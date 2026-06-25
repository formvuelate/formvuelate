import { convertJsonSchema } from '../../src/converter.js'

const warn = vi.spyOn(console, 'warn').mockImplementation(() => {})

afterAll(() => warn.mockRestore())
beforeEach(() => vi.clearAllMocks())

describe('convertJsonSchema', () => {
  describe('primitives', () => {
    it('maps a string to the default string component', () => {
      const schema = convertJsonSchema({
        type: 'object',
        properties: { name: { type: 'string', title: 'Name', description: 'Your name', default: 'Jane' } }
      })

      expect(schema.name).toMatchObject({
        component: 'FvlString',
        label: 'Name',
        hint: 'Your name',
        default: 'Jane'
      })
    })

    it('maps number and integer to the number component', () => {
      const schema = convertJsonSchema({
        type: 'object',
        properties: {
          price: { type: 'number', minimum: 0, maximum: 100 },
          age: { type: 'integer' }
        }
      })

      expect(schema.price).toMatchObject({ component: 'FvlNumber', min: 0, max: 100 })
      expect(schema.price.step).toBeUndefined()
      expect(schema.age).toMatchObject({ component: 'FvlNumber', step: 1 })
    })

    it('maps boolean to the boolean component', () => {
      const schema = convertJsonSchema({ type: 'object', properties: { agree: { type: 'boolean' } } })
      expect(schema.agree.component).toBe('FvlBoolean')
    })
  })

  describe('string formats', () => {
    it('adds a native input type for known formats', () => {
      const schema = convertJsonSchema({
        type: 'object',
        properties: {
          email: { type: 'string', format: 'email' },
          birthday: { type: 'string', format: 'date' },
          when: { type: 'string', format: 'date-time' },
          site: { type: 'string', format: 'uri' },
          secret: { type: 'string', format: 'password' }
        }
      })

      expect(schema.email).toMatchObject({ component: 'FvlString', type: 'email' })
      expect(schema.birthday.type).toBe('date')
      expect(schema.when.type).toBe('datetime-local')
      expect(schema.site.type).toBe('url')
      expect(schema.secret.type).toBe('password')
    })

    it('uses a format component when configured and skips the input type', () => {
      const schema = convertJsonSchema(
        { type: 'object', properties: { email: { type: 'string', format: 'email' } } },
        { formatComponents: { email: 'FvlEmail' } }
      )

      expect(schema.email.component).toBe('FvlEmail')
      expect(schema.email.type).toBeUndefined()
    })
  })

  describe('enums', () => {
    it('maps enum to a select with options', () => {
      const schema = convertJsonSchema({
        type: 'object',
        properties: { color: { type: 'string', enum: ['r', 'g'], enumNames: ['Red', 'Green'] } }
      })

      expect(schema.color.component).toBe('FvlEnum')
      expect(schema.color.options).toEqual([
        { value: 'r', label: 'Red' },
        { value: 'g', label: 'Green' }
      ])
    })

    it('defaults labels to the stringified value', () => {
      const schema = convertJsonSchema({ type: 'object', properties: { n: { type: 'integer', enum: [1, 2] } } })
      expect(schema.n.options).toEqual([
        { value: 1, label: '1' },
        { value: 2, label: '2' }
      ])
    })

    it('supports oneOf with const/title', () => {
      const schema = convertJsonSchema({
        type: 'object',
        properties: {
          plan: { oneOf: [{ const: 'free', title: 'Free' }, { const: 'pro', title: 'Pro' }] }
        }
      })

      expect(schema.plan.component).toBe('FvlEnum')
      expect(schema.plan.options).toEqual([
        { value: 'free', label: 'Free' },
        { value: 'pro', label: 'Pro' }
      ])
    })
  })

  describe('nested objects', () => {
    it('emits a nested SchemaForm with a schema key', () => {
      const schema = convertJsonSchema({
        type: 'object',
        properties: {
          address: {
            type: 'object',
            properties: {
              street: { type: 'string' },
              zip: { type: 'string' }
            }
          }
        }
      })

      expect(schema.address.component).toBe('SchemaForm')
      expect(schema.address.schema.street.component).toBe('FvlString')
      expect(schema.address.schema.zip.component).toBe('FvlString')
      // containers carry no validations
      expect(schema.address.validations).toBeUndefined()
    })

    it('marks required children', () => {
      const schema = convertJsonSchema({
        type: 'object',
        properties: { a: { type: 'string' }, b: { type: 'string' } },
        required: ['b']
      })

      expect(schema.a.required).toBeUndefined()
      expect(schema.b.required).toBe(true)
      expect(typeof schema.b.validations).toBe('function')
    })
  })

  describe('arrays', () => {
    it('maps an array of primitives to the array component with itemSchema (no schema key)', () => {
      const schema = convertJsonSchema(
        {
          type: 'object',
          properties: {
            tags: { type: 'array', items: { type: 'string' }, minItems: 1, maxItems: 3 }
          }
        },
        { components: { array: 'FvlArray' } }
      )

      expect(schema.tags.component).toBe('FvlArray')
      expect(schema.tags.schema).toBeUndefined()
      expect(schema.tags.itemSchema).toMatchObject({ component: 'FvlString' })
      expect(schema.tags.minItems).toBe(1)
      expect(schema.tags.maxItems).toBe(3)
    })

    it('maps an array of objects to an object itemSchema', () => {
      const schema = convertJsonSchema(
        {
          type: 'object',
          properties: {
            people: {
              type: 'array',
              items: { type: 'object', properties: { name: { type: 'string' } } }
            }
          }
        },
        { components: { array: 'FvlArray' } }
      )

      expect(schema.people.component).toBe('FvlArray')
      expect(schema.people.itemSchema.component).toBe('SchemaForm')
      expect(schema.people.itemSchema.schema.name.component).toBe('FvlString')
    })
  })

  describe('configuration', () => {
    it('honors a custom components map', () => {
      const schema = convertJsonSchema(
        { type: 'object', properties: { name: { type: 'string' } } },
        { components: { string: 'MyInput' } }
      )
      expect(schema.name.component).toBe('MyInput')
    })

    it('lets mapComponent take precedence', () => {
      const schema = convertJsonSchema(
        { type: 'object', properties: { name: { type: 'string' } } },
        { mapComponent: (node, ctx) => (ctx.type === 'string' ? 'Overridden' : undefined) }
      )
      expect(schema.name.component).toBe('Overridden')
    })

    it('remaps emitted prop names', () => {
      const schema = convertJsonSchema(
        { type: 'object', properties: { name: { type: 'string', title: 'Name', description: 'hi' } } },
        { propNames: { hint: 'description', label: 'text' } }
      )
      expect(schema.name.text).toBe('Name')
      expect(schema.name.description).toBe('hi')
    })

    it('can disable validations', () => {
      const schema = convertJsonSchema(
        { type: 'object', properties: { name: { type: 'string', minLength: 2 } } },
        { includeValidations: false }
      )
      expect(schema.name.validations).toBeUndefined()
    })
  })

  describe('unsupported input', () => {
    it('warns and returns {} for a non-object root', () => {
      const schema = convertJsonSchema({ type: 'string' })
      expect(schema).toEqual({})
      expect(warn).toHaveBeenCalled()
    })

    it('warns on $ref / allOf and still renders something', () => {
      const schema = convertJsonSchema({
        type: 'object',
        properties: {
          a: { $ref: '#/definitions/x' },
          b: { allOf: [{ type: 'string' }] }
        }
      })

      expect(warn).toHaveBeenCalled()
      // unknown-type fields fall back to a string component rather than vanishing
      expect(schema.a.component).toBe('FvlString')
      expect(schema.b.component).toBe('FvlString')
    })
  })
})
