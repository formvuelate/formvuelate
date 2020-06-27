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

describe('SchemaForm', () => {
  it('renders a form based on a schema', () => {
    const schema = {
      firstName: {
        component: FormText,
        label: 'First Name'
      },
      lastName: {
        component: FormText,
        label: 'Last Name'
      }
    }
    const wrapper = mount(SchemaForm, {
      props: { schema, modelValue: {} }
    })

    expect(wrapper.findAllComponents(FormText)).toHaveLength(2)
  })

  it('renders a form based on an array schema', () => {
    const schema = [
      {
        component: FormText,
        label: 'First Name',
        model: 'firstName'
      },
      {
        component: FormText,
        label: 'Last Name',
        model: 'lastName'
      }
    ]

    const wrapper = mount(SchemaForm, {
      props: { schema, modelValue: {} }
    })

    expect(wrapper.findAllComponents(FormText)).toHaveLength(2)
  })

  it('renders a form based on a nested schema', () => {
    const nestedSchema = {
      work: {
        component: SchemaForm,
        schema: {
          address: {
            component: FormText,
            label: 'Work address'
          },
          phone: {
            component: FormText,
            label: 'Work phone'
          },
          details: {
            component: SchemaForm,
            schema: {
              position: {
                component: FormText,
                label: 'Work position'
              },
              employees: {
                component: FormSelect,
                label: 'Number of employees',
                options: [
                  '1', '2', '3', '4+'
                ]
              }
            }
          }
        }
      }
    }

    const wrapper = mount(SchemaForm, {
      props: { schema: nestedSchema, modelValue: {} }
    })

    expect(wrapper.findAllComponents(FormText)).toHaveLength(3)
    expect(wrapper.findAllComponents(FormSelect)).toHaveLength(1)
  })

  it('can self check if it is a parent schema', () => {
    const nestedSchema = {
      work: {
        component: SchemaForm,
        schema: {
          details: {
            component: SchemaForm,
            schema: {
              position: {
                component: FormText,
                label: 'Work position'
              }
            }
          }
        }
      }
    }

    const wrapper = mount(SchemaForm, {
      props: { schema: nestedSchema, modelValue: {} }
    })

    expect(wrapper.vm.hasParentSchema).toBe(false)
    expect(wrapper.findComponent(SchemaForm).vm.hasParentSchema).toBe(true)
  })

  it('injects a unique id to each component', () => {
    const schema = {
      firstName: {
        component: FormText,
        label: 'First Name'
      },
      lastName: {
        component: FormText,
        label: 'Last Name'
      }
    }

    const wrapper = shallowMount(SchemaForm, {
      props: { schema, modelValue: {} }
    })

    const ids = []
    for (const el of wrapper.vm.parsedSchema) {
      expect(el.uuid).toBeTruthy()
      expect(ids).not.toContain(el.uuid)
      ids.push(el.uuid)
    }
  })

  describe('emits', () => {
    it('update:modelValue when an input updates', async () => {
      const schema = {
        firstName: {
          component: FormText,
          label: 'First Name'
        }
      }

      const wrapper = mount(SchemaForm, {
        props: { schema, modelValue: {} }
      })

      wrapper.findComponent(FormText).vm.$emit('update:modelValue', 'first name')

      expect(wrapper.emitted()['update:modelValue']).toHaveLength(1)
      expect(wrapper.emitted()['update:modelValue'][0]).toEqual([
        { firstName: 'first name' }
      ])
    })

    it('update:modelValue with the appended current value from the model ', () => {
      const schema = {
        firstName: {
          component: FormText,
          label: 'First Name'
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

      const wrapper = mount(SchemaForm, {
        props: { schema, modelValue: { firstName: 'first name' } }
      })

      wrapper.findComponent(FormSelect).vm.$emit('update:modelValue', 'Documentation')
      expect(wrapper.emitted()['update:modelValue']).toHaveLength(1)
      expect(wrapper.emitted()['update:modelValue'][0]).toEqual([
        { firstName: 'first name', favoriteThingAboutVue: 'Documentation' }
      ])
    })

    it('update:modelValue when a component fires update-batch', () => {
      const schema = {
        name: {
          component: FormText,
          label: 'Full Name'
        }
      }

      const wrapper = mount(SchemaForm, {
        props: {
          schema,
          modelValue: {
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
        { original: true, firstName: 'Marina', lastName: 'Mosti' }
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

    it('the schema only, when a schema prop is set', () => {
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

    it('the sharedConfig into all the elements', () => {
      const schema = {
        firstName: {
          component: FormText,
          label: 'First Name'
        },
        lastName: {
          component: FormText,
          label: 'Last Name'
        }
      }

      const wrapper = mount(SchemaForm, {
        props: {
          schema,
          modelValue: {},
          sharedConfig: {
            shared: 'test'
          }
        }
      })

      const inputs = wrapper.findAllComponents(FormText)
      for (const input of inputs) {
        expect(input.vm.$attrs.shared).toEqual('test')
      }
    })
  })

  describe('when the schema changes', () => {
    it('cleans up the model', async () => {
      const schema = {
        firstName: {
          component: FormText,
          label: 'First Name'
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

      const wrapper = mount(SchemaForm, {
        props: {
          schema,
          modelValue: {
            firstName: 'delete me', favoriteThingAboutVue: 'Documentation'
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
        { favoriteThingAboutVue: 'Documentation' }
      ])
    })

    it('prevents model clean up if the preventModelCleanupOnSchemaChange prop is true', async () => {
      const schema = {
        firstName: {
          component: FormText,
          label: 'First Name'
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

      const wrapper = mount(SchemaForm, {
        props: {
          schema,
          modelValue: {
            firstName: 'delete me', favoriteThingAboutVue: 'Documentation'
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
      expect(wrapper.vm.modelValue).toEqual({
        firstName: 'delete me', favoriteThingAboutVue: 'Documentation'
      })
    })
  })
})
