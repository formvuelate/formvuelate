import useInjectedSchema from '../../src/features/InjectedSchema'
import { INJECTED_SCHEMA } from '../../src/utils/constants'

import { mount } from '@vue/test-utils'
import { reactive } from 'vue'

// useInjectedSchema decides whether a SchemaForm injects its own schema (when
// it is the top-level/parent form) or reuses the schema injected by an
// ancestor (when it is a nested child). The parent path is exercised by every
// SchemaForm mount across the suite; this covers the child path directly.
describe('InjectedSchema feature', () => {
  it('reuses the injected parent schema when not acting as the parent', () => {
    const parentSchema = [[{ model: 'a', component: 'X' }]]
    let result

    mount({
      setup () {
        result = useInjectedSchema(
          reactive({ schema: [], nestedSchemaModel: '' }),
          false
        )

        return () => null
      }
    }, {
      global: { provide: { [INJECTED_SCHEMA]: parentSchema } }
    })

    expect(result.schema).toBe(parentSchema)
  })
})
