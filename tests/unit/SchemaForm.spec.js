import useSchemaForm from '../../src/features/useSchemaForm'
import SchemaForm from '../../src/SchemaForm'

import { mount } from '@vue/test-utils'
import { markRaw, ref } from 'vue'

const FormText = {
  template: '<input/>',
  props: ['label']
}

const FormSelect = {
  template: '<select />',
  props: ['label', 'options']
}

const SchemaWrapperFactory = (schema, binds, formModel) => {
  return {
    template: `
      <SchemaForm
        :schema="schemaRef"
        v-bind="binds"
      />
    `,
    components: { SchemaForm },
    setup () {
      const schemaRef = ref(schema)
      useSchemaForm(formModel || schemaRef)

      return {
        schemaRef,
        binds
      }
    }
  }
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

    const wrapper = mount(SchemaWrapperFactory(schema))

    expect(wrapper.findAllComponents(FormText)).toHaveLength(2)
  })

  describe('schemaRowClasses prop', () => {
    it('renders form rows with user defined classes', () => {
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

      const wrapper = mount(SchemaWrapperFactory(
        schema,
        { schemaRowClasses: 'custom-class-a' }
      ))

      expect(wrapper.findAll('.schema-row.custom-class-a')).toHaveLength(2)
    })
  })

  describe('array schema', () => {
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

      const wrapper = mount(SchemaWrapperFactory(schema))

      expect(wrapper.findAllComponents(FormText)).toHaveLength(2)
    })

    it('renders a form with a schema containing a row of horizontal elements', () => {
      const schema = [
        {
          component: FormText,
          label: 'First Name',
          model: 'firstName'
        },
        [
          {
            component: FormText,
            label: 'Middle Name',
            model: 'middleName'
          },
          {
            component: FormText,
            label: 'Last Name',
            model: 'lastName'
          }
        ]
      ]

      const wrapper = mount(SchemaWrapperFactory(schema))

      expect(wrapper.findAllComponents(FormText)).toHaveLength(3)
    })
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

    const wrapper = mount(SchemaWrapperFactory(nestedSchema))

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

    const wrapper = mount(SchemaWrapperFactory(nestedSchema))

    const schemaForms = wrapper.findAllComponents(SchemaForm)

    expect(schemaForms[0].vm.hasParentSchema).toBe(false)
    expect(schemaForms[1].vm.hasParentSchema).toBe(true)
    expect(schemaForms[2].vm.hasParentSchema).toBe(true)
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

    const wrapper = mount(SchemaWrapperFactory(schema))

    const ids = []
    for (const row of wrapper.findComponent(SchemaForm).vm.parsedSchema) {
      for (const el of row) {
        expect(el.uuid).toBeTruthy()
        expect(ids).not.toContain(el.uuid)
        ids.push(el.uuid)
      }
    }
  })

  describe('syncing model data', () => {
    it('updates the schemaRef injected with useSchemaForm when an input emits update:modelValue', () => {
      const formModel = ref({
        firstName: 'First',
        lastName: 'Last'
      })

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

      const wrapper = mount(SchemaWrapperFactory(schema, null, formModel))

      wrapper.findComponent(FormText).vm.$emit('update:modelValue', 'Marina')

      expect(formModel.value.firstName).toEqual('Marina')
    })

    it('correctly updates the schemaRef on deeply nested schemas', () => {
      const formModel = ref({
        levelOne: {
          levelTwo: {
            lastName: 'Last'
          }
        }
      })

      const schema = {
        levelOne: {
          component: SchemaForm,
          schema: {
            levelTwo: {
              component: SchemaForm,
              schema: {
                lastName: {
                  component: FormText,
                  label: 'Last Name'
                }
              }
            }
          }
        }
      }

      const wrapper = mount(SchemaWrapperFactory(schema, null, formModel))

      wrapper.findComponent(FormText).vm.$emit('update:modelValue', 'Mosti')

      expect(formModel.value.levelOne.levelTwo.lastName).toEqual('Mosti')
    })

    it('correctly updates the schemaRef on deeply nested schemas when the ref is not specifically populated', () => {
      const formModel = ref({})

      const schema = {
        levelOne: {
          component: SchemaForm,
          schema: {
            levelTwo: {
              component: SchemaForm,
              schema: {
                lastName: {
                  component: FormText,
                  label: 'Last Name'
                }
              }
            }
          }
        }
      }

      const wrapper = mount(SchemaWrapperFactory(schema, null, formModel))

      wrapper.findComponent(FormText).vm.$emit('update:modelValue', 'Mosti')

      expect(formModel.value.levelOne.levelTwo.lastName).toEqual('Mosti')
    })
  })

  describe('binds', () => {
    it('the properties in a field into the component', () => {
      const wrapper = mount(SchemaWrapperFactory({
        firstName: {
          component: FormText,
          label: 'label',
          one: 1,
          two: 2
        }
      }))

      const field = wrapper.findComponent(FormText)
      expect(field.vm.label).toEqual('label')
      expect(field.vm.$attrs.one).toEqual(1)
      expect(field.vm.$attrs.two).toEqual(2)
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

      const wrapper = mount(SchemaWrapperFactory(schema, { sharedConfig: { shared: 'test' } }))

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

      const formModel = ref({
        firstName: 'Mr Piddles International Cat of Mistery',
        favoriteThingAboutVue: 'Documentation'
      })

      const wrapper = mount(SchemaWrapperFactory(schema, null, formModel))

      const copySchema = { ...schema }
      delete copySchema.firstName
      wrapper.setProps({
        schema: copySchema
      })
      await wrapper.vm.$nextTick()

      expect(formModel.value).toEqual({ favoriteThingAboutVue: 'Documentation' })
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

      const formModel = ref({
        firstName: 'Mr Piddles International Cat of Mistery',
        favoriteThingAboutVue: 'Documentation'
      })

      const wrapper = mount(SchemaWrapperFactory(schema, { preventModelCleanupOnSchemaChange: true }, formModel))

      const copySchema = { ...schema }
      delete copySchema.firstName
      wrapper.setProps({
        schema: copySchema
      })
      await wrapper.vm.$nextTick()

      expect(formModel.value).toEqual({
        firstName: 'Mr Piddles International Cat of Mistery',
        favoriteThingAboutVue: 'Documentation'
      })
    })
  })
})
