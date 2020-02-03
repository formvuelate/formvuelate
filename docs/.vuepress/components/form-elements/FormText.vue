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
      @input="$emit('input', $event.target.value)"
    >
  </div>
</template>

<script>
import FormMixin from '../../../../src/FormMixin'

export default {
  mixins: [FormMixin],
  props: {
    value: { required: true },
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
  }
}
</script>

<style lang="stylus">
input:disabled
  background-color: lightgrey
</style>
