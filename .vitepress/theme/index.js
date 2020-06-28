import SplitTab from '/.vitepress/docs/components/SplitTab.vue'
import FormText from '/.vitepress/docs/components/form-elements/FormText.vue'
import FormSelect from '/.vitepress/docs/components/form-elements/FormSelect.vue'
import FormCheckbox from '/.vitepress/docs/components/form-elements/FormCheckbox.vue'
import BaseButton from '/.vitepress/docs/components/form-elements/BaseButton.vue'
import SchemaForm from './../../src/SchemaForm.vue'
import SchemaPlayground from '/.vitepress/docs/components/SchemaPlayground.vue'

import ExampleVModel from '/.vitepress/docs/components/ExampleVModel.vue'
import ArrayExample from '/.vitepress/docs/components/ArrayExample.vue'
import HorizontalForm from '/.vitepress/docs/components/HorizontalForm.vue'
import Formception from '/.vitepress/docs/components/Formception.vue'

import './styles/vars.css';
import './styles/layout.css';
import './styles/code.css';
import './styles/custom-blocks.css';
import Layout from './Layout.vue';
import NotFound from './NotFound.vue';
const theme = {
  Layout,
  NotFound,
  enhanceApp ({ app, router, siteData }) {
    app.provide('router', router)

    app.component('FormText', FormText)
    app.component('FormSelect', FormSelect)
    app.component('FormCheckbox', FormCheckbox)
    app.component('BaseButton', BaseButton)
    app.component('SchemaPlayground', SchemaPlayground)

    app.component('SchemaForm', SchemaForm)

    app.component('SplitTab', SplitTab)
    app.component('ExampleVModel', ExampleVModel)
    app.component('ArrayExample', ArrayExample)
    app.component('Formception', Formception)
    app.component('HorizontalForm', HorizontalForm)
  }
};
export default theme;
