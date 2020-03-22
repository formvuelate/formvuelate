import { h, isRef } from 'vue'

export default function WithErrorsPlugin (ErrorsListComp) {
  return function (baseReturns, props) {
    const { parsedSchema } = baseReturns
    const schemaWithErrorsList = parsedSchema.value.map(el => {
      return {
        ...el,
        component: withErrorsComponent(el.component)
      }
    })

    return {
      ...baseReturns,
      parsedSchema: schemaWithErrorsList
    }
  }

  function withErrorsComponent (Comp) {
    return (props, { attrs }) => {
      const errors = props.vResults.$errors

      return [
        h(Comp, {
          ...props,
          ...attrs,
          invalid: !!errors.length
        }),
        h(ErrorsListComp, { errors })
      ]
    }
  }
}
