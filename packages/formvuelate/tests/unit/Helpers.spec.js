import { ref } from 'vue'
import {
  findOrCreateProp,
  findNestedFormModelProp,
  updateFormModel,
  deleteFormModelProperty,
  forEachSchemaElement,
  findPropertyForPath,
  forEachPropInModel
} from '../../src/utils/Helpers'

describe('Helpers', () => {
  describe('findPropertyForPath', () => {
    it('resolves a dotted path against an object', () => {
      const obj = { a: { b: { c: 42 } } }
      expect(findPropertyForPath('a.b.c', obj)).toBe(42)
    })

    it('resolves a single-level path', () => {
      expect(findPropertyForPath('name', { name: 'Marina' })).toBe('Marina')
    })
  })

  describe('findOrCreateProp', () => {
    it('returns an existing prop', () => {
      const model = { nested: { keep: true } }
      expect(findOrCreateProp(model, 'nested')).toBe(model.nested)
    })

    it('creates the prop as an empty object if missing', () => {
      const model = {}
      const created = findOrCreateProp(model, 'nested')
      expect(created).toEqual({})
      expect(model.nested).toBe(created)
    })
  })

  describe('findNestedFormModelProp', () => {
    it('walks a dotted path, creating intermediate objects', () => {
      const formModel = ref({})
      const leaf = findNestedFormModelProp(formModel, 'a.b.c')
      leaf.value = 1
      expect(formModel.value).toEqual({ a: { b: { c: { value: 1 } } } })
    })
  })

  describe('updateFormModel', () => {
    it('sets a top-level property', () => {
      const formModel = ref({})
      updateFormModel(formModel, 'firstName', 'Marina')
      expect(formModel.value.firstName).toBe('Marina')
    })

    it('sets a nested property via path', () => {
      const formModel = ref({})
      updateFormModel(formModel, 'street', '10 Downing', 'address')
      expect(formModel.value).toEqual({ address: { street: '10 Downing' } })
    })
  })

  describe('deleteFormModelProperty', () => {
    it('deletes a top-level property', () => {
      const formModel = ref({ a: 1, b: 2 })
      deleteFormModelProperty(formModel, 'a')
      expect(formModel.value).toEqual({ b: 2 })
    })

    it('keeps the parent if it still has other properties', () => {
      const formModel = ref({ address: { street: 'x', city: 'y' } })
      deleteFormModelProperty(formModel, 'street', 'address')
      expect(formModel.value).toEqual({ address: { city: 'y' } })
    })

    // Intentional behavior split (relied on by SchemaForm cleanup tests):
    // - a SHALLOW (single-level) parent is kept as an empty object when its
    //   last child is removed, so the model keeps mirroring a top-level
    //   sub-schema that is still present in the schema.
    // - a DEEP (2+ level) parent is pruned when it becomes empty.
    it('keeps a now-empty SHALLOW parent object', () => {
      const formModel = ref({ address: { street: 'x' }, name: 'y' })
      deleteFormModelProperty(formModel, 'street', 'address')
      expect(formModel.value).toEqual({ address: {}, name: 'y' })
    })

    it('prunes a now-empty DEEP parent object', () => {
      const formModel = ref({ a: { b: { c: 1 } }, keep: 'me' })
      deleteFormModelProperty(formModel, 'c', 'a.b')
      expect(formModel.value).toEqual({ a: {}, keep: 'me' })
    })
  })

  describe('forEachPropInModel', () => {
    it('visits every leaf, including siblings that come AFTER a nested object', () => {
      // Regression guard: the early `return` bug skipped props after the
      // first nested object at a given level.
      const model = ref({ first: 'a', nested: { deep: 'd' }, last: 'z' })
      const visited = {}
      forEachPropInModel(model, (prop, value, path) => {
        visited[path ? `${path}.${prop}` : prop] = value
      })

      expect(visited).toEqual({
        first: 'a',
        'nested.deep': 'd',
        last: 'z'
      })
    })

    it('produces correct dot paths for sibling nested objects', () => {
      const model = ref({
        a: { x: 1 },
        b: { y: 2 }
      })
      const paths = []
      forEachPropInModel(model, (prop, value, path) => {
        paths.push(path ? `${path}.${prop}` : prop)
      })

      expect(paths.sort()).toEqual(['a.x', 'b.y'])
    })
  })

  describe('forEachSchemaElement', () => {
    it('gives every element in a multi-element row the same parent path', () => {
      // Regression guard: a leading element with a sub-schema used to leak its
      // own model as the path for later elements in the same row.
      const schema = [
        [
          { model: 'address', schema: { street: { component: 'text' } } },
          { model: 'phone', component: 'text' }
        ]
      ]

      const pathByModel = {}
      forEachSchemaElement(schema, (el, path) => {
        pathByModel[el.model] = path
      })

      expect(pathByModel.address).toBe('')
      expect(pathByModel.phone).toBe('')
      expect(pathByModel.street).toBe('address')
    })

    it('recurses into deeply nested schemas with cumulative paths', () => {
      const schema = {
        level1: {
          schema: {
            level2: {
              schema: {
                leaf: { component: 'text' }
              }
            }
          }
        }
      }

      const pathByModel = {}
      forEachSchemaElement(schema, (el, path) => {
        pathByModel[el.model] = path
      })

      expect(pathByModel.level1).toBe('')
      expect(pathByModel.level2).toBe('level1')
      expect(pathByModel.leaf).toBe('level1.level2')
    })
  })
})
