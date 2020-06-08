import SchemaForm from '../../src/SchemaForm'
import FormText from '../../.vitepress/docs/components/form-elements/FormText'
import FormSelect from '../../.vitepress/docs/components/form-elements/FormSelect'
import FormCheckbox from '../../.vitepress/docs/components/form-elements/FormCheckbox'

import { markRaw } from 'vue'

export const schema = {
  firstName: {
    component: markRaw(FormText),
    label: 'First Name',
  },
  lastName: {
    component: markRaw(FormText),
    label: 'Last Name',
  },
  email: {
    component: markRaw(FormText),
    label: 'Your email',
    required: true,
    config: {
      type: 'email'
    }
  },
  favoriteThingAboutVue: {
    component: markRaw(FormSelect),
    label: 'Favorite thing about Vue',
    required: true,
    options: [
      'Ease of use',
      'Documentation',
      'Community'
    ]
  },
  isVueFan: {
    component: markRaw(FormCheckbox),
    label: 'Are you a Vue fan?'
  }
}

export const nestedSchema = {
  ...schema,
  work: {
    component: markRaw(SchemaForm),
    schema: {
      address: {
        component: markRaw(FormText),
        label: 'Work address'
      },
      phone: {
        component: markRaw(FormText),
        label: 'Work phone'
      },
      details: {
        component: markRaw(SchemaForm),
        schema: {
          position: {
            component: markRaw(FormText),
            label: 'Work position'
          },
          employees: {
            component: markRaw(FormSelect),
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

export const wizardSchema = [
  {
    firstName: {
      component: markRaw(FormText),
      label: 'First Name',
    },
    lastName: {
      component: markRaw(FormText),
      label: 'Last Name',
    },
  },
  {
    email: {
      component: markRaw(FormText),
      label: 'Your email',
      required: true,
      config: {
        type: 'email'
      }
    },
    favoriteThingAboutVue: {
      component: markRaw(FormSelect),
      label: 'Favorite thing about Vue',
      required: true,
      options: [
        'Ease of use',
        'Documentation',
        'Community'
      ]
    },
  }
]
