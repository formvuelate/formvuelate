<template>
  <div style="display: flex">
    <div>
      <textarea @keyup="toggleValidation" v-model="schema" class="editor" :class="{ 'editor-error': hasParseErrors }"/>
      {{ disabledParsing }}
      <p v-if="hasParseErrors" style="color: red">The Schema is invalid. Must be valid JSON value. <br>{{ schemaError }}</p>
    </div>
    <div>
      <SchemaForm :schema="parsedSchema" v-model="value" />
      <pre>{{ value }}</pre>
    </div>
  </div>
</template>

<script>
import { ref, reactive, watchEffect } from 'vue'
import FormText from './form-elements/FormText.vue'
import FormSelect from './form-elements/FormSelect.vue'
import FormCheckbox from './form-elements/FormCheckbox.vue'

export default {
  components: {
    FormText, FormSelect, FormCheckbox
  },
  setup () {
    const schema = ref(JSON.stringify({
      firstName: {
        component: 'FormText',
        label: 'First Name',
      },
      lastName: {
        component: 'FormText',
        label: 'Last Name',
      },
      email: {
        component: 'FormText',
        label: 'Your email',
        required: true,
        config: {
          type: 'email'
        }
      },
    }, null, 2))

    const value = reactive({})
    const schemaError = ref('')
    const hasParseErrors = ref(false)
    const disabledParsing = ref(false)

    const parsedSchema = ref(JSON.parse(schema.value))

    const toggleValidation = (event) => {
      disabledParsing.value = [' ', 'Enter', 'Tab'].includes(event.key)
    }

    watchEffect(() => {
      try {
        const parsingResult = JSON.parse(schema.value)

        if (!disabledParsing.value) {
          parsedSchema.value = parsingResult
        }
        hasParseErrors.value = false
      } catch (e) {
        schemaError.value = e.message
        hasParseErrors.value = true
      }
    })

    return {
      schema,
      schemaError,
      parsedSchema,
      hasParseErrors,
      value,
      toggleValidation,
      disabledParsing
    }
  }
}
</script>

<style lang="stylus" scoped>
.editor {
  min-width: 500px;
  min-height: 600px;
  white-space: pre;
  padding: 10px;
  margin-right: 20px;
  font-size: 1rem;
}

.editor-error {
  border: 1px solid red;
}
</style>
