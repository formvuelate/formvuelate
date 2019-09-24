<template>
  <div>
    <label :for="label">
      {{ label }}
    </label>
    <div v-if="displayMode !== 'VIEW'">
      <select
        :value="value"
        :required="required"
        :id="label"
        @input="update($event.target.value)"
      >
        <option
          v-for="option in options"
          :key="option"
          :value="option"
          :selected="option === value"
        >
          {{ option }}
        </option>
      </select>
    </div>
    <p v-else v-text="value"></p>
  </div>
</template>

<script>
import FormMixin from '../FormMixin'

export default {
  mixins: [FormMixin],
  props: {
    label: { type: String, required: true },
    options: { type: Array, required: true },
    displayMode: { type: String }
  }
}
</script>

<style lang="stylus" scoped>
  p
    margin-top: 0;
</style>
