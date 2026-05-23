# Provisional Plan — Replace CodeSandbox iframes with in-doc interactive demos

> **Status:** provisional / not started. Written to hand off to a fresh session.
> **Scope decision (locked):** these are **interactive demos with an editable JSON-schema `<textarea>`**, exactly like the old playground — a user edits the schema and watches the rendered form react in the browser. We are **NOT** building a code editor, and we are **NOT** recreating CodeSandbox (no arbitrary code editing, no in-browser bundler, no `@vue/repl`, no Sandpack). Just: *schema in, live form out.*

## Why

The docs embed **9 CodeSandbox iframes** (plus 1 Vimeo video that stays). The sandboxes are 4+ years old, pinned to 3.x API patterns, and don't play well with the current Vue 3 / 4.0 setup. VitePress compiles every `.md` as a Vue SFC, so we can run real, interactive Vue components directly in the docs and delete the iframes entirely.

## What we're replacing

| Page | Old sandbox id | Replacement |
|---|---|---|
| `docs/4.x/guide/index.md` | `fvl-playground-3x` | **MainPlayground** (object/array switch + `preventModelCleanupOnSchemaChange` toggle) |
| `docs/4.x/guide/schema-form.md` | `fvl-horizontal-form-3x` | `SchemaPlayground` w/ horizontal array schema |
| `docs/4.x/guide/schema-wizard.md` | `fvl-wizard-3x` | **WizardPlayground** (SchemaWizard + step nav) |
| `docs/4.x/examples/index.md` | `fvl-useschemaform-3x` | `SchemaPlayground` |
| `docs/4.x/examples/index.md` | `fvl-nested-schema-3x` | `SchemaPlayground` |
| `docs/4.x/examples/index.md` | `fvl-array-schema` | `SchemaPlayground` |
| `docs/4.x/examples/index.md` | `fvl-conditional-schema-3x` | `SchemaPlayground` |
| `docs/4.x/examples/index.md` | `fvl-conditional-…-schema-condition-3x` | `SchemaPlayground` |
| `docs/4.x/examples/index.md` | `fvl-100-nested-with-computed-3x` | `SchemaPlayground` |

**Keep:** the Vimeo `<iframe>` in `docs/4.x/guide/accessibility.md` (not a sandbox).

## Current docs state (verified)

- VitePress `^1.6.4`, **default theme**, only file is `docs/4.x/.vitepress/config.ts` (no `theme/` dir yet).
- `docs/4.x/package.json` depends only on `vitepress` — no `formvuelate`, no `sass`.
- Build/deploy: Netlify, `pnpm install` (workspace) + `pnpm --filter fvl-docs build`, publish `docs/4.x/.vitepress/dist`.

---

## Architecture

The whole thing reduces to **one reusable component** plus a small set of demo form components. Every example is the same machine seeded with a different schema.

### 1. Custom theme + global registration — `docs/4.x/.vitepress/theme/index.ts`

```ts
import DefaultTheme from 'vitepress/theme'
import { SchemaForm } from 'formvuelate'

import FormText from './components/FormText.vue'
import FormSelect from './components/FormSelect.vue'
import FormCheckbox from './components/FormCheckbox.vue'
import BaseButton from './components/BaseButton.vue'
import SchemaPlayground from './components/SchemaPlayground.vue'

import './styles/demos.css'

export default {
  extends: DefaultTheme,
  enhanceApp({ app }) {
    // IMPORTANT: schemas reference components by STRING ("FormText",
    // "SchemaForm", ...). FVL resolves those names against globally
    // registered components, so they MUST be registered here.
    app.component('SchemaForm', SchemaForm)
    app.component('FormText', FormText)
    app.component('FormSelect', FormSelect)
    app.component('FormCheckbox', FormCheckbox)
    app.component('BaseButton', BaseButton)
    app.component('SchemaPlayground', SchemaPlayground)
  }
}
```

### 2. The reusable core — `theme/components/SchemaPlayground.vue`

Generalized straight from the existing playground: editable JSON `<textarea>` → live `SchemaForm` → live `formModel` output.

```vue
<script setup>
import { ref, watchEffect } from 'vue'
import { useSchemaForm, SchemaForm } from 'formvuelate'

const props = defineProps({
  initialSchema: { type: [Object, Array], required: true },
  editable:      { type: Boolean, default: true },
  showModel:     { type: Boolean, default: true }
})

const schemaText   = ref(JSON.stringify(props.initialSchema, null, 2))
const parsedSchema = ref(JSON.parse(schemaText.value))
const value        = ref({})
useSchemaForm(value)

const error      = ref('')
const hasError   = ref(false)
const pauseParse = ref(false)

// don't reparse mid-token while the user is typing whitespace/structure
const onKeyup = (e) => { pauseParse.value = [' ', 'Enter', 'Tab'].includes(e.key) }

watchEffect(() => {
  try {
    const next = JSON.parse(schemaText.value)
    if (!pauseParse.value) parsedSchema.value = next
    hasError.value = false
  } catch (e) {
    error.value = e.message
    hasError.value = true
  }
})

const onSubmit = () => window.alert('Form submitted')
</script>

<template>
  <div class="fvl-demo">
    <div v-if="editable" class="fvl-demo__editor">
      <textarea v-model="schemaText" spellcheck="false"
                :class="{ 'is-error': hasError }" />
      <p v-if="hasError" class="fvl-demo__error">Invalid JSON — {{ error }}</p>
    </div>

    <div class="fvl-demo__preview">
      <SchemaForm :schema="parsedSchema" @submit="onSubmit">
        <template #afterForm>
          <BaseButton type="submit">Submit</BaseButton>
        </template>
      </SchemaForm>
      <pre v-if="showModel">{{ value }}</pre>
    </div>
  </div>
</template>
```

### 3. Demo form components — `theme/components/`

Small wrappers over native inputs using FVL's `modelValue` / `update:modelValue` contract. Ported/simplified from the old sandbox apps.

```vue
<!-- FormText.vue -->
<script setup>
defineProps({ modelValue: [String, Number], label: String, config: Object })
defineEmits(['update:modelValue'])
</script>
<template>
  <label class="fvl-field">
    <span v-if="label">{{ label }}</span>
    <input :value="modelValue" v-bind="config"
           @input="$emit('update:modelValue', $event.target.value)" />
  </label>
</template>
```

`FormSelect.vue` (native `<select>` over `options`), `FormCheckbox.vue` (`:checked` / `change` → boolean), `BaseButton.vue` (styled `<button><slot/></button>`) follow the same pattern.

### 4. Seed schemas — `theme/demoSchemas.js`

One module exporting each example's starting schema (`basicObjectSchema`, `horizontalArraySchema`, `nestedSchema`, `conditionalSchema`, `hundredNestedSchema`, …). Pull these from the current CodeSandbox sources / the playground snippet so the demos open with the same content users saw before.

### 5. Embedding in markdown

```md
<script setup>
import { nestedSchema } from '../.vitepress/theme/demoSchemas.js'
</script>

<ClientOnly>
  <SchemaPlayground :initial-schema="nestedSchema" />
</ClientOnly>
```

`<ClientOnly>` is required — the demos use `JSON.parse`, `watchEffect`, `window.alert`, and textarea interaction that should not run/hydrate during SSR.

### 6. Dependencies — `docs/4.x/package.json`

```jsonc
"devDependencies": {
  "vitepress": "^1.6.4",
  "formvuelate": "workspace:*",                  // dogfood in-repo source
  "@formvuelate/plugin-lookup": "workspace:*",
  "@formvuelate/plugin-vee-validate": "workspace:*",
  "vee-validate": "^4.14.6",                     // validation demo only
  "yup": "^1.4.0",                               // validation demo only
  "sass": "^1.80.0"                              // if styling demos in scss
}
```
> Decision to confirm: `workspace:*` (docs always match the repo) vs `^4.0.0` (isolated builds off npm). Recommend `workspace:*`; Netlify already does a workspace install.

---

## Special cases (not plain `SchemaPlayground`)

- **MainPlayground** (`guide/index.md`): the full playground from the old sandbox — adds the **object ⇄ array** schema switcher and the **`preventModelCleanupOnSchemaChange`** checkbox. Wrap `SchemaPlayground` and feed it a swappable schema, or port the original component wholesale (it already exists — see the snippet the maintainer pasted).
- **WizardPlayground** (`guide/schema-wizard.md`): uses `SchemaWizard` (array of step schemas) + prev/next step buttons + `step` ref. Separate component; same textarea-edit idea applied to the multi-step schema.
- **ValidationPlayground** (if any example shows vee-validate): build the form via `SchemaFormFactory([VeeValidatePlugin()])`, define a `yup`/validation schema, and use field components that render error messages. This is the only demo needing more than the base inputs.

---

## Gotchas / checklist

- [ ] **SSR:** every demo wrapped in `<ClientOnly>`.
- [ ] **String component resolution:** `SchemaForm` + all field components registered globally in `enhanceApp` (schemas use string names, incl. nested `component: "SchemaForm"`).
- [ ] **CSS scoping:** scope ALL demo styles under `.fvl-demo` (the old playground had bare global selectors like `.schema-row { display:flex }` / `.editor` that would leak into the whole VitePress site).
- [ ] **`markRaw`:** for any object-form schema that passes a component *reference* (not a string), wrap it in `markRaw` per existing docs guidance.
- [ ] **Netlify:** build must be a workspace-aware install (`pnpm install` at root, then `pnpm --filter fvl-docs build`) so `workspace:*` resolves.
- [ ] **Delete** the 9 CodeSandbox `<iframe>` blocks; **keep** the Vimeo iframe in `accessibility.md`.

## Suggested execution order

1. Scaffold `theme/index.ts` + base field components + `SchemaPlayground.vue`; smoke-test by embedding **MainPlayground** on `guide/index.md` and running `pnpm --filter fvl-docs dev`.
2. Move the two other guide demos (horizontal form, wizard).
3. Move the five `examples/` demos (just different seed schemas).
4. Build `pnpm --filter fvl-docs build`, preview, then verify on a Netlify deploy preview.
5. Remove the 9 iframes once their replacements render.

## Reference

The maintainer's existing playground component (object/array schemas, the JSON
`<textarea>` editor, `preventModelCleanupOnSchemaChange` toggle, nested
`SchemaForm` via string component names) is the canonical starting point for
`MainPlayground` / `SchemaPlayground`. Lift its schemas into `demoSchemas.js`
and its editor logic into `SchemaPlayground.vue`.
