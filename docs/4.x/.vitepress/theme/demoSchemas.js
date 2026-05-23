// Seed schemas for the in-doc demos. Each example opens with one of these so
// the playgrounds show the same content users saw in the old CodeSandboxes.
// Components are referenced by STRING name and resolved against the components
// registered globally in theme/index.ts.

export const objSchema = {
  firstName: {
    component: 'FormText',
    label: 'First Name'
  },
  lastName: {
    component: 'FormText',
    label: 'Last Name'
  },
  email: {
    component: 'FormText',
    label: 'Your email',
    required: true,
    type: 'email',
    config: {}
  },
  favoriteThingAboutVue: {
    component: 'FormSelect',
    label: 'Favorite thing about Vue',
    required: true,
    options: ['Ease of use', 'Documentation', 'Community']
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
          },
          employees: {
            component: 'FormSelect',
            label: 'Number of employees',
            options: ['1', '2', '3', '4+']
          }
        }
      }
    }
  }
}

export const arraySchema = [
  [
    {
      component: 'FormText',
      label: 'First Name',
      model: 'firstName',
      style: 'margin-right: 10px;'
    },
    {
      component: 'FormText',
      label: 'Last Name',
      model: 'lastName'
    }
  ],
  {
    component: 'FormText',
    label: 'Your email',
    required: true,
    model: 'email',
    config: {
      type: 'email'
    }
  },
  {
    component: 'FormSelect',
    label: 'Favorite thing about Vue',
    required: true,
    model: 'favoriteThingAboutVue',
    options: ['Ease of use', 'Documentation', 'Community']
  },
  {
    component: 'FormCheckbox',
    label: 'Are you a Vue fan?',
    model: 'isVueFan'
  },
  {
    component: 'SchemaForm',
    model: 'work',
    schema: [
      {
        component: 'FormText',
        label: 'Work address',
        model: 'address'
      },
      {
        component: 'FormText',
        label: 'Work phone',
        model: 'phone'
      },
      {
        component: 'SchemaForm',
        model: 'details',
        schema: [
          {
            component: 'FormText',
            label: 'Work position',
            model: 'position'
          },
          {
            component: 'FormSelect',
            label: 'Number of employees',
            model: 'employees',
            options: ['1', '2', '3', '4+']
          }
        ]
      }
    ]
  }
]
