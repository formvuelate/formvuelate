import SchemaForm from '../../src/SchemaForm'
import FormText from '../../.vitepress/docs/components/form-elements/FormText'
import FormSelect from '../../.vitepress/docs/components/form-elements/FormSelect'
import FormCheckbox from '../../.vitepress/docs/components/form-elements/FormCheckbox'

import { schema, nestedSchema } from './schema'
import { shallowMount, mount } from '@vue/test-utils'

describe('SchemaForm', () => {
  it('renders a form based on a schema', () => {
    const wrapper = mount(SchemaForm, {
      props: { schema: nestedSchema, modelValue: {} }
    })

    expect(wrapper.findAllComponents(FormText)).toHaveLength(6)
    expect(wrapper.findAllComponents(FormSelect)).toHaveLength(2)
    expect(wrapper.findAllComponents(FormCheckbox)).toHaveLength(1)
  })

  it('can provide/inject to check for a parent SchemaForm', () => {
    const wrapper = mount(SchemaForm, {
      props: { schema: nestedSchema, modelValue: {} }
    })

    expect(wrapper.vm.hasParentSchema).toBe(false)
    expect(wrapper.findComponent(SchemaForm).vm.hasParentSchema).toBe(true)
  })

  it('injects a unique id to each component', () => {
    const wrapper = shallowMount(SchemaForm, {
      props: { schema, modelValue: {} }
    })

    const ids = []
    for (const el of wrapper.vm.parsedSchema) {
      expect(el.uuid).toBeTruthy()
      expect(ids).not.toContain()
      ids.push(el.uuid)
    }
  })

  describe('emits', () => {
    it('emits update:modelValue when an input updates', async () => {
      const wrapper = mount(SchemaForm, {
        props: { schema, modelValue: {} }
      })

      wrapper.findComponent(FormText).vm.$emit('update:modelValue', 'first name')

      expect(wrapper.emitted()['update:modelValue']).toHaveLength(1)
      expect(wrapper.emitted()['update:modelValue'][0]).toEqual([
        { firstName: 'first name' }
      ])

      await wrapper.setProps({ modelValue: { firstName: 'first name' } })

      wrapper.findComponent(FormSelect).vm.$emit('update:modelValue', true)
      expect(wrapper.emitted()['update:modelValue']).toHaveLength(2)
      expect(wrapper.emitted()['update:modelValue'][1]).toEqual([
        { firstName: 'first name', favoriteThingAboutVue: true }
      ])
    })

    it('emits update:modelValue when a component fires update-batch', () => {
      const wrapper = mount(SchemaForm, {
        props: {
          schema, modelValue: {
            original: true
          }
        }
      })

      wrapper.findComponent(FormText).vm.$emit('update-batch', {
        firstName: 'Marina',
        lastName: 'Mosti'
      })

      expect(wrapper.emitted()['update:modelValue']).toHaveLength(1)
      expect(wrapper.emitted()['update:modelValue'][0]).toEqual([
        { original: true, firstName: "Marina", lastName: "Mosti" }
      ])
    })
  })

  describe('binds', () => {
    it('the properties in a field into the component', () => {
      const wrapper = mount(SchemaForm, {
        props: {
          schema: {
            firstName: {
              component: FormText,
              label: 'label',
              one: 1,
              two: 2
            }
          },
          modelValue: {}
        }
      })

      const field = wrapper.findComponent(FormText)
      expect(field.vm.label).toEqual('label')
      expect(field.vm.$attrs.one).toEqual(1)
      expect(field.vm.$attrs.two).toEqual(2)
    })

    it('the schema only if a schema prop is set', () => {
      const wrapper = mount(SchemaForm, {
        props: {
          schema: {
            nested: {
              component: SchemaForm,
              schema: { firstName: { component: FormText, label: 'test' } },
              one: 1
            }
          },
          modelValue: {}
        }
      })

      const schemaForm = wrapper.findComponent(SchemaForm)

      expect(schemaForm.vm.schema).toEqual(
        expect.objectContaining({ firstName: expect.anything() })
      )
      expect(schemaForm.vm.$attrs.one).toBeUndefined()
    })

    it('binds the sharedConfig into all the elements', () => {
      const wrapper = mount(SchemaForm, {
        props: {
          schema, modelValue: {},
          sharedConfig: {
            shared: 'test'
          }
        }
      })

      const inputs = wrapper.findAllComponents(FormText)
      for (let input of inputs) {
        expect(input.vm.$attrs.shared).toEqual('test')
      }
    })
  })

  describe('when the schema changes', () => {
    it('cleans up the model', async () => {
      const wrapper = mount(SchemaForm, {
        props: {
          schema,
          modelValue: {
            firstName: 'delete me', favoriteThingAboutVue: true
          }
        }
      })

      const copySchema = { ...schema }
      delete copySchema.firstName
      wrapper.setProps({
        schema: copySchema
      })
      await wrapper.vm.$nextTick()

      expect(wrapper.emitted()['update:modelValue']).toHaveLength(1)
      expect(wrapper.emitted()['update:modelValue'][0]).toEqual([
        { favoriteThingAboutVue: true }
      ])
    })

    it('prevents model clean up with the preventModelCleanupOnSchemaChange prop', async () => {
      const wrapper = mount(SchemaForm, {
        props: {
          schema,
          modelValue: {
            firstName: 'delete me', favoriteThingAboutVue: true
          },
          preventModelCleanupOnSchemaChange: true
        }
      })

      const copySchema = { ...schema }
      delete copySchema.firstName
      wrapper.setProps({
        schema: copySchema
      })
      await wrapper.vm.$nextTick()

      expect(wrapper.emitted()['update:modelValue']).toBeUndefined()
    })
  })
})
