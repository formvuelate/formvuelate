<script setup>
// Demo-only control for SchemaArray's `after` slot prop (rendered per row).
// SchemaArray ships no markup, so the "Remove" button is the consumer's
// component. It emits `remove`; SchemaArray drops that row.
defineProps({
  index: { type: Number, default: 0 },
  count: { type: Number, default: 0 },
  canRemove: { type: Boolean, default: true }
})
defineEmits(['remove'])
</script>

<template>
  <button
    type="button"
    class="fvl-button"
    :disabled="canRemove === false"
    @click="$emit('remove')"
  >
    Remove
  </button>
</template>
