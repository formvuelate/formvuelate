<template>
  <div>
    <SchemaForm
      :schema="schema"
      v-model="userData"
    />

    <JSONDisplay :data="userData" />
  </div>
</template>

<script>
import JSONDisplay from './JSONDisplay'
import FormText from './form-elements/FormText'
import FormSelect from './form-elements/FormSelect'
import FormCheckbox from './form-elements/FormCheckbox'
import EmailModal from './form-elements/EmailModal'

const SCHEMA = {
  firstName: {
    component: FormText,
    label: 'First Name',
  },
  lastName: {
    component: FormText,
    label: 'Last Name',
  },
  email: {
    component: FormText,
    label: 'Your email',
    required: true,
    config: {
      type: 'email'
    }
  },
  emailTemplate: {
    component: EmailModal,
    schema: {
      emailTitle: {
        component: FormText,
        label: 'Email title'
      },
      emailContent: {
        component: FormText,
        label: 'Email content'
      },
      acceptSpam: {
        component: FormCheckbox,
        label: 'I accept all spam'
      },
      acceptTos: {
        component: FormCheckbox,
        label: 'And ToS'
      },
      noms: {
        component: FormSelect,
        label: 'Include noms',
        options: [
          'NoTY',
          'Cheekin',
          'Avocado',
          'Pizza'
        ]
      }
    }
  }
}

export default {
  components: { JSONDisplay },
  data () {
    return {
      userData: {},
      schema: SCHEMA
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
