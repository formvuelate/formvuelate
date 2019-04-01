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
const SCHEMA = {
  firstName: {
    component: 'FormText',
    label: 'First Name',
  },
  lastName: {
    component: 'FormText',
    label: 'Last Name',
  },
  email: {
    component: 'FormText',
    label: 'Your email',
    required: true,
    config: {
      type: 'email'
    }
  },
  isVueFan: {
    component: 'FormCheckbox',
    label: 'Are you a Vue fan?'
  }
}

import OutputDisplay from './OutputDisplay'
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
              component: 'FormText',
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
