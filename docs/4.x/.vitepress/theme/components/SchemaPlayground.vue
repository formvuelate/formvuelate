<script setup>
// Reusable demo core for the examples pages: editable JSON schema -> live
// SchemaForm -> live form model. The example pages just pass a different
// `initialSchema`. (MainPlayground is its own component because it adds the
// schema-type switcher and prevent-cleanup toggle.)
import { ref, watchEffect } from 'vue'
import { SchemaForm, useSchemaForm } from 'formvuelate'

const props = defineProps({
  initialSchema: { type: [Object, Array], required: true },
  editable: { type: Boolean, default: true },
  showModel: { type: Boolean, default: true }
})

const schemaText = ref(JSON.stringify(props.initialSchema, null, 2))
const parsedSchema = ref(JSON.parse(schemaText.value))

const value = ref({})
useSchemaForm(value)

const error = ref('')
const hasError = ref(false)
const pauseParse = ref(false)

// Don't reparse mid-token while the user is typing whitespace/structure.
const onKeyup = (e) => {
  pauseParse.value = [' ', 'Enter', 'Tab'].includes(e.key)
}

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
    <div class="fvl-demo__body">
      <div v-if="editable" class="fvl-demo__editor">
        <textarea
          v-model="schemaText"
          class="editor"
          spellcheck="false"
          :class="{ 'editor-error': hasError }"
          @keyup="onKeyup"
        />
        <p v-if="hasError" class="fvl-demo__error">
          The Schema is invalid. Must be a valid JSON value.<br />{{ error }}
        </p>
      </div>

      <div class="fvl-demo__preview">
        <SchemaForm :schema="parsedSchema" @submit="onSubmit">
          <template #afterForm>
            <BaseButton type="submit">Submit</BaseButton>
          </template>
        </SchemaForm>
      </div>
    </div>

    <pre v-if="showModel" class="fvl-demo__model">{{ value }}</pre>
  </div>
</template>
