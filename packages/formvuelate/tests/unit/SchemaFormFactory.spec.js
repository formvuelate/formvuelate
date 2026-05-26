import { inject, h } from 'vue'
import SchemaFormFactory from '../../src/SchemaFormFactory'
import SchemaForm from '../../src/SchemaForm.vue'
import { INJECTED_LOCAL_COMPONENTS } from '../../src/utils/constants'
import { mount } from '@vue/test-utils'

const props = {
  schema: {}
}

const emit = vi.fn()
const attrs = {}
const context = { emit, attrs }

const FormText = {
  template: '<input/>',
  props: ['label']
}

const FormSelect = {
  template: '<select />',
  props: ['label', 'options']
}

let warn

describe('SchemaFormFactory', () => {
  beforeAll(() => {
    // Disable inject and provide warnings
    warn = vi.spyOn(console, 'warn').mockImplementation(() => {})

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
    const plugin = vi.fn((fn) => {
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

  it('passes components to be registered to the output SchemaForm', () => {
    const factory = SchemaFormFactory([], {
      FormText, FormSelect
    })

    expect(factory.components).toEqual(
      expect.objectContaining({ FormText, FormSelect })
    )
  })

  it('provides the local components to sub FVL components', () => {
    const factory = SchemaFormFactory([], {
      FormText, FormSelect
    })

    const injecting = {
      setup () {
        const locals = inject(INJECTED_LOCAL_COMPONENTS)

        return {
          locals
        }
      }
    }

    const wrapper = mount({
      components: { injecting },
      setup () {
        factory.setup(props, context)

        return () => h(injecting)
      }
    })

    expect(wrapper.findComponent(injecting).vm.locals).toEqual({
      FormText,
      FormSelect
    })
  })

  it('warns when a plugin passes a non-object to extendSchemaFormProps', () => {
    warn.mockClear()
    const badPlugin = () => {}
    badPlugin.extend = ({ extendSchemaFormProps }) => extendSchemaFormProps('not-an-object')

    SchemaFormFactory([badPlugin])

    expect(warn).toHaveBeenCalled()
  })

  it('skips the dev warning when process is not defined (browser)', () => {
    warn.mockClear()
    const badPlugin = () => {}
    badPlugin.extend = ({ extendSchemaFormProps }) => extendSchemaFormProps('not-an-object')

    vi.stubGlobal('process', undefined)
    try {
      SchemaFormFactory([badPlugin])
    } finally {
      vi.unstubAllGlobals()
    }

    expect(warn).not.toHaveBeenCalled()
  })

  it('lets a plugin add events via extendEmits, preserving and de-duping', () => {
    const plugin = () => {}
    // includes a brand new event, an event already declared by SchemaForm,
    // and a duplicate, to exercise both sides of the de-dupe check.
    plugin.extend = ({ extendEmits }) => extendEmits(['custom-event', 'submit', 'custom-event'])

    const factory = SchemaFormFactory([plugin])

    expect(factory.emits).toContain('custom-event')
    expect(factory.emits).toContain('submit')
    expect(factory.emits.filter(e => e === 'custom-event')).toHaveLength(1)
    expect(factory.emits.filter(e => e === 'submit')).toHaveLength(1)
  })

  it('warns when a plugin passes a non-array to extendEmits', () => {
    warn.mockClear()
    const badPlugin = () => {}
    badPlugin.extend = ({ extendEmits }) => extendEmits('not-an-array')

    SchemaFormFactory([badPlugin])

    expect(warn).toHaveBeenCalled()
  })

  it('skips the extendEmits dev warning when process is not defined (browser)', () => {
    warn.mockClear()
    const badPlugin = () => {}
    badPlugin.extend = ({ extendEmits }) => extendEmits('not-an-array')

    vi.stubGlobal('process', undefined)
    try {
      SchemaFormFactory([badPlugin])
    } finally {
      vi.unstubAllGlobals()
    }

    expect(warn).not.toHaveBeenCalled()
  })
})
