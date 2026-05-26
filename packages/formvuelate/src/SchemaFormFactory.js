import { provide, inject } from 'vue'
import SchemaForm from './SchemaForm.vue'
import { isObject } from './utils/assertions'
import { INJECTED_LOCAL_COMPONENTS } from './utils/constants'

export default function SchemaFormFactory (plugins = [], components = null) {
  // Copy the original SchemaForm setup
  const originalSetup = SchemaForm.setup

  const schemaFormProps = { ...SchemaForm.props }
  const schemaFormEmits = [...(SchemaForm.emits || [])]

  function extendSchemaFormProps (newProps) {
    if (!isObject(newProps)) {
      if (typeof process !== 'undefined' && process.env && process.env.NODE_ENV !== 'production') {
        console.warn('FormVueLate: extendSchemaFormProps can only receive a Vue props object')
      }
      return
    }

    Object.assign(schemaFormProps, newProps)
  }

  function extendEmits (newEmits) {
    if (!Array.isArray(newEmits)) {
      if (typeof process !== 'undefined' && process.env && process.env.NODE_ENV !== 'production') {
        console.warn('FormVueLate: extendEmits can only receive an array of event names')
      }
      return
    }

    newEmits.forEach(name => {
      if (!schemaFormEmits.includes(name)) schemaFormEmits.push(name)
    })
  }

  plugins.forEach(plugin => {
    if (plugin.extend) {
      plugin.extend({ extendSchemaFormProps, extendEmits })
    }
  })

  function setup (props, context) {
    // Call the original setup and preserve its results
    const baseSchemaFormReturns = originalSetup(props, context)

    if (components) {
      // If user defined local components to be used inside the SchemaForm
      // injected them so that SchemaField can use them if declared
      if (!inject(INJECTED_LOCAL_COMPONENTS, null)) {
        provide(INJECTED_LOCAL_COMPONENTS, components)
      }
    }

    if (!plugins.length) return baseSchemaFormReturns
    else {
      // Apply plugins on the data returned
      // by the original SchemaForm
      return plugins.reduce(
        (schemaFormReturns, plugin) => {
          return plugin(schemaFormReturns, props, context)
        },
        baseSchemaFormReturns
      )
    }
  }

  return {
    ...SchemaForm,
    props: schemaFormProps,
    emits: schemaFormEmits,
    components: {
      ...components,
      ...SchemaForm.components
    },
    name: 'SchemaFormWithPlugins',
    // Return a customized setup function with plugins
    // as the new SchemaForm setup
    setup
  }
}
