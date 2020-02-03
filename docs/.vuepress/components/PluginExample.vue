<template>
  <div>
    <SchemaFormWithValidations
      :schema="schema"
      v-model="userData"
    />

    <!-- <JSONDisplay :data="userData" /> -->
  </div>
</template>

<script>
import JSONDisplay from './JSONDisplay'
import FormText from './form-elements/FormText'
import FormSelect from './form-elements/FormSelect'
import FormCheckbox from './form-elements/FormCheckbox'
import SchemaFormFactory from '../../../src/SchemaFormFactory'
import useVuelidate from '@vuelidate/core'
import VuelidatePlugin from '../../../src/useVuelidatePlugin'
import { required, email } from '@vuelidate/validators/src/withMessages'
import { ref } from '@vue/composition-api'

const SchemaFormWithValidations = SchemaFormFactory([VuelidatePlugin(useVuelidate)])

const SCHEMA = {
  firstName: {
    component: FormText,
    label: 'First Name',
    validations: {
      required
    }
  },
  lastName: {
    component: FormText,
    label: 'Last Name',
    validations: {
      required
    }
  },
  email: {
    component: FormText,
    label: 'Your email',
    required: true,
    config: {
      type: 'email'
    },
    validations: {
      email
    }
  },
}

export default {
  components: { JSONDisplay, SchemaFormWithValidations },
  setup () {
    const userData = ref({
      firstName: 'John',
      lastName: '',
      email: ''
    })

    return {
      schema: SCHEMA,
      userData
    }
  }
}
</script>

<style lang="stylus">
.steps
  max-width: 35rem
  text-align: left
  margin: 0 auto 4rem
  line-height: 1.6
</style>
