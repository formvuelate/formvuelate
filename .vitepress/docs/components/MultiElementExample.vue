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
import SchemaForm from '../../../src/SchemaForm'
import MultiElementWrapper from './form-elements/MultiElementWrapper'
import FormText from './form-elements/FormText'

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
  favorites: {
    component: MultiElementWrapper
  }
}

export default {
  components: { JSONDisplay },
  data() {
    return {
      userData: {},
      schema: SCHEMA
    }
  },
}
</script>


<style lang="stylus">
.steps
  max-width: 35rem
  text-align: left
  margin: 0 auto 4rem
  line-height: 1.6
</style>
