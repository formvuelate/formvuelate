import { toRefs, h, computed, markRaw, watch, getCurrentInstance, unref, resolveDynamicComponent, inject, provide } from 'vue'
import { useForm, useField } from 'vee-validate'
import { definePlugin, constants } from 'formvuelate'

/**
 * For a Schema, find the elements in each of the rows and remap the element with the given function
 * @param {Array} schema
 * @param {Function} fn
 *
 * @returns {Array}
 */
const mapElementsInSchema = (schema, fn) => schema.map(row => row.map(el => fn(el)))

/**
 * Maps the validation state to props
 */
function defaultMapProps (validation) {
  return {
    validation
  }
}

const VEE_VALIDATE_FVL_FORM_KEY = 'vee-validate-fvl-form-context'

export default function VeeValidatePlugin (opts) {
  // Maps the validation state exposed by vee-validate to components
  const mapProps = (opts && opts.mapProps) || defaultMapProps

  function veeValidatePlugin (baseReturns, props, context) {
    // Take the parsed schema from SchemaForm setup returns
    const { parsedSchema, formBinds } = baseReturns

    // Get additional properties not defined on the `SchemaForm` derivatives
    const { attrs: formAttrs } = getCurrentInstance() || { attrs: {} }
    // try to retrieve vee-validate form from the root schema if possible
    let formContext = inject(VEE_VALIDATE_FVL_FORM_KEY, undefined)
    // Only the schema form that creates the vee-validate context (the root) owns
    // the form-level state, so only it should publish it via `update:validation`.
    // Nested schema forms reuse the injected context and must stay silent.
    const isRootForm = !formContext

    if (!formContext) {
      // if non-existent create one and provide it for nested schemas
      formContext = useForm({
        validationSchema: props.validationSchema ? computed(() => props.validationSchema) : undefined,
        initialErrors: formAttrs['initial-errors'] || formAttrs.initialErrors,
        initialTouched: formAttrs['initial-touched'] || formAttrs.initialTouched
      })

      provide(VEE_VALIDATE_FVL_FORM_KEY, formContext)
    }

    const { handleSubmit } = formContext

    function mapField (el, path = '') {
      // If this element's component is already a withFieldWrapper (because an
      // outer plugin instance wrapped it for a nested SchemaForm), leave it
      // alone. Re-wrapping would register the field with vee-validate twice and
      // the first registration gets marked pendingUnmount, suppressing errors.
      // Only valid when the wrapper survived sibling-plugin processing — e.g.
      // when LookupPlugin's mapProperties re-resolves the component, we still
      // need to wrap fresh.
      if (el && el.component && el.component.name === 'withFieldWrapper') {
        return el
      }

      // Handles nested schemas
      // doesn't treat nested forms as fields
      // instead goes over their fields and maps them recursively
      if (el.schema) {
        path = path ? `${path}.${el.model}` : el.model

        // Make sure we only deal with schema arrays and not nested objects
        const schemaArray = Array.isArray(el.schema)
          ? el.schema
          : Object.keys(el.schema).map(model => {
            return {
              model,
              ...el.schema[model]
            }
          })

        return {
          ...el,
          schema: schemaArray.map(nestedField => mapField(nestedField, path))
        }
      }

      const constructField = (field) => {
        return {
          ...field,
          _veeValidateConfig: {
            mapProps,
            path
          },
          component: withField(field)
        }
      }

      if (Array.isArray(el)) {
        return el.map(constructField)
      }

      return constructField(el)
    }

    // Map components in schema to enhanced versions with `useField`
    const formSchemaWithVeeValidate = computed(() => mapElementsInSchema(parsedSchema.value, mapField))

    // override the submit function with one that triggers validation
    const formSubmit = formBinds.value.onSubmit
    const onSubmit = handleSubmit((_, { evt }) => {
      formSubmit(evt)
    })

    // The form-level validation state, shared between the `validation` slot prop
    // and the `update:validation` event so the two can never drift apart.
    const validation = computed(() => {
      return {
        errors: formContext.errors.value,
        values: formContext.values,
        isSubmitting: formContext.isSubmitting.value,
        submitCount: formContext.submitCount.value,
        meta: formContext.meta.value
      }
    })

    // Publish the validation state to the parent scope so it can be consumed
    // outside the form via `v-model:validation` (or a plain `@update:validation`
    // listener). `immediate` seeds the parent with the initial state on mount.
    if (isRootForm && context && typeof context.emit === 'function') {
      watch(
        validation,
        value => context.emit('update:validation', value),
        { deep: true, immediate: true }
      )
    }

    return {
      ...baseReturns,
      formBinds: computed(() => {
        return {
          ...baseReturns.formBinds.value,
          onSubmit
        }
      }),
      slotBinds: computed(() => {
        return {
          ...baseReturns.slotBinds.value,
          validation: validation.value
        }
      }),
      parsedSchema: formSchemaWithVeeValidate
    }
  }

  // extends the schema form props and emits
  const extend = ({ extendSchemaFormProps, extendEmits }) => {
    extendSchemaFormProps({
      validationSchema: {
        type: Object,
        default: undefined
      }
    })

    // Allows `v-model:validation` / `@update:validation` on the generated
    // SchemaForm so the form-level validation state can be read outside it.
    if (typeof extendEmits === 'function') {
      extendEmits(['update:validation'])
    }
  }

  return definePlugin({
    setup: veeValidatePlugin,
    extend
  })
}

// Used to track if a component was already marked
// very important to avoid re-creating components when re-rendering
const COMPONENT_LOOKUP = new Map()

function withField (el) {
  const Comp = el.component

  if (COMPONENT_LOOKUP.has(Comp)) {
    return COMPONENT_LOOKUP.get(Comp)
  }

  const wrappedComponent = markRaw({
    name: 'withFieldWrapper',
    props: {
      label: {
        type: String,
        default: undefined
      },
      modelValue: {
        type: null,
        default: undefined
      },
      validations: {
        type: [String, Object, Function],
        default: undefined
      },
      _veeValidateConfig: {
        type: Object,
        required: true
      }
    },
    setup (props, { attrs }) {
      const { path, mapProps } = props._veeValidateConfig
      const { validations, modelValue } = toRefs(props)
      const initialValue = modelValue.value
      // Build a fully qualified field name using dot notation for nested fields
      // ex: user.name
      const name = path ? `${path}.${attrs.model}` : attrs.model
      const label = computed(() => props.label)
      const { value, errorMessage, meta, setTouched, errors } = useField(name, validations, {
        initialValue,
        label
      })

      watch(modelValue, (val) => {
        value.value = val
      })

      const localComponents = inject(constants.INJECTED_LOCAL_COMPONENTS, {})
      const resolvedComponent = resolveComponent(Comp, localComponents)

      return function renderWithField () {
        return h(resolvedComponent, {
          ...props,
          ...attrs,
          ...mapProps({
            errorMessage: unref(errorMessage),
            errors: unref(errors),
            meta,
            setTouched
          }, el)
        })
      }
    }
  })

  // Assign it to the cache to avoid re-creating it
  COMPONENT_LOOKUP.set(Comp, wrappedComponent)

  return wrappedComponent
}

/**
 * Resolves the component definition by checking the local injection first then trying the vue dynamic resolve algorithm.
 * @param {*} component The component object or name
 * @param {*} localComponents The injected components lookup from SchemaFormFactory
 */
function resolveComponent (component, localComponents) {
  if (localComponents && typeof component === 'string' && component in localComponents) {
    return localComponents[component]
  }

  return resolveDynamicComponent(component)
}
