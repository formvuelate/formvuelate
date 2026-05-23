import { h, ref } from 'vue'
import SchemaWizard from '../../../src/SchemaWizard.vue'
import useSchemaForm from '../../../src/features/useSchemaForm'
import { BaseInput } from '../../utils/components'

const wizardSchema = [
  {
    firstName: { component: BaseInput, label: 'First name' },
    lastName: { component: BaseInput, label: 'Last name' }
  },
  {
    email: { component: BaseInput, label: 'Email' }
  }
]

describe('SchemaWizard', () => {
  it('renders only the current step and switches when the step changes', () => {
    const step = ref(0)
    cy.mount({
      setup () {
        useSchemaForm(ref({}))
        return () => h(SchemaWizard, { schema: wizardSchema, step: step.value })
      }
    })

    cy.get('input').should('have.length', 2)
    cy.get('label')
      .eq(0)
      .should('have.text', 'First name')
      .then(() => {
        step.value = 1

        cy.get('input').should('have.length', 1)
        cy.get('label').eq(0).should('have.text', 'Email')
      })
  })

  it('preserves data entered in earlier steps when navigating back and forth', () => {
    const step = ref(0)
    cy.mount({
      setup () {
        const model = ref({})
        useSchemaForm(model)
        return () =>
          h('div', [
            h(SchemaWizard, { schema: wizardSchema, step: step.value }),
            h('pre', { class: 'model' }, JSON.stringify(model.value))
          ])
      }
    })

    cy.get('input').eq(0).type('Marina')
    cy.get('input').eq(1).type('Mosti')
    cy.get('.model')
      .should('contain', '"firstName":"Marina"')
      .then(() => {
        step.value = 1

        cy.get('input').should('have.length', 1)
        cy.get('input').eq(0).type('marina@test.com')

        // step 0 data survives switching to step 1
        cy.get('.model').should('contain', '"firstName":"Marina"')
        cy.get('.model').should('contain', '"lastName":"Mosti"')
        cy.get('.model').should('contain', '"email":"marina@test.com"')
      })
      .then(() => {
        step.value = 0

        // going back, the original inputs still hold their values
        cy.get('input').eq(0).should('have.value', 'Marina')
        cy.get('input').eq(1).should('have.value', 'Mosti')
      })
  })

  it('emits submit', () => {
    const onSubmit = cy.stub().as('submit')
    cy.mount({
      setup () {
        useSchemaForm(ref({}))
        return () =>
          h(SchemaWizard, { schema: wizardSchema, step: 0, onSubmit }, {
            afterForm: () => h('button', { type: 'submit' }, 'Submit')
          })
      }
    })

    cy.get('button').click()
    cy.get('@submit').should('have.been.calledOnce')
  })
})
