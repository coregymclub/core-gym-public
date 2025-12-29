<script setup lang="ts">
import type { Trainer } from '~/composables/useSheets'

useHead({
  title: 'Personlig Träning - Core Gym Club',
  meta: [
    { name: 'description', content: 'Ibland behöver man en knuff i rätt riktning. Våra PT:s hjälper dig hitta din väg.' }
  ]
})

useThemeColor('#1a1a1a')

const { openPTSheet, openPTDetailSheet } = useSheets()

// Fetch trainers from API
const { data: trainers } = await useFetch<Trainer[]>('/api/trainers')

const methodologySteps = [
  {
    step: '01',
    title: 'Konsultation',
    description: 'Vi ses och pratar igenom dina mål, din historik och vad du vill uppnå. Det kostar inget och förbinder dig inte till något.',
    image: '/images/pt/konsultation.webp',
    trainer: 'Filip'
  },
  {
    step: '02',
    title: 'Plan',
    description: 'Tillsammans lägger vi upp en plan som funkar i ditt liv. Träning, kost och återhämtning i balans.',
    image: 'https://coregymclub.zoezi.se/image/get?id=2c0876db-893d-4cdb-8c22-8d97461e005e&width=800&height=800',
    trainer: 'Denise'
  },
  {
    step: '03',
    title: 'Resultat',
    description: 'Vi tränar, justerar och peppar. Vi mäter framstegen så du svart på vitt ser att det händer grejer.',
    image: 'https://coregymclub.zoezi.se/image/get?id=a0a45ca4-15e5-430c-8cda-701b59ae73fd&width=800&height=800',
    trainer: 'Joel'
  },
  {
    step: '04',
    title: 'Hållbarhet',
    description: 'Målet är inte bara snabba resultat, utan att ge dig verktygen för att hålla i träningen livet ut.',
    image: 'https://coregymclub.zoezi.se/image/get?id=3109997f-cdb8-4446-ab26-54c7933ce27a&width=800&height=800',
    trainer: 'Michan'
  }
]

const faqs = [
  {
    question: 'Måste jag vara vältränad för att ha PT?',
    answer: 'Tvärtom! En PT är till för att hjälpa dig dit du vill, oavsett var du startar. Många av våra kunder är nybörjare.'
  },
  {
    question: 'Vad kostar det?',
    answer: 'Priset varierar beroende på PT och hur många timmar du köper. Boka en kostnadsfri konsultation så går vi igenom upplägget.'
  },
  {
    question: 'Kan jag träna med en kompis?',
    answer: 'Absolut! Vi erbjuder Duo-PT för er som vill träna tillsammans. Det är både roligt och kostnadseffektivt.'
  },
  {
    question: 'Hur långt är ett pass?',
    answer: 'Ett standardpass är 55 minuter. Det ger oss tid för uppvärmning, effektiv träning och nedvarvning.'
  }
]

const openFaq = ref<number | null>(null)

function toggleFaq(index: number) {
  openFaq.value = openFaq.value === index ? null : index
}
</script>

<template>
  <div>
    <!-- Hero Section -->
    <section class="min-h-[100svh] flex items-end justify-center bg-on-surface text-white px-6 relative overflow-hidden">
       <!-- Background Image -->
      <div class="absolute inset-0 z-0">
         <img src="/images/pt/hero-mobile-duotone.webp" alt="Personlig träning på Core Gym" class="w-full h-full object-cover object-top" />
         <div class="absolute inset-0 bg-gradient-to-t from-on-surface/80 via-transparent to-transparent" />
      </div>

      <div class="container text-center relative z-10 max-w-4xl pb-32 md:pb-40">
        <span class="inline-block px-4 py-2 rounded-full border border-white/20 bg-white/10 backdrop-blur mb-6 text-sm font-bold tracking-widest uppercase">
          Din investering i dig själv
        </span>
        <h1 class="text-hero text-white mb-6 animate-slide-up leading-none">Personlig Träning</h1>
        <p class="text-xl md:text-2xl text-white/80 max-w-xl mx-auto font-medium animate-slide-up leading-tight tracking-tight" style="animation-delay: 0.1s">
          Ibland behöver man en knuff i rätt riktning. Våra PT:s hjälper dig hitta din väg.
        </p>
      </div>
    </section>

    <!-- Philosophy / Benefits -->
    <section class="section bg-surface">
      <div class="container">
        <div class="text-center mb-16 max-w-3xl mx-auto">
          <h2 class="font-display font-bold text-4xl md:text-5xl mb-6 uppercase tracking-tight">Inte bara träning</h2>
          <p class="text-body-lg text-on-surface-dim">
            Att anlita en PT handlar inte bara om att lyfta tungt. Det handlar om att lära känna sin kropp, 
            undvika skador och hitta glädjen i rörelse som håller hela livet.
          </p>
        </div>

        <div class="grid md:grid-cols-3 gap-8">
          <div class="card bg-surface-dim p-8 text-center hover:-translate-y-2 transition-transform duration-300">
            <div class="w-16 h-16 bg-surface rounded-full flex items-center justify-center mx-auto mb-6 shadow-sm text-brand">
              <svg class="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <h3 class="text-title mb-3">Din väg</h3>
            <p class="text-body text-on-surface-dim">Inga standardprogram. Vi utgår från dig, din kropp och dina mål.</p>
          </div>
          <div class="card bg-surface-dim p-8 text-center hover:-translate-y-2 transition-transform duration-300">
            <div class="w-16 h-16 bg-surface rounded-full flex items-center justify-center mx-auto mb-6 shadow-sm text-brand">
              <svg class="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 10V3L4 14h7v7l9-11h-7z" />
              </svg>
            </div>
            <h3 class="text-title mb-3">Teknik & Pepp</h3>
            <p class="text-body text-on-surface-dim">Lär dig lyfta rätt, springa smartare och våga ta i lite mer än du trodde var möjligt.</p>
          </div>
          <div class="card bg-surface-dim p-8 text-center hover:-translate-y-2 transition-transform duration-300">
            <div class="w-16 h-16 bg-surface rounded-full flex items-center justify-center mx-auto mb-6 shadow-sm text-brand">
              <svg class="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <h3 class="text-title mb-3">När det passar dig</h3>
            <p class="text-body text-on-surface-dim">Morgonpigg eller kvällsmänniska? Vi hittar en tid som funkar i ditt liv.</p>
          </div>
        </div>
      </div>
    </section>

    <!-- Methodology / Process -->
    <section class="section bg-surface-dim relative overflow-hidden">
      <div class="container relative z-10">
        <h2 class="text-section mb-16">Så funkar det</h2>
        <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <div v-for="(step, index) in methodologySteps" :key="step.step" class="group relative aspect-[4/5] rounded-[2.5rem] overflow-hidden shadow-lg transition-transform duration-500 hover:-translate-y-2">
            <!-- Background Image -->
            <img 
              :src="step.image" 
              :alt="step.trainer" 
              class="absolute inset-0 w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
            />
            
            <!-- Dark Overlay -->
            <div class="absolute inset-0 bg-gradient-to-t from-black/90 via-black/40 to-transparent group-hover:from-black/95 group-hover:via-black/60 transition-colors duration-500"></div>

            <!-- Step Number - Large & Absolute -->
            <div class="absolute top-6 right-6 font-display font-bold text-6xl text-white/10 select-none pointer-events-none">
              {{ step.step }}
            </div>

            <!-- Content -->
            <div class="absolute bottom-0 left-0 right-0 p-8 flex flex-col justify-end h-full">
              <span class="inline-block w-12 h-12 rounded-full bg-brand flex items-center justify-center text-white font-bold text-lg mb-6 shadow-lg group-hover:scale-110 transition-transform duration-300">
                {{ step.step }}
              </span>
              <h3 class="font-display font-bold text-3xl text-white mb-4 uppercase tracking-tight">{{ step.title }}</h3>
              <p class="text-white/80 leading-relaxed font-medium transform translate-y-4 opacity-90 group-hover:translate-y-0 group-hover:opacity-100 transition-all duration-300">
                {{ step.description }}
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>

    <!-- Trainers Section -->
    <section class="section bg-surface">
      <div class="container">
        <h2 class="text-section mb-4">Våra tränare</h2>
        <p class="text-lead mb-16">Klicka på en tränare för att läsa mer.</p>

        <div class="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
          <button
            v-for="trainer in trainers"
            :key="trainer.id"
            class="group bg-surface-dim rounded-[2rem] p-6 text-center hover:bg-surface-container hover:-translate-y-1 hover:shadow-elevated transition-all duration-300"
            @click="openPTDetailSheet(trainer)"
          >
            <!-- Avatar -->
            <div class="w-28 h-28 mx-auto mb-5 rounded-full overflow-hidden shadow-lg group-hover:scale-105 transition-transform duration-300">
              <img
                v-if="trainer.imageUrl"
                :src="trainer.imageUrl"
                :alt="trainer.name"
                class="w-full h-full object-cover"
              />
              <div v-else class="w-full h-full flex items-center justify-center text-on-surface-dim bg-surface">
                <span class="text-2xl font-bold">{{ trainer.name.charAt(0) }}</span>
              </div>
            </div>

            <!-- Label -->
            <p class="text-xs font-bold uppercase tracking-widest text-brand mb-2">Personlig tränare</p>

            <!-- Name -->
            <h3 class="font-display font-bold text-xl text-on-surface uppercase tracking-tight mb-4 group-hover:text-brand transition-colors">
              {{ trainer.name.split(' ')[0] }}
            </h3>

            <!-- Quote -->
            <p class="text-body text-on-surface-dim leading-relaxed">
              "{{ trainer.quote }}"
            </p>
          </button>
        </div>
      </div>
    </section>

    <!-- FAQ -->
    <section class="section bg-surface-dim">
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

    <!-- CTA Section -->
    <section class="section bg-brand text-white relative overflow-hidden">
      <!-- Decorational circles -->
      <div class="absolute top-0 left-0 w-[600px] h-[600px] bg-white/10 rounded-full -translate-x-1/2 -translate-y-1/2 blur-3xl" />
      <div class="absolute bottom-0 right-0 w-[600px] h-[600px] bg-black/10 rounded-full translate-x-1/3 translate-y-1/3 blur-3xl" />

      <div class="container text-center relative z-10 max-w-4xl mx-auto">
        <h2 class="font-display font-bold text-5xl md:text-6xl lg:text-7xl mb-8 uppercase tracking-tighter">Osäker på vem som passar dig?</h2>
        <p class="text-xl md:text-2xl text-white/90 mb-12 leading-relaxed font-medium">
          Ingen fara. Skicka en förfrågan så matchar vi dig med rätt PT utifrån dina mål.
        </p>
        <button
          class="btn bg-white text-brand hover:bg-surface-dim border-none shadow-xl px-14 py-5 h-auto text-xl rounded-full hover:shadow-[0_20px_50px_rgba(0,0,0,0.3)] hover:-translate-y-1 transition-all"
          @click="openPTSheet()"
        >
          Matcha mig med en PT
        </button>
      </div>
    </section>
  </div>
</template>
