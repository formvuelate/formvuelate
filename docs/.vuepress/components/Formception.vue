<template>
  <div>
    <SchemaForm
    :schema="schema"
    v-model="userData"
  />

    <div class="output">
      vModel Output:
      <ul>
        <li
          v-for="(value, prop) in userData"
          :key="prop"
        >
          {{ prop }}: {{ value }}
        </li>
      </ul>
    </div>
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
  },
  work: {
    component: 'SchemaForm',
    schema: {
      address: {
        component: 'FormText',
        label: 'Work address'
      },
      phone: {
        component: 'FormText',
        label: 'Work phone'
      },
      details: {
        component: 'SchemaForm',
        schema: {
          position: {
            component: 'FormText',
            label: 'Work position'
          }
        }
      }
    }
  }
}

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

.output
  max-width: 35rem
  margin: 0 auto 4rem
  ul
    list-style: none
</style>
