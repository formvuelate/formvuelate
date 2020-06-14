import SchemaWizard from '../../src/SchemaWizard'
import SchemaForm from '../../src/SchemaForm'

import { shallowMount, mount } from '@vue/test-utils'
import { markRaw } from 'vue'

const FormText = {
  template: '<input/>',
  props: ['label']
}

const FormSelect = {
  template: '<select />',
  props: ['label', 'options']
}

markRaw(FormSelect)
markRaw(FormText)
markRaw(SchemaForm)

const wizardSchema = [
  {
    firstName: {
      component: FormText,
      label: 'First Name'
    },
    lastName: {
      component: FormText,
      label: 'Last Name'
    }
  },
  {
    email: {
      component: FormText,
      label: 'Your email',
      required: true,
      config: {
        type: 'email'
      }
    },
    favoriteThingAboutVue: {
      component: FormSelect,
      label: 'Favorite thing about Vue',
      required: true,
      options: [
        'Ease of use',
        'Documentation',
        'Community'
      ]
    }
  }
]

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

  // TODO: Figure out a way to mock the provide function in Vue 3
  it('defines itself as the parent schema on the child SchemaForms', () => {
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
