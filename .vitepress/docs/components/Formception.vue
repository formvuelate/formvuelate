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
import { computed, shallowRef, ref } from 'vue'
import FormText from './form-elements/FormText.vue'
import FormSelect from './form-elements/FormSelect.vue'
import FormCheckbox from './form-elements/FormCheckbox.vue'
import SchemaForm from '../../../src/SchemaForm.vue'
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
  components: { BaseButton },
  setup () {
    const userData = ref({})
    const schema = shallowRef(SCHEMA)

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
