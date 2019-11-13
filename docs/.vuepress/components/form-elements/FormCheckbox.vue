<template>
  <div>
    <label>
      <input
        type="checkbox"
        :checked="value"
        @input="$emit('input', $event.target.checked)"
      >
      {{ label }}
    </label>
  </div>
</template>

<script>
export default {
  props: {
    value: { required: true },
    label: {
      type: String,
      required: true
    }
  }
}
</script>
