<template>
  <div>
    <button @click="changeDisplayMode">Change Mode</button>
    <SchemaForm
      :schema="schema"
      v-model="userData"
      :display-mode="displayMode"
    />

    <OutputDisplay :data="userData" />
  </div>
</template>

<script>
    import OutputDisplay from './OutputDisplay'
    import FormText from '../../../src/form-elements/FormText'
    import FormSelect from '../../../src/form-elements/FormSelect'
    import FormCheckbox from '../../../src/form-elements/FormCheckbox'

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
    };

    export default {
        components: { OutputDisplay },
        data () {
            return {
                userData: {},
                displayMode: 'EDIT'
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
            changeDisplayMode() {
                this.displayMode = (this.displayMode === 'EDIT') ? 'VIEW' : 'EDIT';
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
  button
    padding: 4px 8px
    border-radius: 3px
    border: 1px solid #ccc
    font-size: 1rem
</style>
