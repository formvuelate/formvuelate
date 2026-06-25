import { buildValidations } from '../../src/validations.js'

describe('buildValidations', () => {
  it('returns undefined when there are no constraints', () => {
    expect(buildValidations({ type: 'string' })).toBeUndefined()
    expect(buildValidations(null)).toBeUndefined()
  })

  describe('required', () => {
    it('fails on empty and passes when filled', () => {
      const validate = buildValidations({ type: 'string' }, { required: true, label: 'Name' })
      expect(validate('')).toBe('Name is required')
      expect(validate(undefined)).toBe('Name is required')
      expect(validate('Jane')).toBe(true)
    })

    it('treats a present boolean (including false) as valid', () => {
      const validate = buildValidations({ type: 'boolean' }, { required: true, label: 'Agree' })
      expect(validate(undefined)).toBe('Agree is required')
      expect(validate(false)).toBe(true)
      expect(validate(true)).toBe(true)
    })

    it('requires a non-empty array', () => {
      const validate = buildValidations({ type: 'array' }, { required: true, label: 'Tags' })
      expect(validate([])).toBe('Tags is required')
      expect(validate(['a'])).toBe(true)
    })
  })

  describe('optional empty values short-circuit', () => {
    it('passes other checks when an optional field is empty', () => {
      const validate = buildValidations({ type: 'string', minLength: 5 }, { label: 'Bio' })
      expect(validate('')).toBe(true)
      expect(validate('abc')).toBe('Bio must be at least 5 characters')
    })
  })

  describe('string constraints', () => {
    it('enforces minLength / maxLength', () => {
      const validate = buildValidations({ type: 'string', minLength: 2, maxLength: 4 }, { required: true, label: 'Code' })
      expect(validate('a')).toBe('Code must be at least 2 characters')
      expect(validate('abcde')).toBe('Code must be at most 4 characters')
      expect(validate('abc')).toBe(true)
    })

    it('enforces pattern', () => {
      const validate = buildValidations({ type: 'string', pattern: '^[A-Z]+$' }, { required: true, label: 'Caps' })
      expect(validate('abc')).toBe('Caps is not in the correct format')
      expect(validate('ABC')).toBe(true)
    })

    it('validates email and uri formats', () => {
      const email = buildValidations({ type: 'string', format: 'email' }, { required: true, label: 'Email' })
      expect(email('nope')).toBe('Email must be a valid email')
      expect(email('a@b.com')).toBe(true)

      const uri = buildValidations({ type: 'string', format: 'uri' }, { required: true, label: 'Site' })
      expect(uri('nope')).toBe('Site must be a valid URL')
      expect(uri('https://example.com')).toBe(true)
    })
  })

  describe('numeric constraints', () => {
    it('enforces minimum / maximum (coercing string input)', () => {
      const validate = buildValidations({ type: 'number', minimum: 1, maximum: 10 }, { required: true, label: 'Qty' })
      expect(validate('0')).toBe('Qty must be greater than or equal to 1')
      expect(validate('11')).toBe('Qty must be less than or equal to 10')
      expect(validate('5')).toBe(true)
    })

    it('supports numeric exclusive bounds (draft-06+)', () => {
      const validate = buildValidations({ type: 'number', exclusiveMinimum: 0, exclusiveMaximum: 5 }, { required: true, label: 'N' })
      expect(validate(0)).toBe('N must be greater than 0')
      expect(validate(5)).toBe('N must be less than 5')
      expect(validate(3)).toBe(true)
    })

    it('supports boolean exclusive bounds (draft-04)', () => {
      const validate = buildValidations(
        { type: 'number', minimum: 0, exclusiveMinimum: true },
        { required: true, label: 'N' }
      )
      expect(validate(0)).toBe('N must be greater than 0')
      expect(validate(1)).toBe(true)
    })

    it('enforces integer', () => {
      const validate = buildValidations({ type: 'integer' }, { required: true, label: 'Age' })
      expect(validate('1.5')).toBe('Age must be an integer')
      expect(validate('30')).toBe(true)
    })
  })

  describe('array item bounds', () => {
    it('enforces minItems / maxItems', () => {
      const validate = buildValidations({ type: 'array', minItems: 1, maxItems: 2 }, { label: 'Tags' })
      expect(validate([])).toBe('Tags must have at least 1 items')
      expect(validate(['a', 'b', 'c'])).toBe('Tags must have at most 2 items')
      expect(validate(['a'])).toBe(true)
    })
  })

  describe('enum membership', () => {
    it('fails for values outside the enum', () => {
      const validate = buildValidations({ type: 'string', enum: ['a', 'b'] }, { required: true, label: 'Pick' })
      expect(validate('c')).toBe('Pick must be one of the allowed values')
      expect(validate('a')).toBe(true)
    })
  })

  describe('messages', () => {
    it('interpolates and allows overrides', () => {
      const validate = buildValidations(
        { type: 'string', minLength: 3 },
        { required: true, label: 'Field', messages: { minLength: 'Need {min}+ chars for {label}' } }
      )
      expect(validate('ab')).toBe('Need 3+ chars for Field')
    })

    it('falls back to a generic label', () => {
      const validate = buildValidations({ type: 'string' }, { required: true })
      expect(validate('')).toBe('This field is required')
    })
  })
})
