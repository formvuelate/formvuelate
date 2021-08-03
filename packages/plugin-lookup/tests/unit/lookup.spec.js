import { computed, ref } from 'vue'
import LookupPlugin, { mapElementsInSchema } from '../../src/index.js'

const rawSchema = [
  [
    {
      model: 'firstName',
      component: 'FormText',
      label: 'First Name',
      mappable: true,
      unique: false
    }
  ],
  [
    {
      label: 'Favorite thing about Vue',
      required: true,
      model: 'favoriteThingAboutVue',
      component: 'FormSelect',
      mappable: true,
      unique: false
    },
    {
      label: 'Are you a Vue fan?',
      model: 'isVueFan',
      component: 'FormCheckbox',
      mappable: true,
      unique: false
    }
  ]
]

const schema = computed(() => rawSchema)
const warn = jest.spyOn(console, 'warn').mockImplementation()

describe('Lookup Plugin', () => {
  beforeEach(() => jest.clearAllMocks())
  afterAll(() => warn.mockRestore())

  describe('mapComponents', () => {
    it('maps a key value object of components inside the schema', () => {
      const lookup = LookupPlugin({
        mapComponents: {
          FormText: 'BaseInput',
          FormSelect: 'BaseSelect'
        }
      })
      const { parsedSchema } = lookup({ parsedSchema: schema })

      mapElementsInSchema(parsedSchema.value, el => {
        expect(el.component).not.toEqual('FormText')
      })

      expect(parsedSchema.value[0][0].component).toEqual('BaseInput')
      expect(parsedSchema.value[1][0].component).toEqual('BaseSelect')
      expect(parsedSchema.value[1][1].component).toEqual('FormCheckbox')
    })
  })

  describe('mapProps', () => {
    it('maps props in the schema elements from a key value pair object', () => {
      const lookup = LookupPlugin({
        mapProps: {
          label: 'tag'
        }
      })
      const { parsedSchema } = lookup({ parsedSchema: schema })

      mapElementsInSchema(parsedSchema.value, el => {
        expect('tag' in el).toEqual(true)
        expect('label' in el).toEqual(false)
      })
    })

    it('can map without deleting the original property', () => {
      const lookup = LookupPlugin({
        mapProps: {
          label: 'tag'
        },
        preserveMappedProps: true
      })

      const { parsedSchema } = lookup({ parsedSchema: schema })

      mapElementsInSchema(parsedSchema.value, el => {
        expect('tag' in el).toEqual(true)
        expect('label' in el).toEqual(true)
        expect(el.tag).toEqual(el.label)
      })
    })

    it('can receive a function to create the mapping', () => {
      const rawSchema = [
        [
          {
            model: 'firstName',
            type: 'FormText',
            label: 'First Name',
            mappable: true,
            unique: false
          }
        ],
        [
          {
            label: 'Favorite thing about Vue',
            required: true,
            model: 'favoriteThingAboutVue',
            type: 'FormSelect',
            mappable: true,
            unique: false
          },
          {
            label: 'Are you a Vue fan?',
            model: 'isVueFan',
            type: 'FormCheckbox',
            mappable: true,
            unique: false
          }
        ]
      ]

      const schema = computed(() => rawSchema)

      const mapper = jest.fn((el) => {
        if (el.type === 'FormText') {
          return {
            mappable: 'remapped',
            type: 'component'
          }
        }

        return {
          type: 'component'
        }
      })

      const lookup = LookupPlugin({
        mapProps: mapper
      })

      const { parsedSchema } = lookup({ parsedSchema: schema })

      expect('mappable' in parsedSchema.value[0][0]).toBe(false)
      expect('remapped' in parsedSchema.value[0][0]).toBe(true)

      mapElementsInSchema(parsedSchema.value, el => {
        expect('component' in el).toEqual(true)
        expect('type' in el).toEqual(false)
      })
    })

    it('can map a prop as a function', () => {
      const lookup = LookupPlugin({
        mapProps: {
          mappable: (el) => {
            if (el.label === 'First Name') {
              return 'nameable'
            }

            return false
          }
        }
      })

      const { parsedSchema } = lookup({ parsedSchema: schema })

      mapElementsInSchema(parsedSchema.value, el => {
        expect('nameable' in el).toBe(el.label === 'First Name')
      })
    })

    describe('warnings', () => {
      it('throws a console warning if prop is not found', async () => {
        const lookup = LookupPlugin({
          mapProps: {
            foo: 'bar'
          }
        })

        const { parsedSchema } = lookup({ parsedSchema: schema })

        // Force computed property to execute so that warning are fired
        // eslint-disable-next-line
        parsedSchema.value

        expect(warn).toHaveBeenCalledTimes(3)
        expect(warn).toHaveBeenCalledWith(expect.stringContaining('property "foo" not found'), expect.anything())
      })
    })

    describe('deleting properties', () => {
      it('can delete a property if its equal to false', () => {
        const lookup = LookupPlugin({
          mapProps: {
            label: false
          }
        })
        const { parsedSchema } = lookup({ parsedSchema: schema })

        mapElementsInSchema(parsedSchema.value, el => {
          expect('label' in el).toEqual(false)
        })
      })

      it('can delete a property through a function', () => {
        const lookup = LookupPlugin({
          mapProps: (el) => {
            return {
              label: false
            }
          }
        })

        const { parsedSchema } = lookup({ parsedSchema: schema })

        mapElementsInSchema(parsedSchema.value, el => {
          expect('label' in el).toEqual(false)
        })
      })
    })
  })

  it('preserves reactivity in computed schemas', () => {
    const toggle = ref('A')
    const computedSchema = computed(() => {
      return toggle.value === 'A'
        ? [
            [
              {
                model: 'A',
                component: 'text',
                label: 'A'
              }
            ]
          ]
        : [
            [
              {
                model: 'B',
                component: 'text',
                label: 'B'
              }
            ]
          ]
    })

    const lookup = LookupPlugin({
      mapComponents: {
        text: 'FormText'
      }
    })
    const { parsedSchema } = lookup({ parsedSchema: computedSchema })

    expect(parsedSchema.value).toEqual([[
      { component: 'FormText', label: 'A', model: 'A' }
    ]])

    toggle.value = 'B'

    expect(parsedSchema.value).toEqual([[
      { component: 'FormText', label: 'B', model: 'B' }
    ]])
  })
})
