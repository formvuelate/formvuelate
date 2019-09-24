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
import FormMixin from '../../../../src/FormMixin'

export default {
  mixins: [ FormMixin ],
  props: {
    label: {
      type: String,
      required: true
    }
  }
}
</script>
