import SchemaWizard from '../../src/SchemaWizard'
import SchemaForm from '../../src/SchemaForm'
import { shallowMount, mount } from '@vue/test-utils'

import { wizardSchema } from './schema'

describe('SchemaWizard', () => {
  it('renders a SchemaForm for each index of the schema array based on the current step', async () => {
    const wrapper = shallowMount(SchemaWizard, {
      props: {
        schema: wizardSchema,
        modelValue: [],
        step: 0
      }
    })

    expect(wrapper.findComponent(SchemaForm).vm.schema).toEqual(wizardSchema[0])
    await wrapper.setProps({
      step: 1
    })

    expect(wrapper.findComponent(SchemaForm).vm.schema).toEqual(wizardSchema[1])
  })

  it('defines itself as a parent schema through provide', () => {
    const wrapper = mount(SchemaWizard, {
      props: {
        schema: wizardSchema,
        modelValue: [],
        step: 0
      }
    })

    expect(wrapper.findComponent(SchemaForm).vm.hasParentSchema).toBe(true)
  })

  it('emits update:modelValue when the child SchemaForm updates', () => {
    const wrapper = shallowMount(SchemaWizard, {
      props: {
        schema: wizardSchema,
        modelValue: [
          {},
          { something: 'else' }
        ],
        step: 0
      }
    })

    wrapper.findComponent(SchemaForm).vm.$emit('update:modelValue', { firstName: 'Marina' })

    expect(wrapper.emitted()['update:modelValue']).toHaveLength(1)
    expect(wrapper.emitted()['update:modelValue'][0]).toEqual([
      [
        { firstName: 'Marina' },
        { something: 'else' }
      ]
    ])
  })
})
