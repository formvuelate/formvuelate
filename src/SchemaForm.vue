<template>
  <form class="schema-form">
    <component
      v-for="(field, property) in schema"
      :key="property"
      :is="field.component"
      v-bind="{ ...field }"
      :value="value[property]"
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
    }
  }
}
</script>
