<script setup>
// Demo-only checkbox. v-model in the playground and schema-driven via FVL both
// map to modelValue / update:modelValue.
defineProps({
  modelValue: { type: Boolean, default: false },
  label: { type: String, default: '' }
})
defineEmits(['update:modelValue'])
</script>

<template>
  <label class="fvl-field fvl-field--checkbox">
    <input
      type="checkbox"
      :checked="modelValue"
      @change="$emit('update:modelValue', $event.target.checked)"
    />
    <span v-if="label" class="fvl-field__label">{{ label }}</span>
  </label>
</template>
