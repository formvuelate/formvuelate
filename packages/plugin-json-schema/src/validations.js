/**
 * Build synchronous validator functions from JSON Schema constraints.
 *
 * The returned function matches the contract vee-validate's `useField` accepts
 * for a validator: it returns `true` when valid or a `string` error message when
 * invalid. Because it is a plain function, the plugin needs no yup/zod runtime
 * dependency.
 */

const DEFAULT_MESSAGES = {
  required: '{label} is required',
  minLength: '{label} must be at least {min} characters',
  maxLength: '{label} must be at most {max} characters',
  minimum: '{label} must be greater than or equal to {min}',
  maximum: '{label} must be less than or equal to {max}',
  exclusiveMinimum: '{label} must be greater than {min}',
  exclusiveMaximum: '{label} must be less than {max}',
  pattern: '{label} is not in the correct format',
  email: '{label} must be a valid email',
  uri: '{label} must be a valid URL',
  integer: '{label} must be an integer',
  enum: '{label} must be one of the allowed values',
  minItems: '{label} must have at least {min} items',
  maxItems: '{label} must have at most {max} items'
}

// Pragmatic, dependency-free checks. Not exhaustive RFC implementations, but
// good enough for the common form-validation cases.
const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
const URI_RE = /^[a-z][a-z\d+\-.]*:\/\/\S+$/i

const isEmpty = value => value === undefined || value === null || value === ''

const interpolate = (template, vars) =>
  template.replace(/\{(\w+)\}/g, (_, key) => (key in vars ? vars[key] : `{${key}}`))

/**
 * @param {Object} node - A JSON Schema node
 * @param {Object} [ctx]
 * @param {Boolean} [ctx.required]
 * @param {String} [ctx.label]
 * @param {Object} [ctx.messages]
 * @returns {((value: any) => true | string) | undefined}
 */
export function buildValidations(node, ctx = {}) {
  if (!node || typeof node !== 'object') return undefined

  const required = ctx.required === true
  const messages = { ...DEFAULT_MESSAGES, ...(ctx.messages || {}) }
  const label = ctx.label || 'This field'
  const type = Array.isArray(node.type) ? node.type[0] : node.type
  const msg = (key, vars = {}) => interpolate(messages[key], { label, ...vars })

  const checks = []

  if (required) {
    checks.push(value => {
      if (type === 'array') {
        return Array.isArray(value) && value.length > 0 ? true : msg('required')
      }
      if (type === 'boolean') {
        // A required boolean only needs to be present (true OR false).
        return value === undefined || value === null ? msg('required') : true
      }
      return isEmpty(value) ? msg('required') : true
    })
  }

  if (typeof node.minLength === 'number') {
    checks.push(value => (String(value).length >= node.minLength ? true : msg('minLength', { min: node.minLength })))
  }
  if (typeof node.maxLength === 'number') {
    checks.push(value => (String(value).length <= node.maxLength ? true : msg('maxLength', { max: node.maxLength })))
  }
  if (typeof node.pattern === 'string') {
    let re = null
    try {
      re = new RegExp(node.pattern)
    } catch {
      re = null
    }
    if (re) checks.push(value => (re.test(String(value)) ? true : msg('pattern')))
  }
  if (node.format === 'email') {
    checks.push(value => (EMAIL_RE.test(String(value)) ? true : msg('email')))
  }
  if (node.format === 'uri' || node.format === 'url') {
    checks.push(value => (URI_RE.test(String(value)) ? true : msg('uri')))
  }

  if (typeof node.minimum === 'number') {
    checks.push(value => (Number(value) >= node.minimum ? true : msg('minimum', { min: node.minimum })))
  }
  if (typeof node.maximum === 'number') {
    checks.push(value => (Number(value) <= node.maximum ? true : msg('maximum', { max: node.maximum })))
  }
  // exclusiveMinimum/Maximum: number form (draft-06+) or boolean form (draft-04, paired with minimum/maximum)
  if (typeof node.exclusiveMinimum === 'number') {
    checks.push(value => (Number(value) > node.exclusiveMinimum ? true : msg('exclusiveMinimum', { min: node.exclusiveMinimum })))
  } else if (node.exclusiveMinimum === true && typeof node.minimum === 'number') {
    checks.push(value => (Number(value) > node.minimum ? true : msg('exclusiveMinimum', { min: node.minimum })))
  }
  if (typeof node.exclusiveMaximum === 'number') {
    checks.push(value => (Number(value) < node.exclusiveMaximum ? true : msg('exclusiveMaximum', { max: node.exclusiveMaximum })))
  } else if (node.exclusiveMaximum === true && typeof node.maximum === 'number') {
    checks.push(value => (Number(value) < node.maximum ? true : msg('exclusiveMaximum', { max: node.maximum })))
  }
  if (type === 'integer') {
    checks.push(value => (Number.isInteger(Number(value)) ? true : msg('integer')))
  }

  if (typeof node.minItems === 'number') {
    checks.push(value => (Array.isArray(value) && value.length >= node.minItems ? true : msg('minItems', { min: node.minItems })))
  }
  if (typeof node.maxItems === 'number') {
    checks.push(value => (Array.isArray(value) && value.length <= node.maxItems ? true : msg('maxItems', { max: node.maxItems })))
  }

  if (Array.isArray(node.enum)) {
    checks.push(value => (node.enum.some(option => option === value) ? true : msg('enum')))
  }

  if (checks.length === 0) return undefined

  return function validate(value) {
    // Optional + empty values skip every check (standard form UX). Required
    // fields never skip, so their (first) check runs and reports the message.
    if (!required && isEmpty(value)) return true

    for (const check of checks) {
      const result = check(value)
      if (result !== true) return result
    }

    return true
  }
}

export default buildValidations
