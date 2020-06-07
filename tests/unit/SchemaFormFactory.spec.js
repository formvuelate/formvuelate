import SchemaFormFactory from '../../src/SchemaFormFactory'
import SchemaForm from '../../src/SchemaForm'

import { shallowMount } from '@vue/test-utils'

const props = {
  schema: {},
  modelValue: {}
}

const emit = jest.fn()
const attrs = {}
const context = { emit, attrs }

let warn
describe('SchemaFormFactory', () => {
  beforeAll(() => {
    // Disable inject and provide warnings
    warn = jest.spyOn(console, 'warn').mockImplementation();

    expect.extend({
      toEqualFunction (received, compare) {
        const rString = received.toString()
        const cString = compare.toString()

        return {
          message: () => `expected fn ${rString} to equal ${cString}`,
          pass: rString === cString
        }
      }
    })
  })

  afterAll(() => { warn.mockRestore() })

  it('returns the original setup if no plugins are set', () => {
    const factory = SchemaFormFactory()

    expect(factory.setup(props, context))
      .toEqualFunction(SchemaForm.setup(props, context))
  })

  it('applies the plugins to the data returned from schema form', () => {
    let paramFn
    const plugin = jest.fn((fn, props, context) => {
      paramFn = fn
      return fn
    })

    const factory = SchemaFormFactory([
      plugin,
      plugin,
      plugin
    ])

    factory.setup(props, context)

    expect(plugin).toHaveBeenCalledTimes(3)
    expect(plugin).toHaveBeenCalledWith(
      expect.anything(),
      props,
      context
    )
    expect(paramFn).toEqualFunction(SchemaForm.setup(props, context))
  })
})
