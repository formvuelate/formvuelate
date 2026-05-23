
import { h, ref, shallowRef } from 'vue'
import { SchemaFormFactory, useSchemaForm } from '../../../src/index'
import LookupPlugin, { lookupSubSchemas } from '../../../../plugin-lookup/src/index'
import VeeValidatePlugin from '../../../../plugin-vee-validate/src/index'
import { BaseInput } from '../../utils/components'

describe('SchemaFormFactory', () => {
  it('works with a blank plugin configuration and locally defined components', () => {
    const SchemaFormWithPlugins = SchemaFormFactory([], { BaseInput })

    cy.mount({
      components: { SchemaFormWithPlugins },
      setup () {
        const model = ref({
          name: '',
          pet: 'something',
          nested: {

          }
        })

        lookupSubSchemas(SchemaFormWithPlugins)
        useSchemaForm(model)

        const schemaRef = shallowRef({
          name: {
            component: 'BaseInput',
            label: 'Your name'
          },
          pet: {
            component: 'BaseInput',
            label: 'Your pet'
          },
          nested: {
            component: 'SchemaForm',
            schema: {
              game: {
                component: 'BaseInput',
                label: 'Videogame'
              }
            }
          }
        })

        return () => h(SchemaFormWithPlugins, {
          schema: schemaRef
        })
      }
    })

    cy.get('input').should('have.length', 3)
  })

  describe('with lookup plugin', () => {
    it('parses subschema SchemaForm elements', () => {
      const SCHEMA = [
        {
          model: 'firstName',
          component: 'Text',
          label: 'First Name'
        },
        {
          model: 'nested',
          component: 'SchemaForm',
          schema: [
            {
              model: 'nestedfirstName',
              component: 'Text',
              label: 'First Name nested'
            },
            {
              model: 'nestedLastName',
              component: BaseInput,
              label: 'Last name nested'
            },
            {
              model: 'doubleNested',
              component: 'SchemaForm',
              schema: [
                {
                  model: 'doubleNestedName',
                  component: 'Text',
                  label: 'Double nested text'
                }
              ]
            }
          ]
        }
      ]

      const SchemaFormWithPlugins = SchemaFormFactory([
        LookupPlugin({
          mapComponents: {
            Text: BaseInput
          }
        })
      ])

      cy.mount({
        components: { SchemaFormWithPlugins },
        setup () {
          const model = ref({})
          lookupSubSchemas(SchemaFormWithPlugins)
          useSchemaForm(model)

          const schemaRef = shallowRef(SCHEMA)

          return () => h(SchemaFormWithPlugins, {
            schema: schemaRef
          })
        }
      })

      cy.get('input').should('have.length', 4)
      cy.get('label').eq(3).should('have.text', 'Double nested text')
    })

    it('works when also having to mapProps the component property and mapComponents', () => {
      const SCHEMA = [
        {
          model: 'firstName',
          type: 'Text',
          label: 'First Name'
        },
        {
          model: 'nested',
          type: 'Container',
          schema: [
            {
              model: 'nestedfirstName',
              type: 'Text',
              label: 'First Name nested'
            },
            {
              model: 'nestedLastName',
              type: BaseInput,
              label: 'Last name nested'
            },
            {
              model: 'doubleNested',
              type: 'Container',
              schema: [
                {
                  model: 'doubleNestedName',
                  type: 'Text',
                  label: 'Double nested text'
                }
              ]
            }
          ]
        }
      ]

      const SchemaFormWithPlugins = SchemaFormFactory([
        LookupPlugin({
          mapProps: {
            type: 'component'
          },
          mapComponents: {
            Text: BaseInput,
            Container: 'SchemaForm'
          }
        })
      ])

      cy.mount({
        components: { SchemaFormWithPlugins },
        setup () {
          const model = ref({})
          lookupSubSchemas(SchemaFormWithPlugins)
          useSchemaForm(model)

          const schemaRef = shallowRef(SCHEMA)

          return () => h(SchemaFormWithPlugins, {
            schema: schemaRef
          })
        }
      })

      cy.get('input').should('have.length', 4)
      cy.get('label').eq(3).should('have.text', 'Double nested text')
    })

    it('maps props through a function form', () => {
      const SchemaFormWithPlugins = SchemaFormFactory([
        LookupPlugin({
          mapComponents: { text: BaseInput },
          mapProps: () => ({ heading: 'label' })
        })
      ])

      cy.mount({
        components: { SchemaFormWithPlugins },
        setup () {
          useSchemaForm(ref({}))
          const schemaRef = shallowRef({
            name: { component: 'text', heading: 'Your name' }
          })
          return () => h(SchemaFormWithPlugins, { schema: schemaRef })
        }
      })

      // `heading` was renamed to `label`, so BaseInput renders it.
      cy.get('label').should('have.text', 'Your name')
      cy.get('input').should('have.length', 1)
    })

    it('binds user input through lookup-mapped components', () => {
      const SchemaFormWithPlugins = SchemaFormFactory([
        LookupPlugin({ mapComponents: { text: BaseInput } })
      ])

      cy.mount({
        components: { SchemaFormWithPlugins },
        setup () {
          const model = ref({})
          useSchemaForm(model)
          const schemaRef = shallowRef({
            username: { component: 'text', label: 'Username' }
          })
          return () => h('div', [
            h(SchemaFormWithPlugins, { schema: schemaRef }),
            h('pre', { class: 'model' }, JSON.stringify(model.value))
          ])
        }
      })

      cy.get('input').type('marina')
      cy.get('.model').should('contain', '"username":"marina"')
    })
  })

  describe('with lookup and vee-validate', () => {
    it('integrates lookup and vee plugins in nested schemas', () => {
      const SCHEMA = [
        {
          model: 'firstName',
          type: 'Text',
          label: 'First Name'
        },
        {
          model: 'nested',
          type: 'Container',
          schema: [
            {
              model: 'nestedfirstName',
              type: 'Text',
              label: 'First Name nested',
              validations: value => value && value.length > 3
            }
          ]
        }
      ]

      const SchemaFormWithPlugins = SchemaFormFactory([
        LookupPlugin({
          mapProps: {
            type: 'component'
          },
          mapComponents: {
            Text: BaseInput,
            Container: 'SchemaForm'
          }
        }),
        VeeValidatePlugin({})
      ])

      cy.mount({
        components: { SchemaFormWithPlugins },
        setup () {
          const model = ref({})
          lookupSubSchemas(SchemaFormWithPlugins)
          useSchemaForm(model)

          const schemaRef = shallowRef(SCHEMA)

          return () => h(SchemaFormWithPlugins, {
            schema: schemaRef
          })
        }
      })

      cy.get('input').should('have.length', 2)
      cy.get('label').eq(1).should('have.text', 'First Name nested')

      cy.get('input').eq(1).type('Ma')
      cy.get('.error').should('have.text', 'First Name nested is not valid.')

      // Reaching a valid value (length > 3) clears the nested error.
      cy.get('input').eq(1).type('rina')
      cy.get('.error').should('not.exist')
    })
  })
})
