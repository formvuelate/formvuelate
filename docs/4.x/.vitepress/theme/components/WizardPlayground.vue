<script setup>
// SchemaWizard demo: an array of step schemas + a `step` index. Back/Next move
// between steps; the final step shows Submit. Buttons live in the afterForm slot
// so they render inside the wizard's <form>.
import { ref } from 'vue'
import { SchemaWizard, useSchemaForm } from 'formvuelate'

const step = ref(0)
const userData = ref({})
useSchemaForm(userData)

const wizardSchema = [
  // Step 1 — name
  {
    firstName: { component: 'FormText', label: 'First Name' },
    lastName: { component: 'FormText', label: 'Last Name' }
  },
  // Step 2 — contact
  {
    email: { component: 'FormText', label: 'Email', config: { type: 'email' } },
    isVueFan: { component: 'FormCheckbox', label: 'Are you a Vue fan?' }
  }
]

const lastStep = wizardSchema.length - 1
const next = () => { if (step.value < lastStep) step.value++ }
const prev = () => { if (step.value > 0) step.value-- }
const onSubmit = () => window.alert('Form submitted')
</script>

<template>
  <div class="fvl-demo">
    <p class="fvl-demo__heading">Step {{ step + 1 }} of {{ wizardSchema.length }}</p>
    <SchemaWizard :schema="wizardSchema" :step="step" @submit="onSubmit">
      <template #afterForm>
        <div class="fvl-wizard-nav">
          <BaseButton v-if="step > 0" type="button" @click="prev">Back</BaseButton>
          <BaseButton v-if="step < lastStep" type="button" @click="next">Next</BaseButton>
          <BaseButton v-else type="submit">Submit</BaseButton>
        </div>
      </template>
    </SchemaWizard>
    <pre class="fvl-demo__model">{{ userData }}</pre>
  </div>
</template>
