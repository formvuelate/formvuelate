<template>
  <div>
    <slot name="beforeForm"></slot>
    <form class="schema-form">
      <component
        v-for="field in parsedSchema"
        :key="field.model"
        :is="field.component"
        v-bind="binds(field)"
        :value="val(field)"
        @input="update(field.model, $event)"
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
      type: [Object, Array],
      required: true,
      validator (schema) {
        if (!Array.isArray(schema)) return true

        return schema.filter(field => !field.model && !field.schema).length === 0
      }
    },
    value: {
      type: Object,
      required: true
    }
  },
  computed: {
    parsedSchema () {
      if (Array.isArray(this.schema)) return this.schema

      const arraySchema = []
      for (let model in this.schema) {
        arraySchema.push({
          ...this.schema[model],
          model
        })
      }

      return arraySchema
    }
  },
  methods: {
    update (property, value) {
      this.$emit('input', {
        ...this.value,
        [property]: value
      })
    },
    binds (field) {
      return field.schema
        ? { schema: field.schema }
        : field
    },
    val (field) {
      if (field.schema && !this.value[field.model]) {
        return {}
      }

      return this.value[field.model]
    }
  }
}
</script>
