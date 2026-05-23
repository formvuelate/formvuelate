import { h, ref, shallowRef } from 'vue'
import * as yup from 'yup'
import { SchemaFormFactory, useSchemaForm } from '../../../src/index'
import VeeValidatePlugin from '../../../../plugin-vee-validate/src/index'
import { BaseInput } from '../../utils/components'

const REQUIRED = 'Required'
const EMAIL = 'Must be an email'
const TOO_SHORT = 'Too short'

describe('vee-validate plugin (browser)', () => {
  it('shows and clears per-field validation errors as the user types', () => {
    const SchemaWithValidation = SchemaFormFactory([VeeValidatePlugin()])

    cy.mount({
      components: { SchemaWithValidation },
      setup () {
        useSchemaForm(ref({}))
        const schema = shallowRef({
          email: {
            component: BaseInput,
            label: 'Email',
            validations: yup.string().required(REQUIRED).email(EMAIL)
          }
        })
        return () => h(SchemaWithValidation, { schema })
      }
    })

    cy.get('input').type('notanemail')
    cy.get('.error').should('have.text', EMAIL)

    cy.get('input').clear()
    cy.get('input').type('marina@test.com')
    cy.get('.error').should('not.exist')
  })

  it('runs form-level validation from a validation-schema', () => {
    const SchemaWithValidation = SchemaFormFactory([VeeValidatePlugin()])

    cy.mount({
      components: { SchemaWithValidation },
      setup () {
        useSchemaForm(ref({}))
        const schema = shallowRef([
          { model: 'email', component: BaseInput, label: 'Email' },
          { model: 'password', component: BaseInput, label: 'Password' }
        ])
        const validationSchema = yup.object({
          email: yup.string().email(EMAIL).required(REQUIRED),
          password: yup.string().min(4, TOO_SHORT).required(REQUIRED)
        })
        return () => h(SchemaWithValidation, { schema, validationSchema })
      }
    })

    cy.get('input').eq(0).type('bad')
    cy.get('.error').eq(0).should('have.text', EMAIL)

    cy.get('input').eq(1).type('ab')
    cy.get('.error').eq(1).should('have.text', TOO_SHORT)

    cy.get('input').eq(0).clear()
    cy.get('input').eq(0).type('marina@test.com')
    cy.get('input').eq(1).clear()
    cy.get('input').eq(1).type('longenough')
    cy.get('.error').should('not.exist')
  })

  it('blocks submit while invalid and fires it once valid', () => {
    const onSubmit = cy.stub().as('submit')
    const SchemaWithValidation = SchemaFormFactory([VeeValidatePlugin()])

    cy.mount({
      components: { SchemaWithValidation },
      setup () {
        useSchemaForm(ref({}))
        const schema = shallowRef([
          { model: 'email', component: BaseInput, label: 'Email' }
        ])
        const validationSchema = yup.object({
          email: yup.string().email(EMAIL).required(REQUIRED)
        })
        return () =>
          h(SchemaWithValidation, { schema, validationSchema, onSubmit }, {
            afterForm: () => h('button', { type: 'submit' }, 'Submit')
          })
      }
    })

    // Submitting empty/invalid surfaces the error and does NOT call the handler.
    cy.get('button').click()
    cy.get('.error').should('exist')
    cy.get('@submit').should('not.have.been.called')

    // Once valid, submit goes through.
    cy.get('input').type('marina@test.com')
    cy.get('button').click()
    cy.get('@submit').should('have.been.calledOnce')
  })

  it('exposes form-level validation state on the afterForm slot', () => {
    const SchemaWithValidation = SchemaFormFactory([VeeValidatePlugin()])

    cy.mount({
      components: { SchemaWithValidation },
      setup () {
        useSchemaForm(ref({}))
        const schema = shallowRef([
          { model: 'email', component: BaseInput, label: 'Email' }
        ])
        const validationSchema = yup.object({
          email: yup.string().email(EMAIL).required(REQUIRED)
        })
        return () =>
          h(SchemaWithValidation, { schema, validationSchema }, {
            afterForm: ({ validation }) =>
              h('span', { class: 'submit-count' }, String(validation.submitCount))
          })
      }
    })

    cy.get('.submit-count').should('have.text', '0')
  })
})
