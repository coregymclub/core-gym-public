<script setup lang="ts">
import type { FieldConfig } from '~/composables/useFormValidation'

type FormVariant = 'contact' | 'pt' | 'grouptraining' | 'custom'

interface Props {
  variant?: FormVariant
  fields?: FieldConfig[]
  submitLabel?: string
  title?: string
  description?: string
  successMessage?: string
  endpoint?: string
}

const props = withDefaults(defineProps<Props>(), {
  variant: 'contact',
  submitLabel: 'Skicka',
  successMessage: 'Tack! Vi återkommer så snart vi kan.',
})

const emit = defineEmits<{
  submit: [data: Record<string, string>]
}>()

// Form state
const formData = ref<Record<string, string>>({})
const isSubmitting = ref(false)
const isSuccess = ref(false)
const submitError = ref<string | null>(null)

// Validation
const { validate, validateSingleField, markTouched, clearErrors, getError } = useFormValidation()

// Preset field configurations
const presetFields: Record<FormVariant, FieldConfig[]> = {
  contact: [
    {
      name: 'name',
      label: 'Namn',
      type: 'text',
      placeholder: 'Ditt namn',
      required: true,
      autocomplete: 'name',
    },
    {
      name: 'email',
      label: 'E-post',
      type: 'email',
      placeholder: 'din@epost.se',
      required: true,
      autocomplete: 'email',
      rules: [{ type: 'email' }],
    },
    {
      name: 'phone',
      label: 'Telefon',
      type: 'tel',
      placeholder: '07X XXX XX XX',
      autocomplete: 'tel',
      rules: [{ type: 'phone' }],
    },
    {
      name: 'message',
      label: 'Meddelande',
      type: 'textarea',
      placeholder: 'Skriv ditt meddelande här...',
      required: true,
      rows: 4,
      maxlength: 1000,
    },
  ],
  pt: [
    {
      name: 'name',
      label: 'Namn',
      type: 'text',
      placeholder: 'Ditt namn',
      required: true,
      autocomplete: 'name',
      halfWidth: true,
    },
    {
      name: 'email',
      label: 'E-post',
      type: 'email',
      placeholder: 'din@epost.se',
      required: true,
      autocomplete: 'email',
      rules: [{ type: 'email' }],
      halfWidth: true,
    },
    {
      name: 'phone',
      label: 'Telefon',
      type: 'tel',
      placeholder: '07X XXX XX XX',
      required: true,
      autocomplete: 'tel',
      rules: [{ type: 'phone' }],
      halfWidth: true,
    },
    {
      name: 'gym',
      label: 'Välj anläggning',
      type: 'select',
      required: true,
      halfWidth: true,
      options: [
        { value: 'vegastaden', label: 'Vegastaden' },
        { value: 'tungelsta', label: 'Tungelsta' },
        { value: 'vasterhaninge', label: 'Västerhaninge' },
      ],
    },
    {
      name: 'goal',
      label: 'Vad är ditt mål?',
      type: 'select',
      required: true,
      options: [
        { value: 'strength', label: 'Bygga styrka' },
        { value: 'weight-loss', label: 'Gå ner i vikt' },
        { value: 'endurance', label: 'Förbättra kondition' },
        { value: 'flexibility', label: 'Ökad rörlighet' },
        { value: 'general', label: 'Allmän hälsa' },
        { value: 'other', label: 'Annat' },
      ],
    },
    {
      name: 'experience',
      label: 'Träningserfarenhet',
      type: 'select',
      options: [
        { value: 'beginner', label: 'Nybörjare' },
        { value: 'intermediate', label: 'Tränat ett tag' },
        { value: 'advanced', label: 'Erfaren' },
      ],
    },
    {
      name: 'message',
      label: 'Berätta mer (valfritt)',
      type: 'textarea',
      placeholder: 'Har du några specifika önskemål eller frågor?',
      rows: 3,
      maxlength: 500,
    },
  ],
  grouptraining: [
    {
      name: 'name',
      label: 'Namn',
      type: 'text',
      placeholder: 'Ditt namn',
      required: true,
      autocomplete: 'name',
      halfWidth: true,
    },
    {
      name: 'email',
      label: 'E-post',
      type: 'email',
      placeholder: 'din@epost.se',
      required: true,
      autocomplete: 'email',
      rules: [{ type: 'email' }],
      halfWidth: true,
    },
    {
      name: 'phone',
      label: 'Telefon',
      type: 'tel',
      placeholder: '07X XXX XX XX',
      autocomplete: 'tel',
      rules: [{ type: 'phone' }],
      halfWidth: true,
    },
    {
      name: 'gym',
      label: 'Välj anläggning',
      type: 'select',
      required: true,
      halfWidth: true,
      options: [
        { value: 'vegastaden', label: 'Vegastaden' },
        { value: 'tungelsta', label: 'Tungelsta' },
        { value: 'vasterhaninge', label: 'Västerhaninge' },
      ],
    },
    {
      name: 'classType',
      label: 'Typ av pass',
      type: 'select',
      required: true,
      halfWidth: true,
      options: [
        { value: 'bodypump', label: 'BodyPump' },
        { value: 'rpm', label: 'RPM / Spinning' },
        { value: 'bodycombat', label: 'BodyCombat' },
        { value: 'yoga', label: 'Yoga' },
        { value: 'grit', label: 'GRIT' },
        { value: 'other', label: 'Annat' },
      ],
    },
    {
      name: 'preferredTime',
      label: 'Föredragen tid',
      type: 'select',
      halfWidth: true,
      options: [
        { value: 'morning', label: 'Morgon (06-10)' },
        { value: 'midday', label: 'Mitt på dagen (10-14)' },
        { value: 'afternoon', label: 'Eftermiddag (14-18)' },
        { value: 'evening', label: 'Kväll (18-21)' },
        { value: 'flexible', label: 'Flexibel' },
      ],
    },
    {
      name: 'message',
      label: 'Övriga frågor (valfritt)',
      type: 'textarea',
      placeholder: 'Något du undrar över?',
      rows: 3,
      maxlength: 500,
    },
  ],
  custom: [],
}

// Get active fields based on variant or custom fields
const activeFields = computed(() => {
  if (props.variant === 'custom' && props.fields) {
    return props.fields
  }
  return presetFields[props.variant] || presetFields.contact
})

// Initialize form data
const initFormData = () => {
  const data: Record<string, string> = {}
  for (const field of activeFields.value) {
    data[field.name] = ''
  }
  formData.value = data
}

// Handle field blur
const handleBlur = (field: FieldConfig) => {
  markTouched(field.name)
  validateSingleField(field.name, formData.value[field.name] || '', field)
}

// Variant labels for email subjects
const variantLabels: Record<FormVariant, string> = {
  contact: '💬 Kontaktformulär',
  pt: '🏋️ PT-förfrågan',
  grouptraining: '🎯 Gruppträning',
  custom: '📧 Formulär',
}

// Build email HTML from form data
const buildEmailHtml = () => {
  const timestamp = new Date().toLocaleString('sv-SE', { timeZone: 'Europe/Stockholm' })
  const variantLabel = variantLabels[props.variant] || 'Formulär'

  let html = `<h2>${variantLabel}</h2>`
  html += `<p><strong>Tid:</strong> ${timestamp}</p><hr>`

  for (const field of activeFields.value) {
    const value = formData.value[field.name]
    if (value) {
      // Get display label for select options
      let displayValue = value
      if (field.type === 'select' && field.options) {
        const option = field.options.find(o => o.value === value)
        displayValue = option?.label || value
      }
      html += `<p><strong>${field.label}:</strong> ${displayValue}</p>`
    }
  }

  html += `<hr><p style="color: #666; font-size: 12px;">Skickat via coregymclub.se</p>`
  return html
}

// Handle form submission
const handleSubmit = async () => {
  // Validate all fields
  const isValid = validate(formData.value, activeFields.value)

  if (!isValid) {
    // Mark all fields as touched to show errors
    for (const field of activeFields.value) {
      markTouched(field.name)
    }
    return
  }

  isSubmitting.value = true
  submitError.value = null

  try {
    // Emit submit event for parent handling
    emit('submit', { ...formData.value })

    // Send email via Core Gym email endpoint
    const variantLabel = variantLabels[props.variant] || 'Formulär'
    const emailHtml = buildEmailHtml()

    const response = await fetch('https://student-email.coregymclub.se/send', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        to: 'info@coregym.club',
        subject: `${variantLabel}: ${formData.value.name || 'Anonym'}`,
        html: emailHtml,
        replyTo: formData.value.email || undefined,
      }),
    })

    if (!response.ok) {
      throw new Error('Något gick fel. Försök igen.')
    }

    isSuccess.value = true
    initFormData()
    clearErrors()
  } catch (error) {
    submitError.value = error instanceof Error ? error.message : 'Något gick fel. Försök igen.'
  } finally {
    isSubmitting.value = false
  }
}

// Reset form
const resetForm = () => {
  isSuccess.value = false
  submitError.value = null
  initFormData()
  clearErrors()
}

// Initialize on mount
onMounted(() => {
  initFormData()
})

// Re-initialize when fields change
watch(activeFields, () => {
  initFormData()
}, { deep: true })
</script>

<template>
  <div class="core-form">
    <!-- Header -->
    <div v-if="title || description" class="mb-8">
      <h3 v-if="title" class="text-title mb-3">{{ title }}</h3>
      <p v-if="description" class="text-body text-on-surface-dim">{{ description }}</p>
    </div>

    <!-- Success State -->
    <div v-if="isSuccess" class="text-center py-12">
      <div class="w-16 h-16 bg-surface-dim rounded-full flex items-center justify-center mx-auto mb-6 border border-outline">
        <svg class="w-8 h-8 text-on-surface" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7" />
        </svg>
      </div>
      <p class="text-body text-on-surface mb-6 font-medium">{{ successMessage }}</p>
      <button
        type="button"
        class="text-on-surface-dim hover:text-on-surface font-medium transition-colors underline decoration-outline hover:decoration-on-surface underline-offset-4"
        @click="resetForm"
      >
        Skicka nytt meddelande
      </button>
    </div>

    <!-- Form -->
    <form v-else @submit.prevent="handleSubmit" class="space-y-6">
      <div class="grid grid-cols-1 sm:grid-cols-2 gap-x-4 gap-y-6">
        <template v-for="field in activeFields" :key="field.name">
          <!-- Text/Email/Tel/Date/Time/Number inputs -->
          <FormsFormInput
            v-if="['text', 'email', 'tel', 'date', 'time', 'number'].includes(field.type)"
            v-model="formData[field.name]"
            :type="field.type as 'text' | 'email' | 'tel' | 'date' | 'time' | 'number'"
            :label="field.label"
            :placeholder="field.placeholder"
            :required="field.required"
            :error="getError(field.name)"
            :autocomplete="field.autocomplete"
            :class="{ 'sm:col-span-2': !field.halfWidth }"
            @blur="handleBlur(field)"
          />

          <!-- Textarea -->
          <FormsFormTextarea
            v-else-if="field.type === 'textarea'"
            v-model="formData[field.name]"
            :label="field.label"
            :placeholder="field.placeholder"
            :required="field.required"
            :error="getError(field.name)"
            :rows="field.rows"
            :maxlength="field.maxlength"
            class="sm:col-span-2"
            @blur="handleBlur(field)"
          />

          <!-- Select -->
          <FormsFormSelect
            v-else-if="field.type === 'select'"
            v-model="formData[field.name]"
            :options="field.options || []"
            :label="field.label"
            :placeholder="field.placeholder"
            :required="field.required"
            :error="getError(field.name)"
            :class="{ 'sm:col-span-2': !field.halfWidth }"
            @blur="handleBlur(field)"
          />
        </template>
      </div>

      <!-- Error message -->
      <div v-if="submitError" class="p-4 bg-surface border border-brand/20 rounded-xl">
        <p class="text-label text-brand">{{ submitError }}</p>
      </div>

      <!-- Submit button -->
      <button
        type="submit"
        :disabled="isSubmitting"
        class="w-full sm:w-auto btn-primary disabled:opacity-50 disabled:cursor-not-allowed"
      >
        <span v-if="isSubmitting" class="flex items-center justify-center gap-2">
          <svg class="animate-spin h-5 w-5" fill="none" viewBox="0 0 24 24">
            <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4" />
            <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
          </svg>
          Skickar...
        </span>
        <span v-else>{{ submitLabel }}</span>
      </button>
    </form>
  </div>
</template>

<style scoped>
.core-form {
  @apply w-full;
}
</style>
