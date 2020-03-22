import { toRefs, isRef, reactive, watch, h } from 'vue'
import { required } from '@/libs/validators/withMessages'
import useVuelidate from '@/libs/vuelidate'

export default function VuelidatePlugin (baseReturns, props) {
  // Take the parsed schema from SchemaForm setup returns
  const { parsedSchema } = baseReturns

  // Wrap all components with the "withVuelidate" component
  const schemaWithVuelidate = parsedSchema.map(el => {
    return {
      ...el,
      component: withVuelidate(el.component)
    }
  })

  return {
    ...baseReturns,
    parsedSchema: schemaWithVuelidate
  }
}

export function withVuelidate (Comp) {
  return {
    setup (props, { attrs }) {
      const { validations, modelValue, model } = toRefs(props)
      const propertyName = model.value

      // Setup validation results for that schema leaf
      const vResults = useVuelidate(
        { [propertyName]: validations.value },
        { [propertyName]: modelValue },
        propertyName
      )

      return {
        vResults,
        props,
        attrs
      }
    },
    render () {
      // It renders the original component with the
      // validation results as props
      return h(Comp, {
        ...this.props,
        ...this.attrs,
        vResults: this.vResults
      })
    }
  }
}
