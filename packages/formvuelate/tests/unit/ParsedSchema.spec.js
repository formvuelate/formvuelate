import useParsedSchema from '../../src/features/ParsedSchema'
import SchemaForm from '../../src/SchemaForm.vue'
import { LOOKUP_PARSE_SUB_SCHEMA_FORMS } from '../../src/utils/constants'

import { ref, shallowRef } from 'vue'
import { mount } from '@vue/test-utils'

const factory = ({
  schema,
  model = null,
  opts = {}
}) => {
  return mount({
    name: 'ParsedSchemaComponent',
    template: `
      <div>{{ parsedSchema }}</div>
    `,
    setup () {
      const { parsedSchema } = useParsedSchema(schema, model)

      return { parsedSchema }
    }
  }, opts)
}

describe('ParsedSchema feature', () => {
  it('returns an empty schema if its not valid', () => {
    const schema = ref({})
    const wrapper = factory({ schema })

    expect(wrapper.vm.parsedSchema).toEqual([])
  })

  it('returns the whole schema if the model requested is not found', () => {
    const schema = shallowRef({
      someElement: {
        component: 'test'
      },
      nestedModel: {
        component: SchemaForm,
        schema: {
          otherElement: {
            component: 'test'
          }
        }
      }
    })

    const wrapper = factory({ schema, model: 'wrongModel' })

    expect(wrapper.vm.parsedSchema).toEqual(
      [
        [expect.objectContaining({ component: 'test' })],
        [expect.objectContaining({ model: 'nestedModel' })]
      ]
    )
  })

  it('returns the matched subschema when the model targets a direct schema element', () => {
    const schema = shallowRef({
      info: {
        component: SchemaForm,
        schema: {
          firstName: { component: 'test' },
          lastName: { component: 'test' }
        }
      }
    })

    const wrapper = factory({ schema, model: 'info' })

    expect(wrapper.vm.parsedSchema).toEqual([
      [expect.objectContaining({ component: 'test', model: 'firstName' })],
      [expect.objectContaining({ component: 'test', model: 'lastName' })]
    ])
  })

  it('finds a model nested inside a deeper subschema (recursive lookup)', () => {
    const schema = shallowRef({
      outer: {
        component: SchemaForm,
        schema: {
          inner: {
            component: SchemaForm,
            schema: {
              deep: { component: 'test' }
            }
          }
        }
      }
    })

    const wrapper = factory({ schema, model: 'inner' })

    expect(wrapper.vm.parsedSchema).toEqual([
      [expect.objectContaining({ component: 'test', model: 'deep' })]
    ])
  })

  it('calls the remapSubSchemaForms fn if it was provided by lookup', () => {
    const schema = shallowRef({
      someElement: {
        component: 'test'
      }
    })

    const remapSubSchemaForms = vi.fn()
    const SchemaFormWithPlugins = { name: 'SFwP', template: '<div />' }

    factory({
      schema,
      opts: {
        global: {
          provide: {
            [LOOKUP_PARSE_SUB_SCHEMA_FORMS]: {
              remapSubSchemaForms,
              SchemaFormWithPlugins
            }
          }
        }
      }
    })

    expect(remapSubSchemaForms).toHaveBeenCalledTimes(1)
    expect(remapSubSchemaForms).toHaveBeenCalledWith(
      [[expect.objectContaining({ component: 'test', model: 'someElement' })]],
      SchemaFormWithPlugins
    )
  })
})
