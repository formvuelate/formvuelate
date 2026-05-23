<script setup>
// Demo-only input. FormVueLate is bring-your-own-components; this exists purely
// so the docs have something to render. SchemaForm spreads every schema prop
// onto us (label, required, config, style, ...), so we declare the ones we use
// and let the rest fall through to the root element.
defineProps({
  modelValue: { type: [String, Number], default: '' },
  label: { type: String, default: '' },
  required: { type: Boolean, default: false },
  // Schemas set the input type either at the top level (type: 'email') or via
  // config ({ config: { type: 'email' } }); honour both.
  type: { type: String, default: 'text' },
  config: { type: Object, default: () => ({}) }
})
defineEmits(['update:modelValue'])
</script>

<template>
  <label class="fvl-field">
    <span v-if="label" class="fvl-field__label">
      {{ label }}<span v-if="required" class="fvl-field__required">*</span>
    </span>
    <input
      class="fvl-field__input"
      :type="type"
      v-bind="config"
      :value="modelValue"
      @input="$emit('update:modelValue', $event.target.value)"
    />
  </label>
</template>
