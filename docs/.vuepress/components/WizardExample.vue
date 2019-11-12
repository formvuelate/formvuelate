<template>
  <div>
    <p>Step: {{ step + 1 }}</p>

    <SchemaWizard
      :schema="schema"
      :step="step"
      v-model="userData"
    >
      <button
        v-if="step < schema.length - 1"
        @click="step++">Next</button>
      <button
        v-if="step > 0"
        @click="step--">Back</button>
    </SchemaWizard>

    <JSONDisplay
      :data="userData"
    />
  </div>
</template>

<script>
import JSONDisplay from './JSONDisplay'
import FormText from './form-elements/FormText'
import FormSelect from './form-elements/FormSelect'
import FormCheckbox from './form-elements/FormCheckbox'

const SCHEMA = [
  {
    firstName: {
      component: FormText,
      label: 'First Name',
    },
    lastName: {
      component: FormText,
      label: 'Last Name',
    }
  },
  {
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
  },
  {
    address: {
      component: FormText,
      label: 'Work address'
    },
    phone: {
      component: FormText,
      label: 'Work phone'
    },
  }
]

export default {
  data() {
    return {
      userData: [],
      step: 0
    }
  },
  computed: {
    schema() {
      return SCHEMA
    }
  }
}
</script>

<style lang="stylus" scoped>
button
  padding: 4px 8px
  border-radius: 3px
  border: 1px solid #ccc
  font-size: 1rem
</style>
