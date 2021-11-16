import { SchemaFormWrapper } from '../support/helpers'
import { ref } from 'vue'
import { mount } from '@cypress/vue'
import { BaseInput } from '../../utils/components'
import SchemaForm from '../../../src/SchemaForm.vue'

describe('useSchemaForm', () => {
  it('can update the form model directly', () => {
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
          }
        }
      }
    }

    const model = ref({
      name: '',
      contact: {
        email: ''
      }
    })

    mount(SchemaFormWrapper({
      schema,
      model,
      onSetup: ({ updateFormModel }) => {
        updateFormModel('contact.email', 'marina@test.com')

        updateFormModel('name', 'Marina')
        updateFormModel('name', 'Mosti') // Overwrite on purpose
      }
    }))

    cy.get('input').eq('0').should('have.value', 'Mosti')
    cy.get('input').eq('1').should('have.value', 'marina@test.com')
  })
})
