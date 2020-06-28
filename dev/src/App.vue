<template>
  <div id="app">
    <SchemaForm
      :schema="schema"
      v-model="form"
    />


    <pre>{{ form }}</pre>
  </div>
</template>

<script>
import { ref, markRaw } from 'vue'
import SchemaForm from './components/SchemaForm'
import FormText from '../../.vitepress/docs/components/form-elements/FormText'

export default {
  components: {
    SchemaForm
  },
  setup () {
    markRaw(FormText)

    const schema = [
      {
        component: FormText,
        label: 'First Name',
        model: 'firstName'
      },
      {
        component: FormText,
        label: 'Last Name',
        model: 'lastName'
      },
      [
        {
          component: FormText,
          label: 'three',
          model: 'three'
        },
        {
          component: FormText,
          label: 'four',
          model: 'four'
        }
      ]
    ]

    const form = ref({})

    return {
      schema,
      form
    }
  }
}
</script>
