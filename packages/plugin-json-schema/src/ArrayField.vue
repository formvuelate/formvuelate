<template>
  <div class="fvl-array-field">
    <label
      v-if="label"
      class="fvl-array-field__label"
    >{{ label }}</label>
    <p
      v-if="hint"
      class="fvl-array-field__hint"
    >{{ hint }}</p>

    <div class="fvl-array-field__items">
      <div
        v-for="(item, index) in items"
        :key="item.key"
        class="fvl-array-field__item"
      >
        <slot
          name="item"
          :item="item.value"
          :index="index"
          :remove="() => remove(item.key)"
          :canRemove="canRemove"
        >
          <ArrayItem
            v-if="isObjectItem"
            :schema="objectItemSchema"
            :modelValue="item.value"
            @update:modelValue="value => updateItem(item.key, value)"
          />
          <component
            :is="primitiveComponent"
            v-else
            v-bind="primitiveBinds"
            :modelValue="item.value"
            @update:modelValue="value => updateItem(item.key, value)"
          />

          <button
            v-if="canRemove"
            type="button"
            class="fvl-array-field__remove"
            @click="remove(item.key)"
          >
            {{ removeLabel }}
          </button>
        </slot>
      </div>
    </div>

    <slot
      name="add"
      :add="add"
      :canAdd="canAdd"
    >
      <button
        v-if="canAdd"
        type="button"
        class="fvl-array-field__add"
        @click="add"
      >
        {{ addLabel }}
      </button>
    </slot>
  </div>
</template>

<script>
import { ref, computed, watch, inject, onMounted } from 'vue'
import { constants } from 'formvuelate'
import ArrayItem from './ArrayItem.js'

export default {
  name: 'FvlArrayField',
  components: { ArrayItem },
  props: {
    modelValue: { type: Array, default: () => [] },
    itemSchema: { type: Object, default: () => ({}) },
    label: { type: String, default: '' },
    hint: { type: String, default: '' },
    minItems: { type: Number, default: null },
    maxItems: { type: Number, default: null },
    addLabel: { type: String, default: 'Add' },
    removeLabel: { type: String, default: 'Remove' }
  },
  emits: ['update:modelValue'],
  setup (props, { emit }) {
    const locals = inject(constants.INJECTED_LOCAL_COMPONENTS, {})

    // Object entries carry a `schema` (their properties); everything else
    // (primitives and nested arrays) renders through a single component.
    const isObjectItem = computed(() => Boolean(props.itemSchema && props.itemSchema.schema))
    const objectItemSchema = computed(() => props.itemSchema && props.itemSchema.schema)

    const primitiveComponent = computed(() => {
      const component = props.itemSchema && props.itemSchema.component
      if (typeof component === 'string') return locals[component] || component
      return component
    })

    // Forward the item schema's presentational props (label/hint/type/etc.) to
    // the entry component, minus the keys ArrayField consumes itself.
    const primitiveBinds = computed(() => {
      const { component, schema, model, ...rest } = props.itemSchema || {}
      void component
      void schema
      void model
      return rest
    })

    let keyCounter = 0
    let internal = false
    const items = ref([])

    const defaultItemValue = () => {
      if (isObjectItem.value) return {}
      if (props.itemSchema && 'default' in props.itemSchema) return props.itemSchema.default
      return undefined
    }

    const toItems = arr => (Array.isArray(arr) ? arr : []).map(value => ({ key: keyCounter++, value }))

    // Build the entry list, padding up to `minItems` with fresh defaults.
    const seed = arr => {
      const base = toItems(arr)
      const min = Number(props.minItems) || 0
      while (base.length < min) base.push({ key: keyCounter++, value: defaultItemValue() })
      return base
    }

    items.value = seed(props.modelValue)

    const emitValue = () => {
      internal = true
      emit(
        'update:modelValue',
        items.value.map(item => item.value)
      )
    }

    // If minItems padded entries that the bound model doesn't have yet, push
    // them up once so the model matches what's rendered.
    onMounted(() => {
      const currentLength = Array.isArray(props.modelValue) ? props.modelValue.length : 0
      if (items.value.length !== currentLength) emitValue()
    })

    watch(
      () => props.modelValue,
      value => {
        if (internal) {
          internal = false
          return
        }
        items.value = seed(value)
      },
      { deep: true }
    )

    const canAdd = computed(() => props.maxItems == null || items.value.length < props.maxItems)
    const canRemove = computed(() => props.minItems == null || items.value.length > props.minItems)

    const updateItem = (key, value) => {
      const item = items.value.find(entry => entry.key === key)
      if (!item) return
      item.value = value
      emitValue()
    }

    const add = () => {
      if (!canAdd.value) return
      items.value = [...items.value, { key: keyCounter++, value: defaultItemValue() }]
      emitValue()
    }

    const remove = key => {
      if (!canRemove.value) return
      items.value = items.value.filter(entry => entry.key !== key)
      emitValue()
    }

    return {
      items,
      isObjectItem,
      objectItemSchema,
      primitiveComponent,
      primitiveBinds,
      canAdd,
      canRemove,
      updateItem,
      add,
      remove
    }
  }
}
</script>
