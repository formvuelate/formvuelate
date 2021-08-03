import { inject, provide, computed } from 'vue'
import {
  IS_SCHEMA_WIZARD,
  PARENT_SCHEMA_EXISTS
} from '../utils/constants'

export default function useParentSchema () {
  const isChildOfWizard = inject(IS_SCHEMA_WIZARD, false)

  const hasParentSchema = inject(PARENT_SCHEMA_EXISTS, false)
  if (!hasParentSchema) {
    provide(PARENT_SCHEMA_EXISTS, true)
  }

  const behaveLikeParentSchema = computed(() => (!isChildOfWizard && !hasParentSchema))

  return {
    behaveLikeParentSchema,
    hasParentSchema,
    isChildOfWizard
  }
}
