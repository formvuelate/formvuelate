// The plugin reads `getCurrentInstance()` to pull extra form attrs and falls
// back to `{ attrs: {} }` when there is no active instance. That fallback never
// happens during a normal mount (the plugin always runs inside SchemaForm's
// setup), so we drive the plugin function directly with `getCurrentInstance`
// stubbed to null. vee-validate's `useForm` is stubbed too, since it requires a
// live component setup we deliberately don't have here.
const { fakeFormContext } = vi.hoisted(() => ({
  fakeFormContext: {
    errors: { value: {} },
    values: { name: '' },
    isSubmitting: { value: false },
    submitCount: { value: 0 },
    meta: { value: { valid: true } },
    handleSubmit: (cb) => cb
  }
}))

vi.mock('vue', async (importOriginal) => {
  const actual = await importOriginal()
  return { ...actual, getCurrentInstance: () => null }
})

vi.mock('vee-validate', () => ({
  useForm: () => fakeFormContext,
  useField: () => ({
    value: { value: undefined },
    errorMessage: { value: undefined },
    meta: {},
    setTouched: () => {},
    errors: { value: [] }
  })
}))

import VeeValidatePlugin from '../../src/index.js'

describe('VeeValidatePlugin setup (unit)', () => {
  it('falls back to empty form attrs when there is no current instance', () => {
    const warn = vi.spyOn(console, 'warn').mockImplementation(() => {})

    const plugin = VeeValidatePlugin()
    const emit = vi.fn()

    const result = plugin(
      {
        parsedSchema: { value: [] },
        formBinds: { value: { onSubmit: vi.fn() } },
        slotBinds: { value: {} }
      },
      { validationSchema: undefined },
      { emit }
    )

    // It still returns the enhanced binds and schema...
    expect(result.parsedSchema).toBeDefined()
    expect(result.formBinds).toBeDefined()
    // ...and seeds the parent with the initial validation state via the
    // immediate watcher, proving it ran past the getCurrentInstance fallback.
    expect(emit).toHaveBeenCalledWith(
      'update:validation',
      expect.objectContaining({ isSubmitting: false, submitCount: 0 })
    )

    warn.mockRestore()
  })

  it('leaves read-only elements unwrapped so they never register as fields', () => {
    const Input = { name: 'Input', template: '<input/>' }
    const Display = { name: 'Display', template: '<div/>' }

    const plugin = VeeValidatePlugin()

    const result = plugin(
      {
        parsedSchema: {
          value: [
            [{ model: 'name', component: Input }],
            [{ model: 'note', component: Display, readonly: true }]
          ]
        },
        formBinds: { value: { onSubmit: vi.fn() } },
        slotBinds: { value: {} }
      },
      { validationSchema: undefined },
      { emit: vi.fn() }
    )

    const enhanced = result.parsedSchema.value
    const nameEl = enhanced[0][0]
    const noteEl = enhanced[1][0]

    // A normal field gets wrapped with the vee-validate field wrapper...
    expect(nameEl.component.name).toBe('withFieldWrapper')
    // ...while a read-only element keeps its original component untouched.
    expect(noteEl.component).toBe(Display)
    expect(noteEl.readonly).toBe(true)
  })
})
