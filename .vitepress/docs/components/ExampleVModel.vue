<template>
  <form @submit.prevent="formSubmit">
    <SchemaForm
      :schema="schema"
      v-model="userData"
    />

    <BaseButton type="submit">Submit</BaseButton>

    <pre>{{ userData }}</pre>
  </form>
</template>

<script>
import { computed, ref } from 'vue'
import FormText from './form-elements/FormText.vue'
import FormSelect from './form-elements/FormSelect.vue'
import FormCheckbox from './form-elements/FormCheckbox.vue'
import BaseButton from './form-elements/BaseButton.vue'

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
  components: { BaseButton },
  setup () {
    const userData = ref({})
    const schema = computed(() => {
      return userData.value.isVueFan ? {
        ...SCHEMA,
        feedback: {
          component: FormText,
          label: 'Gimme some feedback'
        }
      }
        : SCHEMA
    })

    const formSubmit = () => {
      alert('Form submitted!')
    }

    return {
      userData,
      schema,
      formSubmit
    }
  }
}
</script>
