import { shallowRef } from 'vue'
import { BaseInput, ReadOnlySummary } from '../../utils/components'
import { SchemaFormWrapper } from '../support/helpers'

describe('read-only elements', () => {
  it('renders a read-only element that reflects the live form model', () => {
    const schema = shallowRef({
      firstName: {
        component: BaseInput,
        label: 'First name'
      },
      summary: {
        component: ReadOnlySummary,
        label: 'Summary',
        readonly: true
      }
    })

    cy.mount(SchemaFormWrapper({ schema }))

    // Starts empty, then tracks what the user types without being an input itself.
    cy.get('.summary-value').should('have.text', '{}')
    cy.get('input').type('Marina')
    cy.get('.summary-value').should('contain', 'Marina')
  })

  it('keeps the read-only element out of the form model', () => {
    let model

    const schema = shallowRef({
      firstName: {
        component: BaseInput,
        label: 'First name'
      },
      summary: {
        component: ReadOnlySummary,
        label: 'Summary',
        readonly: true,
        // Even a `default` on a read-only element is ignored.
        default: 'should be ignored'
      }
    })

    cy.mount(
      SchemaFormWrapper({
        schema,
        onSetup: ({ formModel }) => { model = formModel }
      })
    )

    cy.get('input').type('Marina')
    cy.wrap(null).should(() => {
      expect(model.value).to.deep.equal({ firstName: 'Marina' })
    })
  })
})
