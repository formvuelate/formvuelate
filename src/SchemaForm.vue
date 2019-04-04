<template>
  <div>
    <slot name="beforeForm"></slot>
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
    <slot name="afterForm"></slot>
  </div>
</template>

<script>
export default {
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
  methods: {
    update (property, value) {
      const values = { ...this.value }
      values[property] = value

      this.$emit('input', values)
    },
    binds (field) {
      return field.schema
        ? { schema: field.schema }
        : field
    },
    val (property, field) {
      if (field.schema && !this.value[property]) {
        return {}
      }

      return this.value[property]
    }
  }
}
</script>
