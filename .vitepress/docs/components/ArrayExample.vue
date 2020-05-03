<template>
  <div>
    <SchemaForm
      :schema="schema"
      :value="userData"
      @input="mergeChanges"
    />

    <JSONDisplay :data="userData" />
  </div>
</template>

<script>
import JSONDisplay from './JSONDisplay'
import FormText from './form-elements/FormText'
import FormSelect from './form-elements/FormSelect'
import FormCheckbox from './form-elements/FormCheckbox'
import SchemaForm from '../../../src/SchemaForm'

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
  },
  {
    component: SchemaForm,
    schema: [
      {
        component: FormText,
        label: 'Work address',
        model: 'address'
      },
      {
        component: FormText,
        label: 'Work phone',
        model: 'phone'
      }
    ]
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
