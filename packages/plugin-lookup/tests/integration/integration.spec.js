import LookupPlugin from '../../src/index.js'
import { SchemaFormFactory, useSchemaForm } from 'formvuelate'
import { mount } from '@vue/test-utils'
import { markRaw, ref } from 'vue'

const FormText = {
  template: '<input/>',
  emits: ['update:modelValue'],
  props: ['label', 'modelValue']
}

const SchemaWrapper = (factory, schema) => {
  return {
    template: `
      <Factory :schema="schemaRef" />
    `,
    components: { Factory: factory },
    setup () {
      const schemaRef = ref(schema)
      const formModel = ref({})
      useSchemaForm(formModel)

      return {
        schemaRef
      }
    }
  }
}

markRaw(FormText)

describe('FVL integration', () => {
  describe('with array schema', () => {
    it('maps', () => {
      const schema = [
        {
          type: 'BaseInput',
          label: 'First Name',
          model: 'firstName'
        },
        [
          {
            type: 'BaseInput',
            label: 'Last Name',
            model: 'lastName'
          },
          {
            type: 'BaseInput',
            label: 'Email',
            model: 'email'
          }
        ]
      ]

      const factory = SchemaFormFactory([
        LookupPlugin({
          mapComponents: {
            BaseInput: FormText
          },
          mapProps: {
            type: 'component'
          }
        })
      ])

      const wrapper = mount(SchemaWrapper(factory, schema))

      expect(wrapper.findAllComponents(FormText)).toHaveLength(3)
      expect(wrapper.findAllComponents(FormText)[0].vm.label).toEqual('First Name')
      expect(wrapper.findAllComponents(FormText)[1].vm.label).toEqual('Last Name')
      expect(wrapper.findAllComponents(FormText)[2].vm.label).toEqual('Email')
    })
  })
})

describe('with object schema', () => {
  it('maps', () => {
    const schema = {
      firstName: {
        type: 'BaseInput',
        label: 'First Name'
      },
      lastName: {
        type: 'BaseInput',
        label: 'Last Name'
      }
    }

    const factory = SchemaFormFactory([
      LookupPlugin({
        mapComponents: {
          BaseInput: FormText
        },
        mapProps: {
          type: 'component'
        }
      })
    ])

    const wrapper = mount(SchemaWrapper(factory, schema))

    expect(wrapper.findAllComponents(FormText)).toHaveLength(2)
    expect(wrapper.findAllComponents(FormText)[0].vm.label).toEqual('First Name')
    expect(wrapper.findAllComponents(FormText)[1].vm.label).toEqual('Last Name')
  })
})
