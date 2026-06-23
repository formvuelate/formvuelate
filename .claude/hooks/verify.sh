#!/usr/bin/env bash
#
# Stop-hook verification runner for FormVueLate.
#
# Spawns a read-only Claude subagent to run a check (lint / unit / e2e),
# parses the subagent's verdict, and reports back to the MAIN agent.
#
# Reporting channel: with `asyncRewake: true`, exiting 2 wakes the main agent
# and surfaces this script's stderr to it as a system reminder. So we always
# exit 2 to deliver a report (pass OR fail) and put the report on stderr.
#
# Loop safety: each outcome is reported at most once per working-tree state.
# We key a marker file on the hash of `git diff HEAD`. Once a check has PASSED
# for a given diff we stay silent (exit 0) so the agent is free to stop.
#
# Usage: verify.sh <label> <subagent-prompt>

set -u

# Resolve the repo root without hardcoding any machine-specific path.
# Hooks receive $CLAUDE_PROJECT_DIR; fall back to git, then to CWD.
REPO="${CLAUDE_PROJECT_DIR:-$(git rev-parse --show-toplevel 2>/dev/null || pwd)}"
cd "$REPO" || exit 0

# --- recursion guard --------------------------------------------------------
# The subagent is itself a Claude session and would trigger this same Stop hook
# when it finishes. We export the flag before spawning it; the child inherits
# it and bails here, so we never recurse.
[ -n "${FVL_HOOK_RUNNING:-}" ] && exit 0
export FVL_HOOK_RUNNING=1

LABEL="$1"
PROMPT="$2"

# --- resolve the pnpm runner ------------------------------------------------
# Hooks often run with a minimal PATH where `pnpm` isn't directly available.
# Prefer a real pnpm on PATH; otherwise use corepack, which resolves the
# repo's pinned pnpm from package.json#packageManager.
if command -v pnpm >/dev/null 2>&1; then
  PNPM="pnpm"
elif command -v corepack >/dev/null 2>&1; then
  PNPM="corepack pnpm"
else
  echo "[verify: $LABEL] FAILED ❌ — neither pnpm nor corepack found on PATH." >&2
  exit 2
fi
PROMPT="$PROMPT

Invoke pnpm as \`$PNPM\` (plain \`pnpm\` may not be on PATH)."

# --- per-state guard --------------------------------------------------------
STATE_DIR="$REPO/.claude/.verify-state"
mkdir -p "$STATE_DIR"
HASH="$(git -C "$REPO" diff HEAD | shasum | awk '{print $1}')"
SLUG="$(printf '%s' "$LABEL" | tr ' /' '__')"
PASS_MARKER="$STATE_DIR/${SLUG}.passed"

# Already green for this exact diff? Stay quiet so the agent can stop cleanly.
if [ -f "$PASS_MARKER" ] && [ "$(cat "$PASS_MARKER")" = "$HASH" ]; then
  exit 0
fi

# --- run the subagent -------------------------------------------------------
# Read-only toolset: it can run pnpm/git via Bash and inspect files, but cannot
# edit code. --output-format text keeps the verdict easy to parse.
OUT="$(claude -p "$PROMPT

Output a short findings section, then a FINAL line that is EXACTLY one of:
VERDICT:PASS
VERDICT:FAIL
List every failure on its own line as 'path/to/file:line - short reason'. If a
line number is unknown, use the file path alone." \
  --output-format text \
  --tools "Bash,Read,Grep,Glob" \
  --allowedTools "Bash" "Read" "Grep" "Glob" 2>&1)"

# --- report back ------------------------------------------------------------
if printf '%s\n' "$OUT" | grep -q '^VERDICT:PASS$'; then
  printf '%s' "$HASH" > "$PASS_MARKER"
  {
    echo "[verify: $LABEL] PASSED ✅"
    printf '%s\n' "$OUT" | grep -v '^VERDICT:PASS$'
  } >&2
  exit 2
else
  rm -f "$PASS_MARKER"
  {
    echo "[verify: $LABEL] FAILED ❌ — fix the issues below, then continue:"
    printf '%s\n' "$OUT" | grep -v '^VERDICT:FAIL$'
  } >&2
  exit 2
fi
