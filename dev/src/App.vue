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
        label: 'one',
        model: 'one'
      },
      [
        {
          component: FormText,
          label: 'two',
          model: 'two'
        },
        {
          component: FormText,
          label: 'three',
          model: 'three'
        }
      ],
      {
        component: FormText,
        label: 'four',
        model: 'four'
      },
      [
        {
          component: FormText,
          label: 'five',
          model: 'five'
        },
        {
          component: FormText,
          label: 'six',
          model: 'six'
        },
        {
          component: FormText,
          label: 'seven',
          model: 'seven'
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
