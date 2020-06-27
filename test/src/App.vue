<template>
  <div id="app">
    <SchemaForm
      :schema="schema"
      v-model="form"
    />
  </div>
</template>

<script>
import { ref, markRaw } from 'vue'
import SchemaForm from '../../src/SchemaForm'
import FormText from '../../.vitepress/docs/components/form-elements/FormText'

export default {
  components: {
    SchemaForm
  },
  setup () {
    markRaw(FormText)

    const schema = {
      firstName: {
        component: FormText,
        label: 'First Name'
      },
      lastName: {
        component: FormText,
        label: 'Last Name'
      }
    }

    // const schema = [
    //   {
    //     component: FormText,
    //     label: 'First Name',
    //     model: 'firstName'
    //   },
    //   {
    //     component: FormText,
    //     label: 'Last Name',
    //     model: 'lastName'
    //   }
    // ]

    const form = ref({})

    return {
      schema,
      form
    }
  }
}
</script>

<style>
#app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
  margin-top: 60px;
}
</style>
