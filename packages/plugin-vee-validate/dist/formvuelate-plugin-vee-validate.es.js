/**
 * @formvuelate/plugin-vee-validate v2.3.0
 * (c) 2021 Abdelrahman Awad <logaretm1@gmail.com>
 * @license MIT
 */

import { computed, getCurrentInstance, h, inject, markRaw, provide, resolveDynamicComponent, toRefs, unref, watch } from 'vue';
import { useField, useForm } from 'vee-validate';

/**
 * For a Schema, find the elements in each of the rows and remap the element with the given function
 * @param {Array} schema
 * @param {Function} fn
 *
 * @returns {Array}
 */
var mapElementsInSchema = function (schema, fn) { return schema.map(function (row) { return row.map(function (el) { return fn(el); }); }); };

/**
 * Maps the validation state to props
 */
function defaultMapProps (validation) {
  return {
    validation: validation
  }
}

var VEE_VALIDATE_FVL_FORM_KEY = 'vee-validate-fvl-form-context';

function VeeValidatePlugin (opts) {
  // Maps the validation state exposed by vee-validate to components
  var mapProps = (opts && opts.mapProps) || defaultMapProps;

  return function veeValidatePlugin (baseReturns) {
  // Take the parsed schema from SchemaForm setup returns
    var parsedSchema = baseReturns.parsedSchema;
    var formBinds = baseReturns.formBinds;

    // Get additional properties not defined on the `SchemaForm` derivatives
    var ref = getCurrentInstance();
    var formAttrs = ref.attrs;
    // try to retrieve vee-validate form from the root schema if possible
    var formContext = inject(VEE_VALIDATE_FVL_FORM_KEY, undefined);
    if (!formContext) {
      // if non-existent create one and provide it for nested schemas
      formContext = useForm({
        validationSchema: formAttrs['validation-schema'] || formAttrs.validationSchema,
        initialErrors: formAttrs['initial-errors'] || formAttrs.initialErrors,
        initialTouched: formAttrs['initial-touched'] || formAttrs.initialTouched
      });

      provide(VEE_VALIDATE_FVL_FORM_KEY, formContext);
    }

    var handleSubmit = formContext.handleSubmit;

    function mapField (el, path) {
      if ( path === void 0 ) path = '';

      // Handles nested schemas
      // doesn't treat nested forms as fields
      // instead goes over their fields and maps them recursively
      if (el.schema) {
        path = path ? (path + "." + (el.model)) : el.model;

        // Make sure we only deal with schema arrays and not nested objects
        var schemaArray = Array.isArray(el.schema) ? el.schema : Object.keys(el.schema).map(function (model) {
          return Object.assign({}, {model: model},
            el.schema[model])
        });

        return Object.assign({}, el,
          {schema: schemaArray.map(function (nestedField) { return mapField(nestedField, path); })})
      }

      return Object.assign({}, el,
        // namespaced prop to avoid clash with users' props
        {_veeValidateConfig: {
          mapProps: mapProps,
          path: path
        },
        component: withField(el)})
    }

    // Map components in schema to enhanced versions with `useField`
    var formSchemaWithVeeValidate = computed(function () { return mapElementsInSchema(parsedSchema.value, mapField); });

    // override the submit function with one that triggers validation
    var formSubmit = formBinds.value.onSubmit;
    var onSubmit = handleSubmit(function (_, ref) {
      var evt = ref.evt;

      formSubmit(evt);
    });

    return Object.assign({}, baseReturns,
      {formBinds: computed(function () {
        return Object.assign({}, baseReturns.formBinds.value,
          {onSubmit: onSubmit})
      }),
      slotBinds: computed(function () {
        return Object.assign({}, baseReturns.slotBinds.value,
          {validation: {
            errors: formContext.errors.value,
            values: formContext.values,
            isSubmitting: formContext.isSubmitting.value,
            submitCount: formContext.submitCount.value,
            meta: formContext.meta.value
          }})
      }),
      parsedSchema: formSchemaWithVeeValidate})
  }
}

// Used to track if a component was already marked
// very important to avoid re-creating components when re-rendering
var COMPONENT_LOOKUP = new Map();

function withField (el) {
  var Comp = el.component;

  if (COMPONENT_LOOKUP.has(Comp)) {
    return COMPONENT_LOOKUP.get(Comp)
  }

  var wrappedComponent = markRaw({
    name: 'withFieldWrapper',
    props: {
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
    setup: function setup (props, ref) {
      var attrs = ref.attrs;

      var ref$1 = props._veeValidateConfig;
      var path = ref$1.path;
      var mapProps = ref$1.mapProps;
      var ref$2 = toRefs(props);
      var validations = ref$2.validations;
      var modelValue = ref$2.modelValue;
      var initialValue = modelValue ? modelValue.value : undefined;
      // Build a fully qualified field name using dot notation for nested fields
      // ex: user.name
      var name = path ? (path + "." + (attrs.model)) : attrs.model;
      var ref$3 = useField(name, validations, {
        initialValue: initialValue
      });
      var value = ref$3.value;
      var errorMessage = ref$3.errorMessage;
      var meta = ref$3.meta;
      var setTouched = ref$3.setTouched;
      var errors = ref$3.errors;

      if (modelValue) {
        watch(modelValue, function (val) {
          value.value = val;
        });
      }

      var resolvedComponent = resolveDynamicComponent(Comp);

      return function renderWithField () {
        return h(resolvedComponent, Object.assign({}, props,
          attrs,
          mapProps({
            errorMessage: unref(errorMessage),
            errors: unref(errors),
            meta: meta,
            setTouched: setTouched
          }, el)))
      }
    }
  });

  // Assign it to the cache to avoid re-creating it
  COMPONENT_LOOKUP.set(Comp, wrappedComponent);

  return wrappedComponent
}

export { mapElementsInSchema, withField };
export default VeeValidatePlugin;
