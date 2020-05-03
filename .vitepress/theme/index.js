import Layout from './Layout.vue'
import SplitTab from './components/SplitTab.vue'
import FormText from './components/form-elements/FormText.vue'
import SchemaForm from './../../src/SchemaForm.vue'
import ExampleVModel from './components/ExampleVModel.vue'

/**
 * @typedef {{
 *   app: import('vue').App
 *   router: import('../app/router').Router
 *   siteData: import('vue').Ref<object>
 * }} EnhanceAppContext
 *
 * @type {{
 *   Layout: import('vue').ComponentOptions
 *   NotFound?: import('vue').ComponentOptions
 *   enhanceApp?: (ctx: EnhanceAppContext) => void
 * }}
 */

export default {
  Layout,
  NotFound: () => '404 ;<',
  enhanceApp ({ app, router, siteData }) {
    console.log(app);
    app.component('SchemaForm', SchemaForm)
    app.component('FormText', FormText)
    app.component('ExampleVModel', ExampleVModel)
    app.component('SplitTab', SplitTab)
  }
}
