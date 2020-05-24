<template>
  <div style="margin-bottom: 2rem">
    <h3>SchemaForm props</h3>
    <FormCheckbox v-model="options.preventModelCleanupOnSchemaChange" label="preventModelCleanupOnSchemaChange" />
  </div>
  <div style="display: flex">
    <div>
      <textarea @keyup="toggleValidation" v-model="schema" class="editor" :class="{ 'editor-error': hasParseErrors }"/>
      <p v-if="hasParseErrors" style="color: red">The Schema is invalid. Must be valid JSON value. <br>{{ schemaError }}</p>
    </div>
    <div>
      <SchemaForm
        class="schema-form"
        @submit="onSubmit"
        :preventModelCleanupOnSchemaChange="options.preventModelCleanupOnSchemaChange"
        :schema="parsedSchema" v-model="value"
      >
        <template v-slot:afterForm>
          <BaseButton type="submit">Submit</BaseButton>
        </template>
      </SchemaForm>
      <pre>{{ value }}</pre>
    </div>
  </div>
</template>

<script>
import { ref, watchEffect, reactive } from 'vue'

export default {
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
      favoriteThingAboutVue: {
        component: 'FormSelect',
        label: 'Favorite thing about Vue',
        required: true,
        options: [
          'Ease of use',
          'Documentation',
          'Community'
        ]
      },
      isVueFan: {
        component: 'FormCheckbox',
        label: 'Are you a Vue fan?'
      },
      work: {
        component: 'SchemaForm',
        schema: {
          address: {
            component: 'FormText',
            label: 'Work address'
          },
          phone: {
            component: 'FormText',
            label: 'Work phone'
          },
          details: {
            component: 'SchemaForm',
            schema: {
              position: {
                component: 'FormText',
                label: 'Work position'
              },
              employees: {
                component: 'FormSelect',
                label: 'Number of employees',
                options: [
                  '1', '2', '3', '4+'
                ]
              }
            }
          }
        }
      }
    }, null, 2))

    const value = ref({})
    const schemaError = ref('')
    const hasParseErrors = ref(false)
    const disabledParsing = ref(false)
    const options = reactive({
      preventModelCleanupOnSchemaChange: false
    })

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

    const onSubmit = () => {
      alert(`Form submitted`)
    }

    return {
      schema,
      schemaError,
      parsedSchema,
      hasParseErrors,
      value,
      toggleValidation,
      options,
      onSubmit
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
