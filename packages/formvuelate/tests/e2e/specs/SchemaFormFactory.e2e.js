import { mount } from '@cypress/vue'

import { h, ref, shallowRef } from 'vue'
import { SchemaFormFactory, SchemaForm, useSchemaForm } from '../../../src/index'
import LookupPlugin, { lookupSubSchemas } from '../../../../plugin-lookup/src/index'
import { BaseInput } from '../../utils/components'

describe('SchemaFormFactory', () => {
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

      mount({
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
  })
})
