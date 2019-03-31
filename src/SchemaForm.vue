<template>
  <form class="schema-form">
    <component
      v-for="(field, property) in schema"
      :key="property"
      :is="field.component"
      v-bind="binds(field)"
      :value="val(property, field)"
      @input="update(property, $event)"
    />
    <slot/>
  </form>
</template>

<script>
import FormCheckbox from './form-elements/FormCheckbox'
import FormText from './form-elements/FormText'

export default {
  components: {
    FormCheckbox,
    FormText
  },
  props: {
    schema: {
      type: Object,
      required: true
    },
    value: {
      type: Object,
      required: true
    }
  },
  data () {
    return {
      values: {}
    }
  },
  methods: {
    update (property, value) {
      this.$set(this.values, property, value)

      this.$emit('input', this.values)
    },
    binds (field) {
      return field.component === 'SchemaForm'
        ? { schema: field.schema }
        : field
    },
    val (property, field) {
      if (field.component === 'SchemaForm' && !this.values[property]) {
        return {}
      }

      return this.values[property]
    }
  }
}
</script>
