import { mount } from '@vue/test-utils'
import { ref } from 'vue'
import flushPromises from 'flush-promises'
import SchemaForm from '../../src/SchemaForm.vue'
import SchemaArray from '../../src/SchemaArray.vue'
import SchemaArrayRow from '../../src/SchemaArrayRow.vue'
import SchemaFormFactory from '../../src/SchemaFormFactory'
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

// Reorder control: up/down buttons that emit `move` with a direction.
const ReorderControl = {
  props: ['index', 'count', 'canRemove'],
  emits: ['remove', 'move'],
  template: `<span>
    <button class="up" @click="$emit('move', -1)">up</button>
    <button class="down" @click="$emit('move', 1)">down</button>
  </span>`
}

// Controls that emit regardless of canAdd/canRemove, to exercise the guards.
const ForceAdd = {
  emits: ['add'],
  template: `<button class="force-add" @click="$emit('add')">+</button>`
}
const ForceRemove = {
  emits: ['remove'],
  template: `<button class="force-remove" @click="$emit('remove')">-</button>`
}

// Append control that emits a preset value with `add`.
const AddPreset = {
  emits: ['add'],
  template: `<button class="add-preset" @click="$emit('add', 'preset')">add preset</button>`
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

  describe('reordering', () => {
    const reorderSchema = {
      tags: {
        component: SchemaArray,
        items: { component: TextInput },
        after: ReorderControl,
        append: AddControl
      }
    }

    it('moves rows up and down', async () => {
      const model = ref({ tags: ['a', 'b', 'c'] })
      const wrapper = mountForm(reorderSchema, model)

      await wrapper.findAll('.down')[0].trigger('click')
      await flushPromises()
      expect(model.value.tags).toEqual(['b', 'a', 'c'])

      await wrapper.findAll('.up')[2].trigger('click')
      await flushPromises()
      expect(model.value.tags).toEqual(['b', 'c', 'a'])
    })

    it('ignores moves that fall out of bounds', async () => {
      const model = ref({ tags: ['a', 'b'] })
      const wrapper = mountForm(reorderSchema, model)

      await wrapper.findAll('.up')[0].trigger('click')
      await wrapper.findAll('.down')[1].trigger('click')
      await flushPromises()
      expect(model.value.tags).toEqual(['a', 'b'])
    })
  })

  describe('guards', () => {
    it('does not add past max or remove below min even if a control emits', async () => {
      const model = ref({ tags: ['a', 'b'] })
      const wrapper = mountForm(
        {
          tags: {
            component: SchemaArray,
            items: { component: TextInput },
            after: ForceRemove,
            append: ForceAdd,
            min: 2,
            max: 2
          }
        },
        model
      )

      await wrapper.find('.force-add').trigger('click')
      await flushPromises()
      expect(model.value.tags).toHaveLength(2)

      await wrapper.findAll('.force-remove')[0].trigger('click')
      await flushPromises()
      expect(model.value.tags).toHaveLength(2)
    })

    it('adds an entry with the value emitted by the control', async () => {
      const model = ref({ tags: ['a'] })
      const wrapper = mountForm(
        { tags: { component: SchemaArray, items: { component: TextInput }, append: AddPreset } },
        model
      )

      await wrapper.find('.add-preset').trigger('click')
      await flushPromises()
      expect(model.value.tags).toEqual(['a', 'preset'])
    })

    it('uses the item default when adding a blank scalar entry', async () => {
      const model = ref({ tags: ['a'] })
      const wrapper = mountForm(
        { tags: { component: SchemaArray, items: { component: TextInput, default: 'new' }, append: AddControl } },
        model
      )

      await wrapper.find('.add').trigger('click')
      await flushPromises()
      expect(model.value.tags).toEqual(['a', 'new'])
    })
  })

  describe('external model changes', () => {
    it('reseeds scalar rows when the model changes from outside', async () => {
      const model = ref({ tags: ['a'] })
      const wrapper = mountForm(
        { tags: { component: SchemaArray, items: { component: TextInput }, after: RemoveControl, append: AddControl } },
        model
      )

      model.value.tags = ['x', 'y']
      await flushPromises()

      expect(wrapper.findAll('.text')).toHaveLength(2)
      expect(wrapper.findAll('.text')[0].element.value).toBe('x')
    })

    it('reseeds a group row when the model changes from outside', async () => {
      const model = ref({ friends: [{ name: 'Ada' }] })
      const wrapper = mountForm(
        {
          friends: {
            component: SchemaArray,
            items: { name: { component: TextInput } },
            after: RemoveControl,
            append: AddControl
          }
        },
        model
      )

      model.value.friends = [{ name: 'Grace' }]
      await flushPromises()

      expect(wrapper.find('.text').element.value).toBe('Grace')
    })
  })

  describe('component resolution', () => {
    it('resolves a string item component via the factory local components', () => {
      const Form = SchemaFormFactory([], { FvlText: TextInput })
      const wrapper = mount({
        components: { Form },
        setup () {
          useSchemaForm(ref({ tags: ['a'] }))
          return {
            schema: { tags: { component: SchemaArray, items: { component: 'FvlText' } } }
          }
        },
        template: '<Form :schema="schema" />'
      })

      expect(wrapper.find('.text').exists()).toBe(true)
    })
  })

  describe('bare mounts (prop defaults)', () => {
    it('renders with default props', () => {
      const wrapper = mount(SchemaArray)
      expect(wrapper.find('.schema-array').exists()).toBe(true)
    })

    it('SchemaArrayRow tolerates missing items and a non-object value', () => {
      const wrapper = mount(SchemaArrayRow)
      expect(wrapper.exists()).toBe(true)
    })

    it('ignores updates and moves for unknown keys', () => {
      const wrapper = mount(SchemaArray, {
        props: { modelValue: ['a'], items: { component: TextInput } }
      })

      expect(() => {
        wrapper.vm.updateRow('nope', 'x')
        wrapper.vm.move('nope', 1)
      }).not.toThrow()
    })
  })

  describe('dynamic min (runtime schema changes)', () => {
    it('pads the array when min increases at runtime', async () => {
      const wrapper = mount(SchemaArray, {
        props: { modelValue: ['a'], items: { component: TextInput }, min: 1 }
      })
      expect(wrapper.findAll('.text')).toHaveLength(1)

      await wrapper.setProps({ min: 3 })
      await flushPromises()

      expect(wrapper.findAll('.text')).toHaveLength(3)
      const emitted = wrapper.emitted('update:modelValue')
      expect(emitted[emitted.length - 1][0]).toHaveLength(3)
    })

    it('does not shrink the array when min decreases', async () => {
      const wrapper = mount(SchemaArray, {
        props: { modelValue: ['a', 'b', 'c'], items: { component: TextInput }, min: 3 }
      })

      await wrapper.setProps({ min: 1 })
      await flushPromises()

      expect(wrapper.findAll('.text')).toHaveLength(3)
    })
  })
})
