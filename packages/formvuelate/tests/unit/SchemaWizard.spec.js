import SchemaWizard from '../../src/SchemaWizard.vue'
import SchemaForm from '../../src/SchemaForm.vue'
import useSchemaForm from '../../src/features/useSchemaForm'

import { mount } from '@vue/test-utils'
import { markRaw, ref, h, nextTick } from 'vue'

const FormText = {
  template: '<input/>',
  props: ['label']
}

const FormSelect = {
  template: '<select />',
  props: ['label', 'options']
}

const SchemaWrapperFactory = (schema, binds, formModel) => {
  return {
    template: `
      <SchemaWizard
        :schema="schemaRef"
        v-bind="binds"
      />
    `,
    components: { SchemaWizard },
    setup () {
      const schemaRef = ref(schema)
      useSchemaForm(formModel || schemaRef)

      return {
        schemaRef,
        binds
      }
    }
  }
}

markRaw(FormSelect)
markRaw(FormText)
markRaw(SchemaForm)

const wizardSchema = [
  {
    firstName: {
      component: FormText,
      label: 'First Name'
    },
    lastName: {
      component: FormText,
      label: 'Last Name'
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
    }
  }
]

describe('SchemaWizard', () => {
  it('renders a SchemaForm for each index of the schema array based on the current step', async () => {
    const wrapper = mount(SchemaWrapperFactory(wizardSchema, {
      step: 0
    }))

    expect(wrapper.findComponent(SchemaForm).vm.schema).toEqual(wizardSchema[0])
    await wrapper.setProps({
      step: 1
    })

    expect(wrapper.findComponent(SchemaForm).vm.schema).toEqual(wizardSchema[1])
  })

  it('emits submit when its form is submitted', async () => {
    const wrapper = mount(SchemaWrapperFactory(wizardSchema, {
      step: 0
    }))

    await wrapper.find('form').trigger('submit')

    expect(wrapper.findComponent(SchemaWizard).emitted('submit')).toHaveLength(1)
  })

  it('notifies child SchemaForms that they are under a wizard', () => {
    const wrapper = mount(SchemaWrapperFactory(wizardSchema, {
      step: 0
    }))

    expect(wrapper.findComponent(SchemaForm).vm.behaveLikeParentSchema).toBe(false)
  })

  it('preserves model data across step changes (no cleanup on step switch)', async () => {
    // The wizard renders each step's schema through a SchemaForm with
    // preventModelCleanupOnSchemaChange. Switching steps must NOT wipe data
    // that belongs to other steps — that's the whole point of a wizard.
    const formModel = ref({
      firstName: 'Marina',
      lastName: 'Mosti',
      email: 'marina@example.com'
    })
    const step = ref(0)

    mount({
      components: { SchemaWizard },
      setup () {
        useSchemaForm(formModel)
        return () => h(SchemaWizard, { schema: wizardSchema, step: step.value })
      }
    })

    // Step 0 only renders firstName/lastName; email belongs to step 1. Moving
    // to step 1 must keep firstName/lastName even though they leave the
    // rendered schema.
    step.value = 1
    await nextTick()
    expect(formModel.value).toEqual({
      firstName: 'Marina',
      lastName: 'Mosti',
      email: 'marina@example.com'
    })

    // And back again — still intact.
    step.value = 0
    await nextTick()
    expect(formModel.value).toEqual({
      firstName: 'Marina',
      lastName: 'Mosti',
      email: 'marina@example.com'
    })
  })
})
