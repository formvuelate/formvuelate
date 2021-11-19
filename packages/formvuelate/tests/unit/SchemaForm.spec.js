import useSchemaForm from '../../src/features/useSchemaForm'
import SchemaForm from '../../src/SchemaForm.vue'
import SchemaField from '../../src/SchemaField.vue'

import { IS_SCHEMA_WIZARD, SCHEMA_MODEL_PATH } from '../../src/utils/constants'

import { mount } from '@vue/test-utils'
import { markRaw, ref, isRef, provide, computed } from 'vue'
import * as Vue from 'vue'

const FormText = {
  template: '<input/>',
  props: ['label'],
  emits: ['update:modelValue']
}

const FormSelect = {
  template: '<select />',
  props: ['label', 'options'],
  emits: ['update:modelValue']
}

const SchemaWrapperFactory = (
  schema,
  binds,
  formModel,
  { insideWizard = false } = {}
) => {
  return {
    template: `
      <SchemaForm
        :schema="schemaRef"
        v-bind="binds"
      >
        <template #beforeForm>Before form</template>
        <template #afterForm>After form</template>
      </SchemaForm>
    `,
    components: { SchemaForm },
    setup () {
      const schemaRef = isRef(schema) ? schema : ref(schema)
      useSchemaForm(formModel || {})

      if (insideWizard) {
        // Mock it being inside a SchemaWizard with provide
        provide(IS_SCHEMA_WIZARD, true)
      }

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
  describe('schema types and options', () => {
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

    it('renders a form based on a computed schema', async () => {
      const model = ref({
        check: 'A',
        a: '',
        b: ''
      })

      const schema = computed(() => {
        return model.value.check === 'A'
          ? {
              check: {
                component: FormSelect,
                options: ['A', 'B'],
                label: 'A or B'
              },
              a: {
                component: FormText,
                label: 'A'
              }
            }
          : {
              check: {
                component: FormSelect,
                options: ['A', 'B'],
                label: 'A or B'
              },
              b: {
                component: FormText,
                label: 'B'
              }
            }
      })

      const wrapper = mount(SchemaWrapperFactory(schema, null, model))
      expect(wrapper.findComponent(FormText).props().label).toEqual('A')

      wrapper.findComponent(FormSelect).vm.$emit('update:modelValue', 'B')
      await wrapper.vm.$nextTick()

      expect(wrapper.findComponent(FormText).props().label).toEqual('B')
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

    it('works with an empty array schema', () => {
      const wrapper = mount(SchemaWrapperFactory([]))

      expect(wrapper.find('form').exists()).toBe(true)
    })
  })

  describe('default schema values', () => {
    it('populates the formModel with the schema when created if a default prop exists', () => {
      const schema = {
        firstName: {
          component: FormText,
          label: 'First Name',
          default: 'Darth'
        },
        lastName: {
          component: FormText,
          label: 'Last Name',
          default: 'Vader'
        },
        contact: {
          component: SchemaForm,
          schema: {
            email: {
              component: FormText,
              label: 'Email',
              default: 'darth@deathstarmail.com'
            },
            address: {
              FormText,
              label: 'Address'
            },
            deepNest: {
              component: SchemaForm,
              schema: {
                lightSaber: {
                  component: FormText,
                  label: 'Lightsaber',
                  default: 'Red'
                }
              }
            }
          }
        }
      }

      const formModel = ref({})

      mount(SchemaWrapperFactory(schema, {}, formModel))
      expect(formModel.value).toEqual({
        firstName: 'Darth',
        lastName: 'Vader',
        contact: {
          email: 'darth@deathstarmail.com',
          deepNest: {
            lightSaber: 'Red'
          }
        }
      })
    })

    it('can set default schema values to boolean false', () => {
      const schema = {
        firstName: {
          component: FormText,
          label: 'First Name',
          default: false
        },
        contact: {
          component: SchemaForm,
          schema: {
            deepNest: {
              component: SchemaForm,
              schema: {
                lightSaber: {
                  component: FormText,
                  label: 'Lightsaber',
                  default: false
                }
              }
            }
          }
        }
      }

      const formModel = ref({})

      mount(SchemaWrapperFactory(schema, {}, formModel))
      expect(formModel.value).toEqual({
        firstName: false,
        contact: {
          deepNest: {
            lightSaber: false
          }
        }
      })
    })

    it('populates the formModel with defaults on schemas with multiple top levels', async () => {
      const formModel = ref({ })

      const schema = ref({
        levelOneA: {
          component: SchemaForm,
          schema: {
            amount: {
              component: FormText,
              label: 'Amount A',
              default: '10'
            }
          }
        },
        levelOneB: {
          component: SchemaForm,
          schema: {
            amount: {
              component: FormText,
              label: 'Amount B',
              default: '20'
            }
          }
        }
      })

      mount(SchemaWrapperFactory(schema, null, formModel))
      expect(formModel.value.levelOneA.amount).toEqual('10')
      expect(formModel.value.levelOneB.amount).toEqual('20')
    })
  })

  it('renders a form with multiple nested schemas at the same nesting level', () => {
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
              },
              employees: {
                component: FormSelect,
                label: 'Number of employees',
                options: [
                  '1', '2', '3', '4+'
                ]
              }
            }
          },
          moreDetails: {
            component: SchemaForm,
            schema: {
              department: {
                component: FormText,
                label: 'Department'
              },
              hours: {
                component: FormSelect,
                label: 'Hours per shift',
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

    expect(wrapper.findAllComponents(FormText)).toHaveLength(2)
    expect(wrapper.findAllComponents(FormSelect)).toHaveLength(2)
  })

  describe('a11y', () => {
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
  })

  describe('props', () => {
    it('renders form rows with user defined classes with schemaRowClasses', () => {
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

    it('passes sharedConfig to child SchemaFields', () => {
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
        { sharedConfig: { custom: 1 } }
      ))

      const fields = wrapper.findAllComponents(SchemaField)
      fields.forEach(field => {
        expect(field.props().sharedConfig).toEqual({ custom: 1 })
      })
    })

    it('can allow the user to use their own wrapping form tag', () => {
      const schema = {
        firstName: {
          component: FormText,
          label: 'First Name'
        }
      }

      const wrapper = mount(SchemaWrapperFactory(
        schema,
        { useCustomFormWrapper: true }
      ))

      expect(wrapper.element.tagName).toEqual('DIV')
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

    it('preserves reactivity on field properties', async () => {
      const reactiveRef = ref('reactive')
      const schema = computed(() => {
        const schema = {
          firstName: {
            component: FormText,
            label: reactiveRef.value
          }
        }

        return schema
      })

      const wrapper = mount(SchemaWrapperFactory(schema))

      expect(wrapper.findComponent(FormText).props('label')).toEqual('reactive')

      reactiveRef.value = 'something'
      await wrapper.vm.$nextTick()

      expect(wrapper.findComponent(FormText).props('label')).toEqual('something')
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

    it('cleans up the model with nested array schemas', async () => {
      const schema = [
        {
          model: 'firstName',
          component: FormText,
          label: 'First Name',
          default: 'Mr Piddles'
        },
        {
          model: 'favoriteThingAboutVue',
          component: FormSelect,
          label: 'Favorite thing about Vue',
          required: true,
          default: 'Documentation',
          options: [
            'Ease of use',
            'Documentation',
            'Community'
          ]
        },
        {
          model: 'nested',
          schema: [
            {
              model: 'lastName',
              component: FormText,
              label: 'Last name',
              default: 'International Cat of Mistery'
            },
            {
              model: 'email',
              component: FormText,
              label: 'Email',
              default: 'meow@mail.purr'
            },
            {
              model: 'nested2',
              schema: [
                {
                  model: 'middleName',
                  component: FormText,
                  label: 'Middle name',
                  default: 'Le meow'
                }
              ]
            }
          ]
        }
      ]

      const formModel = ref({})

      const wrapper = mount(SchemaWrapperFactory(schema, null, formModel))
      expect(formModel.value).toEqual({
        firstName: 'Mr Piddles',
        favoriteThingAboutVue: 'Documentation',
        nested: {
          email: 'meow@mail.purr',
          lastName: 'International Cat of Mistery',
          nested2: {
            middleName: 'Le meow'
          }
        }
      })

      const copySchema = [...schema]
      // Delete first name
      copySchema.splice(0, 1)

      // Delete email and nested 2
      copySchema[1].schema.splice(1, 2)

      wrapper.setProps({
        schema: copySchema
      })
      await wrapper.vm.$nextTick()

      expect(formModel.value).toEqual({
        favoriteThingAboutVue: 'Documentation',
        nested: {
          lastName: 'International Cat of Mistery'
        }
      })
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

  describe('behaving as the parent or child schema', () => {
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

    it('presents a form when it is the parent', () => {
      const wrapper = mount(SchemaWrapperFactory({
        firstName: {
          component: FormText,
          label: 'First Name'
        },
        lastName: {
          component: FormText,
          label: 'Last Name'
        }
      }))

      expect(wrapper.element.tagName).toBe('FORM')
    })

    it('presents as a div when it is not the parent', () => {
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

      const wrapper = mount(SchemaWrapperFactory(schema, null, null, { insideWizard: true }))

      expect(wrapper.element.tagName).toBe('DIV')
    })

    it('exposes beforeForm and afterForm slots when its the parent', () => {
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

      expect(wrapper.text()).toContain('Before form')
      expect(wrapper.text()).toContain('After form')
    })
  })

  describe('handling nested schemas', () => {
    it('cleans up the model', async () => {
      const schema = {
        firstName: {
          component: FormText,
          label: 'First Name'
        },
        lastName: {
          component: FormText,
          label: 'Last Name'
        },
        properties: {
          component: SchemaForm,
          schema: {
            favoriteThingAboutVue: {
              component: FormSelect,
              label: 'Favorite thing about Vue',
              required: true,
              condition: model => !!model.firstName,
              options: ['Ease of use', 'Documentation', 'Community']
            }
          }
        }
      }

      const formModel = ref({
        firstName: 'Victor',
        lastName: 'Lambert',
        properties: {
          favoriteThingAboutVue: 'Community'
        }
      })

      const wrapper = mount(SchemaWrapperFactory(schema, null, formModel))

      const copySchema = { ...schema }
      delete copySchema.firstName
      wrapper.setProps({
        schema: copySchema
      })
      await wrapper.vm.$nextTick()

      expect(formModel.value).toEqual({
        lastName: 'Lambert',
        properties: {}
      })
    })

    it('injects the nestedSchemaModel prop as part of the path', () => {
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

      const provideSpy = jest.spyOn(Vue, 'provide')

      mount(SchemaWrapperFactory(
        schema,
        { nestedSchemaModel: 'myNestedPath' }
      ))

      expect(provideSpy).toHaveBeenCalledWith(SCHEMA_MODEL_PATH, 'myNestedPath')
    })
  })
})
