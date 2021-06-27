import { mount } from '@cypress/vue'
import SchemaForm from './SchemaForm.vue'

import useSchemaForm from './features/useSchemaForm'
import { shallowRef, ref, h, computed } from 'vue'

const SchemaFormWrapper = (schema) => ({
  components: [SchemaForm],
  setup () {
    const model = ref({})
    useSchemaForm(model)

    const schemaRef = shallowRef(schema)

    return {
      schema: schemaRef
    }
  },
  render () {
    return h(SchemaForm, {
      schema,
      onSubmit: this.$emit('submit')
    })
  }
})

const BaseInput = {
  props: ['label'],
  render () {
    return [
      h('label', this.label),
      h('input', { ...this.$attrs })
    ]
  }
}

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

    mount(SchemaFormWrapper(schema))

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

    mount(SchemaFormWrapper(schema))

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

    mount(SchemaFormWrapper(schema))

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

    mount(SchemaFormWrapper(schema))

    cy.get('label').should('have.text', 'First name')
      .then(() => {
        label.value = 'Name'
        cy.wait(100)

        cy.get('label').should('have.text', 'Name')
      })
  })
})
