import JsonSchemaPlugin from '../../src/index.js'
import veeValidatePlugin from '@formvuelate/plugin-vee-validate'
import LookupPlugin from '@formvuelate/plugin-lookup'
import { SchemaFormFactory, useSchemaForm } from 'formvuelate'
import { mount } from '@vue/test-utils'
import { ref } from 'vue'
import flushPromises from 'flush-promises'

const FvlString = {
  template: `<input class="fvl-string" :type="type || 'text'" :value="modelValue"
    @input="$emit('update:modelValue', $event.target.value)" />`,
  props: ['modelValue', 'label', 'hint', 'type'],
  emits: ['update:modelValue']
}

const FvlStringWithError = {
  template: `<div>
    <input class="fvl-string" :value="modelValue" @input="$emit('update:modelValue', $event.target.value)" />
    <span class="error">{{ errorMessage }}</span>
  </div>`,
  props: ['modelValue', 'label', 'errorMessage'],
  emits: ['update:modelValue']
}

const FvlNumber = {
  template: `<input class="fvl-number" type="number" :value="modelValue"
    @input="$emit('update:modelValue', Number($event.target.value))" />`,
  props: ['modelValue', 'label', 'min', 'max', 'step'],
  emits: ['update:modelValue']
}

const FvlBoolean = {
  template: `<input class="fvl-boolean" type="checkbox" :checked="modelValue"
    @change="$emit('update:modelValue', $event.target.checked)" />`,
  props: ['modelValue', 'label'],
  emits: ['update:modelValue']
}

const FvlEnum = {
  template: `<select class="fvl-enum" :value="modelValue" @change="$emit('update:modelValue', $event.target.value)">
    <option v-for="o in options" :key="o.value" :value="o.value">{{ o.label }}</option>
  </select>`,
  props: ['modelValue', 'label', 'options'],
  emits: ['update:modelValue']
}

const BaseInput = {
  template: `<input class="base-input" :value="modelValue" @input="$emit('update:modelValue', $event.target.value)" />`,
  props: ['modelValue', 'label'],
  emits: ['update:modelValue']
}

const LOCAL = { FvlString, FvlNumber, FvlBoolean, FvlEnum }

const mountSchema = (jsonSchema, { plugins, components = LOCAL, model = ref({}) } = {}) => {
  const Form = SchemaFormFactory(plugins || [JsonSchemaPlugin()], components)

  const wrapper = mount({
    components: { Form },
    setup () {
      useSchemaForm(model)
      return { jsonSchema }
    },
    template: '<Form :json-schema="jsonSchema" />'
  })

  return { wrapper, model }
}

describe('JsonSchema plugin integration', () => {
  it('renders a component per JSON Schema type', () => {
    const { wrapper } = mountSchema({
      type: 'object',
      properties: {
        name: { type: 'string', title: 'Name' },
        age: { type: 'integer' },
        agree: { type: 'boolean' },
        color: { type: 'string', enum: ['red', 'green'] }
      }
    })

    expect(wrapper.find('.fvl-string').exists()).toBe(true)
    expect(wrapper.find('.fvl-number').exists()).toBe(true)
    expect(wrapper.find('.fvl-boolean').exists()).toBe(true)
    expect(wrapper.find('.fvl-enum').exists()).toBe(true)
    expect(wrapper.findComponent(FvlString).props('label')).toBe('Name')
    expect(wrapper.findComponent(FvlEnum).props('options')).toEqual([
      { value: 'red', label: 'red' },
      { value: 'green', label: 'green' }
    ])
  })

  it('writes primitive values into the form model', async () => {
    const { wrapper, model } = mountSchema({
      type: 'object',
      properties: { name: { type: 'string' } }
    })

    await wrapper.find('.fvl-string').setValue('Jane')
    await flushPromises()

    expect(model.value.name).toBe('Jane')
  })

  it('renders nested objects and writes to the nested model path', async () => {
    const { wrapper, model } = mountSchema({
      type: 'object',
      properties: {
        address: {
          type: 'object',
          properties: { street: { type: 'string', title: 'Street' } }
        }
      }
    })

    expect(wrapper.findAllComponents(FvlString)).toHaveLength(1)

    await wrapper.find('.fvl-string').setValue('Main St')
    await flushPromises()

    expect(model.value.address.street).toBe('Main St')
  })

  describe('arrays of primitives', () => {
    it('adds, edits and removes entries', async () => {
      const { wrapper, model } = mountSchema(
        { type: 'object', properties: { tags: { type: 'array', items: { type: 'string' } } } },
        { model: ref({ tags: ['a'] }) }
      )

      expect(wrapper.findAll('.fvl-string')).toHaveLength(1)

      await wrapper.find('.fvl-array-field__add').trigger('click')
      await flushPromises()
      expect(wrapper.findAll('.fvl-string')).toHaveLength(2)
      expect(model.value.tags).toHaveLength(2)

      await wrapper.findAll('.fvl-string')[1].setValue('b')
      await flushPromises()
      expect(model.value.tags[1]).toBe('b')

      await wrapper.findAll('.fvl-array-field__remove')[0].trigger('click')
      await flushPromises()
      expect(wrapper.findAll('.fvl-string')).toHaveLength(1)
      expect(model.value.tags).toEqual(['b'])
    })

    it('gates add/remove with minItems and maxItems', async () => {
      const { wrapper } = mountSchema(
        {
          type: 'object',
          properties: { tags: { type: 'array', items: { type: 'string' }, minItems: 1, maxItems: 2 } }
        },
        { model: ref({ tags: ['a'] }) }
      )

      // at minItems -> no remove control
      expect(wrapper.findAll('.fvl-array-field__remove')).toHaveLength(0)

      await wrapper.find('.fvl-array-field__add').trigger('click')
      await flushPromises()

      // at maxItems -> add control hidden, remove now available
      expect(wrapper.findAll('.fvl-string')).toHaveLength(2)
      expect(wrapper.find('.fvl-array-field__add').exists()).toBe(false)
      expect(wrapper.findAll('.fvl-array-field__remove')).toHaveLength(2)
    })
  })

  describe('arrays of objects', () => {
    it('assembles an array of objects and keeps entries keyed on removal', async () => {
      const { wrapper, model } = mountSchema(
        {
          type: 'object',
          properties: {
            people: {
              type: 'array',
              items: { type: 'object', properties: { name: { type: 'string', title: 'Name' } } }
            }
          }
        },
        { model: ref({ people: [{ name: 'Ada' }] }) }
      )

      expect(wrapper.findAll('.fvl-string')).toHaveLength(1)
      expect(wrapper.find('.fvl-string').element.value).toBe('Ada')

      await wrapper.find('.fvl-array-field__add').trigger('click')
      await flushPromises()
      expect(wrapper.findAll('.fvl-string')).toHaveLength(2)

      await wrapper.findAll('.fvl-string')[1].setValue('Lin')
      await flushPromises()
      expect(model.value.people).toEqual([{ name: 'Ada' }, { name: 'Lin' }])

      // Remove the first entry; the survivor must keep its own value (no bleed).
      await wrapper.findAll('.fvl-array-field__remove')[0].trigger('click')
      await flushPromises()
      expect(model.value.people).toEqual([{ name: 'Lin' }])
      expect(wrapper.find('.fvl-string').element.value).toBe('Lin')
    })
  })

  describe('plugin composition', () => {
    it('derives validations consumed by the vee-validate plugin', async () => {
      const { wrapper } = mountSchema(
        { type: 'object', properties: { email: { type: 'string', format: 'email' } }, required: ['email'] },
        {
          plugins: [
            JsonSchemaPlugin(),
            veeValidatePlugin({ mapProps: state => ({ errorMessage: state.errorMessage }) })
          ],
          components: { FvlString: FvlStringWithError }
        }
      )

      await wrapper.find('.fvl-string').setValue('not-an-email')
      await flushPromises()
      expect(wrapper.find('.error').text()).toBe('email must be a valid email')

      await wrapper.find('.fvl-string').setValue('a@b.com')
      await flushPromises()
      expect(wrapper.find('.error').text()).toBe('')
    })

    it('composes with the lookup plugin to remap component names', () => {
      const { wrapper } = mountSchema(
        { type: 'object', properties: { name: { type: 'string' } } },
        {
          plugins: [JsonSchemaPlugin(), LookupPlugin({ mapComponents: { FvlString: 'BaseInput' } })],
          components: { BaseInput }
        }
      )

      expect(wrapper.findComponent(BaseInput).exists()).toBe(true)
    })
  })
})
