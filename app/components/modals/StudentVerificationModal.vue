<script setup lang="ts">
interface Props {
  productName: string
  productPrice: number
  checkoutUrl: string
  verificationType: 'student' | 'senior'
}

const props = defineProps<Props>()

const emit = defineEmits<{
  close: []
}>()

const personnummer = ref('')
const file = ref<File | null>(null)
const fileName = ref('')
const isSubmitting = ref(false)
const error = ref<string | null>(null)
const isDragging = ref(false)

const verificationLabel = computed(() =>
  props.verificationType === 'student' ? 'Studieintyg' : 'Pensionärsintyg'
)

const titleLabel = computed(() =>
  props.verificationType === 'student' ? 'Verifiera studentstatus' : 'Verifiera seniorstatus'
)

const descriptionLabel = computed(() =>
  props.verificationType === 'student'
    ? 'Ladda upp ditt studieintyg eller CSN-intyg för att få studentrabatt.'
    : 'Ladda upp ett intyg som visar att du är 65+ för att få seniorrabatt.'
)

// Handle file selection
const handleFileSelect = (e: Event) => {
  const input = e.target as HTMLInputElement
  if (input.files && input.files[0]) {
    setFile(input.files[0])
  }
}

// Handle drag and drop
const handleDrop = (e: DragEvent) => {
  isDragging.value = false
  if (e.dataTransfer?.files && e.dataTransfer.files[0]) {
    setFile(e.dataTransfer.files[0])
  }
}

const setFile = (f: File) => {
  // Validate file type
  const allowedTypes = ['image/jpeg', 'image/png', 'image/webp', 'application/pdf']
  if (!allowedTypes.includes(f.type)) {
    error.value = 'Endast bilder (JPG, PNG, WebP) eller PDF är tillåtna.'
    return
  }

  // Validate file size (max 10MB)
  if (f.size > 10 * 1024 * 1024) {
    error.value = 'Filen får max vara 10 MB.'
    return
  }

  file.value = f
  fileName.value = f.name
  error.value = null
}

// Convert file to base64
const fileToBase64 = (f: File): Promise<string> => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader()
    reader.readAsDataURL(f)
    reader.onload = () => resolve(reader.result as string)
    reader.onerror = (err) => reject(err)
  })
}

// Validate personnummer format (YYYYMMDD-XXXX or YYMMDD-XXXX)
const isValidPersonnummer = (pnr: string): boolean => {
  const cleaned = pnr.replace(/\s/g, '')
  // Accept both YYYYMMDD-XXXX and YYMMDD-XXXX formats
  return /^(\d{6}|\d{8})[-]?\d{4}$/.test(cleaned)
}

// Normalize personnummer to 12 digits
const normalizePersonnummer = (pnr: string): string => {
  const cleaned = pnr.replace(/[\s-]/g, '')
  if (cleaned.length === 10) {
    const year = parseInt(cleaned.substring(0, 2))
    const century = year > 30 ? '19' : '20'
    return century + cleaned
  }
  return cleaned
}

// Save verification to API
const saveVerification = async () => {
  try {
    const normalizedPnr = normalizePersonnummer(personnummer.value)

    await fetch('https://api.coregym.club/verification', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        type: props.verificationType, // 'student' or 'senior'
        personnummer: normalizedPnr
      })
    })
  } catch (err) {
    console.error('Failed to save verification:', err)
    // Continue anyway - checkout is more important
  }
}

// Handle form submission
const handleSubmit = async () => {
  error.value = null

  // Validate personnummer
  if (!personnummer.value.trim()) {
    error.value = 'Ange ditt personnummer.'
    return
  }

  if (!isValidPersonnummer(personnummer.value)) {
    error.value = 'Ange ett giltigt personnummer (ÅÅMMDD-XXXX eller ÅÅÅÅMMDD-XXXX).'
    return
  }

  // Validate file
  if (!file.value) {
    error.value = `Ladda upp ditt ${verificationLabel.value.toLowerCase()}.`
    return
  }

  isSubmitting.value = true

  try {
    // Convert file to base64
    const fileBase64 = await fileToBase64(file.value)

    // Build email HTML
    const timestamp = new Date().toLocaleString('sv-SE', { timeZone: 'Europe/Stockholm' })
    const typeLabel = props.verificationType === 'student' ? '🎓 Studentverifiering' : '👴 Seniorverifiering'

    const html = `
      <h2>${typeLabel}</h2>
      <p><strong>Tid:</strong> ${timestamp}</p>
      <hr>
      <p><strong>Personnummer:</strong> ${personnummer.value}</p>
      <p><strong>Medlemskap:</strong> ${props.productName}</p>
      <p><strong>Pris:</strong> ${props.productPrice} kr/mån</p>
      <hr>
      <p><strong>Bifogat intyg:</strong> ${fileName.value}</p>
      <p><em>Se bilaga nedan.</em></p>
      <hr>
      <p style="color: #666; font-size: 12px;">Skickat via coregymclub.se - Bli medlem</p>
    `

    // Send email with attachment
    const response = await fetch('https://student-email.coregymclub.se/send', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        to: 'info@coregym.club',
        subject: `${typeLabel}: ${personnummer.value}`,
        html,
        attachments: [
          {
            filename: fileName.value,
            content: fileBase64.split(',')[1], // Remove data:... prefix
            encoding: 'base64',
          }
        ]
      }),
    })

    if (!response.ok) {
      throw new Error('Kunde inte skicka verifieringen. Försök igen.')
    }

    // Spara verifiering till API
    await saveVerification()

    // Redirect to checkout
    window.location.href = props.checkoutUrl

  } catch (err) {
    error.value = err instanceof Error ? err.message : 'Något gick fel. Försök igen.'
    isSubmitting.value = false
  }
}
</script>

<template>
  <ModalsResponsiveModal
    :open="true"
    :title="titleLabel"
    :subtitle="descriptionLabel"
    @close="emit('close')"
  >
    <!-- Form -->
    <form @submit.prevent="handleSubmit" class="px-6 pb-6 space-y-5">
          <!-- Personnummer -->
          <div>
            <label class="block text-sm font-bold text-on-surface mb-2 uppercase tracking-wide">
              Personnummer <span class="text-brand">*</span>
            </label>
            <input
              v-model="personnummer"
              type="text"
              placeholder="ÅÅÅÅMMDD-XXXX"
              class="w-full px-4 py-3 rounded-xl border border-outline bg-surface-container focus:border-on-surface focus:ring-1 focus:ring-on-surface transition-colors text-on-surface placeholder:text-on-surface-dim/50"
              autocomplete="off"
            />
          </div>

          <!-- File Upload -->
          <div>
            <label class="block text-sm font-bold text-on-surface mb-2 uppercase tracking-wide">
              {{ verificationLabel }} <span class="text-brand">*</span>
            </label>
            <div
              class="relative border-2 border-dashed rounded-xl p-6 text-center transition-colors cursor-pointer"
              :class="[
                isDragging ? 'border-brand bg-brand/5' : 'border-outline hover:border-on-surface-dim',
                file ? 'bg-surface-container' : ''
              ]"
              @dragover.prevent="isDragging = true"
              @dragleave.prevent="isDragging = false"
              @drop.prevent="handleDrop"
              @click="($refs.fileInput as HTMLInputElement).click()"
            >
              <input
                ref="fileInput"
                type="file"
                accept="image/jpeg,image/png,image/webp,application/pdf"
                class="hidden"
                @change="handleFileSelect"
              />

              <div v-if="file" class="flex items-center justify-center gap-3">
                <svg class="w-8 h-8 text-brand" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                <div class="text-left">
                  <p class="font-bold text-on-surface truncate max-w-[200px]">{{ fileName }}</p>
                  <p class="text-sm text-on-surface-dim">Klicka för att byta fil</p>
                </div>
              </div>

              <div v-else>
                <svg class="w-10 h-10 mx-auto mb-3 text-on-surface-dim" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
                </svg>
                <p class="font-bold text-on-surface mb-1">Dra och släpp fil här</p>
                <p class="text-sm text-on-surface-dim">eller klicka för att välja</p>
                <p class="text-xs text-on-surface-dim mt-2">JPG, PNG, WebP eller PDF (max 10 MB)</p>
              </div>
            </div>
          </div>

          <!-- Error -->
          <div v-if="error" class="p-4 bg-brand/10 border border-brand/20 rounded-xl">
            <p class="text-sm text-brand font-medium">{{ error }}</p>
          </div>

          <!-- Info box -->
          <div class="p-4 bg-surface-container rounded-xl">
            <p class="text-sm text-on-surface-dim">
              <strong class="text-on-surface">Vad händer sen?</strong><br>
              Vi granskar ditt intyg och aktiverar rabatten på ditt konto. Du kan slutföra köpet direkt.
            </p>
          </div>

          <!-- Submit -->
          <button
            type="submit"
            :disabled="isSubmitting"
            class="w-full btn bg-on-surface text-white hover:bg-black py-4 text-lg rounded-full font-bold disabled:opacity-50 disabled:cursor-not-allowed transition-all"
          >
            <span v-if="isSubmitting" class="flex items-center justify-center gap-2">
              <svg class="animate-spin h-5 w-5" fill="none" viewBox="0 0 24 24">
                <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4" />
                <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
              </svg>
              Skickar...
            </span>
            <span v-else>Fortsätt till betalning</span>
          </button>
        </form>
  </ModalsResponsiveModal>
</template>
