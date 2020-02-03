import SchemaForm from './SchemaForm'

export default function SchemaFormFactory (plugins = [], config) {
  const originalSetup = SchemaForm.setup

  function setup (...args) {
    const baseSchemaFormReturns = originalSetup(...args)

    if (!plugins.length) return baseSchemaFormReturns
    else {
      return plugins.reduce((schemaFormReturns, plugin) => {
        const props = args[0]
        return plugin(schemaFormReturns, props)
      }, baseSchemaFormReturns)
    }
  }

  return {
    ...SchemaForm,
    setup
  }
}
