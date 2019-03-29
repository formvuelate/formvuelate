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
      @input="update($event.target.value)"
    >
  </div>
</template>

<script>
import FormMixin from '../FormMixin'

export default {
  mixins: [ FormMixin ],
  props: {
    config: {
      type: Object,
      default: () => ({ type: 'text' })
    }
  }
}
</script>
