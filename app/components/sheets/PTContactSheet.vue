<script setup lang="ts">
import type { Trainer } from '~/composables/useSheets'
import type { FieldConfig } from '~/composables/useFormValidation'

const { ptSheet, closePTSheet } = useSheets()

// Form state
const formData = ref<Record<string, string>>({})
const isSubmitting = ref(false)
const isSuccess = ref(false)

const { validate, validateSingleField, markTouched, clearErrors, getError } = useFormValidation()

// Dynamic title based on trainer
const sheetTitle = computed(() => {
  if (ptSheet.value.trainer) {
    return `KONTAKTA ${ptSheet.value.trainer.name.toUpperCase()}`
  }
  return 'BOKA PERSONLIG TRÄNING'
})

const sheetSubtitle = computed(() => {
  if (ptSheet.value.trainer?.title) {
    return ptSheet.value.trainer.title
  }
  return 'Fyll i formuläret så kontaktar vi dig för ett kostnadsfritt samtal.'
})

// Fetch trainers from API (lazy to avoid blocking SSR on every page)
const { data: trainers } = useLazyFetch<Trainer[]>('/api/trainers')

// Form fields - trainer field is shown only when no trainer is preselected
const fields = computed<FieldConfig[]>(() => {
  const baseFields: FieldConfig[] = [
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
      name: 'email',
      label: 'E-post',
      type: 'email',
      placeholder: 'din@epost.se',
      required: true,
      autocomplete: 'email',
      rules: [{ type: 'email' }],
    },
  ]

  // Add trainer selector if no trainer is preselected
  if (!ptSheet.value.trainer) {
    baseFields.push({
      name: 'trainer',
      label: 'Välj tränare (valfritt)',
      type: 'select',
      placeholder: 'Ingen preferens',
      options: [
        { value: '', label: 'Ingen preferens' },
        ...(trainers.value || []).map(t => ({ value: t.id, label: `${t.name} - ${t.shortName}` })),
      ],
    })
  }

  baseFields.push(
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
        { value: 'rehab', label: 'Rehabilitering' },
        { value: 'other', label: 'Annat' },
      ],
    },
    {
      name: 'message',
      label: 'Berätta mer (valfritt)',
      type: 'textarea',
      placeholder: 'Har du några specifika önskemål, skador att ta hänsyn till, eller frågor?',
      rows: 3,
      maxlength: 500,
    }
  )

  return baseFields
})

// Initialize form data when sheet opens
watch(() => ptSheet.value.isOpen, (isOpen) => {
  if (isOpen) {
    const data: Record<string, string> = {}
    for (const field of fields.value) {
      data[field.name] = ''
    }
    // Pre-fill trainer if one is selected
    if (ptSheet.value.trainer) {
      data.trainer = ptSheet.value.trainer.id
    }
    formData.value = data
    isSuccess.value = false
    clearErrors()
  }
}, { immediate: true })

const handleBlur = (field: FieldConfig) => {
  markTouched(field.name)
  validateSingleField(field.name, formData.value[field.name] || '', field)
}

const handleSubmit = async () => {
  const isValid = validate(formData.value, fields.value)

  if (!isValid) {
    for (const field of fields.value) {
      markTouched(field.name)
    }
    return
  }

  isSubmitting.value = true

  try {
    const trainerName = ptSheet.value.trainer?.name ||
      trainers.value?.find(t => t.id === formData.value.trainer)?.name ||
      'Ingen preferens'

    const goalLabels: Record<string, string> = {
      'strength': 'Bygga styrka',
      'weight-loss': 'Gå ner i vikt',
      'endurance': 'Förbättra kondition',
      'flexibility': 'Ökad rörlighet',
      'general': 'Allmän hälsa',
      'rehab': 'Rehabilitering',
      'other': 'Annat'
    }

    const timestamp = new Date().toLocaleString('sv-SE', { timeZone: 'Europe/Stockholm' })

    const emailHtml = `
      <h2>🏋️ Ny PT-förfrågan</h2>
      <p><strong>Tid:</strong> ${timestamp}</p>
      <hr>
      <p><strong>Namn:</strong> ${formData.value.name}</p>
      <p><strong>Telefon:</strong> ${formData.value.phone}</p>
      <p><strong>E-post:</strong> ${formData.value.email}</p>
      <p><strong>Tränare:</strong> ${trainerName}</p>
      <p><strong>Mål:</strong> ${goalLabels[formData.value.goal] || formData.value.goal}</p>
      ${formData.value.message ? `<hr><h3>Meddelande:</h3><p>${formData.value.message}</p>` : ''}
      <hr>
      <p style="color: #666; font-size: 12px;">Skickat via coregymclub.se PT-formulär</p>
    `

    const response = await fetch('https://student-email.coregymclub.se/send', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        to: 'info@coregym.club',
        subject: `🏋️ PT-förfrågan: ${formData.value.name} → ${trainerName}`,
        html: emailHtml,
        replyTo: formData.value.email
      })
    })

    if (!response.ok) {
      throw new Error('Kunde inte skicka')
    }

    isSuccess.value = true
  } catch (error) {
    console.error('Submit error:', error)
  } finally {
    isSubmitting.value = false
  }
}

const handleClose = () => {
  closePTSheet()
}

const handleNewMessage = () => {
  isSuccess.value = false
  const data: Record<string, string> = {}
  for (const field of fields.value) {
    data[field.name] = ''
  }
  formData.value = data
  clearErrors()
}
</script>

<template>
  <SheetsBottomSheet
    :open="ptSheet.isOpen"
    :title="sheetTitle"
    :subtitle="sheetSubtitle"
    max-width="lg"
    @close="handleClose"
  >
    <!-- Trainer card if preselected -->
    <div
      v-if="ptSheet.trainer && !isSuccess"
      class="flex items-center gap-4 p-4 bg-surface-dim rounded-xl mb-6"
    >
      <div
        class="w-14 h-14 rounded-full bg-surface-container flex-shrink-0 overflow-hidden"
      >
        <img
          v-if="ptSheet.trainer.imageUrl"
          :src="ptSheet.trainer.imageUrl"
          :alt="ptSheet.trainer.name"
          class="w-full h-full object-cover"
        />
        <div v-else class="w-full h-full flex items-center justify-center text-on-surface-dim">
          <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
          </svg>
        </div>
      </div>
      <div class="min-w-0">
        <p class="font-medium text-on-surface">{{ ptSheet.trainer.name }}</p>
        <p class="text-label text-on-surface-dim">{{ ptSheet.trainer.shortName }}</p>
      </div>
    </div>

    <!-- Success state -->
    <div v-if="isSuccess" class="text-center py-8">
      <div class="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
        <svg class="w-8 h-8 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7" />
        </svg>
      </div>
      <h3 class="text-title mb-2">Tack för din förfrågan!</h3>
      <p class="text-body text-on-surface-dim mb-6">
        {{ ptSheet.trainer ? `${ptSheet.trainer.name} återkommer` : 'Vi återkommer' }} till dig inom 24 timmar.
      </p>
      <div class="flex flex-col sm:flex-row gap-3 justify-center">
        <button
          type="button"
          class="btn-secondary px-6 py-3"
          @click="handleNewMessage"
        >
          Skicka ny förfrågan
        </button>
        <button
          type="button"
          class="btn-primary px-6 py-3"
          @click="handleClose"
        >
          Stäng
        </button>
      </div>
    </div>

    <!-- Form -->
    <form v-else @submit.prevent="handleSubmit" class="space-y-5">
      <div class="grid grid-cols-1 sm:grid-cols-2 gap-x-4 gap-y-5">
        <template v-for="field in fields" :key="field.name">
          <FormsFormInput
            v-if="['text', 'email', 'tel'].includes(field.type)"
            v-model="formData[field.name]"
            :type="field.type as 'text' | 'email' | 'tel'"
            :label="field.label"
            :placeholder="field.placeholder"
            :required="field.required"
            :error="getError(field.name)"
            :autocomplete="field.autocomplete"
            :class="{ 'sm:col-span-2': !field.halfWidth }"
            @blur="handleBlur(field)"
          />

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

      <button
        type="submit"
        :disabled="isSubmitting"
        class="w-full btn-primary py-4 disabled:opacity-50 disabled:cursor-not-allowed"
      >
        <span v-if="isSubmitting" class="flex items-center justify-center gap-2">
          <svg class="animate-spin h-5 w-5" fill="none" viewBox="0 0 24 24">
            <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4" />
            <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
          </svg>
          Skickar...
        </span>
        <span v-else>Skicka förfrågan</span>
      </button>

      <p class="text-label text-on-surface-dim text-center">
        Genom att skicka godkänner du att vi kontaktar dig.
      </p>
    </form>
  </SheetsBottomSheet>
</template>
