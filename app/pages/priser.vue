<script setup lang="ts">
useHead({
  title: 'Bli medlem - Core Gym Club',
  meta: [
    { name: 'description', content: 'Medlemskap från 360 kr/mån. Ett kort, fyra gym. Inga bindningstider.' }
  ]
})

const CHECKOUT_URL = 'https://coregymclub.zoezi.se/homepage/56'

const clubs = [
  { id: 'vegastaden', name: 'Vegastaden' },
  { id: 'tungelsta', name: 'Tungelsta' },
  { id: 'vasterhaninge', name: 'Västerhaninge' },
  { id: 'osmo', name: 'Ösmo' },
]

const categories = [
  { id: 'ordinarie', name: 'Ordinarie', desc: 'Alla åldrar' },
  { id: 'student', name: 'Student', desc: 'Med giltigt CSN' },
  { id: 'senior', name: 'Senior 65+', desc: 'Pensionärsrabatt' },
]

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
  osmo: {
    ordinarie: [],
    student: [],
    senior: []
  }
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
  osmo: {
    headline: 'Kommer 2026',
    amenities: [
      { icon: 'clock', text: 'Öppettider kommer' },
      { icon: 'sparkles', text: 'Nybyggt gym' },
    ],
    extra: 'Vi bygger för fullt! Håll utkik för mer information och förköpserbjudanden.'
  }
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

const selectedClub = ref<string | null>(null)
const selectedCategory = ref('ordinarie')

const currentProducts = computed(() => {
  if (!selectedClub.value) return []
  return products[selectedClub.value]?.[selectedCategory.value] || []
})

function getCheckoutUrl(product: any) {
  let url = `${CHECKOUT_URL}?product=${product.id}`
  if (product.discount) url += `&discount=${product.discount}`
  return url
}

function toggleFaq(index: number) {
  openFaq.value = openFaq.value === index ? null : index
}
</script>

<template>
  <div class="grain relative min-h-screen flex flex-col">
    <!-- Hero -->
    <section class="min-h-[70vh] flex flex-col justify-end items-center px-6 pb-32 md:pb-40 relative overflow-hidden bg-surface-bright">
      <!-- Background Image -->
      <div class="absolute inset-0 z-0">
        <img
          src="/images/lifting-eleiko-nike-dark.webp"
          alt="Medlemskap"
          class="w-full h-full object-cover opacity-90 scale-105"
        />
        <div class="absolute inset-0 bg-gradient-to-t from-black/80 via-black/30 to-transparent" />
      </div>

      <div class="container text-center relative z-10">
        <h1 class="font-display font-bold text-5xl md:text-7xl lg:text-8xl text-white mb-6 animate-slide-up uppercase tracking-tighter leading-[0.9]">Bli medlem</h1>
        <p class="text-2xl md:text-3xl text-white/90 font-medium max-w-2xl mx-auto animate-slide-up leading-relaxed" style="animation-delay: 0.1s">
          Välj ditt gym. Välj din plan. Börja träna idag.
        </p>
      </div>
    </section>

    <!-- Steg 1: Välj gym -->
    <section v-if="!selectedClub" class="section bg-surface pt-0 relative z-20 -mt-24">
      <div class="container max-w-5xl px-4">
        <div class="bg-surface rounded-3xl p-8 md:p-16 shadow-elevated-lg border border-outline/30">
          <div class="text-center mb-12">
            <span class="inline-flex items-center justify-center w-14 h-14 rounded-full bg-on-surface text-white text-2xl font-bold font-display mb-8">1</span>
            <h2 class="font-display font-bold text-4xl md:text-5xl mb-4 uppercase tracking-tight">Välj anläggning</h2>
            <p class="text-lg text-on-surface-dim font-medium">Var vill du träna mest?</p>
          </div>

          <div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <button
              v-for="club in clubs"
              :key="club.id"
              @click="selectedClub = club.id"
              class="group relative overflow-hidden rounded-2xl p-8 text-center bg-surface-container hover:bg-on-surface border border-transparent transition-all duration-300 hover:-translate-y-1 active:scale-98"
            >
              <h3 class="font-display font-bold text-2xl md:text-3xl text-on-surface group-hover:text-white transition-colors uppercase tracking-tight">{{ club.name }}</h3>
            </button>
          </div>
        </div>
      </div>
    </section>

    <!-- Steg 2: Välj medlemskap -->
    <section v-else class="section bg-surface pt-0 relative z-20 -mt-24">
      <div class="container max-w-5xl px-4">
        <div class="bg-surface rounded-3xl p-6 md:p-16 shadow-elevated-lg border border-outline/30 animate-fade">
          <!-- Header -->
          <div class="flex flex-col items-center gap-6 mb-12 border-b border-outline/30 pb-8">
             <button @click="selectedClub = null" class="btn bg-surface-container text-on-surface hover:bg-surface-dim px-6 py-3 text-sm h-auto rounded-full font-bold">
              ← Byt gym
            </button>
            <h2 class="font-display font-bold text-4xl md:text-5xl text-center uppercase tracking-tight leading-none">{{ clubs.find(c => c.id === selectedClub)?.name }}</h2>
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
            <NuxtLink to="/osmo" class="btn bg-on-surface text-white hover:bg-black px-8 py-4 text-lg rounded-full shadow-lg border-none">
              Anmäl intresse
            </NuxtLink>
          </div>

          <!-- Product Selection -->
          <div v-else>
            <!-- Tabs -->
            <div class="flex flex-wrap justify-center gap-3 mb-12">
              <button
                v-for="cat in categories"
                :key="cat.id"
                @click="selectedCategory = cat.id"
                class="px-6 py-3 rounded-full text-base font-bold transition-all duration-300 border"
                :class="selectedCategory === cat.id 
                  ? 'bg-on-surface text-white border-on-surface shadow-md' 
                  : 'bg-transparent text-on-surface-dim border-outline/50 hover:border-on-surface hover:text-on-surface'"
              >
                {{ cat.name }}
              </button>
            </div>

            <!-- Products List -->
            <div class="flex flex-col gap-6 max-w-3xl mx-auto">
              <a
                v-for="product in currentProducts"
                :key="product.id"
                :href="getCheckoutUrl(product)"
                class="group relative bg-white border border-outline hover:border-on-surface rounded-2xl p-6 md:p-10 transition-all duration-300 hover:shadow-elevated hover:-translate-y-1 flex flex-col md:flex-row items-center gap-6 md:gap-10"
                :class="{ 'ring-2 ring-on-surface/10': product.popular }"
              >
                <div v-if="product.popular" class="absolute -top-3 left-1/2 -translate-x-1/2 bg-on-surface text-white text-xs font-bold uppercase tracking-widest px-4 py-1.5 rounded-full shadow-md">
                  Rekommenderas
                </div>

                <div class="flex-1 text-center md:text-left w-full">
                  <h3 class="font-display font-bold text-3xl text-on-surface mb-3 uppercase tracking-tight leading-none">{{ product.name }}</h3>
                  <div class="flex flex-wrap gap-2 justify-center md:justify-start">
                    <span v-for="feat in product.features" :key="feat" class="text-xs font-bold text-on-surface-dim bg-surface-container px-3 py-1.5 rounded-lg uppercase tracking-wide">
                      {{ feat }}
                    </span>
                  </div>
                </div>

                <div class="text-center md:text-right flex-shrink-0 w-full md:w-auto border-t md:border-t-0 border-outline/30 pt-4 md:pt-0 mt-2 md:mt-0">
                  <div class="flex items-baseline justify-center md:justify-end gap-1 mb-2">
                    <span class="text-4xl md:text-5xl font-display font-bold text-on-surface tracking-tight">{{ product.price }}</span>
                    <span class="text-base font-bold text-on-surface-dim">{{ product.unit.replace('kr/', '') }}</span>
                  </div>
                  <span class="text-xs font-bold uppercase tracking-widest text-on-surface flex items-center justify-center md:justify-end gap-2 group-hover:gap-3 transition-all">
                    Välj plan
                    <svg class="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 8l4 4m0 0l-4 4m4-4H3" />
                    </svg>
                  </span>
                </div>
              </a>
            </div>
          </div>
        </div>
      </div>
    </section>

    <!-- Club Info Section -->
    <section v-if="selectedClub && currentClubInfo" class="section bg-surface-container">
      <div class="container text-center max-w-5xl px-4">
        <h2 class="font-display font-bold text-3xl md:text-5xl mb-12 text-on-surface uppercase tracking-tight leading-tight">{{ currentClubInfo.headline }}</h2>

        <div class="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-6 md:gap-10">
          <div v-for="amenity in currentClubInfo.amenities" :key="amenity.text" class="flex flex-col items-center gap-4 group">
            <div class="w-16 h-16 md:w-20 md:h-20 rounded-2xl md:rounded-[2rem] bg-white shadow-sm flex items-center justify-center text-on-surface group-hover:scale-105 transition-transform duration-300">
               <!-- Clock icon -->
              <svg v-if="amenity.icon === 'clock'" class="w-8 h-8" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                <circle cx="12" cy="12" r="10" stroke-width="2"/>
                <path stroke-linecap="round" stroke-width="2" d="M12 6v6l4 2"/>
              </svg>
              <!-- Dumbbell icon -->
              <svg v-else-if="amenity.icon === 'dumbbell'" class="w-8 h-8" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6.5 6.5h-2a1 1 0 0 0-1 1v9a1 1 0 0 0 1 1h2m0-11v11m0-11h2v11h-2m11-11h2a1 1 0 0 1 1 1v9a1 1 0 0 1-1 1h-2m0-11v11m0-11h-2v11h2m-6-11v11"/>
              </svg>
              <!-- Users icon -->
              <svg v-else-if="amenity.icon === 'users'" class="w-8 h-8" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2M9 11a4 4 0 1 0 0-8 4 4 0 0 0 0 8zm14 10v-2a4 4 0 0 0-3-3.87M16 3.13a4 4 0 0 1 0 7.75"/>
              </svg>
              <!-- Flame/sauna icon -->
              <svg v-else-if="amenity.icon === 'flame'" class="w-8 h-8" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 22c-4.97 0-9-2.582-9-7v-.088C3 12.794 4.338 11.1 6.375 10c1.949-1.052 3.101-2.99 2.813-5l-.563-3 2.086.795c3.757 1.43 6.625 4.526 7.29 8.379.137.794-.09 1.597-.59 2.151-.37.41-.404 1.018-.106 1.47.71 1.078.695 2.49-.039 3.548A4.48 4.48 0 0 1 14 21.522"/>
              </svg>
              <!-- Sparkles/EGYM/New icon -->
              <svg v-else-if="amenity.icon === 'sparkles'" class="w-8 h-8" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 3l1.912 5.813a2 2 0 0 0 1.275 1.275L21 12l-5.813 1.912a2 2 0 0 0-1.275 1.275L12 21l-1.912-5.813a2 2 0 0 0-1.275-1.275L3 12l5.813-1.912a2 2 0 0 0 1.275-1.275L12 3z"/>
              </svg>
              <!-- Key icon -->
              <svg v-else-if="amenity.icon === 'key'" class="w-8 h-8" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 2l-2 2m-7.61 7.61a5.5 5.5 0 1 1-7.778 7.778 5.5 5.5 0 0 1 7.777-7.777zm0 0L15.5 7.5m0 0l3 3L22 7l-3-3m-3.5 3.5L19 4"/>
              </svg>
              <!-- Heart icon -->
              <svg v-else-if="amenity.icon === 'heart'" class="w-8 h-8" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"/>
              </svg>
              <!-- Zap icon -->
              <svg v-else-if="amenity.icon === 'zap'" class="w-8 h-8" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 2L3 14h9l-1 8 10-12h-9l1-8z"/>
              </svg>
            </div>
            <span class="text-base font-bold text-on-surface-dim uppercase tracking-wide leading-snug">{{ amenity.text }}</span>
          </div>
        </div>

        <p v-if="currentClubInfo.extra" class="text-2xl text-on-surface-dim mt-16 italic font-medium max-w-3xl mx-auto leading-relaxed">{{ currentClubInfo.extra }}</p>
      </div>
    </section>

    <!-- FAQ -->
    <section class="section bg-surface">
      <div class="container max-w-4xl">
        <h2 class="font-display font-bold text-5xl mb-16 text-center uppercase tracking-tight">Vanliga frågor</h2>
        
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
  </div>
</template>