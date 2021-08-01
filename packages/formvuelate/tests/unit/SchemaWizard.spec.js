import SchemaWizard from '../../src/SchemaWizard.vue'
import SchemaForm from '../../src/SchemaForm.vue'
import useSchemaForm from '../../src/features/useSchemaForm'

import { mount } from '@vue/test-utils'
import { markRaw, ref } from 'vue'

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

  it('notifies child SchemaForms that they are under a wizard', () => {
    const wrapper = mount(SchemaWrapperFactory(wizardSchema, {
      step: 0
    }))

    expect(wrapper.findComponent(SchemaForm).vm.behaveLikeParentSchema).toBe(false)
  })
})
