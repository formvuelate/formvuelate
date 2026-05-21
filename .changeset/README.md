# Changesets

This directory is managed by [Changesets](https://github.com/changesets/changesets) — the release tooling that replaced Lerna in the 4.x branch.

## Adding a change

When you make a change that should land in a release, run:

```bash
pnpm changeset
```

Pick the packages affected, pick a bump type (major/minor/patch), and write a short summary. A markdown file lands here. Commit it alongside your code change.

## Releasing

The GitHub Actions release workflow watches `main`. When changesets exist on `main`, it opens (or updates) a "Version Packages" PR that bumps versions and aggregates the summaries into changelogs. Merging that PR triggers npm publish.

For the linked packages (`formvuelate`, `@formvuelate/plugin-vee-validate`, `@formvuelate/plugin-lookup`) the versions are kept in lockstep — bumping any one bumps all three.

## Manual release (if needed)

```bash
pnpm changeset version    # apply pending changesets, bump versions
pnpm build                # rebuild dists
pnpm changeset publish    # publish to npm
```
