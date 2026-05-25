<template>
  <div class="schema-array">
    <div
      v-for="(row, index) in rows"
      :key="row.key"
      class="schema-array-row"
    >
      <SchemaArrayRow
        :items="items"
        :modelValue="row.value"
        @update:modelValue="value => updateRow(row.key, value)"
      />
      <component
        :is="resolvedAfter"
        v-if="resolvedAfter"
        :index="index"
        :count="rows.length"
        :canRemove="canRemove"
        @remove="removeRow(row.key)"
        @move="direction => move(row.key, direction)"
      />
    </div>

    <component
      :is="resolvedAppend"
      v-if="resolvedAppend"
      :count="rows.length"
      :canAdd="canAdd"
      @add="add"
    />
  </div>
</template>

<script>
import { ref, computed, watch, inject, onMounted } from 'vue'
import SchemaArrayRow from './SchemaArrayRow.vue'
import { INJECTED_LOCAL_COMPONENTS } from './utils/constants'

/**
 * A repeatable array field. Declared in a schema like any other field
 * (`{ friends: { component: SchemaArray, items, after, append } }`), so it works
 * anywhere in the schema and with dynamic schemas. It owns the whole array as a
 * single leaf value (core has no array-path model) and ships NO markup of its
 * own. Add/remove/reorder come from user-provided `after` (per row) and
 * `append` (once) components declared in the schema, which emit their intent up.
 */
export default {
  name: 'SchemaArray',
  components: { SchemaArrayRow },
  inheritAttrs: false,
  props: {
    modelValue: {
      type: Array,
      default: () => []
    },
    items: {
      type: Object,
      default: () => ({})
    },
    // User control components (component or local-component name).
    after: {
      type: [Object, Function, String],
      default: null
    },
    append: {
      type: [Object, Function, String],
      default: null
    },
    min: {
      type: Number,
      default: null
    },
    max: {
      type: Number,
      default: null
    }
  },
  emits: ['update:modelValue'],
  setup (props, { emit }) {
    const locals = inject(INJECTED_LOCAL_COMPONENTS, {})
    const resolve = component =>
      typeof component === 'string' ? locals[component] || component : component
    const resolvedAfter = computed(() => (props.after ? resolve(props.after) : null))
    const resolvedAppend = computed(() => (props.append ? resolve(props.append) : null))

    const isScalar = computed(() => Boolean(props.items && props.items.component))
    const blankValue = () => {
      if (!isScalar.value) return {}
      return props.items && 'default' in props.items ? props.items.default : undefined
    }

    let keyCounter = 0
    let internal = false
    const rows = ref([])

    const toRows = value =>
      (Array.isArray(value) ? value : []).map(entry => ({ key: keyCounter++, value: entry }))

    // Build the row list, padding up to `min` with blank entries.
    const seed = value => {
      const base = toRows(value)
      const min = Number(props.min) || 0
      while (base.length < min) base.push({ key: keyCounter++, value: blankValue() })
      return base
    }

    rows.value = seed(props.modelValue)

    const emitValue = () => {
      internal = true
      emit(
        'update:modelValue',
        rows.value.map(row => row.value)
      )
    }

    // If `min` padded entries the bound model doesn't have yet, push them up once.
    onMounted(() => {
      const current = Array.isArray(props.modelValue) ? props.modelValue.length : 0
      if (rows.value.length !== current) emitValue()
    })

    watch(
      () => props.modelValue,
      value => {
        if (internal) {
          internal = false
          return
        }
        rows.value = seed(value)
      },
      { deep: true }
    )

    const canAdd = computed(() => props.max == null || rows.value.length < props.max)
    const canRemove = computed(() => props.min == null || rows.value.length > props.min)

    const updateRow = (key, value) => {
      const row = rows.value.find(entry => entry.key === key)
      if (!row) return
      row.value = value
      emitValue()
    }

    const add = value => {
      if (!canAdd.value) return
      const entry = value !== undefined ? value : blankValue()
      rows.value = [...rows.value, { key: keyCounter++, value: entry }]
      emitValue()
    }

    const removeRow = key => {
      if (!canRemove.value) return
      rows.value = rows.value.filter(entry => entry.key !== key)
      emitValue()
    }

    const move = (key, direction) => {
      const from = rows.value.findIndex(entry => entry.key === key)
      if (from === -1) return
      const to = direction === 'up' || direction === -1 ? from - 1 : from + 1
      if (to < 0 || to >= rows.value.length) return
      const next = [...rows.value]
      ;[next[from], next[to]] = [next[to], next[from]]
      rows.value = next
      emitValue()
    }

    return {
      rows,
      resolvedAfter,
      resolvedAppend,
      canAdd,
      canRemove,
      updateRow,
      add,
      removeRow,
      move
    }
  }
}
</script>
