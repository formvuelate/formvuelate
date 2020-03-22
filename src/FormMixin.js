export default {
  props: {
    modelValue: {
      required: true
    },
    required: {
      type: Boolean,
      default: () => false
    },
    config: {
      type: Object,
      default: () => {}
    }
  },
  methods: {
    update (value) {
      this.$emit('update:modelValue', value)
    }
  }
}
