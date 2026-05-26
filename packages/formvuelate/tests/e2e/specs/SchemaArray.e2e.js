import SchemaForm from '../../../src/SchemaForm.vue'
import SchemaArray from '../../../src/SchemaArray.vue'
import useSchemaForm from '../../../src/features/useSchemaForm'
import { ref, computed, h } from 'vue'
import { BaseInput } from '../../utils/components'

// User-provided control components: they only emit, and SchemaArray ships none.
const AddControl = {
  props: ['count', 'canAdd'],
  emits: ['add'],
  render () {
    return h(
      'button',
      { class: 'add', type: 'button', disabled: this.canAdd === false, onClick: () => this.$emit('add') },
      'add'
    )
  }
}

const RemoveControl = {
  props: ['index', 'count', 'canRemove'],
  emits: ['remove', 'move'],
  render () {
    return h(
      'button',
      { class: 'remove', type: 'button', disabled: this.canRemove === false, onClick: () => this.$emit('remove') },
      'remove'
    )
  }
}

const mountArrayForm = (schema, initial) =>
  cy.mount({
    setup () {
      const model = ref(initial)
      useSchemaForm(model)
      return () =>
        h('div', [h(SchemaForm, { schema }), h('pre', { class: 'model' }, JSON.stringify(model.value))])
    }
  })

describe('SchemaArray', () => {
  const groupSchema = {
    friends: {
      component: SchemaArray,
      items: {
        name: { component: BaseInput, label: 'Name' },
        role: { component: BaseInput, label: 'Role' }
      },
      after: RemoveControl,
      append: AddControl
    }
  }

  it('renders a row per entry and adds new rows', () => {
    mountArrayForm(groupSchema, { friends: [{ name: 'Ada', role: 'Engineer' }] })

    cy.get('input').should('have.length', 2)
    cy.get('.add').click()
    cy.get('input').should('have.length', 4)
    cy.get('.model').should('contain', '"name":"Ada"')
  })

  it('removes a row without bleeding its value onto the survivor', () => {
    mountArrayForm(groupSchema, { friends: [{ name: 'Ada', role: 'Engineer' }] })

    cy.get('.add').click()
    cy.get('input').eq(2).type('Lin')
    cy.get('.model').should('contain', '"name":"Lin"')

    // Remove the FIRST row; the survivor (Lin) must keep its own value.
    cy.get('.remove').eq(0).click()
    cy.get('input').should('have.length', 2)
    cy.get('input').eq(0).should('have.value', 'Lin')
    cy.get('.model').should('contain', '"name":"Lin"')
    cy.get('.model').should('not.contain', 'Ada')
  })

  it('adds, edits and removes scalar rows', () => {
    const scalarSchema = {
      tags: {
        component: SchemaArray,
        items: { component: BaseInput, label: 'Tag' },
        after: RemoveControl,
        append: AddControl
      }
    }

    mountArrayForm(scalarSchema, { tags: ['vue'] })

    cy.get('input').should('have.length', 1)
    cy.get('.add').click()
    cy.get('input').eq(1).type('react')
    cy.get('.model').should('contain', '["vue","react"]')

    cy.get('.remove').eq(0).click()
    cy.get('input').should('have.length', 1)
    cy.get('.model').should('contain', '["react"]')
  })

  it('gates add and remove with min and max', () => {
    const gated = {
      tags: {
        component: SchemaArray,
        items: { component: BaseInput },
        after: RemoveControl,
        append: AddControl,
        min: 1,
        max: 2
      }
    }

    mountArrayForm(gated, { tags: ['a'] })

    // at min -> cannot remove
    cy.get('.remove').should('be.disabled')

    cy.get('.add').click()
    cy.get('input').should('have.length', 2)

    // at max -> cannot add, can now remove
    cy.get('.add').should('be.disabled')
    cy.get('.remove').first().should('not.be.disabled')
  })

  it('seeds blank entries up to min', () => {
    const gated = {
      tags: {
        component: SchemaArray,
        items: { component: BaseInput },
        after: RemoveControl,
        append: AddControl,
        min: 2
      }
    }

    mountArrayForm(gated, { tags: [] })

    cy.get('input').should('have.length', 2)
  })

  it('supports nested arrays', () => {
    const nested = {
      teams: {
        component: SchemaArray,
        items: {
          name: { component: BaseInput, label: 'Team' },
          members: {
            component: SchemaArray,
            items: { component: BaseInput },
            after: RemoveControl,
            append: AddControl
          }
        },
        after: RemoveControl,
        append: AddControl
      }
    }

    mountArrayForm(nested, { teams: [{ name: 'A', members: ['x'] }] })

    // team name + one member
    cy.get('input').should('have.length', 2)
    // the inner "members" add renders before the outer "teams" add
    cy.get('.add').eq(0).click()
    cy.get('input').should('have.length', 3)
    cy.get('.model').should('contain', '"members"')
  })

  it('renders rows with no controls when after/append are omitted', () => {
    mountArrayForm({ tags: { component: SchemaArray, items: { component: BaseInput } } }, { tags: ['a', 'b'] })

    cy.get('input').should('have.length', 2)
    cy.get('.add').should('not.exist')
    cy.get('.remove').should('not.exist')
  })

  it('pads the list when a dynamic schema raises min at runtime', () => {
    cy.mount({
      setup () {
        const min = ref(1)
        const model = ref({ tags: ['a'] })
        useSchemaForm(model)
        const schema = computed(() => ({
          tags: {
            component: SchemaArray,
            items: { component: BaseInput },
            after: RemoveControl,
            append: AddControl,
            min: min.value
          }
        }))
        return () =>
          h('div', [
            h('button', { class: 'raise-min', type: 'button', onClick: () => { min.value = 3 } }, 'raise'),
            h(SchemaForm, { schema: schema.value }),
            h('pre', { class: 'model' }, JSON.stringify(model.value))
          ])
      }
    })

    cy.get('input').should('have.length', 1)
    cy.get('.raise-min').click()
    cy.get('input').should('have.length', 3)
  })

  // Mirrors the docs demo: component names are strings resolved against globally
  // registered components, in a single SchemaForm over a single array.
  it('works with string component names resolved globally (docs demo pattern)', () => {
    const GText = {
      props: ['modelValue', 'label'],
      emits: ['update:modelValue'],
      render () {
        return h('input', {
          class: 'gtext',
          value: this.modelValue,
          onInput: e => this.$emit('update:modelValue', e.target.value)
        })
      }
    }
    const GAdd = {
      props: ['count', 'canAdd'],
      emits: ['add'],
      render () {
        return h(
          'button',
          { class: 'gadd', type: 'button', disabled: this.canAdd === false, onClick: () => this.$emit('add') },
          'add'
        )
      }
    }
    const GRemove = {
      props: ['index', 'count', 'canRemove'],
      emits: ['remove'],
      render () {
        return h(
          'button',
          { class: 'gremove', type: 'button', disabled: this.canRemove === false, onClick: () => this.$emit('remove') },
          'x'
        )
      }
    }

    cy.mount(
      {
        setup () {
          const model = ref({
            friends: [
              { name: 'Ada', role: 'Engineer' },
              { name: 'Grace', role: 'Designer' }
            ]
          })
          useSchemaForm(model)
          const schema = {
            friends: {
              component: 'SchemaArray',
              items: {
                name: { component: 'GText', label: 'Name' },
                role: { component: 'GText', label: 'Role' }
              },
              after: 'GRemove',
              append: 'GAdd',
              min: 1
            }
          }
          return () =>
            h('div', [h(SchemaForm, { schema }), h('pre', { class: 'model' }, JSON.stringify(model.value))])
        }
      },
      { global: { components: { SchemaArray, GText, GAdd, GRemove } } }
    )

    cy.get('.gtext').should('have.length', 4)
    cy.get('.gadd').click()
    cy.get('.gtext').should('have.length', 6)
    cy.get('.model').should('contain', 'Ada').and('contain', 'Grace')
    cy.get('.gremove').first().click()
    cy.get('.gtext').should('have.length', 4)
    cy.get('.model').should('contain', 'Grace').and('not.contain', 'Ada')
  })
})
