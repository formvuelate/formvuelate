import { computed, toRefs } from '@vue/composition-api'

export default function VuelidatePlugin (useVuelidate) {
  return function (baseReturns, props) {
    const state = computed(() => toRefs(props.value))
    const { parsedSchema } = baseReturns
    const validationRules = parsedSchema.value.reduce((rules, field) => {
      if (field.validations) {
        return {
          ...rules,
          [field.model]: field.validations
        }
      }
      return rules
    }, { })

    const $v = useVuelidate(validationRules, state)

    return {
      ...baseReturns,
      $v
    }
  }
}
