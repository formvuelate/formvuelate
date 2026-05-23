<script setup>
// Demo-only select. Works two ways:
//   1. schema-driven  — FVL binds :modelValue / @update:modelValue
//   2. direct in the playground — :modelValue + @change, where @change is a
//      fallthrough native listener (we only emit update:modelValue, so the
//      select's native change event bubbles to the root <label> and reaches it).
defineProps({
  modelValue: { type: [String, Number], default: '' },
  label: { type: String, default: '' },
  required: { type: Boolean, default: false },
  options: { type: Array, default: () => [] },
  disableNoSelection: { type: Boolean, default: false }
})
defineEmits(['update:modelValue'])

const optionValue = (o) => (o && typeof o === 'object' ? o.value : o)
const optionLabel = (o) => (o && typeof o === 'object' ? (o.label ?? o.value) : o)
</script>

<template>
  <label class="fvl-field">
    <span v-if="label" class="fvl-field__label">
      {{ label }}<span v-if="required" class="fvl-field__required">*</span>
    </span>
    <select
      class="fvl-field__input"
      :value="modelValue"
      @change="$emit('update:modelValue', $event.target.value)"
    >
      <option v-if="!disableNoSelection" value="" disabled>Please select an option</option>
      <option
        v-for="option in options"
        :key="optionValue(option)"
        :value="optionValue(option)"
      >
        {{ optionLabel(option) }}
      </option>
    </select>
  </label>
</template>
