<template>
  <div>
    <SchemaForm
      :schema="schema"
      v-model="userData"
    />

    <OutputDisplay :data="userData" />
  </div>
</template>

<script>
import OutputDisplay from './OutputDisplay'
import FormText from './form-elements/FormText'
import FormSelect from './form-elements/FormSelect'
import FormCheckbox from './form-elements/FormCheckbox'
import SchemaForm from '../../../src/SchemaForm'

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
  favoriteThingAboutVue: {
    component: FormSelect,
    label: 'Favorite thing about Vue',
    required: true,
    options: [
      'Ease of use',
      'Documentation',
      'Community'
    ]
  },
  isVueFan: {
    component: FormCheckbox,
    label: 'Are you a Vue fan?'
  },
  work: {
    component: SchemaForm,
    schema: {
      address: {
        component: FormText,
        label: 'Work address'
      },
      phone: {
        component: FormText,
        label: 'Work phone'
      },
      details: {
        component: SchemaForm,
        schema: {
          position: {
            component: FormText,
            label: 'Work position'
          },
          employees: {
            component: FormSelect,
            label: 'Number of employees',
            options: [
              '1', '2', '3', '4+'
            ]
          }
        }
      }
    }
  }
}

export default {
  components: { OutputDisplay },
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

<style lang="stylus">
.steps
  max-width: 35rem
  text-align: left
  margin: 0 auto 4rem
  line-height: 1.6
</style>
