import useParsedSchema from '../../src/features/ParsedSchema'
import SchemaForm from '../../src/SchemaForm'

import { ref } from 'vue'

describe('ParsedSchema feature', () => {
  it('returns an empty schema if its not valid', () => {
    const schema = ref({})

    const { parsedSchema } = useParsedSchema(schema)
    expect(parsedSchema.value).toEqual([])
  })

  it('returns the whole schema if the model requested is not found', () => {
    const schema = ref({
      someElement: {
        component: 'test'
      },
      nestedModel: {
        component: SchemaForm,
        schema: {
          otherElement: {
            component: 'test'
          }
        }
      }
    })

    const { parsedSchema } = useParsedSchema(schema, 'wrongModel')
    expect(parsedSchema.value).toEqual(
      [
        [expect.objectContaining({ component: 'test' })],
        [expect.objectContaining({ model: 'nestedModel' })]
      ]
    )
  })
})
