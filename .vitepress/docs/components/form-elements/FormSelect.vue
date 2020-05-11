<template>
  <div>
    <label :for="label">
      {{ label }}
    </label>
    <select
      :value="modelValue"
      :required="required"
      :id="label"
      @input="update($event.target.value)"
    >
      <option>-</option>
      <option
        v-for="option in options"
        :key="option"
        :value="option"
        :selected="option === modelValue"
      >
        {{ option }}
      </option>
    </select>
  </div>
</template>

<script>
export default {
  props: {
    modelValue: { required: true },
    required: {
      type: Boolean,
      default: false
    },
    config: {
      type: Object,
      default: () => { }
    },
    label: { type: String, required: true },
    options: { type: Array, required: true }
  },
  methods: {
    update (value) {
      this.$emit('update:modelValue', value)
    }
  }
}
</script>
