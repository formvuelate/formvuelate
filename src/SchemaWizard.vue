<template>
  <div>
    <SchemaForm
      :schema="currentSchema"
      :value="value[step] || {}"
      @input="update"
    />

    <slot></slot>
  </div>
</template>

<script>
import SchemaForm from './SchemaForm'
export default {
  components: { SchemaForm },
  props: {
    schema: {
      type: Array,
      required: true
    },
    step: {
      type: Number,
      required: true,
      default: 0
    },
    value: {
      type: Array,
      required: true
    }
  },
  data () {
    return {
      wizardValues: []
    }
  },
  computed: {
    currentSchema () {
      return this.schema[this.step]
    }
  },
  methods: {
    update (data) {
      this.$set(this.wizardValues, this.step, data)

      this.$emit('input', this.wizardValues)
    }
  }
}
</script>
