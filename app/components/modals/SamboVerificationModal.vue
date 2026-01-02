<script setup lang="ts">
interface Props {
  productId: number
  productName: string
  productPrice: number
  checkoutBaseUrl: string
}

const props = defineProps<Props>()

const emit = defineEmits<{
  close: []
}>()

type SamboOption = 'existing' | 'together' | 'soon' | null

const selectedOption = ref<SamboOption>(null)
const step = ref<'choose' | 'verify' | 'result'>('choose')
const ownPersonnummer = ref('') // Eget personnummer (den som ska bli medlem)
const samboPersonnummer = ref('') // Sambons personnummer (befintlig medlem)
const isVerifying = ref(false)
const error = ref<string | null>(null)
const verificationResult = ref<{
  found: boolean
  name?: string
  active?: boolean
  memberId?: number
} | null>(null)

// Discount codes
const SAMBO_DISCOUNT = 'SAMBO'
const SAMBO_TEMP_DISCOUNT = 'SAMBO30' // Temporary discount for "soon" option

// Build checkout URL
function getCheckoutUrl(discount?: string, quantity?: number): string {
  let url = `${props.checkoutBaseUrl}?product=${props.productId}`
  if (discount) url += `&discount=${discount}`
  if (quantity && quantity > 1) url += `&quantity=${quantity}`
  return url
}

// Handle option selection
function selectOption(option: SamboOption) {
  selectedOption.value = option
  error.value = null

  if (option === 'existing') {
    step.value = 'verify'
  } else if (option === 'together') {
    // Redirect to checkout with 2 products
    window.location.href = getCheckoutUrl(SAMBO_DISCOUNT, 2)
  } else if (option === 'soon') {
    // Show info and redirect with temp discount
    step.value = 'result'
    verificationResult.value = { found: false }
  }
}

// Validate personnummer format
function isValidPersonnummer(pnr: string): boolean {
  const cleaned = pnr.replace(/[\s-]/g, '')
  return /^(\d{10}|\d{12})$/.test(cleaned)
}

// Normalize personnummer to 12 digits
function normalizePersonnummer(pnr: string): string {
  const cleaned = pnr.replace(/[\s-]/g, '')
  if (cleaned.length === 10) {
    // Convert YYMMDDXXXX to YYYYMMDDXXXX
    const year = parseInt(cleaned.substring(0, 2))
    const century = year > 30 ? '19' : '20' // Assume 1931-2030 range
    return century + cleaned
  }
  return cleaned
}

// Verify sambo membership
async function verifySambo() {
  error.value = null

  // Validera eget personnummer
  if (!ownPersonnummer.value.trim()) {
    error.value = 'Ange ditt personnummer.'
    return
  }

  if (!isValidPersonnummer(ownPersonnummer.value)) {
    error.value = 'Ange ett giltigt personnummer för dig själv.'
    return
  }

  // Validera sambons personnummer
  if (!samboPersonnummer.value.trim()) {
    error.value = 'Ange din sambos personnummer.'
    return
  }

  if (!isValidPersonnummer(samboPersonnummer.value)) {
    error.value = 'Ange ett giltigt personnummer för din sambo.'
    return
  }

  isVerifying.value = true

  try {
    const normalizedSambo = normalizePersonnummer(samboPersonnummer.value)

    // Search for sambo member by personnummer
    const response = await fetch(`https://members.coregym.club/search?q=${normalizedSambo}`)

    if (!response.ok) {
      throw new Error('Kunde inte verifiera. Försök igen.')
    }

    const data = await response.json()

    if (data.count > 0) {
      // Find member with active membership
      const activeMember = data.results.find((m: any) => m.hasActiveMembership)

      if (activeMember) {
        verificationResult.value = {
          found: true,
          name: activeMember.firstname || activeMember.name?.split(' ')[0] || 'Din sambo',
          active: true,
          memberId: activeMember.id
        }
        step.value = 'result'
      } else {
        // Found member but not active
        verificationResult.value = {
          found: true,
          name: data.results[0]?.firstname || 'Din sambo',
          active: false
        }
        step.value = 'result'
      }
    } else {
      // No member found
      verificationResult.value = { found: false }
      step.value = 'result'
    }
  } catch (err) {
    error.value = err instanceof Error ? err.message : 'Något gick fel. Försök igen.'
  } finally {
    isVerifying.value = false
  }
}

// Save verification to API
async function saveVerification() {
  try {
    const normalizedOwn = normalizePersonnummer(ownPersonnummer.value)
    const normalizedSambo = normalizePersonnummer(samboPersonnummer.value)

    await fetch('https://api.coregym.club/verification', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        type: 'sambo',
        personnummer: normalizedOwn,
        samboPersonnummer: normalizedSambo,
        samboMemberId: verificationResult.value?.memberId || null,
        samboName: verificationResult.value?.name || null
      })
    })
  } catch (err) {
    console.error('Failed to save verification:', err)
    // Continue anyway - checkout is more important
  }
}

// Proceed to checkout
async function proceedToCheckout() {
  if (verificationResult.value?.found && verificationResult.value?.active) {
    // Spara verifiering innan checkout
    await saveVerification()
    // Verified sambo - full discount
    window.location.href = getCheckoutUrl(SAMBO_DISCOUNT)
  } else if (selectedOption.value === 'soon') {
    // Temp discount for "soon" option
    window.location.href = getCheckoutUrl(SAMBO_TEMP_DISCOUNT)
  }
}

// Go back
function goBack() {
  if (step.value === 'verify' || step.value === 'result') {
    step.value = 'choose'
    selectedOption.value = null
    verificationResult.value = null
    ownPersonnummer.value = ''
    samboPersonnummer.value = ''
    error.value = null
  }
}
</script>

<template>
  <ModalsResponsiveModal :open="true" @close="emit('close')">
    <template #header>
      <div class="flex items-center gap-3 mb-2">
        <button
          v-if="step !== 'choose'"
          @click="goBack"
          class="w-8 h-8 rounded-full bg-surface-container flex items-center justify-center hover:bg-surface-dim transition-colors"
        >
          <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 19l-7-7 7-7" />
          </svg>
        </button>
        <h2 class="font-display font-bold text-2xl uppercase tracking-tight text-on-surface">
          Samborabatt
        </h2>
      </div>
      <p class="text-on-surface-dim">
        Spara 95 kr/mån när ni tränar tillsammans.
      </p>
    </template>

        <!-- Step 1: Choose option -->
        <div v-if="step === 'choose'" class="p-6 pt-2 space-y-3">
          <p class="text-sm font-bold text-on-surface uppercase tracking-wide mb-4">
            Är din sambo redan medlem?
          </p>

          <!-- Option: Already member -->
          <button
            @click="selectOption('existing')"
            class="w-full p-5 rounded-2xl border-2 text-left transition-all hover:border-on-surface hover:bg-surface-container group"
            :class="selectedOption === 'existing' ? 'border-on-surface bg-surface-container' : 'border-outline'"
          >
            <div class="flex items-center gap-4">
              <div class="w-12 h-12 rounded-full bg-brand/10 flex items-center justify-center text-brand group-hover:bg-brand group-hover:text-white transition-colors">
                <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7" />
                </svg>
              </div>
              <div>
                <p class="font-bold text-on-surface">Ja, min sambo är redan medlem</p>
                <p class="text-sm text-on-surface-dim">Verifiera med personnummer</p>
              </div>
            </div>
          </button>

          <!-- Option: Sign up together -->
          <button
            @click="selectOption('together')"
            class="w-full p-5 rounded-2xl border-2 text-left transition-all hover:border-on-surface hover:bg-surface-container group"
            :class="selectedOption === 'together' ? 'border-on-surface bg-surface-container' : 'border-outline'"
          >
            <div class="flex items-center gap-4">
              <div class="w-12 h-12 rounded-full bg-brand/10 flex items-center justify-center text-brand group-hover:bg-brand group-hover:text-white transition-colors">
                <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" />
                </svg>
              </div>
              <div>
                <p class="font-bold text-on-surface">Nej, vi vill teckna tillsammans</p>
                <p class="text-sm text-on-surface-dim">Lägg till två medlemskap direkt</p>
              </div>
            </div>
          </button>

          <!-- Option: Soon -->
          <button
            @click="selectOption('soon')"
            class="w-full p-5 rounded-2xl border-2 text-left transition-all hover:border-on-surface hover:bg-surface-container group"
            :class="selectedOption === 'soon' ? 'border-on-surface bg-surface-container' : 'border-outline'"
          >
            <div class="flex items-center gap-4">
              <div class="w-12 h-12 rounded-full bg-brand/10 flex items-center justify-center text-brand group-hover:bg-brand group-hover:text-white transition-colors">
                <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <div>
                <p class="font-bold text-on-surface">Sambo blir medlem inom 30 dagar</p>
                <p class="text-sm text-on-surface-dim">Få rabatt på första månaden</p>
              </div>
            </div>
          </button>

          <!-- Price info -->
          <div class="mt-6 p-4 bg-surface-container rounded-xl">
            <div class="flex justify-between items-baseline">
              <span class="text-on-surface-dim">Ordinarie pris</span>
              <span class="text-on-surface-dim line-through">595 kr/mån</span>
            </div>
            <div class="flex justify-between items-baseline mt-1">
              <span class="font-bold text-on-surface">Med samborabatt</span>
              <span class="font-bold text-brand text-xl">500 kr/mån</span>
            </div>
          </div>
        </div>

        <!-- Step 2: Verify personnummer -->
        <div v-else-if="step === 'verify'" class="p-6 pt-2 space-y-5">
          <!-- Eget personnummer -->
          <div>
            <label class="block text-sm font-bold text-on-surface mb-2 uppercase tracking-wide">
              Ditt personnummer <span class="text-brand">*</span>
            </label>
            <input
              v-model="ownPersonnummer"
              type="text"
              placeholder="ÅÅÅÅMMDD-XXXX"
              class="w-full px-4 py-3 rounded-xl border border-outline bg-surface-container focus:border-on-surface focus:ring-1 focus:ring-on-surface transition-colors text-on-surface placeholder:text-on-surface-dim/50"
              autocomplete="off"
            />
          </div>

          <!-- Sambons personnummer -->
          <div>
            <label class="block text-sm font-bold text-on-surface mb-2 uppercase tracking-wide">
              Din sambos personnummer <span class="text-brand">*</span>
            </label>
            <input
              v-model="samboPersonnummer"
              type="text"
              placeholder="ÅÅÅÅMMDD-XXXX"
              class="w-full px-4 py-3 rounded-xl border border-outline bg-surface-container focus:border-on-surface focus:ring-1 focus:ring-on-surface transition-colors text-on-surface placeholder:text-on-surface-dim/50"
              autocomplete="off"
              @keyup.enter="verifySambo"
            />
          </div>

          <!-- Error -->
          <div v-if="error" class="p-4 bg-brand/10 border border-brand/20 rounded-xl">
            <p class="text-sm text-brand font-medium">{{ error }}</p>
          </div>

          <!-- Info -->
          <div class="p-4 bg-surface-container rounded-xl">
            <p class="text-sm text-on-surface-dim">
              Vi kontrollerar att din sambo har ett aktivt medlemskap hos Core Gym.
            </p>
          </div>

          <!-- Submit -->
          <button
            @click="verifySambo"
            :disabled="isVerifying"
            class="w-full btn bg-on-surface text-white hover:bg-black py-4 text-lg rounded-full font-bold disabled:opacity-50 disabled:cursor-not-allowed transition-all"
          >
            <span v-if="isVerifying" class="flex items-center justify-center gap-2">
              <svg class="animate-spin h-5 w-5" fill="none" viewBox="0 0 24 24">
                <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4" />
                <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
              </svg>
              Kontrollerar...
            </span>
            <span v-else>Verifiera</span>
          </button>
        </div>

        <!-- Step 3: Result -->
        <div v-else-if="step === 'result'" class="p-6 pt-2">
          <!-- Success: Active member found -->
          <div v-if="verificationResult?.found && verificationResult?.active" class="text-center py-6">
            <div class="w-20 h-20 bg-brand/10 rounded-full flex items-center justify-center mx-auto mb-6">
              <svg class="w-10 h-10 text-brand" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7" />
              </svg>
            </div>
            <h3 class="font-display font-bold text-2xl uppercase tracking-tight mb-2">Verifierad!</h3>
            <p class="text-on-surface-dim mb-6">
              {{ verificationResult.name }} är medlem hos oss. Du får samborabatten!
            </p>

            <div class="p-4 bg-surface-container rounded-xl mb-6">
              <div class="flex justify-between items-baseline">
                <span class="font-bold text-on-surface">Ditt pris</span>
                <span class="font-bold text-brand text-2xl">500 kr/mån</span>
              </div>
            </div>

            <button
              @click="proceedToCheckout"
              class="w-full btn bg-brand text-white hover:bg-brand-dark py-4 text-lg rounded-full font-bold transition-all"
            >
              Fortsätt till betalning
            </button>
          </div>

          <!-- Found but not active -->
          <div v-else-if="verificationResult?.found && !verificationResult?.active" class="text-center py-6">
            <div class="w-20 h-20 bg-amber-100 rounded-full flex items-center justify-center mx-auto mb-6">
              <svg class="w-10 h-10 text-amber-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
              </svg>
            </div>
            <h3 class="font-display font-bold text-2xl uppercase tracking-tight mb-2">Ej aktivt medlemskap</h3>
            <p class="text-on-surface-dim mb-6">
              Vi hittade {{ verificationResult.name }}, men medlemskapet är inte aktivt just nu.
            </p>

            <div class="space-y-3">
              <button
                @click="selectOption('together')"
                class="w-full btn bg-on-surface text-white hover:bg-black py-4 rounded-full font-bold transition-all"
              >
                Teckna tillsammans istället
              </button>
              <button
                @click="goBack"
                class="w-full btn bg-surface-container text-on-surface hover:bg-surface-dim py-3 rounded-full font-medium transition-all"
              >
                Försök igen
              </button>
            </div>
          </div>

          <!-- Not found -->
          <div v-else-if="selectedOption === 'existing' && !verificationResult?.found" class="text-center py-6">
            <div class="w-20 h-20 bg-surface-container rounded-full flex items-center justify-center mx-auto mb-6">
              <svg class="w-10 h-10 text-on-surface-dim" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <h3 class="font-display font-bold text-2xl uppercase tracking-tight mb-2">Hittade ingen</h3>
            <p class="text-on-surface-dim mb-6">
              Vi kunde inte hitta någon medlem med det personnumret.
            </p>

            <div class="space-y-3">
              <button
                @click="selectOption('together')"
                class="w-full btn bg-on-surface text-white hover:bg-black py-4 rounded-full font-bold transition-all"
              >
                Teckna tillsammans istället
              </button>
              <button
                @click="goBack"
                class="w-full btn bg-surface-container text-on-surface hover:bg-surface-dim py-3 rounded-full font-medium transition-all"
              >
                Försök igen
              </button>
            </div>
          </div>

          <!-- "Soon" option result -->
          <div v-else-if="selectedOption === 'soon'" class="text-center py-6">
            <div class="w-20 h-20 bg-brand/10 rounded-full flex items-center justify-center mx-auto mb-6">
              <svg class="w-10 h-10 text-brand" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <h3 class="font-display font-bold text-2xl uppercase tracking-tight mb-2">30 dagars rabatt</h3>
            <p class="text-on-surface-dim mb-6">
              Du får samborabatten på din första månad. När din sambo blivit medlem, koppla ihop er i appen för fortsatt rabatt.
            </p>

            <div class="p-4 bg-surface-container rounded-xl mb-6">
              <div class="flex justify-between items-baseline">
                <span class="text-on-surface-dim">Första månaden</span>
                <span class="font-bold text-brand text-xl">500 kr</span>
              </div>
              <div class="flex justify-between items-baseline mt-1 text-sm">
                <span class="text-on-surface-dim">Därefter</span>
                <span class="text-on-surface-dim">595 kr/mån (eller 500 kr med sambo)</span>
              </div>
            </div>

            <button
              @click="proceedToCheckout"
              class="w-full btn bg-brand text-white hover:bg-brand-dark py-4 text-lg rounded-full font-bold transition-all"
            >
              Fortsätt till betalning
            </button>
          </div>
        </div>
  </ModalsResponsiveModal>
</template>
