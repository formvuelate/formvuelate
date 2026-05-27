import LookupPlugin, { lookupSubSchemas } from '../../src/index.js'
import { SchemaFormFactory, useSchemaForm } from 'formvuelate'
import { mount } from '@vue/test-utils'
import { markRaw, ref, h, shallowRef } from 'vue'

// `lookupSubSchemas` flips a module-level flag, so this lives in its own file
// to keep that state from leaking into the plain LookupPlugin integration
// tests.
const FormText = {
  template: '<input class="text" :value="modelValue" @input="$emit(\'update:modelValue\', $event.target.value)" />',
  props: ['label', 'modelValue'],
  emits: ['update:modelValue']
}

markRaw(FormText)

const mountWithSubSchemas = (SCHEMA, plugins) => {
  const SchemaFormWithPlugins = SchemaFormFactory(plugins)

  return mount({
    components: { SchemaFormWithPlugins },
    setup () {
      const model = ref({})
      lookupSubSchemas(SchemaFormWithPlugins)
      useSchemaForm(model)

      const schemaRef = shallowRef(SCHEMA)

      return () => h(SchemaFormWithPlugins, { schema: schemaRef })
    }
  })
}

describe('LookupPlugin sub-schema lookup', () => {
  it('replaces nested "SchemaForm" components with the plugin-enhanced form', () => {
    const SCHEMA = [
      { model: 'firstName', component: 'Text', label: 'First Name' },
      {
        model: 'nested',
        component: 'SchemaForm',
        schema: [
          { model: 'nestedFirst', component: 'Text', label: 'Nested First' },
          {
            model: 'doubleNested',
            component: 'SchemaForm',
            schema: [
              { model: 'deep', component: 'Text', label: 'Deep' }
            ]
          }
        ]
      }
    ]

    const wrapper = mountWithSubSchemas(SCHEMA, [
      LookupPlugin({ mapComponents: { Text: FormText } })
    ])

    // firstName + nestedFirst + deep, each rendered through the mapped FormText
    // across all three nesting levels.
    expect(wrapper.findAllComponents(FormText)).toHaveLength(3)
    expect(wrapper.findAll('.text')).toHaveLength(3)
  })

  it('still resolves sub-schemas when a string component is mapped to "SchemaForm"', () => {
    const SCHEMA = [
      { model: 'firstName', type: 'Text', label: 'First Name' },
      {
        model: 'nested',
        type: 'Container',
        schema: [
          { model: 'nestedFirst', type: 'Text', label: 'Nested First' }
        ]
      }
    ]

    const wrapper = mountWithSubSchemas(SCHEMA, [
      LookupPlugin({
        mapProps: { type: 'component' },
        mapComponents: { Text: FormText, Container: 'SchemaForm' }
      })
    ])

    expect(wrapper.findAllComponents(FormText)).toHaveLength(2)
  })
})
