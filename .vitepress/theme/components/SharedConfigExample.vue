<template>
  <div>
    <SchemaForm
      :schema="schema"
      v-model="userData"
      :sharedConfig="sharedConfig"
    />

    <JSONDisplay :data="userData" />
  </div>
</template>

<script>
import JSONDisplay from './JSONDisplay'
import FormText from './form-elements/FormText'
import FormSelect from './form-elements/FormSelect'
import FormCheckbox from './form-elements/FormCheckbox'

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
  }
}

export default {
  components: { JSONDisplay },
  data () {
    return {
      userData: {},
      sharedConfig: {
        readOnly: true
      }
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
