import { mount } from '@vue/test-utils'
import { ref } from 'vue'
import flushPromises from 'flush-promises'
import SchemaForm from '../../src/SchemaForm.vue'
import SchemaArray from '../../src/SchemaArray.vue'
import useSchemaForm from '../../src/features/useSchemaForm'

const TextInput = {
  props: ['modelValue', 'label'],
  emits: ['update:modelValue'],
  template: `<input class="text" :value="modelValue" @input="$emit('update:modelValue', $event.target.value)" />`
}

const NumberInput = {
  props: ['modelValue', 'label'],
  emits: ['update:modelValue'],
  template: `<input class="num" type="number" :value="modelValue" @input="$emit('update:modelValue', Number($event.target.value))" />`
}

// User-provided control components: they only EMIT, and SchemaArray ships none.
const RemoveControl = {
  props: ['index', 'count', 'canRemove'],
  emits: ['remove', 'move'],
  template: `<button class="remove" :disabled="canRemove === false" @click="$emit('remove')">remove</button>`
}

const AddControl = {
  props: ['count', 'canAdd'],
  emits: ['add'],
  template: `<button class="add" :disabled="canAdd === false" @click="$emit('add')">add</button>`
}

const mountForm = (schema, model) =>
  mount({
    components: { SchemaForm },
    setup () {
      useSchemaForm(model)
      return { schema }
    },
    template: '<SchemaForm :schema="schema" />'
  })

describe('SchemaArray', () => {
  describe('group rows (array of objects)', () => {
    const groupSchema = {
      friends: {
        component: SchemaArray,
        items: { name: { component: TextInput }, age: { component: NumberInput } },
        after: RemoveControl,
        append: AddControl
      }
    }

    it('renders a row per array entry from the model', () => {
      const model = ref({ friends: [{ name: 'Ada', age: 36 }, { name: 'Grace', age: 45 }] })
      const wrapper = mountForm(groupSchema, model)

      expect(wrapper.findAll('.text')).toHaveLength(2)
      expect(wrapper.findAll('.num')).toHaveLength(2)
      expect(wrapper.findAll('.text')[0].element.value).toBe('Ada')
    })

    it('writes edits to the right element', async () => {
      const model = ref({ friends: [{ name: 'Ada', age: 36 }] })
      const wrapper = mountForm(groupSchema, model)

      await wrapper.find('.text').setValue('Grace')
      await flushPromises()

      expect(model.value.friends[0]).toEqual({ name: 'Grace', age: 36 })
    })

    it('adds and removes entries, survivors keep their values', async () => {
      const model = ref({ friends: [{ name: 'Ada', age: 36 }] })
      const wrapper = mountForm(groupSchema, model)

      await wrapper.find('.add').trigger('click')
      await flushPromises()
      expect(model.value.friends).toHaveLength(2)

      await wrapper.findAll('.text')[1].setValue('Lin')
      await flushPromises()
      expect(model.value.friends).toEqual([{ name: 'Ada', age: 36 }, { name: 'Lin' }])

      // Remove the first row; the survivor must keep its own value (no bleed).
      await wrapper.findAll('.remove')[0].trigger('click')
      await flushPromises()
      expect(model.value.friends).toEqual([{ name: 'Lin' }])
      expect(wrapper.find('.text').element.value).toBe('Lin')
    })
  })

  describe('scalar rows (array of primitives)', () => {
    const scalarSchema = {
      tags: {
        component: SchemaArray,
        items: { component: TextInput },
        after: RemoveControl,
        append: AddControl
      }
    }

    it('adds, edits and removes primitive entries', async () => {
      const model = ref({ tags: ['vue'] })
      const wrapper = mountForm(scalarSchema, model)

      expect(wrapper.findAll('.text')).toHaveLength(1)

      await wrapper.find('.add').trigger('click')
      await flushPromises()
      expect(model.value.tags).toHaveLength(2)

      await wrapper.findAll('.text')[1].setValue('react')
      await flushPromises()
      expect(model.value.tags).toEqual(['vue', 'react'])

      await wrapper.findAll('.remove')[0].trigger('click')
      await flushPromises()
      expect(model.value.tags).toEqual(['react'])
    })
  })

  describe('min / max gating', () => {
    const gatedSchema = {
      tags: {
        component: SchemaArray,
        items: { component: TextInput },
        after: RemoveControl,
        append: AddControl,
        min: 1,
        max: 2
      }
    }

    it('exposes canAdd / canRemove to the control components', async () => {
      const model = ref({ tags: ['a'] })
      const wrapper = mountForm(gatedSchema, model)

      // at min -> cannot remove
      expect(wrapper.find('.remove').attributes('disabled')).toBeDefined()

      await wrapper.find('.add').trigger('click')
      await flushPromises()
      expect(model.value.tags).toHaveLength(2)

      // at max -> cannot add
      expect(wrapper.find('.add').attributes('disabled')).toBeDefined()
    })

    it('seeds blank entries up to min when the model is short', async () => {
      const model = ref({ tags: [] })
      mountForm(gatedSchema, model)
      await flushPromises()

      expect(model.value.tags).toHaveLength(1)
    })
  })

  describe('no controls', () => {
    it('renders rows only when no after/append are provided', () => {
      const model = ref({ tags: ['a', 'b'] })
      const wrapper = mountForm(
        { tags: { component: SchemaArray, items: { component: TextInput } } },
        model
      )

      expect(wrapper.findAll('.text')).toHaveLength(2)
      expect(wrapper.find('.add').exists()).toBe(false)
      expect(wrapper.find('.remove').exists()).toBe(false)
    })
  })

  describe('nested arrays', () => {
    it('supports an array inside an array row', async () => {
      const model = ref({ teams: [{ name: 'A', members: ['x'] }] })
      const schema = {
        teams: {
          component: SchemaArray,
          items: {
            name: { component: TextInput },
            members: {
              component: SchemaArray,
              items: { component: TextInput },
              after: RemoveControl,
              append: AddControl
            }
          },
          after: RemoveControl,
          append: AddControl
        }
      }

      const wrapper = mountForm(schema, model)
      // team name + one member
      expect(wrapper.findAll('.text')).toHaveLength(2)

      // the inner members "add" renders before the outer teams "add"
      await wrapper.findAll('.add')[0].trigger('click')
      await flushPromises()

      expect(model.value.teams[0].members).toHaveLength(2)
      expect(Array.isArray(model.value.teams)).toBe(true)
    })
  })
})
