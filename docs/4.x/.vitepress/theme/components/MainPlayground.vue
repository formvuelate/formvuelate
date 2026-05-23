<script setup>
// The main Getting Started playground: edit the JSON schema on the left, watch
// SchemaForm render on the right. Adds the object <-> array schema switcher and
// the `preventModelCleanupOnSchemaChange` toggle. Ported from the original
// CodeSandbox App.vue. Field components (FormText/FormSelect/FormCheckbox/
// BaseButton) are registered globally in theme/index.ts.
import { ref, reactive, watchEffect } from 'vue'
import { SchemaForm, useSchemaForm } from 'formvuelate'
import { objSchema, arraySchema } from '../demoSchemas.js'

const schema = ref(JSON.stringify(objSchema, null, 2))
const currentSchemaType = ref('object')

const value = ref({})
useSchemaForm(value)

const schemaError = ref('')
const hasParseErrors = ref(false)
const disabledParsing = ref(false)
const options = reactive({ preventModelCleanupOnSchemaChange: false })

const parsedSchema = ref(JSON.parse(schema.value))

// Don't reparse mid-token while the user is typing whitespace/structure.
const toggleValidation = (event) => {
  disabledParsing.value = [' ', 'Enter', 'Tab'].includes(event.key)
}

watchEffect(() => {
  try {
    const parsingResult = JSON.parse(schema.value)
    if (!disabledParsing.value) parsedSchema.value = parsingResult
    hasParseErrors.value = false
  } catch (e) {
    schemaError.value = e.message
    hasParseErrors.value = true
  }
})

const onSubmit = () => window.alert('Form submitted')

const switchSchema = (event) => {
  const val = event.target.value
  currentSchemaType.value = val
  if (val === 'array') schema.value = JSON.stringify(arraySchema, null, 2)
  else if (val === 'object') schema.value = JSON.stringify(objSchema, null, 2)
}
</script>

<template>
  <div class="fvl-demo">
    <div class="fvl-demo__options">
      <p class="fvl-demo__heading">Props:</p>
      <div class="options-menu">
        <FormCheckbox
          v-model="options.preventModelCleanupOnSchemaChange"
          label="preventModelCleanupOnSchemaChange"
        />

        <p class="fvl-demo__heading">Options:</p>
        <FormSelect
          :modelValue="currentSchemaType"
          :options="['object', 'array']"
          disableNoSelection
          label="Schema type"
          @change="switchSchema"
        />
      </div>
    </div>

    <div class="fvl-demo__body">
      <div class="fvl-demo__editor">
        <textarea
          v-model="schema"
          class="editor"
          spellcheck="false"
          :class="{ 'editor-error': hasParseErrors }"
          @keyup="toggleValidation"
        />
        <p v-if="hasParseErrors" class="fvl-demo__error">
          The Schema is invalid. Must be a valid JSON value.<br />{{ schemaError }}
        </p>
      </div>

      <div class="fvl-demo__preview">
        <SchemaForm
          :schema="parsedSchema"
          :preventModelCleanupOnSchemaChange="options.preventModelCleanupOnSchemaChange"
          @submit="onSubmit"
        >
          <template #afterForm>
            <BaseButton type="submit">Submit</BaseButton>
          </template>
        </SchemaForm>
      </div>
    </div>

    <pre class="fvl-demo__model">{{ value }}</pre>
  </div>
</template>
