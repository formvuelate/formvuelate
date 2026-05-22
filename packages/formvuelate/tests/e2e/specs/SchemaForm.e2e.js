import SchemaForm from '../../../src/SchemaForm.vue'

import useSchemaForm from '../../../src/features/useSchemaForm'
import { shallowRef, ref, h, computed } from 'vue'
import { BaseInput } from '../../utils/components'
import { SchemaFormWrapper } from '../support/helpers'

describe('SchemaForm', () => {
  it('renders elements', () => {
    const schema = {
      name: {
        component: BaseInput,
        label: 'Name: '
      },
      email: {
        component: BaseInput,
        label: 'Email: ',
        type: 'email'
      }
    }

    cy.mount(SchemaFormWrapper({ schema }))

    cy.get('input').should('have.length', 2)
  })

  it('renders nested elements', () => {
    const schema = {
      name: {
        component: BaseInput,
        label: 'Name: '
      },
      nested: {
        component: SchemaForm,
        schema: {
          email: {
            component: BaseInput,
            label: 'Email: ',
            type: 'email'
          }
        }
      }
    }

    cy.mount(SchemaFormWrapper({ schema }))

    cy.get('input').should('have.length', 2)
  })

  it('renders nested same level elements', () => {
    const schema = {
      name: {
        component: BaseInput,
        label: 'Name: '
      },
      contact: {
        component: SchemaForm,
        schema: {
          email: {
            component: BaseInput,
            label: 'Email: ',
            type: 'email'
          },
          phone: {
            component: BaseInput,
            label: 'Phone: '
          }
        }
      },
      work: {
        component: SchemaForm,
        schema: {
          workEmail: {
            component: BaseInput,
            label: 'Work Email: ',
            type: 'email'
          },
          workPhone: {
            component: BaseInput,
            label: 'Work phone: '
          }
        }
      }
    }

    cy.mount(SchemaFormWrapper({ schema }))

    cy.get('input').should('have.length', 5)
  })

  it('preserves reactivity for SchemaField element bindings', () => {
    const label = ref('First name')
    const schema = computed(() => {
      return {
        firstName: {
          component: BaseInput,
          label: label.value
        }
      }
    })

    cy.mount(SchemaFormWrapper({ schema }))

    cy.get('label')
      .should('have.text', 'First name')
      .then(() => {
        label.value = 'Name'

        cy.get('label').should('have.text', 'Name')
      })
  })

  it('works with conditions on nested schemas', () => {
    const schema = shallowRef({
      first: {
        component: SchemaForm,
        schema: {
          inputA: {
            component: BaseInput,
            label: 'Input A'
          },
          inputB: {
            component: BaseInput,
            label: 'Input B',
            condition: model => {
              return model.first.inputA === 'B'
            }
          }
        }
      }
    })

    cy.mount(SchemaFormWrapper({ schema }))

    cy.get('input').type('B')
    cy.get('label').eq(1).should('have.text', 'Input B')
  })

  it('can use a custom form element', () => {
    cy.mount({
      setup() {
        const model = ref({})
        useSchemaForm(model)

        const schema = shallowRef({
          first: {
            component: SchemaForm,
            schema: {
              inputA: {
                component: BaseInput,
                label: 'Input A'
              },
              inputB: {
                component: BaseInput,
                label: 'Input B',
                condition: model => {
                  return model.first.inputA === 'B'
                }
              }
            }
          }
        })

        const submitted = ref(false)

        const mySubmit = e => {
          e.preventDefault()
          submitted.value = true
        }

        return () =>
          h(
            'form',
            {
              id: 'myForm',
              onSubmit: mySubmit
            },
            [
              !submitted.value
                ? h(SchemaForm, {
                    schema,
                    useCustomFormWrapper: true
                  })
                : h('p', 'Submitted!'),
              h('button', { type: 'submit' }, 'Submit')
            ]
          )
      }
    })

    cy.get('#myForm').within(() => {
      cy.get('input').type('B')
      cy.get('input').eq('1').type('C')

      cy.get('button').click()
      cy.contains('Submitted!')
    })
  })

  it('cleans conditional fields out of the model when their condition flips to false', () => {
    cy.mount({
      setup() {
        const model = ref({})
        useSchemaForm(model)

        const schema = shallowRef({
          displayName: {
            component: BaseInput,
            label: 'Display name: '
          },
          preferences: {
            component: SchemaForm,
            schema: {
              favoriteVueFeature: {
                component: BaseInput,
                label: 'Favorite Vue feature: ',
                condition: m => !!m.displayName
              }
            }
          }
        })

        return () =>
          h('div', [
            h(SchemaForm, { schema }),
            h('pre', { class: 'model' }, JSON.stringify(model.value))
          ])
      }
    })

    // Initially only the displayName input is visible. The conditional
    // favoriteVueFeature is hidden because displayName is empty.
    cy.get('input').should('have.length', 1)

    // Reveal the conditional field by entering a name.
    cy.get('input').first().type('Marina')
    cy.get('input').should('have.length', 2)

    // Fill in the conditional field and confirm it lands in the model.
    cy.get('input').eq(1).type('Composition API')
    cy.get('.model').should('contain', '"favoriteVueFeature":"Composition API"')

    // Clear displayName — the conditional field's wrapper row hides AND its
    // value is cleaned out of the model (the regression that Phase 7.6 fixed).
    cy.get('input').first().clear()
    cy.get('input').should('have.length', 1)
    cy.get('.model').should('not.contain', 'favoriteVueFeature')
    cy.get('.model').should('contain', '"preferences":{}')

    // Sanity check: no empty <div class="schema-row"> in the DOM (the
    // regression that PR #218 / issue #208 fixed — re-enshrined by the
    // SchemaRow `rowHasVisibleElements` guard).
    cy.get('.schema-row').each($el => {
      expect($el.children().length).to.be.greaterThan(0)
    })
  })
})
