import SchemaForm from './SchemaForm'
import SchemaField from './SchemaField'

export default function SchemaFormFactory (plugins = [], components = null) {
  // Copy the original SchemaForm setup
  const originalSetup = SchemaForm.setup

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
