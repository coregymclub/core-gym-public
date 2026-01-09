<script setup lang="ts">
/**
 * BankID Callback Page
 * Reads flow state from sessionStorage (set before redirect to BankID)
 */

const route = useRoute()

// State
const status = ref<'syncing' | 'ready' | 'submitting' | 'success' | 'error'>('syncing')
const errorMessage = ref('')
const user = ref<{ id: number; firstname: string; lastname: string; personnummer?: string } | null>(null)
const sessionToken = ref('')

// Flow state (loaded from sessionStorage)
const flowState = ref<any>(null)

// Helper to add session token to checkout URL
const addSessionToUrl = (url: string): string => {
  if (!sessionToken.value) return url
  // Add session to checkout URLs (both old zoezi.se and new checkout.coregym.club)
  if (!url.includes('zoezi.se') && !url.includes('checkout.coregym.club')) return url
  const separator = url.includes('?') ? '&' : '?'
  return `${url}${separator}zs=${sessionToken.value}`
}

// Student/Senior verification state
const file = ref<File | null>(null)
const fileName = ref('')
const isDragging = ref(false)
const uploadError = ref<string | null>(null)
const fileInputRef = ref<HTMLInputElement | null>(null)

// Sambo verification state
const samboPersonnummer = ref('')
const samboError = ref<string | null>(null)

// Click file input
const triggerFileInput = () => {
  fileInputRef.value?.click()
}

// Sync session on mount
onMounted(async () => {
  const token = route.query.zs as string
  const firstName = route.query.fn as string
  const lastName = route.query.ln as string
  const userId = route.query.uid as string

  if (!token) {
    status.value = 'error'
    errorMessage.value = 'Ingen session hittades.'
    return
  }

  // Store session token for later use (and in localStorage for persistence)
  sessionToken.value = token
  localStorage.setItem('zoeziSession', JSON.stringify({
    token,
    user: { id: parseInt(userId) || 0, firstname: firstName || '', lastname: lastName || '' }
  }))

  // Load flow state from sessionStorage
  try {
    const stored = sessionStorage.getItem('authFlow')
    if (stored) {
      flowState.value = JSON.parse(stored)
    }
  } catch (e) {
    console.error('Failed to parse authFlow:', e)
  }

  // Build user object from URL params
  const userInfo = {
    id: parseInt(userId) || 0,
    firstname: firstName || '',
    lastname: lastName || ''
  }
  user.value = userInfo

  try {
    // Set session cookie via server API (proper domain handling)
    await fetch('/api/auth/session', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ session: token, user: userInfo }),
      credentials: 'include'
    })
  } catch (e) {
    console.error('Failed to set session cookie:', e)
  }

  // Fetch full member data (including personnummer) via Zoezi API proxy
  try {
    const memberRes = await fetch('/api/z/api/memberapi/get/current', {
      credentials: 'include'
    })
    if (memberRes.ok) {
      const memberData = await memberRes.json()
      if (memberData?.personnummer) {
        user.value = { ...user.value!, personnummer: memberData.personnummer }
      }
    }
  } catch (e) {
    console.error('Failed to fetch member data:', e)
  }

  // Clear the stored flow after reading
  sessionStorage.removeItem('authFlow')

  // If no flow or simple redirect flow, go to destination
  if (!flowState.value || flowState.value.flow === 'sambo-together' || flowState.value.flow === 'login') {
    status.value = 'success'
    await new Promise(resolve => setTimeout(resolve, 500))
    window.location.replace(addSessionToUrl(flowState.value?.redirect || '/bli-medlem'))
    return
  }

  // Show verification form
  status.value = 'ready'
})

// File upload handlers
const handleFileSelect = (e: Event) => {
  const input = e.target as HTMLInputElement
  if (input.files?.[0]) setFile(input.files[0])
}

const handleDrop = (e: DragEvent) => {
  isDragging.value = false
  if (e.dataTransfer?.files?.[0]) setFile(e.dataTransfer.files[0])
}

const setFile = (f: File) => {
  const allowedTypes = ['image/jpeg', 'image/png', 'image/webp', 'application/pdf']
  if (!allowedTypes.includes(f.type)) {
    uploadError.value = 'Endast bilder eller PDF.'
    return
  }
  if (f.size > 10 * 1024 * 1024) {
    uploadError.value = 'Max 10 MB.'
    return
  }
  file.value = f
  fileName.value = f.name
  uploadError.value = null
}

const fileToBase64 = (f: File): Promise<string> => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader()
    reader.readAsDataURL(f)
    reader.onload = () => resolve(reader.result as string)
    reader.onerror = reject
  })
}

// Submit student/senior verification
const submitStudentVerification = async () => {
  if (!file.value) {
    uploadError.value = 'Ladda upp ett intyg.'
    return
  }

  status.value = 'submitting'

  try {
    const fileBase64 = await fileToBase64(file.value)
    const timestamp = new Date().toLocaleString('sv-SE', { timeZone: 'Europe/Stockholm' })
    const typeLabel = flowState.value?.flow === 'student' ? 'Studentverifiering' : 'Seniorverifiering'

    const html = `
      <h2>${typeLabel}</h2>
      <p><strong>Tid:</strong> ${timestamp}</p>
      <p><strong>Namn:</strong> ${user.value?.firstname} ${user.value?.lastname}</p>
      <p><strong>Personnummer:</strong> ${user.value?.personnummer || 'Ej tillgängligt'}</p>
      <p><strong>Medlemskap:</strong> ${flowState.value?.product}</p>
      <p><strong>Pris:</strong> ${flowState.value?.price} kr/mån</p>
      <p><strong>Intyg:</strong> ${fileName.value}</p>
    `

    const response = await fetch('https://student-email.coregymclub.se/send', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        to: 'info@coregym.club',
        subject: `${typeLabel}: ${user.value?.firstname} ${user.value?.lastname}`,
        html,
        attachments: [{
          filename: fileName.value,
          content: fileBase64.split(',')[1],
          encoding: 'base64',
          contentType: file.value?.type || 'application/octet-stream',
        }]
      }),
    })

    if (!response.ok) throw new Error('Kunde inte skicka.')

    status.value = 'success'
    await new Promise(resolve => setTimeout(resolve, 500))
    window.location.replace(addSessionToUrl(flowState.value?.checkout || '/bli-medlem'))

  } catch (err) {
    status.value = 'ready'
    uploadError.value = 'Något gick fel.'
  }
}

// Sambo verification
const submitSamboVerification = async () => {
  samboError.value = null
  const pnr = samboPersonnummer.value.replace(/[\s-]/g, '')

  if (!pnr || !/^(\d{10}|\d{12})$/.test(pnr)) {
    samboError.value = 'Ange ett giltigt personnummer.'
    return
  }

  status.value = 'submitting'

  try {
    const normalized = pnr.length === 10
      ? (parseInt(pnr.substring(0, 2)) > 30 ? '19' : '20') + pnr
      : pnr

    const response = await fetch(`https://members.coregym.club/search?q=${normalized}`)
    if (!response.ok) throw new Error('Kunde inte verifiera.')

    const data = await response.json()
    const activeMember = data.results?.find((m: any) => m.hasActiveMembership)

    if (activeMember) {
      status.value = 'success'
      await new Promise(resolve => setTimeout(resolve, 500))
      window.location.replace(addSessionToUrl(`${flowState.value?.checkoutBase}?product=${flowState.value?.productId}&discount=sambo`))
    } else {
      samboError.value = data.count > 0
        ? 'Din sambo har inget aktivt medlemskap.'
        : 'Hittade ingen medlem med det personnumret.'
      status.value = 'ready'
    }
  } catch (err) {
    status.value = 'ready'
    samboError.value = 'Något gick fel.'
  }
}

const flow = computed(() => flowState.value?.flow || '')
</script>

<template>
  <div class="min-h-screen bg-surface flex items-center justify-center p-4">
    <div class="w-full max-w-md">

      <!-- Syncing -->
      <div v-if="status === 'syncing'" class="text-center py-12">
        <div class="w-12 h-12 border-2 border-on-surface border-t-transparent rounded-full animate-spin mx-auto mb-4" />
        <p class="text-on-surface-dim">Loggar in...</p>
      </div>

      <!-- Error -->
      <div v-else-if="status === 'error'" class="text-center py-12">
        <div class="w-14 h-14 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
          <svg class="w-7 h-7 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
          </svg>
        </div>
        <p class="text-on-surface font-medium mb-4">{{ errorMessage }}</p>
        <NuxtLink to="/bli-medlem" class="inline-block px-6 py-3 bg-on-surface text-white rounded-full font-bold">
          Tillbaka
        </NuxtLink>
      </div>

      <!-- Success -->
      <div v-else-if="status === 'success'" class="text-center py-12">
        <div class="w-14 h-14 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
          <svg class="w-7 h-7 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7" />
          </svg>
        </div>
        <p class="text-on-surface font-medium">Skickar dig vidare...</p>
      </div>

      <!-- Verification Forms -->
      <template v-else>
        <!-- Header -->
        <div class="text-center mb-6">
          <div class="w-14 h-14 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <svg class="w-7 h-7 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7" />
            </svg>
          </div>
          <p class="text-on-surface-dim mb-1">Inloggad som</p>
          <p class="text-on-surface font-bold text-lg">{{ user?.firstname }} {{ user?.lastname }}</p>
        </div>

        <!-- Student/Senior Form -->
        <div v-if="flow === 'student' || flow === 'senior'" class="bg-white rounded-2xl shadow-lg p-6 space-y-4">
          <h2 class="font-bold text-lg text-center">
            {{ flow === 'student' ? 'Ladda upp studieintyg' : 'Ladda upp seniorintyg' }}
          </h2>

          <div
            class="border-2 border-dashed rounded-xl p-5 text-center cursor-pointer transition-colors"
            :class="file ? 'bg-sky-50 border-sky-500' : 'border-gray-300 hover:border-gray-400'"
            @dragover.prevent="isDragging = true"
            @dragleave.prevent="isDragging = false"
            @drop.prevent="handleDrop"
            @click="triggerFileInput"
          >
            <input ref="fileInputRef" type="file" accept="image/*,application/pdf" class="hidden" @change="handleFileSelect" />
            <div v-if="file" class="flex items-center justify-center gap-2">
              <svg class="w-5 h-5 text-sky-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7" />
              </svg>
              <span class="font-medium truncate max-w-[200px]">{{ fileName }}</span>
            </div>
            <div v-else>
              <p class="font-medium">Ladda upp intyg</p>
              <p class="text-sm text-gray-500">Bild eller PDF</p>
            </div>
          </div>

          <div v-if="uploadError" class="p-3 bg-red-50 rounded-xl text-sm text-red-600">{{ uploadError }}</div>

          <button @click="submitStudentVerification" :disabled="status === 'submitting'" class="w-full bg-on-surface text-white py-4 rounded-full font-bold disabled:opacity-50">
            {{ status === 'submitting' ? 'Skickar...' : 'Fortsätt till betalning' }}
          </button>
        </div>

        <!-- Sambo Form -->
        <div v-else-if="flow === 'sambo-verify'" class="bg-white rounded-2xl shadow-lg p-6 space-y-4">
          <h2 class="font-bold text-lg text-center">Verifiera sambo</h2>
          <p class="text-sm text-center text-gray-600">Ange din sambos personnummer</p>

          <input
            v-model="samboPersonnummer"
            type="text"
            placeholder="ÅÅÅÅMMDD-XXXX"
            inputmode="numeric"
            class="w-full px-4 py-3.5 rounded-xl border border-gray-300 text-lg"
            @keyup.enter="submitSamboVerification"
          />

          <div v-if="samboError" class="p-3 bg-red-50 rounded-xl text-sm text-red-600">{{ samboError }}</div>

          <button @click="submitSamboVerification" :disabled="status === 'submitting'" class="w-full bg-on-surface text-white py-4 rounded-full font-bold disabled:opacity-50">
            {{ status === 'submitting' ? 'Kontrollerar...' : 'Verifiera och fortsätt' }}
          </button>
        </div>
      </template>

    </div>
  </div>
</template>
