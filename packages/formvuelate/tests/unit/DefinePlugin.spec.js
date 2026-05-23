import definePlugin from '../../src/features/DefinePlugin'

describe('definePlugin', () => {
  it('returns a function plugin unchanged', () => {
    const plugin = (baseReturns) => baseReturns
    expect(definePlugin(plugin)).toBe(plugin)
  })

  it('returns the setup fn from an object plugin and attaches extend', () => {
    const setup = (baseReturns) => baseReturns
    const extend = ({ extendSchemaFormProps }) => extendSchemaFormProps({})

    const result = definePlugin({ setup, extend })

    expect(result).toBe(setup)
    expect(result.extend).toBe(extend)
  })

  it('returns the setup fn without an extend when none is provided', () => {
    const setup = (baseReturns) => baseReturns

    const result = definePlugin({ setup })

    expect(result).toBe(setup)
    expect(result.extend).toBeUndefined()
  })

  it('produces a plugin that the SchemaFormFactory can consume', () => {
    // The factory calls plugin.extend({ extendSchemaFormProps }) and then
    // plugin(baseReturns, props, context). A defined plugin must satisfy both.
    const calls = []
    const plugin = definePlugin({
      setup: (baseReturns) => {
        calls.push('setup')
        return baseReturns
      },
      extend: () => {
        calls.push('extend')
      }
    })

    plugin.extend({ extendSchemaFormProps: () => {} })
    const returned = plugin({ parsedSchema: [] })

    expect(calls).toEqual(['extend', 'setup'])
    expect(returned).toEqual({ parsedSchema: [] })
  })
})
