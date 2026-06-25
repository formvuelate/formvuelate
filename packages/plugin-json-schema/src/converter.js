import { buildValidations } from './validations'

/**
 * Default logical-key -> component-name mapping. These are abstract string
 * names, so the converted schema composes with `SchemaFormFactory` local
 * components and with `LookupPlugin`. The `array` default is a string too; the
 * plugin entry (index.js) overrides it with the shipped `ArrayField` component
 * so arrays work out of the box without registration.
 */
const DEFAULT_COMPONENTS = {
  string: 'FvlString',
  number: 'FvlNumber',
  integer: 'FvlNumber',
  boolean: 'FvlBoolean',
  enum: 'FvlEnum',
  object: 'SchemaForm',
  array: 'FvlArray'
}

const DEFAULT_PROP_NAMES = {
  label: 'label',
  hint: 'hint',
  inputType: 'type',
  options: 'options'
}

/** JSON Schema `format` -> native input `type` (when keeping a generic string component). */
const FORMAT_INPUT_TYPES = {
  email: 'email',
  date: 'date',
  'date-time': 'datetime-local',
  time: 'time',
  uri: 'url',
  url: 'url',
  password: 'password'
}

const warn = (message, ...args) => {
  if (typeof process !== 'undefined' && process.env && process.env.NODE_ENV === 'production') return
  console.warn(`[plugin-json-schema] ${message}`, ...args)
}

const resolveOptions = (options = {}) => ({
  components: { ...DEFAULT_COMPONENTS, ...(options.components || {}) },
  mapComponent: typeof options.mapComponent === 'function' ? options.mapComponent : null,
  formatComponents: options.formatComponents || {},
  propNames: { ...DEFAULT_PROP_NAMES, ...(options.propNames || {}) },
  includeValidations: options.includeValidations !== false,
  messages: options.messages || {}
})

const isConstEnum = node =>
  Array.isArray(node.oneOf) && node.oneOf.length > 0 && node.oneOf.every(o => o && typeof o === 'object' && 'const' in o)

/**
 * Convert a JSON Schema (object root) into a FormVueLate object-form schema.
 * @param {Object} jsonSchema
 * @param {Object} [options]
 * @returns {Object} key -> FVL field
 */
export function convertJsonSchema(jsonSchema, options = {}) {
  const opts = resolveOptions(options)

  if (!jsonSchema || typeof jsonSchema !== 'object') {
    warn('convertJsonSchema expects a JSON Schema object', jsonSchema)
    return {}
  }

  const rootType = Array.isArray(jsonSchema.type) ? jsonSchema.type[0] : jsonSchema.type
  if (rootType && rootType !== 'object' && !jsonSchema.properties) {
    warn(`root schema type "${rootType}" is not an object; only object roots are supported`, jsonSchema)
    return {}
  }

  return convertProperties(jsonSchema, opts)
}

const convertProperties = (objectNode, opts) => {
  const properties = objectNode.properties || {}
  const requiredList = Array.isArray(objectNode.required) ? objectNode.required : []
  const result = {}

  for (const name of Object.keys(properties)) {
    result[name] = convertNode(properties[name], {
      name,
      required: requiredList.includes(name),
      opts
    })
  }

  return result
}

const resolveComponent = (node, ctx, logicalKey, opts) => {
  if (opts.mapComponent) {
    const mapped = opts.mapComponent(node, ctx)
    if (mapped) return mapped
  }

  if (ctx.format && opts.formatComponents[ctx.format]) {
    return opts.formatComponents[ctx.format]
  }

  return opts.components[logicalKey]
}

const buildOptions = node => {
  if (isConstEnum(node)) {
    return node.oneOf.map(o => ({ value: o.const, label: o.title != null ? o.title : String(o.const) }))
  }

  const values = Array.isArray(node.enum) ? node.enum : []
  const names = Array.isArray(node.enumNames) ? node.enumNames : null

  return values.map((value, i) => ({
    value,
    label: names && names[i] != null ? names[i] : String(value)
  }))
}

const applyStringFormat = (field, node, opts) => {
  const format = node.format
  if (!format) return

  // If a dedicated component was chosen for this format, let it own the
  // presentation. Otherwise add a native input type onto the generic string.
  if (opts.formatComponents[format]) return

  const inputType = FORMAT_INPUT_TYPES[format]
  if (inputType) field[opts.propNames.inputType] = inputType
}

const warnUnsupported = (node, name) => {
  for (const key of ['allOf', 'anyOf', 'patternProperties']) {
    if (key in node) warn(`property "${name}" uses "${key}" which is not supported and will be ignored`, node)
  }

  if ('oneOf' in node && !isConstEnum(node)) {
    warn(`property "${name}" uses non-const "oneOf" which is not supported and will be ignored`, node)
  }

  if ('$ref' in node) {
    warn(`property "${name}" uses "$ref" which is not resolved in this version`, node)
  }
}

const attachMeta = (field, node, required, opts) => {
  if ('title' in node) field[opts.propNames.label] = node.title
  if ('description' in node) field[opts.propNames.hint] = node.description
  if ('default' in node) field.default = node.default
  if (required) field.required = true
}

const attachValidations = (field, node, required, name, opts) => {
  if (!opts.includeValidations) return field

  const label = field[opts.propNames.label] || name
  const validations = buildValidations(node, { required, label, messages: opts.messages })
  if (validations) field.validations = validations

  return field
}

const convertNode = (node, { name, required, opts }) => {
  if (!node || typeof node !== 'object') {
    warn(`property "${name}" has an invalid schema`, node)
    return { component: opts.components.string }
  }

  const field = {}
  attachMeta(field, node, required, opts)
  warnUnsupported(node, name)

  const type = Array.isArray(node.type) ? node.type[0] : node.type
  const ctx = { name, type, format: node.format }

  // enum / oneOf-const -> select. Checked before type so enums of any base type work.
  if (Array.isArray(node.enum) || isConstEnum(node)) {
    field.component = resolveComponent(node, { ...ctx, type: type || 'string' }, 'enum', opts)
    field[opts.propNames.options] = buildOptions(node)
    return attachValidations(field, node, required, name, opts)
  }

  // array -> repeater. NOTE: item schema lives under `itemSchema`, NOT `schema`,
  // so FormVueLate treats this field as an opaque leaf rather than a nested form.
  if (type === 'array') {
    field.component = resolveComponent(node, ctx, 'array', opts)
    field.itemSchema = convertNode(node.items && typeof node.items === 'object' ? node.items : {}, {
      name: `${name}[]`,
      required: false,
      opts
    })
    if (typeof node.minItems === 'number') field.minItems = node.minItems
    if (typeof node.maxItems === 'number') field.maxItems = node.maxItems
    return attachValidations(field, node, required, name, opts)
  }

  // object -> nested SchemaForm (no validations on the container itself).
  if (type === 'object' || node.properties) {
    field.component = resolveComponent(node, { ...ctx, type: 'object' }, 'object', opts)
    field.schema = convertProperties(node, opts)
    return field
  }

  switch (type) {
    case 'string':
      field.component = resolveComponent(node, ctx, 'string', opts)
      applyStringFormat(field, node, opts)
      break
    case 'number':
    case 'integer':
      field.component = resolveComponent(node, ctx, type, opts)
      if (type === 'integer') field.step = 1
      if (typeof node.minimum === 'number') field.min = node.minimum
      if (typeof node.maximum === 'number') field.max = node.maximum
      break
    case 'boolean':
      field.component = resolveComponent(node, ctx, 'boolean', opts)
      break
    default:
      warn(`property "${name}" has unsupported type "${type}"; falling back to string`, node)
      field.component = resolveComponent(node, { ...ctx, type: 'string' }, 'string', opts)
  }

  return attachValidations(field, node, required, name, opts)
}

export default convertJsonSchema
