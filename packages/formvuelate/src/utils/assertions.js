/**
 * Returns true if the passed value is an object
 * @param {*} obj
 * @returns {boolean}
 */
export function isObject (obj) {
  return obj !== null && !!obj && typeof obj === 'object' && !Array.isArray(obj)
}
