import CompositionAPI from '@vue/composition-api'

import SchemaForm from '../../src/SchemaForm.vue'
import SchemaWizard from '../../src/SchemaWizard.vue'

export default ({
  Vue
}) => {
  Vue.use(CompositionAPI)

  Vue.component('SchemaForm', SchemaForm)
  Vue.component('SchemaWizard', SchemaWizard)
}
