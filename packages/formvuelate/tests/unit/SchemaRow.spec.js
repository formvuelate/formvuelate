import SchemaRow from '../../src/SchemaRow.vue'
import SchemaField from '../../src/SchemaField.vue'

import { shallowMount } from '@vue/test-utils'

const FormText = {
  template: '<input/>',
  props: ['label'],
  emits: ['update:modelValue']
}

describe('SchemaRow', () => {
  it('doesnt render if the containing elements are not showing', () => {
    const wrapper = shallowMount(SchemaRow, {
      props: {
        row: [
          {
            model: 'FirstName',
            component: FormText,
            label: 'First Name',
            condition: model => false
          },
          {
            model: 'LastName',
            component: FormText,
            label: 'Last Name',
            condition: model => false
          }
        ]
      }
    })

    expect(wrapper.element.tagName).toBeUndefined()
  })

  it('renders if at least one of the conditions is true', () => {
    const wrapper = shallowMount(SchemaRow, {
      props: {
        row: [
          {
            model: 'FirstName',
            component: FormText,
            label: 'First Name',
            condition: model => false
          },
          {
            model: 'LastName',
            component: FormText,
            label: 'Last Name',
            condition: model => true
          }
        ]
      }
    })

    expect(wrapper.findAllComponents(SchemaField).length).toBe(2)
  })

  it('doesnt render wrapper elements when unwrappedRow is set', () => {
    const wrapper = shallowMount(SchemaRow, {
      props: {
        row: [
          {
            model: 'FirstName',
            component: FormText,
            label: 'First Name'
          },
          {
            model: 'LastName',
            component: FormText,
            label: 'Last Name'
          }
        ],
        unwrappedRows: true
      }
    })

    expect(wrapper.findAllComponents(SchemaField).length).toBe(2)
    expect(wrapper.findAll('div').length).toBe(0)
  })
})
