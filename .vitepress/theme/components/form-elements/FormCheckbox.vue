<template>
  <div>
    <label>
      <input
        type="checkbox"
        :checked="value"
        @input="update($event.target.checked)"
      >
      {{ label }}
    </label>
  </div>
</template>

<script>
export default {
  props: {
    value: { required: true },
    required: {
      type: Boolean,
      default: false
    },
    config: {
      type: Object,
      default: () => {}
    },
    label: {
      type: String,
      required: true
    }
  },
  methods: {
    update (value) {
      this.$emit('input', value)
    }
  }
}
</script>
