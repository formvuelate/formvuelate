import { h } from 'vue'

// A read-only element: it receives the whole form model via the `formModel`
// prop and renders it for display, but never emits, so it can't write a value
// back or land in the form output.
export const ReadOnlySummary = {
  props: ['label', 'formModel'],
  render () {
    return h('div', { class: 'summary' }, [
      this.label ? h('strong', { class: 'summary-label' }, this.label) : null,
      h('pre', { class: 'summary-value' }, JSON.stringify(this.formModel ?? {}))
    ])
  }
}

export const BaseInput = {
  props: ['label', 'modelValue', 'validation'],
  render () {
    return [
      h('label', this.label),
      h('input', {
        ...this.$attrs,
        value: this.modelValue,
        onInput: ($event) => this.$emit('update:modelValue', $event.target.value)
      }),
      this.$props.validation?.errorMessage
        ? h('div',
          {
            class: 'error'
          },
          this.$props.validation.errorMessage
        )
        : null
    ]
  }
}
