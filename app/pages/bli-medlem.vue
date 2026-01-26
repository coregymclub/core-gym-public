<script setup lang="ts">
useHead({
  title: 'Bli medlem - Core Gym Club',
  meta: [
    { name: 'description', content: 'Medlemskap från 360 kr/mån. Ett kort, fyra gym. Inga bindningstider.' }
  ]
})

const route = useRoute()
const router = useRouter()

const CHECKOUT_URL = 'https://z.coregym.club/homepage/56'

const clubs = [
  { id: 'vegastaden', name: 'Vegastaden', siteId: 3 },
  { id: 'tungelsta', name: 'Tungelsta', siteId: 1 },
  { id: 'vasterhaninge', name: 'Västerhaninge', siteId: 2 },
]

// Special clubs with different behavior
const specialClubs = {
  egym: { name: 'EGYM', link: '/egym', description: 'Boka intro' },
  osmo: { name: 'Ösmo', link: '/osmo', description: 'Kommer snart' },
}

const selectedClubData = computed(() => clubs.find(c => c.id === selectedClub.value))

// Student discount prices per product ID
const studentPrices: Record<number, number> = {
  291: 479,  // Alla gym: 595 -> 479
  297: 360,  // Tungelsta & VH: 450 -> 360
  298: 360,  // VH & Tungelsta: 450 -> 360
}

const products = {
  vegastaden: {
    ordinarie: [
      {
        id: 291,
        name: 'Månadskort',
        price: 595,
        unit: 'kr/mån',
        highlight: true,
        popular: true,
        allGyms: true,
        features: ['Alla gym', 'Fria grupppass', 'Ingen bindning']
      },
      {
        id: 21,
        name: 'Årskort',
        price: 7140,
        unit: 'kr/år',
        allGyms: true,
        features: ['Alla gym', 'Fria grupppass', 'Spara 2 månader']
      },
    ],
    student: [
      {
        id: 291,
        name: 'Studentkort',
        price: 479,
        unit: 'kr/mån',
        highlight: true,
        popular: true,
        allGyms: true,
        discount: 'STUDENT',
        features: ['Alla gym', 'Fria grupppass', 'Kräver CSN/studentkort']
      },
    ],
    senior: [
      {
        id: 296,
        name: 'Seniorkort',
        price: 479,
        unit: 'kr/mån',
        highlight: true,
        popular: true,
        allGyms: true,
        features: ['Alla gym', 'Fria grupppass', 'Dagtid före kl 17']
      },
    ],
  },
  tungelsta: {
    ordinarie: [
      {
        id: 297,
        name: 'Månadskort',
        price: 450,
        unit: 'kr/mån',
        highlight: true,
        popular: true,
        features: ['Tungelsta & Västerhaninge', 'Fria grupppass', 'Ingen bindning']
      },
      {
        id: 291,
        name: 'Alla gym',
        price: 595,
        unit: 'kr/mån',
        allGyms: true,
        features: ['Alla gym inkl. Vegastaden', 'Fria grupppass', 'Full flexibilitet']
      },
    ],
    student: [
      {
        id: 297,
        name: 'Studentkort',
        price: 360,
        unit: 'kr/mån',
        highlight: true,
        popular: true,
        discount: 'STUDENT',
        features: ['Tungelsta & Västerhaninge', 'Fria grupppass', 'Kräver CSN/studentkort']
      },
    ],
    senior: [
      {
        id: 299,
        name: 'Seniorkort 65+',
        price: 360,
        unit: 'kr/mån',
        highlight: true,
        popular: true,
        features: ['Tungelsta & Västerhaninge', 'Fria grupppass', 'Alla tider']
      },
    ],
  },
  vasterhaninge: {
    ordinarie: [
      {
        id: 298,
        name: 'Månadskort',
        price: 450,
        unit: 'kr/mån',
        highlight: true,
        popular: true,
        features: ['Tungelsta & Västerhaninge', 'Fria grupppass', 'Ingen bindning']
      },
      {
        id: 291,
        name: 'Alla gym',
        price: 595,
        unit: 'kr/mån',
        allGyms: true,
        features: ['Alla gym inkl. Vegastaden', 'Fria grupppass', 'Full flexibilitet']
      },
    ],
    student: [
      {
        id: 298,
        name: 'Studentkort',
        price: 360,
        unit: 'kr/mån',
        highlight: true,
        popular: true,
        discount: 'STUDENT',
        features: ['Tungelsta & Västerhaninge', 'Fria grupppass', 'Kräver CSN/studentkort']
      },
    ],
    senior: [
      {
        id: 300,
        name: 'Seniorkort 65+',
        price: 360,
        unit: 'kr/mån',
        highlight: true,
        popular: true,
        features: ['Tungelsta & Västerhaninge', 'Fria grupppass', 'Alla tider']
      },
    ],
  },
}

// Club-specific amenities/info
const clubInfo = {
  vegastaden: {
    headline: 'Vårt flaggskepp i Vegastaden',
    amenities: [
      { icon: 'clock', text: 'Öppet 04:00–00:00 alla dagar' },
      { icon: 'dumbbell', text: 'Komplett gym med fria vikter & maskiner' },
      { icon: 'users', text: 'Gruppträning ingår' },
      { icon: 'flame', text: 'Bastu för alla medlemmar' },
      { icon: 'key', text: 'Passerkort för fri access' },
    ],
    extra: 'Vegastaden är vårt största gym med ett brett utbud av utrustning och gruppträning.'
  },
  tungelsta: {
    headline: 'Familjärt gym i Tungelsta',
    amenities: [
      { icon: 'clock', text: 'Öppet 04:00–00:00 alla dagar' },
      { icon: 'dumbbell', text: 'Komplett gym med fria vikter & maskiner' },
      { icon: 'users', text: 'Gruppträning ingår' },
      { icon: 'heart', text: 'Personlig atmosfär' },
      { icon: 'key', text: 'Passerkort för fri access' },
    ],
    extra: 'Tungelsta erbjuder en trivsam miljö med allt du behöver för din träning.'
  },
  vasterhaninge: {
    headline: 'Träna i Västerhaninge',
    amenities: [
      { icon: 'clock', text: 'Öppet 04:00–00:00 alla dagar' },
      { icon: 'dumbbell', text: 'Komplett gym med fria vikter & maskiner' },
      { icon: 'users', text: 'Gruppträning ingår' },
      { icon: 'zap', text: 'Nyligen renoverat' },
      { icon: 'key', text: 'Passerkort för fri access' },
    ],
    extra: 'Västerhaninge har genomgått en renovering och erbjuder moderna faciliteter. EGYM-studion finns i samma byggnad med separat ingång och medlemskap.'
  },
}

const currentClubInfo = computed(() => {
  if (!selectedClub.value) return null
  return clubInfo[selectedClub.value]
})

const faqs = [
  {
    question: 'Hur lång är bindningstiden?',
    answer: 'Vi har ingen bindningstid på våra månadskort. Du kan säga upp när du vill med två månaders uppsägningstid. Årskort gäller i 12 månader.'
  },
  {
    question: 'Hur säger jag upp mitt medlemskap?',
    answer: 'Du säger enkelt upp via Mina Sidor på vår hemsida, eller genom att maila oss på info@coregym.club. Uppsägningstiden är två månader.'
  },
  {
    question: 'Vad ingår i medlemskapet?',
    answer: 'Alla medlemskap inkluderar fria gruppträningspass, tillgång till alla maskiner och fria vikter, samt omklädningsrum med dusch. På Vegastaden ingår även bastu.'
  },
  {
    question: 'Kan jag träna på alla gym?',
    answer: 'Vi har olika kort. "Alla gym" ger tillgång till alla våra anläggningar. Kort för enbart Tungelsta/Västerhaninge ger tillgång till dessa två.'
  },
  {
    question: 'Hur fungerar betalningen?',
    answer: 'Vi drar månadsavgiften via autogiro den 27:e varje månad. Du kan även betala med kort. Första betalningen sker direkt vid köp.'
  },
  {
    question: 'Kan jag frysa mitt medlemskap?',
    answer: 'Ja, du kan frysa ditt medlemskap i upp till 3 månader per år vid sjukdom, resa eller andra särskilda skäl. Kontakta oss för att frysa.'
  },
  {
    question: 'Vad krävs för studentrabatt?',
    answer: 'Du behöver visa giltigt studentkort eller CSN-intyg. Rabatten gäller så länge du studerar på minst 50%.'
  },
  {
    question: 'Vilka öppettider har gymmen?',
    answer: 'Alla våra gym har öppet 04:00-00:00 alla dagar, året runt. Som medlem har du tillgång med ditt passerkort under dessa tider.'
  },
]

const openFaq = ref<number | null>(null)

// Initialize selectedClub from URL query param
const initialClub = route.query.gym as string | undefined
const selectedClub = ref<string | null>(
  initialClub && clubs.some(c => c.id === initialClub) ? initialClub : null
)

const showSeniorPrices = ref(false)
const paymentType = ref<'autogiro' | 'yearly'>('autogiro')

// Sync selectedClub with URL query param (only if different to avoid loops)
watch(selectedClub, (newClub) => {
  const currentQuery = route.query.gym as string | undefined
  if (newClub !== (currentQuery || null)) {
    if (newClub) {
      router.push({ query: { gym: newClub } })
    } else {
      router.push({ query: {} })
    }
  }
})

// Watch route changes (browser back/forward)
watch(() => route.query.gym, (gymQuery) => {
  const gym = gymQuery as string | undefined
  const validGym = gym && clubs.some(c => c.id === gym) ? gym : null
  if (selectedClub.value !== validGym) {
    selectedClub.value = validGym
  }
})

// Verification modal state
const showVerificationModal = ref(false)
const verificationProduct = ref<{
  name: string
  price: number
  checkoutUrl: string
  type: 'student' | 'senior'
} | null>(null)

// Sambo modal state
const showSamboModal = ref(false)
const samboProduct = ref<{
  id: number
  name: string
  price: number
} | null>(null)

const currentProducts = computed(() => {
  if (!selectedClub.value) return []
  const category = showSeniorPrices.value ? 'senior' : 'ordinarie'
  return products[selectedClub.value]?.[category] || []
})

// Membership type for Tungelsta/VH (local vs all gyms)
const membershipType = ref<'local' | 'all'>('local')

// Get the current product based on toggles
const currentProduct = computed(() => {
  const prods = currentProducts.value
  if (!prods.length) return null

  // Vegastaden - toggle between autogiro and yearly
  if (selectedClub.value === 'vegastaden') {
    if (paymentType.value === 'yearly') {
      return prods.find(p => p.id === 21) || prods[0]
    }
    return prods.find(p => p.id !== 21) || prods[0]
  }

  // Tungelsta/VH - toggle between local and all gyms
  if (membershipType.value === 'all') {
    return prods.find(p => p.id === 291) || prods[0]  // Alla gym product
  }
  return prods.find(p => p.id !== 291) || prods[0]  // Local product
})

// Check if yearly option is available (Vegastaden)
const hasYearlyOption = computed(() => {
  return selectedClub.value === 'vegastaden' && currentProducts.value.some(p => p.id === 21)
})

// Check if gym upgrade option is available (Tungelsta/VH)
const hasGymUpgrade = computed(() => {
  return (selectedClub.value === 'tungelsta' || selectedClub.value === 'vasterhaninge') &&
    currentProducts.value.length > 1
})

// Get student price for a product (if available)
function getStudentPrice(productId: number): number | null {
  return studentPrices[productId] || null
}

function getCheckoutUrl(product: any, useStudentDiscount = false) {
  let url = `${CHECKOUT_URL}?product=${product.id}`
  if (useStudentDiscount && studentPrices[product.id]) {
    url += `&discount=student`
  } else if (product.discount) {
    url += `&discount=${product.discount}`
  }
  return url
}

// Handle product click
function handleProductClick(product: any) {
  // Direct redirect (ordinarie or senior)
  window.location.href = getCheckoutUrl(product)
}

// Open student modal with current product
function openStudentModal() {
  if (!currentProduct.value) return
  const product = currentProduct.value
  const studentPrice = studentPrices[product.id] || product.price

  verificationProduct.value = {
    name: 'Studentkort',
    price: studentPrice,
    checkoutUrl: getCheckoutUrl(product, true),
    type: 'student'
  }
  showVerificationModal.value = true
}

function openSamboModal() {
  samboProduct.value = { id: 291, name: 'Sambokort', price: 500 }
  showSamboModal.value = true
}

function toggleFaq(index: number) {
  openFaq.value = openFaq.value === index ? null : index
}
</script>

<template>
  <div class="grain relative min-h-screen flex flex-col">
    <!-- Hero Mobile -->
    <section class="lg:hidden aspect-[4/5] flex flex-col justify-end items-center px-6 pb-24 relative overflow-hidden bg-surface-bright">
      <div class="absolute inset-0 z-0">
        <img
          src="/images/joel-hero-signup-mobile.avif"
          alt="Medlemskap"
          class="w-full h-full object-cover"
        />
        <div class="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent" />
        <div class="absolute inset-0 bg-gradient-to-b from-black/30 to-transparent" />
      </div>
      <div class="container text-center relative z-10">
        <p class="text-2xl text-white font-medium max-w-2xl mx-auto animate-slide-up leading-relaxed">
          Välj ditt gym. Välj din plan. Börja träna idag.
        </p>
      </div>
    </section>

    <!-- Hero Desktop (Video) -->
    <section class="hidden lg:flex aspect-[21/9] flex-col justify-end items-center px-6 pb-32 relative overflow-hidden">
      <div class="absolute inset-0 z-0">
        <video
          autoplay
          muted
          loop
          playsinline
          class="w-full h-full object-cover"
        >
          <source src="/videos/hero_video_compressed.mp4" type="video/mp4" />
        </video>
        <div class="absolute inset-0 bg-gradient-to-t from-black/70 via-black/30 to-transparent" />
      </div>
      <div class="container text-center relative z-10">
        <p class="text-3xl text-white font-medium max-w-2xl mx-auto animate-slide-up leading-relaxed">
          Välj ditt gym. Välj din plan. Börja träna idag.
        </p>
      </div>
    </section>

    <!-- Steg 1: Välj gym -->
    <section v-if="!selectedClub" class="relative z-20 -mt-16 md:mx-auto md:max-w-5xl bg-surface rounded-t-3xl md:rounded-3xl p-8 md:p-16 shadow-elevated-lg md:border border-outline/30">
      <div class="text-center mb-10">
        <span class="inline-block px-3 py-1.5 bg-surface-dim text-on-surface-dim rounded-full text-sm font-bold mb-4 uppercase tracking-wide">Hemmaklubb</span>
        <h2 class="font-display font-bold text-4xl md:text-5xl uppercase tracking-tight mb-3">Välj ditt gym</h2>
        <p class="text-on-surface-dim">Vill du träna på fler gym? Det väljer du längre fram.</p>
      </div>

      <div class="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-8">
        <!-- Regular clubs -->
        <button
          v-for="club in clubs"
          :key="club.id"
          @click="selectedClub = club.id"
          class="group relative overflow-hidden rounded-2xl p-8 text-center bg-surface-container hover:bg-on-surface border border-transparent transition-all duration-300 hover:-translate-y-1 active:scale-98"
        >
          <h3 class="font-display font-bold text-2xl md:text-3xl text-on-surface group-hover:text-white transition-colors uppercase tracking-tight">{{ club.name }}</h3>
        </button>

        <!-- EGYM -->
        <NuxtLink
          to="/egym"
          class="group relative overflow-hidden rounded-2xl p-8 text-center bg-surface-container hover:bg-on-surface border border-transparent transition-all duration-300 hover:-translate-y-1 active:scale-98"
        >
          <h3 class="font-display font-bold text-2xl md:text-3xl text-on-surface group-hover:text-white transition-colors uppercase tracking-tight">EGYM</h3>
        </NuxtLink>

        <!-- Ösmo - samma storlek, streckad kant -->
        <NuxtLink
          to="/osmo"
          class="group relative overflow-hidden rounded-2xl p-8 text-center bg-white border-2 border-dashed border-outline hover:border-on-surface transition-all duration-300 hover:-translate-y-1 active:scale-98"
        >
          <div class="flex items-center justify-center gap-2">
            <span class="relative flex h-2 w-2">
              <span class="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
              <span class="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
            </span>
            <h3 class="font-display font-bold text-2xl md:text-3xl text-on-surface uppercase tracking-tight">Ösmo</h3>
          </div>
          <p class="text-sm text-on-surface-dim mt-1">Kommer 2026</p>
        </NuxtLink>
      </div>

      <!-- Friskvårdsbidrag -->
      <div class="mt-12 pt-10 border-t border-outline/20 text-center">
        <span class="inline-block px-3 py-1.5 bg-sky-100 text-sky-700 rounded-full text-sm font-bold mb-4">Friskvård</span>
        <h3 class="font-display font-bold text-2xl md:text-3xl text-on-surface mb-4 uppercase tracking-tight">Använd ditt friskvårdsbidrag hos oss på Core</h3>
        <p class="text-on-surface-dim text-lg mb-8">Vi är anslutna till alla stora portaler.</p>

        <div class="grid grid-cols-2 md:grid-cols-4 gap-3 max-w-lg mx-auto">
          <div class="bg-white rounded-xl p-4 border border-outline/30 flex items-center justify-center h-14">
            <img src="/images/epassi.svg" alt="Epassi" class="h-5 max-w-full object-contain opacity-70 grayscale" />
          </div>
          <div class="bg-white rounded-xl p-4 border border-outline/30 flex items-center justify-center h-14">
            <img src="/images/benifex.webp" alt="Benifex" class="h-5 max-w-full object-contain opacity-70 grayscale" />
          </div>
          <div class="bg-white rounded-xl p-4 border border-outline/30 flex items-center justify-center h-14">
            <img src="/images/edenred.avif" alt="Edenred" class="h-5 max-w-full object-contain opacity-70 grayscale" />
          </div>
          <div class="bg-white rounded-xl p-4 border border-outline/30 flex items-center justify-center h-14">
            <img src="/images/wellnet.webp" alt="Wellnet" class="h-5 max-w-full object-contain opacity-70 grayscale" />
          </div>
        </div>
      </div>
    </section>

    <!-- Steg 2: Välj medlemskap -->
    <section v-else class="relative z-20 -mt-16 md:mx-auto md:max-w-5xl bg-surface rounded-t-3xl md:rounded-3xl p-6 md:p-16 shadow-elevated-lg md:border border-outline/30 animate-fade">
      <!-- Header -->
      <div class="relative text-center mb-12">
        <button
          @click="selectedClub = null"
          class="absolute left-0 top-0 w-10 h-10 rounded-full bg-surface-container hover:bg-surface-dim flex items-center justify-center transition-colors"
          aria-label="Tillbaka"
        >
          <svg class="w-5 h-5 text-on-surface" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
            <path stroke-linecap="round" stroke-linejoin="round" d="M15 19l-7-7 7-7" />
          </svg>
        </button>
        <h2 class="font-display font-bold text-4xl md:text-6xl uppercase tracking-tight leading-none pt-1">{{ clubs.find(c => c.id === selectedClub)?.name }}</h2>
      </div>

          <!-- If no products (e.g. Ösmo) -->
          <div v-if="currentProducts.length === 0" class="text-center py-12">
            <div class="w-20 h-20 bg-surface-dim rounded-full flex items-center justify-center mx-auto mb-6">
               <svg class="w-10 h-10 text-on-surface-dim" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                 <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
               </svg>
            </div>
            <h3 class="font-display font-bold text-3xl mb-4 uppercase tracking-tight">Snart öppnar vi!</h3>
            <p class="text-lg text-on-surface-dim mb-8 max-w-md mx-auto leading-relaxed">Vi har inte släppt medlemskapen för detta gym ännu. Håll ut!</p>
            <NuxtLink to="/osmo" class="btn btn-dark btn-lg">
              Anmäl intresse
            </NuxtLink>
          </div>

          <!-- Product Selection -->
          <div v-else>
            <!-- Back to ordinarie (when viewing senior) -->
            <div v-if="showSeniorPrices" class="max-w-3xl mx-auto mb-8">
              <button
                @click="showSeniorPrices = false"
                class="flex items-center gap-2 text-on-surface-dim hover:text-on-surface transition-colors font-medium"
              >
                <svg class="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
                  <path stroke-linecap="round" stroke-linejoin="round" d="M15 19l-7-7 7-7" />
                </svg>
                Tillbaka till ordinarie priser
              </button>
              <h3 class="font-display font-bold text-2xl mt-4 uppercase tracking-tight text-on-surface">Seniorpriser 65+</h3>
            </div>

            <!-- Senior info text (when viewing senior prices) -->
            <div v-if="showSeniorPrices" class="max-w-2xl mx-auto mb-8 text-center">
              <p class="text-on-surface-dim">
                Seniorpris gäller dig som fyllt 65 år. Åldersverifiering sker vid köp.
              </p>
            </div>

            <!-- Payment/Membership Toggle -->
            <div v-if="(hasYearlyOption || hasGymUpgrade) && !showSeniorPrices" class="max-w-2xl mx-auto mb-10">
              <!-- Vegastaden: Payment type -->
              <div v-if="hasYearlyOption" class="text-center">
                <p class="text-sm font-medium text-on-surface-dim uppercase tracking-wide mb-4">Välj betalsätt</p>
                <div class="inline-flex bg-surface-container rounded-full p-1">
                  <button
                    @click="paymentType = 'autogiro'"
                    class="px-8 py-3 rounded-full font-bold transition-all min-w-[120px]"
                    :class="paymentType === 'autogiro'
                      ? 'bg-on-surface text-white'
                      : 'text-on-surface-dim hover:text-on-surface'"
                  >
                    Autogiro
                  </button>
                  <button
                    @click="paymentType = 'yearly'"
                    class="px-8 py-3 rounded-full font-bold transition-all min-w-[120px]"
                    :class="paymentType === 'yearly'
                      ? 'bg-on-surface text-white'
                      : 'text-on-surface-dim hover:text-on-surface'"
                  >
                    Direkt
                  </button>
                </div>
              </div>

              <!-- Tungelsta/VH: Membership type -->
              <div v-if="hasGymUpgrade" class="text-center">
                <p class="text-sm font-medium text-on-surface-dim uppercase tracking-wide mb-3">Var vill du träna?</p>
                <div class="grid grid-cols-2 gap-3">
                  <button
                    @click="membershipType = 'local'"
                    class="p-4 rounded-xl border-2 transition-all text-center"
                    :class="membershipType === 'local'
                      ? 'border-on-surface bg-on-surface text-white'
                      : 'border-outline bg-white hover:border-on-surface-dim'"
                  >
                    <div class="font-bold text-lg">{{ selectedClub === 'tungelsta' ? 'Tungelsta + VH' : 'VH + Tungelsta' }}</div>
                    <div class="text-sm" :class="membershipType === 'local' ? 'text-white/70' : 'text-on-surface-dim'">2 gym</div>
                  </button>
                  <button
                    @click="membershipType = 'all'"
                    class="p-4 rounded-xl border-2 transition-all text-center"
                    :class="membershipType === 'all'
                      ? 'border-on-surface bg-on-surface text-white'
                      : 'border-outline bg-white hover:border-on-surface-dim'"
                  >
                    <div class="font-bold text-lg">Alla gym</div>
                    <div class="text-sm" :class="membershipType === 'all' ? 'text-white/70' : 'text-on-surface-dim'">Inkl. Vegastaden</div>
                  </button>
                </div>
              </div>
            </div>

            <!-- Membership Card -->
            <div v-if="currentProduct" class="max-w-2xl mx-auto">
              <div class="bg-white border-2 border-outline rounded-3xl p-8 md:p-10 transition-all">
                <!-- Price -->
                <div class="text-center mb-6">
                  <div class="flex items-baseline justify-center gap-2">
                    <span class="text-6xl md:text-7xl font-display font-bold text-on-surface tracking-tight">{{ currentProduct.price }}</span>
                    <span class="text-2xl font-bold text-on-surface-dim">{{ currentProduct.unit }}</span>
                  </div>
                </div>

                <!-- Features list -->
                <div class="border-t border-outline/30 pt-6 mb-6">
                  <ul class="space-y-3 text-on-surface-dim">
                    <li class="flex items-center gap-3">
                      <svg class="w-5 h-5 text-sky-500 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
                        <path stroke-linecap="round" stroke-linejoin="round" d="M5 13l4 4L19 7" />
                      </svg>
                      <span v-if="membershipType === 'all' || selectedClub === 'vegastaden'">Tillgång till alla gym inkl. EGYM</span>
                      <span v-else>Tillgång till {{ selectedClub === 'tungelsta' ? 'Tungelsta & Västerhaninge' : 'Västerhaninge & Tungelsta' }}</span>
                    </li>
                    <li class="flex items-center gap-3">
                      <svg class="w-5 h-5 text-sky-500 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
                        <path stroke-linecap="round" stroke-linejoin="round" d="M5 13l4 4L19 7" />
                      </svg>
                      <span>Fria gruppträningspass</span>
                    </li>
                    <li class="flex items-center gap-3">
                      <svg class="w-5 h-5 text-sky-500 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
                        <path stroke-linecap="round" stroke-linejoin="round" d="M5 13l4 4L19 7" />
                      </svg>
                      <span>Öppet 04:00–00:00 alla dagar</span>
                    </li>
                    <li v-if="paymentType === 'autogiro' || !hasYearlyOption" class="flex items-center gap-3">
                      <svg class="w-5 h-5 text-sky-500 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
                        <path stroke-linecap="round" stroke-linejoin="round" d="M5 13l4 4L19 7" />
                      </svg>
                      <span>Ingen bindningstid</span>
                    </li>
                  </ul>
                </div>

                <!-- CTA -->
                <button
                  @click="handleProductClick(currentProduct)"
                  class="w-full bg-brand hover:bg-brand-dark active:scale-[0.98] text-white py-4 px-8 rounded-full font-bold text-lg shadow-lg shadow-brand/25 hover:shadow-xl hover:shadow-brand/30 transition-all duration-200"
                >
                  Bli medlem
                </button>
              </div>
            </div>

            <!-- Student & Senior options -->
            <div v-if="!showSeniorPrices" class="max-w-2xl mx-auto mt-8 space-y-3">
              <!-- Student button -->
              <button
                @click="openStudentModal"
                class="w-full flex items-center gap-4 p-4 rounded-2xl transition-all border text-left bg-surface-container border-transparent hover:border-outline"
              >
                <div class="w-6 h-6 rounded-md border-2 border-outline bg-white flex items-center justify-center flex-shrink-0">
                  <svg class="w-4 h-4 text-sky-500" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                    <path stroke-linecap="round" stroke-linejoin="round" d="M12 14l9-5-9-5-9 5 9 5z" />
                    <path stroke-linecap="round" stroke-linejoin="round" d="M12 14l6.16-3.422a12.083 12.083 0 01.665 6.479A11.952 11.952 0 0012 20.055a11.952 11.952 0 00-6.824-2.998 12.078 12.078 0 01.665-6.479L12 14z" />
                  </svg>
                </div>
                <div class="flex-1">
                  <div class="font-bold text-on-surface">Jag är student</div>
                  <div class="text-sm text-on-surface-dim">Spara upp till 116 kr/mån med giltigt studieintyg</div>
                </div>
                <svg class="w-5 h-5 text-on-surface-dim flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
                  <path stroke-linecap="round" stroke-linejoin="round" d="M9 5l7 7-7 7" />
                </svg>
              </button>

              <!-- Senior button -->
              <button
                @click="showSeniorPrices = true; isStudent = false"
                class="w-full flex items-center gap-4 p-4 rounded-2xl border border-transparent bg-surface-container hover:border-outline transition-all text-left"
              >
                <div class="w-6 h-6 rounded-md border-2 border-outline bg-white flex items-center justify-center flex-shrink-0">
                  <svg class="w-4 h-4 text-on-surface-dim" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                    <path stroke-linecap="round" stroke-linejoin="round" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                  </svg>
                </div>
                <div class="flex-1">
                  <div class="font-bold text-on-surface">Jag är 65+</div>
                  <div class="text-sm text-on-surface-dim">Se seniorpriser med rabatt</div>
                </div>
                <svg class="w-5 h-5 text-on-surface-dim flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
                  <path stroke-linecap="round" stroke-linejoin="round" d="M9 5l7 7-7 7" />
                </svg>
              </button>
            </div>

            <!-- Info Cards -->
            <div v-if="!showSeniorPrices" class="mt-10 -mx-6 md:mx-0">
              <div class="flex gap-4 overflow-x-auto px-6 md:px-0 pb-4 snap-x snap-mandatory scrollbar-hide">
                <!-- Friskvård -->
                <div class="flex-shrink-0 w-[85vw] md:w-[400px] snap-start">
                  <div class="bg-gradient-to-br from-sky-50 to-white border-2 border-sky-200 rounded-3xl p-7 h-full shadow-lg">
                    <span class="inline-block px-4 py-2 bg-sky-500 text-white rounded-full text-sm font-bold mb-5">Friskvård</span>
                    <h4 class="font-display font-bold text-2xl text-on-surface mb-3 uppercase tracking-tight">Använd ditt friskvårdsbidrag</h4>
                    <p class="text-base text-on-surface-dim mb-5 leading-relaxed">Vi är anslutna till alla stora friskvårdsportaler. Betala enkelt med ditt bidrag.</p>
                    <div class="flex flex-wrap gap-5 items-center">
                      <img src="/images/epassi.svg" alt="Epassi" class="h-5 w-auto object-contain opacity-60 grayscale" />
                      <img src="/images/benifex.webp" alt="Benifex" class="h-5 w-auto object-contain opacity-60 grayscale" />
                      <img src="/images/edenred.avif" alt="Edenred" class="h-5 w-auto object-contain opacity-60 grayscale" />
                      <img src="/images/wellnet.webp" alt="Wellnet" class="h-5 w-auto object-contain opacity-60 grayscale" />
                    </div>
                  </div>
                </div>

                <!-- Åldersgräns (only Vegastaden) -->
                <div v-if="selectedClub === 'vegastaden'" class="flex-shrink-0 w-[85vw] md:w-[400px] snap-start">
                  <div class="bg-gradient-to-br from-amber-50 to-white border-2 border-amber-200 rounded-3xl p-7 h-full shadow-lg">
                    <span class="inline-block px-4 py-2 bg-amber-500 text-white rounded-full text-sm font-bold mb-5">18+</span>
                    <h4 class="font-display font-bold text-2xl text-on-surface mb-3 uppercase tracking-tight">Åldersgräns</h4>
                    <p class="text-base text-on-surface-dim leading-relaxed">På Vegastaden gäller 18 års åldersgräns. Legitimation kan komma att begäras vid entré.</p>
                  </div>
                </div>

                <!-- Samborabatt -->
                <button @click="openSamboModal" class="flex-shrink-0 w-[85vw] md:w-[400px] snap-start text-left">
                  <div class="bg-gradient-to-br from-pink-50 to-white border-2 border-pink-200 rounded-3xl p-7 h-full shadow-lg hover:shadow-xl hover:border-pink-300 transition-all">
                    <span class="inline-block px-4 py-2 bg-pink-500 text-white rounded-full text-sm font-bold mb-5">Samborabatt</span>
                    <h4 class="font-display font-bold text-2xl text-on-surface mb-3 uppercase tracking-tight">Träna tillsammans för 500 kr/mån</h4>
                    <p class="text-base text-on-surface-dim mb-5 leading-relaxed">Bor du med någon? Ni sparar 95 kr/mån var. Tillgång till alla gym ingår.</p>
                    <span class="inline-flex items-center gap-2 text-base font-bold text-pink-600">
                      Aktivera rabatt
                      <svg class="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
                        <path stroke-linecap="round" stroke-linejoin="round" d="M17 8l4 4m0 0l-4 4m4-4H3" />
                      </svg>
                    </span>
                  </div>
                </button>
              </div>
            </div>
          </div>
    </section>

    <!-- FAQ -->
    <section class="section bg-surface">
      <div class="container max-w-4xl">
        <h2 class="font-display font-bold text-3xl sm:text-4xl md:text-5xl mb-16 text-center uppercase tracking-tight">Vanliga frågor</h2>
        
        <div class="space-y-6">
          <div
            v-for="(faq, index) in faqs"
            :key="index"
            class="bg-surface-container rounded-2xl overflow-hidden transition-all duration-300 border border-transparent hover:border-outline"
            :class="{ 'bg-white shadow-elevated border-outline/50': openFaq === index }"
          >
            <button
              @click="toggleFaq(index)"
              class="w-full flex items-center justify-between p-6 md:p-8 text-left"
            >
              <span class="text-lg md:text-xl font-bold text-on-surface tracking-tight">{{ faq.question }}</span>
              <div class="w-10 h-10 rounded-full bg-surface-dim flex items-center justify-center flex-shrink-0 ml-4 transition-colors" :class="{ 'bg-on-surface text-white': openFaq === index }">
                <svg 
                  class="w-5 h-5 transition-transform duration-300"
                  :class="{ 'rotate-180': openFaq === index }"
                  viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"
                >
                  <path stroke-linecap="round" stroke-linejoin="round" d="M19 9l-7 7-7-7" />
                </svg>
              </div>
            </button>
            <div 
              class="transition-all duration-500 ease-in-out overflow-hidden"
              :style="{ maxHeight: openFaq === index ? '300px' : '0' }"
            >
              <div class="p-6 md:p-8 pt-0 text-base md:text-lg text-on-surface-dim leading-relaxed font-medium">
                {{ faq.answer }}
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>

    <!-- Kontakt -->
    <section class="py-16 bg-surface-container">
      <div class="container max-w-2xl px-4 text-center">
        <h2 class="font-display font-bold text-2xl md:text-3xl mb-4 uppercase tracking-tight">Har du frågor?</h2>
        <p class="text-on-surface-dim text-lg mb-8">
          Tveka inte att höra av dig. Vi hjälper dig gärna.
        </p>
        <div class="flex flex-col sm:flex-row gap-4 justify-center">
          <a href="mailto:info@coregym.club" class="inline-flex items-center justify-center gap-2 px-6 py-3 bg-white rounded-full font-bold text-on-surface border border-outline hover:border-on-surface transition-colors">
            <svg class="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <path stroke-linecap="round" stroke-linejoin="round" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
            </svg>
            info@coregym.club
          </a>
          <a href="tel:0850924549" class="inline-flex items-center justify-center gap-2 px-6 py-3 bg-white rounded-full font-bold text-on-surface border border-outline hover:border-on-surface transition-colors">
            <svg class="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <path stroke-linecap="round" stroke-linejoin="round" d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
            </svg>
            08-509 245 49
          </a>
        </div>
      </div>
    </section>

    <!-- Student Verification Modal -->
    <ModalsStudentVerificationModal
      v-if="showVerificationModal && verificationProduct"
      :product-name="verificationProduct.name"
      :product-price="verificationProduct.price"
      :checkout-url="verificationProduct.checkoutUrl"
      :verification-type="verificationProduct.type"
      @close="showVerificationModal = false"
    />

    <!-- Sambo Verification Modal -->
    <ModalsSamboVerificationModal
      v-if="showSamboModal && samboProduct"
      :product-id="samboProduct.id"
      :product-name="samboProduct.name"
      :product-price="samboProduct.price"
      :checkout-base-url="CHECKOUT_URL"
      @close="showSamboModal = false"
    />
  </div>
</template>