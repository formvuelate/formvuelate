import SchemaForm from './SchemaForm.vue'
import SchemaField from './SchemaField.vue'
import { isObject } from './utils/assertions'

export default function SchemaFormFactory (plugins = [], components = null) {
  // Copy the original SchemaForm setup
  const originalSetup = SchemaForm.setup

  const schemaFormProps = { ...SchemaForm.props }

  function extendSchemaFormProps (newProps) {
    if (!isObject(newProps)) {
      if (process.env && process.env.NODE_ENV !== 'production') {
        console.warn('Formvuelate: extendSchemaFormProps can only receive a Vue props object')
      }
      return
    }

    Object.assign(schemaFormProps, newProps)
  }

  plugins.forEach(plugin => {
    if (plugin.extend) {
      plugin.extend({ extendSchemaFormProps })
    }
  })

  function setup (props, context) {
    // Call the original setup and preserve its results
    const baseSchemaFormReturns = originalSetup(props, context)

    if (!plugins.length) return baseSchemaFormReturns
    else {
      // Apply plugins on the data returned
      // by the original Schemaform
      return plugins.reduce(
        (schemaFormReturns, plugin) => {
          return plugin(schemaFormReturns, props, context)
        },
        baseSchemaFormReturns
      )
    }
  }

  const SchemaFieldWithComponents = {
    ...SchemaField,
    components: {
      ...components,
      ...SchemaField.components
    }
  }

  return {
    ...SchemaForm,
    props: schemaFormProps,
    components: {
      ...components,
      ...SchemaForm.components,
      SchemaField: SchemaFieldWithComponents
    },
    // Return a customized setup function with plugins
    // as the new SchemaForm setup
    setup
  }
}
