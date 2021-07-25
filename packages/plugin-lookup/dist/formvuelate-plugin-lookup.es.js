/**
 * @formvuelate/plugin-lookup v2.1.0
 * (c) 2021 Marina Mosti <marina@mosti.com.mx>
 * @license MIT
 */

import { computed } from 'vue';

/**
 * LookupPlugin
 * @param {Object} configuration
 * @param {Object|Function} configuration.mapComponents - Key value pair of component mapping or a function that returns it
 * @param {Object|Function} configuration.mapProps - Key value pair of prop mapping or a function that returns it
 * @param {Boolean} configuration.preserveMappedProps
 *
 * @returns {Function}
 */
function LookupPlugin (ref) {
  var mapComponents = ref.mapComponents; if ( mapComponents === void 0 ) mapComponents = {};
  var mapProps = ref.mapProps; if ( mapProps === void 0 ) mapProps = null;
  var preserveMappedProps = ref.preserveMappedProps; if ( preserveMappedProps === void 0 ) preserveMappedProps = false;

  return function (baseReturns) {
    var parsedSchema = baseReturns.parsedSchema;

    var replacedSchema = computed(function () {
      var schemaWithRemappedProps = mapProperties(parsedSchema.value, mapProps, { preserveMappedProps: preserveMappedProps });

      return mapComps(schemaWithRemappedProps, mapComponents)
    });

    return Object.assign({}, baseReturns,
      {parsedSchema: replacedSchema})
  }
}

/**
 * For a Schema, find the elements in each of the rows and remap the element with the given function
 * @param {Array} schema
 * @param {Function} fn
 *
 * @returns {Array}
 */
var mapElementsInSchema = function (schema, fn) { return schema.map(function (row) { return row.map(function (el) { return fn(el); }); }); };

/**
 * Remap components in a schema
 * @param {Array} schema - The schema
 * @param {Object|Function} mapComponents
 *
* @returns {Array}
 */
var mapComps = function (schema, mapComponents) {
  return mapElementsInSchema(schema, function (el) {
    var newKey = mapComponents[el.component];

    if (!newKey) { return Object.assign({}, el) }

    return Object.assign({}, el,
      {component: mapComponents[el.component]})
  })
};

/**
 * Remap properties in a schema
 * @param {Array} schema - The schema
 * @param {Function|Object} mapProps - A key pair value object or function that returns it
 *
 * @returns {Array}
 */
var mapProperties = function (schema, mapProps, config) {
  if ( config === void 0 ) config = {};

  if (!mapProps || !['object', 'function'].includes(typeof mapProps)) { return schema }

  if (typeof mapProps === 'function') {
    return mapPropertiesWithUserFunction(schema, mapProps, config)
  }

  var schemaCopy;
  var loop = function ( prop ) {
    schemaCopy = mapElementsInSchema(schema, function (el) {
      return replacePropInElement(el, prop, mapProps[prop], config)
    });
  };

  for (var prop in mapProps) loop( prop );

  return schemaCopy
};

/**
 * Remap properties using a user defined function
 * @param {Array} schema
 * @param {Function} fn
 *
 * @returns {Array} - Parsed schema
 */
var mapPropertiesWithUserFunction = function (schema, fn, config) {
  if ( config === void 0 ) config = {};

  var mapPropsForElement = function (el, fn) {
    var map = fn(el);
    for (var prop in map) {
      el = replacePropInElement(
        el,
        prop,
        map[prop],
        config
      );
    }

    return el
  };

  return mapElementsInSchema(schema, function (el) {
    return mapPropsForElement(el, fn)
  })
};

/**
 *
 * @param {Object} el - The element to replace props in
 * @param {String} prop - The prop to replace or fn to pick the prop
 * @param {String|Function|Boolean} replacement - The replacement for the prop, a function that returns it or the boolean "false" to delete it
 * @param {Object} [config={}]
 * @param {Boolean} [config.preserveMappedProps=false]
 *
 * @returns {Object} - The replaced element
 */
var replacePropInElement = function (el, prop, replacement, ref) {
  if ( ref === void 0 ) ref = {};
  var preserveMappedProps = ref.preserveMappedProps; if ( preserveMappedProps === void 0 ) preserveMappedProps = false;

  var propReplacement = replacement;
  if (typeof replacement === 'function') {
    // If replacement is a function, call it to get
    // the prop to be replaced. If its falsey, then return
    // the element as is
    propReplacement = replacement(el);

    if (!propReplacement) { return el }
  }

  if (!(prop in el)) {
    if (process.env && "development" !== 'production') {
      console.warn(("LookupPlugin: property \"" + prop + "\" not found in"), el);
    }

    // Return the el without replacing
    return el
  }

  var originalValue = el[prop];
  var elementCopy = Object.assign({}, el);

  if (propReplacement === false || !preserveMappedProps) {
    delete elementCopy[prop];
  }

  if (propReplacement === false) {
    return elementCopy
  }

  elementCopy[propReplacement] = originalValue;

  return elementCopy
};

export { mapElementsInSchema };
export default LookupPlugin;
