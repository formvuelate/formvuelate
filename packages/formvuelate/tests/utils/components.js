import { h } from 'vue'

export const BaseInput = {
  props: ['label', 'modelValue'],
  render () {
    return [
      h('label', this.label),
      h('input', {
        ...this.$attrs,
        value: this.modelValue,
        onInput: ($event) => this.$emit('update:modelValue', $event.target.value)
      })
    ]
  }
}
