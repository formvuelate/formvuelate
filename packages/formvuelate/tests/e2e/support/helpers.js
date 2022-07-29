import SchemaForm from '../../../src/SchemaForm.vue'
import { shallowRef, ref, h, isRef } from 'vue'
import useSchemaForm from '../../../src/features/useSchemaForm'

export const SchemaFormWrapper = ({
  schema,
  model = null,
  onSetup = () => {}
}) => ({
  components: [SchemaForm],
  setup () {
    const formModel = model || ref({})
    const { updateFormModel } = useSchemaForm(formModel)

    const schemaRef = isRef(schema) ? schema : shallowRef(schema)

    onSetup({ formModel, updateFormModel })

    return {
      schema: schemaRef
    }
  },
  render () {
    return h(SchemaForm, {
      schema,
      onSubmit: this.$emit('submit')
    })
  }
})
