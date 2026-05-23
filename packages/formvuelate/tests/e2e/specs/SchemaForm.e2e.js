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

  it('writes user input back into the model', () => {
    cy.mount({
      setup () {
        const model = ref({})
        useSchemaForm(model)
        const schema = shallowRef({
          firstName: { component: BaseInput, label: 'First name' },
          lastName: { component: BaseInput, label: 'Last name' }
        })
        return () => h('div', [
          h(SchemaForm, { schema }),
          h('pre', { class: 'model' }, JSON.stringify(model.value))
        ])
      }
    })

    cy.get('input').eq(0).type('Marina')
    cy.get('input').eq(1).type('Mosti')

    cy.get('.model').should('contain', '"firstName":"Marina"')
    cy.get('.model').should('contain', '"lastName":"Mosti"')
  })

  it('pre-populates inputs from `default` schema values', () => {
    cy.mount({
      setup () {
        const model = ref({})
        useSchemaForm(model)
        const schema = shallowRef({
          firstName: { component: BaseInput, label: 'First', default: 'Ada' },
          lastName: { component: BaseInput, label: 'Last', default: 'Lovelace' },
          subscribed: { component: BaseInput, label: 'Subscribed', default: false }
        })
        return () => h('div', [
          h(SchemaForm, { schema }),
          h('pre', { class: 'model' }, JSON.stringify(model.value))
        ])
      }
    })

    cy.get('input').eq(0).should('have.value', 'Ada')
    cy.get('input').eq(1).should('have.value', 'Lovelace')
    // `false` is a legitimate default and must be applied (not skipped).
    cy.get('.model').should('contain', '"subscribed":false')
  })

  it('renders an array schema as horizontal rows', () => {
    cy.mount({
      setup () {
        const model = ref({})
        useSchemaForm(model)
        const schema = shallowRef([
          [
            { model: 'firstName', component: BaseInput, label: 'First' },
            { model: 'lastName', component: BaseInput, label: 'Last' }
          ],
          [
            { model: 'email', component: BaseInput, label: 'Email' }
          ]
        ])
        return () => h(SchemaForm, { schema })
      }
    })

    cy.get('.schema-row').should('have.length', 2)
    cy.get('.schema-row').eq(0).find('input').should('have.length', 2)
    cy.get('.schema-row').eq(1).find('input').should('have.length', 1)
  })

  it('applies sharedConfig to every field', () => {
    cy.mount({
      setup () {
        const model = ref({})
        useSchemaForm(model)
        const schema = shallowRef({
          a: { component: BaseInput, label: 'A' },
          b: { component: BaseInput, label: 'B' }
        })
        return () => h(SchemaForm, { schema, sharedConfig: { placeholder: 'shared' } })
      }
    })

    cy.get('input[placeholder="shared"]').should('have.length', 2)
  })

  it('toggles a top-level conditional field based on another field', () => {
    cy.mount({
      setup () {
        const model = ref({})
        useSchemaForm(model)
        const schema = shallowRef({
          hasPet: { component: BaseInput, label: 'Has pet? (type yes)' },
          petName: {
            component: BaseInput,
            label: 'Pet name',
            condition: m => m.hasPet === 'yes'
          }
        })
        return () => h(SchemaForm, { schema })
      }
    })

    cy.get('input').should('have.length', 1)
    cy.get('input').first().type('yes')
    cy.get('input').should('have.length', 2)
    cy.get('label').eq(1).should('have.text', 'Pet name')

    // Flipping the condition back hides the dependent field again.
    cy.get('input').first().clear()
    cy.get('input').first().type('no')
    cy.get('input').should('have.length', 1)
  })

  it('writes a deeply nested (3-level) input to the correct model path', () => {
    cy.mount({
      setup () {
        const model = ref({})
        useSchemaForm(model)
        const schema = shallowRef({
          level1: {
            component: SchemaForm,
            schema: {
              level2: {
                component: SchemaForm,
                schema: {
                  deepField: { component: BaseInput, label: 'Deep' }
                }
              }
            }
          }
        })
        return () => h('div', [
          h(SchemaForm, { schema }),
          h('pre', { class: 'model' }, JSON.stringify(model.value))
        ])
      }
    })

    cy.get('input').type('deepvalue')
    cy.get('.model').should('contain', '"level1":{"level2":{"deepField":"deepvalue"}}')
  })

  it('preserves compatible model values across a runtime schema swap', () => {
    const variant = ref('a')
    cy.mount({
      setup () {
        const model = ref({})
        useSchemaForm(model)
        const schema = computed(() =>
          variant.value === 'a'
            ? {
                shared: { component: BaseInput, label: 'Shared' },
                onlyA: { component: BaseInput, label: 'Only A' }
              }
            : {
                shared: { component: BaseInput, label: 'Shared' },
                onlyB: { component: BaseInput, label: 'Only B' }
              }
        )
        return () => h('div', [
          h(SchemaForm, { schema }),
          h('pre', { class: 'model' }, JSON.stringify(model.value))
        ])
      }
    })

    cy.get('input').eq(0).type('keepme')
    cy.get('input').eq(1).type('willbecleaned')
    cy.get('.model').should('contain', '"shared":"keepme"')
    cy.get('.model')
      .should('contain', '"onlyA":"willbecleaned"')
      .then(() => {
        variant.value = 'b'

        // shared field's value survives the swap; onlyA is cleaned up
        // because it's no longer in the schema.
        cy.get('.model').should('contain', '"shared":"keepme"')
        cy.get('.model').should('not.contain', 'onlyA')
        cy.get('label').eq(1).should('have.text', 'Only B')
      })
  })

  it('keeps removed-field data when preventModelCleanupOnSchemaChange is set', () => {
    const variant = ref('a')
    cy.mount({
      setup () {
        const model = ref({})
        useSchemaForm(model)
        const schema = computed(() =>
          variant.value === 'a'
            ? {
                keep: { component: BaseInput, label: 'Keep' },
                removeme: { component: BaseInput, label: 'Remove' }
              }
            : {
                keep: { component: BaseInput, label: 'Keep' }
              }
        )
        return () => h('div', [
          h(SchemaForm, { schema, preventModelCleanupOnSchemaChange: true }),
          h('pre', { class: 'model' }, JSON.stringify(model.value))
        ])
      }
    })

    cy.get('input').eq(0).type('kept')
    cy.get('input').eq(1).type('stays')
    cy.get('.model')
      .should('contain', '"removeme":"stays"')
      .then(() => {
        variant.value = 'b'

        cy.get('input').should('have.length', 1)
        // With cleanup prevented, the removed field's value is retained.
        cy.get('.model').should('contain', '"removeme":"stays"')
      })
  })

  it('emits submit from the default form wrapper', () => {
    const onSubmit = cy.stub().as('submit')
    cy.mount({
      setup () {
        const model = ref({})
        useSchemaForm(model)
        const schema = shallowRef({
          name: { component: BaseInput, label: 'Name' }
        })
        return () =>
          h(SchemaForm, { schema, onSubmit }, {
            afterForm: () => h('button', { type: 'submit' }, 'Go')
          })
      }
    })

    cy.get('button').click()
    cy.get('@submit').should('have.been.calledOnce')
  })
})
