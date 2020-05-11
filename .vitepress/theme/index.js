import Layout from './Layout.vue'
import SplitTab from '/.vitepress/docs/components/SplitTab.vue'
import FormText from '/.vitepress/docs/components/form-elements/FormText.vue'
import FormSelect from '/.vitepress/docs/components/form-elements/FormSelect.vue'
import FormCheckbox from '/.vitepress/docs/components/form-elements/FormCheckbox.vue'
import SchemaForm from './../../src/SchemaForm.vue'
import ExampleVModel from '/.vitepress/docs/components/ExampleVModel.vue'
import SidebarLinks from './components/SidebarLinks.vue'
import SidebarLink from './components/SidebarLink.vue'
import SchemaPlayground from '/.vitepress/docs/components/SchemaPlayground.vue'

export default {
  Layout,
  NotFound: () => '404 ;<',
  enhanceApp ({ app, router, siteData }) {
    app.provide('router', router)
    app.component('SidebarLinks', SidebarLinks)
    app.component('SchemaForm', SchemaForm)
    app.component('FormText', FormText)
    app.component('FormSelect', FormSelect)
    app.component('FormCheckbox', FormCheckbox)
    app.component('ExampleVModel', ExampleVModel)
    app.component('SplitTab', SplitTab)
    app.component('SidebarLink', SidebarLink)
    app.component('SchemaPlayground', SchemaPlayground)
  }
}
