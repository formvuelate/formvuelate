<template>
  <div>
    <label :for="label">
      {{ label }}
    </label>
    <select
      :value="value"
      :required="required"
      :id="label"
      @input="$emit('input', $event.target.value)"
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
</template>

<script>
import FormMixin from '../../../../src/FormMixin'

export default {
  mixins: [FormMixin],
  props: {
    value: { required: true },
    label: { type: String, required: true },
    options: { type: Array, required: true }
  }
}
</script>
