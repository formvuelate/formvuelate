import { getCurrentInstance, inject } from 'vue'
/**
 * Includes same-component scope in the inject hierarch
 */
export function injectWithSelf (symbol, def = undefined) {
  const vm = getCurrentInstance()

  return vm?.provides[symbol] || inject(symbol, def)
}
