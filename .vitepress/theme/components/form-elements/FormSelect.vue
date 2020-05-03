<template>
  <div>
    <label :for="label">
      {{ label }}
    </label>
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
    label: { type: String, required: true },
    options: { type: Array, required: true }
  },
  methods: {
    update (value) {
      this.$emit('input', value)
    }
  }
}
</script>
