import DefaultTheme from 'vitepress/theme'
import { SchemaForm, SchemaArray } from 'formvuelate'

import FormText from './components/FormText.vue'
import FormSelect from './components/FormSelect.vue'
import FormCheckbox from './components/FormCheckbox.vue'
import BaseButton from './components/BaseButton.vue'
import DemoContainer from './components/DemoContainer.vue'
import SchemaPlayground from './components/SchemaPlayground.vue'
import MainPlayground from './components/MainPlayground.vue'
import ConditionalComputedDemo from './components/ConditionalComputedDemo.vue'
import ConditionalConditionDemo from './components/ConditionalConditionDemo.vue'
import HundredNestedDemo from './components/HundredNestedDemo.vue'
import WizardPlayground from './components/WizardPlayground.vue'
import ArrayGroupPlayground from './components/ArrayGroupPlayground.vue'
import ArrayScalarPlayground from './components/ArrayScalarPlayground.vue'
import ArrayAddButton from './components/ArrayAddButton.vue'
import ArrayRemoveButton from './components/ArrayRemoveButton.vue'

import './styles/demos.css'

export default {
  extends: DefaultTheme,
  enhanceApp({ app }) {
    // Schemas reference components by STRING name ("FormText", "SchemaForm",
    // ...), so FVL resolves those against globally registered components — they
    // MUST be registered here. The playground components are registered too so
    // markdown can use them without per-page imports.
    app.component('SchemaForm', SchemaForm)
    app.component('FormText', FormText)
    app.component('FormSelect', FormSelect)
    app.component('FormCheckbox', FormCheckbox)
    app.component('BaseButton', BaseButton)
    app.component('DemoContainer', DemoContainer)
    app.component('SchemaPlayground', SchemaPlayground)
    app.component('MainPlayground', MainPlayground)
    app.component('ConditionalComputedDemo', ConditionalComputedDemo)
    app.component('ConditionalConditionDemo', ConditionalConditionDemo)
    app.component('HundredNestedDemo', HundredNestedDemo)
    app.component('WizardPlayground', WizardPlayground)
    app.component('SchemaArray', SchemaArray)
    app.component('ArrayGroupPlayground', ArrayGroupPlayground)
    app.component('ArrayScalarPlayground', ArrayScalarPlayground)
    app.component('ArrayAddButton', ArrayAddButton)
    app.component('ArrayRemoveButton', ArrayRemoveButton)
  }
}
