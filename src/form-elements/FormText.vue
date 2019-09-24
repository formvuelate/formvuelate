<template>
  <div>
    <label :for="label">
      {{ label }}
    </label>
    <div v-if="displayMode !== 'VIEW'">
      <input
        :value="value"
        :type="config.type"
        :required="required"
        :id="label"
        @input="update($event.target.value)"
      >
    </div>
    <div v-else>
      <p v-text="value"></p>
    </div>
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
      default: () => ({ type: 'text' })
    },
    displayMode: {
      type: String,
      default: () => 'EDIT'
    }
  }
}
</script>

<style lang="stylus" scoped>
  p
    margin-top: 0;
</style>
