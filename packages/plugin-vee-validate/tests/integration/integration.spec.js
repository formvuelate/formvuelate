import veeValidatePlugin from '@formvuelate/plugin-vee-validate'
import { configure, defineRule } from 'vee-validate'
import { SchemaFormFactory, useSchemaForm } from 'formvuelate'
import { mount } from '@vue/test-utils'
import { markRaw, ref, computed } from 'vue'
import * as yup from 'yup'
import flushPromises from 'flush-promises'

const FormText = {
  template: `
    <div>
      <input @input="$emit('update:modelValue', $event.target.value)" />
      <span class="error">{{ validation.errorMessage }}</span>
    </div>
  `,
  emits: ['update:modelValue'],
  props: ['label', 'modelValue', 'validation']
}

const FormTextWithMeta = {
  template: `
    <div>
      <input @input="$emit('update:modelValue', $event.target.value)" />
      <span class="dirty">{{ validation.meta.dirty }}</span>
      <span class="touched">{{ validation.meta.touched }}</span>
    </div>
  `,
  emits: ['update:modelValue'],
  props: ['label', 'modelValue', 'validation']
}

const FormTextWithProps = {
  template: `
    <div>
      <input @input="$emit('update:modelValue', $event.target.value)" />
      <span class="error">{{ errorMessage }}</span>
    </div>
  `,
  emits: ['update:modelValue'],
  props: ['label', 'modelValue', 'errorMessage']
}

markRaw(FormText)

const REQUIRED_MESSAGE = 'This field is required'
const MIN_MESSAGE = 'Too short'
const EMAIL_MESSAGE = 'Invalid Email'

describe('FVL integration', () => {
  it('renders error messages using validation prop', async () => {
    const schema = {
      firstName: {
        label: 'First Name',
        component: FormText,
        validations: yup.string().required(REQUIRED_MESSAGE)
      }
    }

    const SchemaWithValidation = SchemaFormFactory([veeValidatePlugin()])

    const wrapper = mount({
      template: `
        <SchemaWithValidation :schema="schema" />
      `,
      components: {
        SchemaWithValidation
      },
      setup () {
        const formData = ref({})
        useSchemaForm(formData)

        return {
          schema
        }
      }
    })

    const input = wrapper.findComponent(FormText)
    input.setValue('')
    await flushPromises()
    expect(wrapper.find('.error').text()).toBe(REQUIRED_MESSAGE)
    input.setValue('hello')
    await flushPromises()
    expect(wrapper.find('.error').text()).toBe('')
  })

  it('maps validation state to props', async () => {
    const schema = [
      {
        label: 'First Name',
        model: 'firstName',
        component: FormTextWithProps,
        validations: yup.string().required(REQUIRED_MESSAGE)
      }
    ]

    const SchemaWithValidation = SchemaFormFactory([
      veeValidatePlugin({
        mapProps: (state) => {
          return {
            errorMessage: state.errorMessage
          }
        }
      })
    ])

    const wrapper = mount({
      template: `
        <SchemaWithValidation :schema="schema" />
      `,
      components: {
        SchemaWithValidation
      },
      setup () {
        const formData = ref({})
        useSchemaForm(formData)

        return {
          schema
        }
      }
    })

    const input = wrapper.findComponent(FormTextWithProps)
    input.setValue('')
    await flushPromises()
    expect(wrapper.find('.error').text()).toBe(REQUIRED_MESSAGE)
    input.setValue('hello')
    await flushPromises()
    expect(wrapper.find('.error').text()).toBe('')
  })

  it('does form-level validation with validation-schema attr', async () => {
    const schema = [
      {
        label: 'Email',
        model: 'email',
        component: FormText
      },
      {
        label: 'Password',
        model: 'password',
        component: FormText
      }
    ]

    const SchemaWithValidation = SchemaFormFactory([veeValidatePlugin()])

    const wrapper = mount({
      template: `
        <SchemaWithValidation :schema="schema" :validation-schema="validationSchema" />
      `,
      components: {
        SchemaWithValidation
      },
      setup () {
        const formData = ref({})
        useSchemaForm(formData)

        const validationSchema = yup.object().shape({
          email: yup.string().email(EMAIL_MESSAGE).required(),
          password: yup.string().min(4, MIN_MESSAGE).required()
        })

        return {
          schema,
          formData,
          validationSchema
        }
      }
    })

    const inputs = wrapper.findAllComponents(FormText)
    const errors = wrapper.findAll('.error')
    inputs[0].setValue('not email')
    await flushPromises()
    expect(errors[0].text()).toBe(EMAIL_MESSAGE)

    inputs[1].setValue('12')
    await flushPromises()
    expect(errors[1].text()).toBe(MIN_MESSAGE)

    inputs[0].setValue('test@gmail.com')
    await flushPromises()
    expect(errors[0].text()).toBe('')

    inputs[1].setValue('1234')
    await flushPromises()
    expect(errors[1].text()).toBe('')
  })

  it('validates before submission', async () => {
    const schema = [
      {
        label: 'Email',
        model: 'email',
        component: FormText
      },
      {
        label: 'Password',
        model: 'password',
        component: FormText
      }
    ]

    const SchemaWithValidation = SchemaFormFactory([veeValidatePlugin()])

    const onSubmit = jest.fn()

    const wrapper = mount({
      template: `
        <SchemaWithValidation :schema="schema" :validation-schema="validationSchema" @submit.prevent="onSubmit" />
      `,
      components: {
        SchemaWithValidation
      },
      setup () {
        const formData = ref({})
        useSchemaForm(formData)
        const validationSchema = yup.object().shape({
          email: yup.string().email(EMAIL_MESSAGE).required(),
          password: yup.string().min(4, MIN_MESSAGE).required()
        })

        return {
          schema,
          formData,
          validationSchema,
          onSubmit
        }
      }
    })

    const inputs = wrapper.findAllComponents(FormText)
    const form = wrapper.find('form')

    form.trigger('submit')
    await flushPromises()
    expect(onSubmit).toHaveBeenCalledTimes(0)

    inputs[0].setValue('test@gmail.com')
    await flushPromises()

    inputs[1].setValue('1234')
    await flushPromises()

    form.trigger('submit')
    await flushPromises()
    expect(onSubmit).toHaveBeenCalledTimes(1)
  })

  it('fills form errors with initial-errors attribute', async () => {
    const schema = [
      {
        label: 'Email',
        model: 'email',
        component: FormText
      },
      {
        label: 'Password',
        model: 'password',
        component: FormText
      }
    ]

    const errors = {
      email: 'wrong',
      password: 'short'
    }

    const SchemaWithValidation = SchemaFormFactory([veeValidatePlugin()])

    const wrapper = mount({
      template: `
        <SchemaWithValidation :schema="schema" :initial-errors="errors" />
      `,
      components: {
        SchemaWithValidation
      },
      setup () {
        const formData = ref({})
        useSchemaForm(formData)

        return {
          schema,
          formData,
          errors
        }
      }
    })

    await flushPromises()
    const messages = wrapper.findAll('.error')
    expect(messages[0].text()).toBe('wrong')
    expect(messages[1].text()).toBe('short')
  })

  it('assigns the dirty meta flag if input value was changed', async () => {
    const schema = [
      {
        label: 'Email',
        model: 'email',
        component: FormTextWithMeta
      },
      {
        label: 'Password',
        model: 'password',
        component: FormTextWithMeta
      }
    ]

    const SchemaWithValidation = SchemaFormFactory([veeValidatePlugin()])
    const wrapper = mount({
      template: `
        <SchemaWithValidation :schema="schema" />
      `,
      components: {
        SchemaWithValidation
      },
      setup () {
        const formData = ref({})
        useSchemaForm(formData)

        return {
          schema
        }
      }
    })

    await flushPromises()
    const input = wrapper.findComponent(FormTextWithMeta)
    await input.setValue('')
    await flushPromises()
    const dirtySpans = wrapper.findAll('.dirty')
    expect(dirtySpans[0].text()).toBe('true')
    expect(dirtySpans[1].text()).toBe('false')
  })

  it('assigns the touched meta flag using initial-touched attribute', async () => {
    const schema = [
      {
        label: 'Email',
        model: 'email',
        component: FormTextWithMeta
      },
      {
        label: 'Password',
        model: 'password',
        component: FormTextWithMeta
      }
    ]

    const touched = {
      email: true,
      password: false
    }

    const SchemaWithValidation = SchemaFormFactory([veeValidatePlugin()])

    const wrapper = mount({
      template: `
        <SchemaWithValidation :schema="schema" :initial-touched="touched" />
      `,
      components: {
        SchemaWithValidation
      },
      setup () {
        const formData = ref({})
        useSchemaForm(formData)

        return {
          schema,
          touched
        }
      }
    })

    await flushPromises()
    const touchedSpans = wrapper.findAll('.touched')
    expect(touchedSpans[0].text()).toBe('true')
    expect(touchedSpans[1].text()).toBe('false')
  })

  // #4
  it('renders global components', async () => {
    const schema = {
      firstName: {
        label: 'First Name',
        component: 'form-text',
        validations: yup.string().required(REQUIRED_MESSAGE)
      }
    }

    const SchemaWithValidation = SchemaFormFactory([veeValidatePlugin()])

    const wrapper = mount(
      {
        template: `
        <SchemaWithValidation :schema="schema" />
      `,
        components: {
          SchemaWithValidation
        },
        setup () {
          const formData = ref({})
          useSchemaForm(formData)
          return {
            schema
          }
        }
      },
      {
        global: {
          components: {
            FormText
          }
        }
      }
    )

    const input = wrapper.findComponent(FormText)
    input.setValue('')
    await flushPromises()
    expect(wrapper.find('.error').text()).toBe(REQUIRED_MESSAGE)
    input.setValue('hello')
    await flushPromises()
    expect(wrapper.find('.error').text()).toBe('')
  })

  it('validates nested fields with array schema', async () => {
    const SchemaWithValidation = SchemaFormFactory([veeValidatePlugin()])
    const schema = {
      user: {
        component: SchemaWithValidation,
        model: 'subform',
        schema: [
          {
            model: 'firstName',
            label: 'First Name',
            component: FormText,
            validations: yup.string().required(REQUIRED_MESSAGE)
          }
        ]
      }
    }

    const wrapper = mount({
      template: `
        <SchemaWithValidation :schema="schema" />
      `,
      components: {
        SchemaWithValidation
      },
      setup () {
        const formData = ref({})
        useSchemaForm(formData)

        return {
          schema
        }
      }
    })

    const input = wrapper.findComponent(FormText)
    input.setValue('')
    await flushPromises()
    expect(wrapper.find('.error').text()).toBe(REQUIRED_MESSAGE)
    input.setValue('hello')
    await flushPromises()
    expect(wrapper.find('.error').text()).toBe('')
  })

  it('validates nested fields with object schema', async () => {
    const SchemaWithValidation = SchemaFormFactory([veeValidatePlugin()])
    const schema = {
      user: {
        component: SchemaWithValidation,
        model: 'subform',
        schema: {
          firstName: {
            label: 'First Name',
            component: FormText,
            validations: yup.string().required(REQUIRED_MESSAGE)
          }
        }
      }
    }

    const wrapper = mount({
      template: `
        <SchemaWithValidation :schema="schema" />
      `,
      components: {
        SchemaWithValidation
      },
      setup () {
        const formData = ref({})
        useSchemaForm(formData)

        return {
          schema
        }
      }
    })

    const input = wrapper.findComponent(FormText)
    input.setValue('')
    await flushPromises()
    expect(wrapper.find('.error').text()).toBe(REQUIRED_MESSAGE)
    input.setValue('hello')
    await flushPromises()
    expect(wrapper.find('.error').text()).toBe('')
  })

  it('preserves reactivity in computed schemas', async () => {
    const toggle = ref('A')
    const SchemaWithValidation = SchemaFormFactory([veeValidatePlugin()])
    const schema = computed(() => {
      if (toggle.value === 'A') {
        return {
          firstName: {
            label: 'First Name',
            component: FormText,
            validations: yup.string().required('NAME')
          }
        }
      }

      return {
        email: {
          label: 'Email',
          component: FormText,
          validations: yup.string().required('EMAIL')
        }
      }
    })

    const wrapper = mount({
      template: `
        <SchemaWithValidation :schema="schema" />
      `,
      components: {
        SchemaWithValidation
      },
      setup () {
        const formData = ref({})
        useSchemaForm(formData)

        return {
          schema
        }
      }
    })

    let input = wrapper.findComponent(FormText)
    input.setValue('')
    await flushPromises()
    expect(wrapper.find('.error').text()).toBe('NAME')

    toggle.value = 'B'
    await flushPromises()
    input = wrapper.findComponent(FormText)
    input.setValue('')
    await flushPromises()
    expect(wrapper.find('.error').text()).toBe('EMAIL')
  })

  it('exposes form-level validation state on afterForm slot', async () => {
    const schema = {
      firstName: {
        label: 'First Name',
        component: FormText,
        validations: yup.string().required(REQUIRED_MESSAGE)
      }
    }

    const SchemaWithValidation = SchemaFormFactory([veeValidatePlugin()])

    const wrapper = mount({
      template: `
        <SchemaWithValidation :schema="schema">
        
          <template #afterForm="{ validation }">
            <span id="error">{{ validation.errors.firstName }}</span>
            <button :disabled="!validation.meta.valid"></button>
          </template>
        </SchemaWithValidation>
      `,
      components: {
        SchemaWithValidation
      },
      setup () {
        const formData = ref({})
        useSchemaForm(formData)

        return {
          schema
        }
      }
    })

    await flushPromises()
    const input = wrapper.findComponent(FormText)
    const button = wrapper.find('button')
    expect(button.element.disabled).toBe(true)
    await input.setValue('')
    await flushPromises()
    expect(wrapper.find('#error').text()).toBe(REQUIRED_MESSAGE)
    await input.setValue('hi')
    await flushPromises()
    expect(button.element.disabled).toBe(false)
    expect(wrapper.find('#error').text()).toBe('')
  })

  it('exposes form-level validation state on beforeForm slot', async () => {
    const schema = {
      firstName: {
        label: 'First Name',
        component: FormText,
        validations: yup.string().required(REQUIRED_MESSAGE)
      }
    }

    const SchemaWithValidation = SchemaFormFactory([veeValidatePlugin()])

    const wrapper = mount({
      template: `
        <SchemaWithValidation :schema="schema">
        
          <template #beforeForm="{ validation }">
            <span id="error">{{ validation.errors.firstName }}</span>
            <button :disabled="!validation.meta.valid"></button>
          </template>
        </SchemaWithValidation>
      `,
      components: {
        SchemaWithValidation
      },
      setup () {
        const formData = ref({})
        useSchemaForm(formData)

        return {
          schema
        }
      }
    })

    await flushPromises()
    const input = wrapper.findComponent(FormText)
    const button = wrapper.find('button')
    expect(button.element.disabled).toBe(true)
    await input.setValue('')
    await flushPromises()
    expect(wrapper.find('#error').text()).toBe(REQUIRED_MESSAGE)
    await input.setValue('hi')
    await flushPromises()
    expect(button.element.disabled).toBe(false)
    expect(wrapper.find('#error').text()).toBe('')
  })

  it('validates fields with array in nested array schema', async () => {
    const SchemaWithValidation = SchemaFormFactory([veeValidatePlugin()])
    const schema = {
      user: {
        component: SchemaWithValidation,
        model: 'subform',
        schema: [
          {
            model: 'email',
            label: 'Email',
            component: FormText,
            validations: yup.string().required(REQUIRED_MESSAGE)
          }, [
            {
              model: 'firstName',
              label: 'First Name',
              component: FormText,
              validations: yup.string().required(REQUIRED_MESSAGE)
            }, {
              model: 'lastName',
              label: 'Last Name',
              component: FormText,
              validations: yup.string().required(REQUIRED_MESSAGE)
            }
          ]
        ]
      }
    }

    const wrapper = mount({
      template: `
        <SchemaWithValidation :schema="schema" />
      `,
      components: {
        SchemaWithValidation
      },
      setup () {
        const formData = ref({})
        useSchemaForm(formData)

        return {
          schema
        }
      }
    })

    const inputs = wrapper.findAllComponents(FormText)
    const errors = wrapper.findAll('.error')

    inputs[0].setValue('')
    await flushPromises()
    expect(errors[0].text()).toBe(REQUIRED_MESSAGE)

    inputs[0].setValue('test@gmail.com')
    await flushPromises()
    expect(errors[0].text()).toBe('')

    inputs[1].setValue('')
    await flushPromises()
    expect(errors[1].text()).toBe(REQUIRED_MESSAGE)

    inputs[1].setValue('Tom')
    await flushPromises()
    expect(errors[1].text()).toBe('')

    inputs[2].setValue('')
    await flushPromises()
    expect(errors[2].text()).toBe(REQUIRED_MESSAGE)

    inputs[2].setValue('Cruise')
    await flushPromises()
    expect(errors[2].text()).toBe('')
  })

  it('handles computed schema', async () => {
    const schema = [
      {
        label: 'Email',
        model: 'email',
        component: FormText
      },
      {
        label: 'Password',
        model: 'password',
        component: FormText
      }
    ]

    const SchemaWithValidation = SchemaFormFactory([veeValidatePlugin()])

    const onSubmit = jest.fn()
    const isRequired = ref(true)

    const wrapper = mount({
      template: `
        <SchemaWithValidation :schema="schema" :validation-schema="validationSchema" @submit.prevent="onSubmit" />
      `,
      components: {
        SchemaWithValidation
      },
      setup () {
        const formData = ref({})
        useSchemaForm(formData)
        const validationSchema = computed(() => {
          const email = yup.string().email(EMAIL_MESSAGE)
          const password = yup.string()

          return yup.object({
            email: isRequired.value ? email.required() : email,
            password: isRequired.value ? password.required() : password
          })
        })

        return {
          schema,
          formData,
          validationSchema,
          onSubmit
        }
      }
    })

    const form = wrapper.find('form')

    form.trigger('submit')
    await flushPromises()
    expect(onSubmit).toHaveBeenCalledTimes(0)
    expect(wrapper.findAll('.error')).toHaveLength(2)

    isRequired.value = false
    await flushPromises()

    form.trigger('submit')
    await flushPromises()
    expect(onSubmit).toHaveBeenCalledTimes(1)
  })

  it('renders label in error messages', async () => {
    // setup global rules and error message generator
    defineRule('required', (value) => !!value)
    configure({
      generateMessage: (ctx) => `${ctx.field} is REQUIRED`
    })

    const schema = {
      firstName: {
        label: 'First Name',
        component: FormText,
        validations: 'required'
      }
    }

    const SchemaWithValidation = SchemaFormFactory([veeValidatePlugin()])

    const wrapper = mount({
      template: `
        <SchemaWithValidation :schema="schema" />
      `,
      components: {
        SchemaWithValidation
      },
      setup () {
        const formData = ref({})
        useSchemaForm(formData)

        return {
          schema
        }
      }
    })

    const input = wrapper.findComponent(FormText)
    input.setValue('')
    await flushPromises()
    expect(wrapper.find('span').text()).toMatch(/First Name/)
    input.setValue('hello')
    await flushPromises()
    expect(wrapper.find('span').text()).toBe('')
  })

  // #253
  it('renders local form factory components', async () => {
    // setup global rules and error message generator
    defineRule('required', (value) => !!value)
    configure({
      generateMessage: (ctx) => `${ctx.field} is REQUIRED`
    })

    const schema = {
      firstName: {
        label: 'First Name',
        component: 'FormText',
        validations: 'required'
      }
    }

    const SchemaWithValidation = SchemaFormFactory([veeValidatePlugin()], {
      FormText
    })

    const wrapper = mount({
      template: `
        <SchemaWithValidation :schema="schema" />
      `,
      components: {
        SchemaWithValidation
      },
      setup () {
        const formData = ref({})
        useSchemaForm(formData)

        return {
          schema
        }
      }
    })

    const input = wrapper.findComponent(FormText)
    expect(input.exists()).toBe(true)
  })
})
