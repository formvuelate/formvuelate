// Seed schemas for the in-doc demos. Each example opens with one of these so
// the playgrounds show the same content users saw in the old CodeSandboxes.
// Components are referenced by STRING name and resolved against the components
// registered globally in theme/index.ts.
//
// These are the JSON-serialisable schemas used by the editable SchemaPlayground
// demos. Function/loop-based examples (conditional, 100-nested, wizard) live in
// their own components since functions can't survive a JSON text editor.

// --- Getting Started playground (object <-> array switch) ---
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

// --- Example: SchemaForm with useSchemaForm (basic object schema) ---
export const basicSchema = {
  firstName: { component: 'FormText', label: 'First Name' },
  lastName: { component: 'FormText', label: 'Last Name' },
  email: { component: 'FormText', label: 'Email', config: { type: 'email' } },
  favoriteThingAboutVue: {
    component: 'FormSelect',
    label: 'Favorite thing about Vue',
    options: ['Ease of use', 'Documentation', 'Community']
  }
}

// --- Example: nested schemas (SchemaForm inside SchemaForm) ---
export const nestedSchema = {
  firstName: { component: 'FormText', label: 'First Name' },
  lastName: { component: 'FormText', label: 'Last Name' },
  work: {
    component: 'SchemaForm',
    schema: {
      address: { component: 'FormText', label: 'Work address' },
      details: {
        component: 'SchemaForm',
        schema: {
          position: { component: 'FormText', label: 'Position' },
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

// --- Example: array-based schema (each field names itself via `model`) ---
export const arrayExampleSchema = [
  { component: 'FormText', label: 'First Name', model: 'firstName' },
  { component: 'FormText', label: 'Last Name', model: 'lastName' },
  {
    component: 'FormSelect',
    label: 'Favorite thing about Vue',
    model: 'favoriteThingAboutVue',
    options: ['Ease of use', 'Documentation', 'Community']
  }
]

// --- Guide: horizontal form (sub-arrays render as side-by-side rows) ---
export const horizontalSchema = [
  [
    {
      component: 'FormText',
      label: 'First Name',
      model: 'firstName',
      style: 'margin-right: 10px;'
    },
    { component: 'FormText', label: 'Last Name', model: 'lastName' }
  ],
  {
    component: 'FormText',
    label: 'Email',
    model: 'email',
    config: { type: 'email' }
  },
  [
    {
      component: 'FormSelect',
      label: 'Favorite thing about Vue',
      model: 'favoriteThingAboutVue',
      options: ['Ease of use', 'Documentation', 'Community'],
      style: 'margin-right: 10px;'
    },
    { component: 'FormCheckbox', label: 'Are you a Vue fan?', model: 'isVueFan' }
  ]
]
