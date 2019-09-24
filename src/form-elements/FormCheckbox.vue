<template>
  <div>
    <label>
      <input
        type="checkbox"
        :checked="value"
        @input="update($event.target.checked)"
        :disabled="displayMode === 'VIEW'"
      >
      {{ label }}
    </label>
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
    displayMode: {
      type: String
    }
  }
}
</script>
