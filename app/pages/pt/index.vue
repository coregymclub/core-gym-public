<script setup lang="ts">
import type { Trainer } from '~/composables/useSheets'

useHead({
  title: 'Personlig Träning - Core Gym Club',
  meta: [
    { name: 'description', content: 'Ibland behöver man en knuff i rätt riktning. Våra PT:s hjälper dig hitta din väg.' }
  ]
})

const { openPTSheet, openPTDetailSheet } = useSheets()

// Fetch trainers from API
const { data: trainers } = await useFetch<Trainer[]>('/api/trainers')

const methodologySteps = [
  {
    step: '01',
    title: 'Konsultation',
    description: 'Vi ses och pratar igenom dina mål, din historik och vad du vill uppnå. Det kostar inget och förbinder dig inte till något.'
  },
  {
    step: '02',
    title: 'Plan',
    description: 'Tillsammans lägger vi upp en plan som funkar i ditt liv. Träning, kost och återhämtning i balans.'
  },
  {
    step: '03',
    title: 'Resultat',
    description: 'Vi tränar, justerar och peppar. Vi mäter framstegen så du svart på vitt ser att det händer grejer.'
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
</script>

<template>
  <div>
    <!-- Hero Section -->
    <section class="min-h-[70vh] flex items-center justify-center bg-on-surface text-white px-6 relative overflow-hidden">
       <!-- Background Image -->
      <div class="absolute inset-0 z-0">
         <img src="/images/lifting-eleiko-nike-dark.webp" alt="Background" class="w-full h-full object-cover opacity-30 mix-blend-overlay" />
         <div class="absolute inset-0 bg-gradient-to-t from-on-surface via-on-surface/50 to-transparent" />
      </div>

      <div class="container text-center relative z-10 max-w-4xl pt-20">
        <span class="inline-block px-4 py-2 rounded-full border border-white/20 bg-white/10 backdrop-blur mb-8 text-sm font-bold tracking-widest uppercase">
          Din investering i dig själv
        </span>
        <h1 class="text-hero text-white mb-8 animate-slide-up">Personlig Träning</h1>
        <p class="text-lead text-white/80 mb-12 max-w-2xl mx-auto animate-slide-up" style="animation-delay: 0.1s">
          Ibland behöver man en knuff i rätt riktning. <br class="hidden md:inline" />
          Våra PT:s hjälper dig hitta din väg.
        </p>
        <button class="btn-primary text-lg px-10 py-5 h-auto animate-slide-up" style="animation-delay: 0.2s" @click="openPTSheet()">
          Boka kostnadsfri konsultation
        </button>
      </div>
    </section>

    <!-- Philosophy / Benefits -->
    <section class="section bg-surface">
      <div class="container">
        <div class="text-center mb-16 max-w-3xl mx-auto">
          <h2 class="text-display mb-6">Inte bara träning</h2>
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
        <div class="grid md:grid-cols-3 gap-12">
          <div v-for="(step, index) in methodologySteps" :key="step.step" class="relative">
            <!-- Connector line -->
            <div v-if="index < 2" class="hidden md:block absolute top-8 left-1/2 w-full h-0.5 bg-outline -z-10" />
            
            <div class="text-center bg-surface p-8 rounded-3xl shadow-sm h-full">
              <span class="text-display text-on-surface/10 block mb-4 text-6xl font-bold">{{ step.step }}</span>
              <h3 class="text-title mb-4">{{ step.title }}</h3>
              <p class="text-body text-on-surface-dim">{{ step.description }}</p>
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

        <div class="grid sm:grid-cols-2 lg:grid-cols-4 gap-8">
          <button
            v-for="trainer in trainers"
            :key="trainer.id"
            class="group text-center"
            @click="openPTDetailSheet(trainer)"
          >
            <!-- Avatar -->
            <div class="relative w-48 h-48 mx-auto mb-6">
              <div class="absolute inset-0 bg-brand rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-300 blur-xl" />
              <div class="relative w-full h-full rounded-full overflow-hidden border-4 border-surface shadow-elevated group-hover:scale-105 transition-transform duration-300">
                <img
                  v-if="trainer.imageUrl"
                  :src="trainer.imageUrl"
                  :alt="trainer.name"
                  class="w-full h-full object-cover grayscale group-hover:grayscale-0 transition-all duration-500"
                />
                <div v-else class="w-full h-full flex items-center justify-center text-on-surface-dim bg-surface-dim">
                  <span class="text-3xl font-bold">{{ trainer.name.charAt(0) }}</span>
                </div>
              </div>
            </div>

            <!-- Info -->
            <div>
              <h3 class="text-title mb-2 group-hover:text-brand transition-colors">
                {{ trainer.name }}
              </h3>

              <!-- Specialties -->
              <div v-if="trainer.specialties?.length" class="flex flex-wrap justify-center gap-2 mb-4">
                <span
                  v-for="specialty in trainer.specialties.slice(0, 2)"
                  :key="specialty"
                  class="text-xs font-bold uppercase tracking-wide px-3 py-1 bg-surface-dim text-on-surface-dim rounded-full"
                >
                  {{ specialty }}
                </span>
              </div>
              
              <span class="text-brand font-bold text-sm inline-flex items-center opacity-0 group-hover:opacity-100 transform translate-y-2 group-hover:translate-y-0 transition-all duration-300">
                Läs mer
                <svg class="w-4 h-4 ml-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 8l4 4m0 0l-4 4m4-4H3" />
                </svg>
              </span>
            </div>
          </button>
        </div>
      </div>
    </section>

    <!-- FAQ -->
    <section class="section bg-surface-dim">
      <div class="container">
        <h2 class="text-section mb-12">Vanliga frågor</h2>
        <div class="max-w-3xl mx-auto space-y-4">
          <details v-for="faq in faqs" :key="faq.question" class="group bg-surface rounded-2xl p-6 cursor-pointer list-none shadow-sm hover:shadow-md transition-shadow">
            <summary class="flex items-center justify-between font-bold text-lg text-on-surface">
              {{ faq.question }}
              <span class="text-brand transform group-open:rotate-180 transition-transform duration-300">
                <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7" /></svg>
              </span>
            </summary>
            <p class="mt-4 text-body text-on-surface-dim leading-relaxed">
              {{ faq.answer }}
            </p>
          </details>
        </div>
      </div>
    </section>

    <!-- CTA Section -->
    <section class="section bg-brand text-white relative overflow-hidden">
      <!-- Decorational circles -->
      <div class="absolute top-0 left-0 w-[600px] h-[600px] bg-white/10 rounded-full -translate-x-1/2 -translate-y-1/2 blur-3xl" />
      <div class="absolute bottom-0 right-0 w-[600px] h-[600px] bg-black/10 rounded-full translate-x-1/3 translate-y-1/3 blur-3xl" />

      <div class="container text-center relative z-10 max-w-4xl mx-auto">
        <h2 class="text-display-lg mb-8">Osäker på vem som passar dig?</h2>
        <p class="text-headline text-white/90 mb-12">
          Ingen fara. Skicka en förfrågan så matchar vi dig med rätt PT utifrån dina mål.
        </p>
        <button
          class="btn bg-white text-brand hover:bg-surface-dim border-none shadow-xl px-10 py-5 h-auto text-lg"
          @click="openPTSheet()"
        >
          Matcha mig med en PT
        </button>
      </div>
    </section>
  </div>
</template>
