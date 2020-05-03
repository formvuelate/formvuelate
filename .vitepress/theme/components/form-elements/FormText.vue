<template>
  <div>
    <label :for="label">
      {{ label }}
    </label>
    <input
      :value="value"
      :type="config.type"
      :required="required"
      :id="label"
      :disabled="readOnly"
      @input="update($event.target.value)"
    >
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
    },
    config: {
      type: Object,
      default: () => ({ type: 'text' })
    },
    readOnly: {
      type: Boolean,
      default: false
    }
  },
  methods: {
    update (value) {
      this.$emit('input', value)
    }
  }
}
</script>
