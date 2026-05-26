<script setup>
// Demo-only control for SchemaArray's `append` slot prop. It ships no markup of
// its own, so the "Add" button is the consumer's component. It emits `add`;
// SchemaArray performs the insert.
defineProps({
  count: { type: Number, default: 0 },
  canAdd: { type: Boolean, default: true }
})
defineEmits(['add'])
</script>

<template>
  <button
    type="button"
    class="fvl-button"
    :disabled="canAdd === false"
    @click="$emit('add')"
  >
    + Add
  </button>
</template>
