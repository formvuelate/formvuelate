<template>
  <div>
    <SchemaForm
      :schema="schema"
      :value="userData"
      @input="mergeChanges"
    />

    <p>Form Output:</p>
    <OutputDisplay :data="userData" />
  </div>
</template>

<script>
import OutputDisplay from './OutputDisplay'
import FormText from '../../../src/form-elements/FormText'
import FormSelect from '../../../src/form-elements/FormSelect'
import FormCheckbox from '../../../src/form-elements/FormCheckbox'

const SCHEMA = [
  {
    component: FormText,
    label: 'First Name',
    model: 'firstName'
  },
  {
    component: FormText,
    label: 'Last Name',
    model: 'lastName'
  }
]

export default {
  data () {
    return {
      userData: {}
    }
  },
  computed: {
    schema () {
      return this.userData.isVueFan
        ? {
            ...SCHEMA,
            feedback: {
              component: FormText,
              label: 'Gimme some feedback'
            }
          }
        : SCHEMA
    }
  },
  methods: {
    mergeChanges (changes) {
      this.userData = {
        ...this.userData,
        ...changes
      }
    }
  }
}
</script>
