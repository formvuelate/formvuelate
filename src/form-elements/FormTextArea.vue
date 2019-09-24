<template>
  <div>
    <label :for="label">
      {{ label }}
    </label>
    <textarea
      :value="value"
      :required="required"
      :id="label"
      :rows="config.rows"
      @input="update($event.target.value)"
    ></textarea>
  </div>
</template>

<script>
import FormMixin from '../FormMixin'

export default {
  mixins: [ FormMixin ],
  props: {
    label: {
      type: String,
      required: true
    },
    config: {
      type: Object,
      default: () => ({ rows: 4 })
    }
  }
}
</script>
