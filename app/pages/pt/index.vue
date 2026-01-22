<script setup lang="ts">
import type { Trainer } from '~/composables/useSheets'

useHead({
  title: 'Personlig Träning - Core Gym Club',
  meta: [
    { name: 'description', content: 'Din kropp, dina mål. Våra PT:s hjälper dig hitta träningsglädjen och nå resultat. Träning utan trösklar.' }
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
    description: 'Vi ses och pratar igenom vad du vill uppnå. Helt kostnadsfritt och utan krav.',
    image: '/images/pt/konsultation.webp',
    trainer: 'Filip'
  },
  {
    step: '02',
    title: 'Plan',
    description: 'Vi lägger upp en plan som funkar i ditt liv. Träning ska ge energi, inte ta.',
    image: '/images/pt/pt-bild02.webp',
    trainer: 'Denise'
  },
  {
    step: '03',
    title: 'Resultat',
    description: 'Vi tränar, justerar och peppar. Vi mäter framstegen så du ser din utveckling svart på vitt.',
    image: '/images/pt/joel-pt-bild2.webp',
    trainer: 'Joel'
  },
  {
    step: '04',
    title: 'Hållbarhet',
    description: 'Målet är inte bara snabba resultat, utan att ge dig verktygen för att hålla i träningen livet ut.',
    image: '/images/pt/denise-portrait.avif',
    trainer: 'Michaela'
  }
]

const faqs = [
  {
    question: 'Måste jag vara vältränad för att ha PT?',
    answer: 'Inte alls. En PT är till för att hjälpa dig dit du vill, oavsett var du startar. Vi möter dig där du är.'
  },
  {
    question: 'Vad kostar det?',
    answer: 'Det beror på vad du vill ha och hur många timmar du köper. Boka en gratis konsultation så hittar vi ett upplägg som passar din plånbok.'
  },
  {
    question: 'Kan jag träna med en kompis?',
    answer: 'Absolut! Vi erbjuder Duo-PT för er som vill träna tillsammans. Dubbelt så kul, och billigare per person.'
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

// Slot machine state
const showSlotMachine = ref(false)
const isSpinning = ref(false)
const slotIndex = ref(0)
const selectedTrainer = ref<Trainer | null>(null)
const spinPhase = ref<'idle' | 'spinning' | 'slowing' | 'done'>('idle')

function startSlotMachine() {
  if (!trainers.value?.length) return
  showSlotMachine.value = true
  isSpinning.value = true
  selectedTrainer.value = null
  spinPhase.value = 'spinning'

  // Spin through trainers with realistic slowdown
  let spins = 0
  const totalSpins = 25 + Math.floor(Math.random() * 10)
  let currentDelay = 60

  const spin = () => {
    slotIndex.value = (slotIndex.value + 1) % trainers.value!.length
    spins++

    if (spins >= totalSpins) {
      spinPhase.value = 'done'
      isSpinning.value = false
      selectedTrainer.value = trainers.value![slotIndex.value]
      return
    }

    // Gradual slowdown in the last 10 spins
    if (spins > totalSpins - 10) {
      spinPhase.value = 'slowing'
      currentDelay += 30
    }

    setTimeout(spin, currentDelay)
  }

  setTimeout(spin, currentDelay)
}

function closeSlotMachine() {
  showSlotMachine.value = false
  isSpinning.value = false
  selectedTrainer.value = null
}

function selectRandomTrainer() {
  if (selectedTrainer.value) {
    const trainer = selectedTrainer.value
    closeSlotMachine()
    setTimeout(() => {
      openPTDetailSheet(trainer)
    }, 200)
  }
}
</script>

<template>
  <div>
    <!-- Hero Section - Responsive images -->
    <section class="min-h-[100svh] flex items-end justify-center bg-on-surface text-white px-6 relative overflow-hidden">
       <!-- Background Image - Mobile -->
      <div class="absolute inset-0 z-0 md:hidden">
         <img src="/images/pt/hero-mobile-duotone.webp" alt="Personlig träning på Core Gym" class="w-full h-full object-cover object-top grayscale" />
         <div class="absolute inset-0 bg-gradient-to-t from-on-surface/80 via-transparent to-transparent" />
      </div>

      <!-- Background Image - Desktop -->
      <div class="absolute inset-0 z-0 hidden md:block">
         <img src="/images/pt/denise-pt-hero.avif?v=1" alt="Personlig träning på Core Gym" class="w-full h-full object-cover object-center grayscale" />
         <div class="absolute inset-0 bg-gradient-to-t from-on-surface via-on-surface/40 to-on-surface/20" />
      </div>

      <div class="container text-center relative z-10 max-w-4xl pb-32 md:pb-40">
        <span class="inline-block px-5 py-2.5 rounded-full bg-brand/80 backdrop-blur-md border border-white/20 shadow-lg mb-6 text-sm font-bold tracking-widest uppercase animate-slide-up text-white">
          Fokus på dig
        </span>
        <h1 class="text-hero text-white mb-6 animate-slide-up leading-none" style="animation-delay: 0.05s">Personlig Träning</h1>
        <p class="text-xl md:text-2xl text-white/80 max-w-xl mx-auto font-medium animate-slide-up leading-tight tracking-tight" style="animation-delay: 0.1s">
          Din kropp. Dina mål. Vår kunskap. Tillsammans hittar vi vägen som funkar för dig.
        </p>
      </div>
    </section>

    <!-- Philosophy / Benefits -->
    <section class="section bg-surface">
      <div class="container">
        <div class="text-center mb-16 max-w-3xl mx-auto">
          <h2 class="font-display font-bold text-4xl md:text-5xl mb-6 uppercase tracking-tight">Mer än bara reps</h2>
          <p class="text-body-lg text-on-surface-dim">
            Att anlita en PT handlar inte bara om att lyfta tungt. Det handlar om att hitta glädjen i rörelse, 
            känna sig trygg i gymmet och bli stark i vardagen.
          </p>
        </div>

        <div class="grid md:grid-cols-3 gap-6">
          <div class="p-8 rounded-2xl bg-surface-dim">
            <h3 class="font-display font-bold text-lg uppercase tracking-tight mb-2">Skräddarsytt program</h3>
            <p class="text-on-surface-dim leading-relaxed">Din PT analyserar din kropp, dina mål och din vardag för att bygga ett program som faktiskt funkar för dig.</p>
          </div>
          <div class="p-8 rounded-2xl bg-surface-dim">
            <h3 class="font-display font-bold text-lg uppercase tracking-tight mb-2">Teknik & säkerhet</h3>
            <p class="text-on-surface-dim leading-relaxed">Med en PT vid din sida lär du dig rätt teknik från start. Du kan pusha hårdare när någon säkrar.</p>
          </div>
          <div class="p-8 rounded-2xl bg-surface-dim">
            <h3 class="font-display font-bold text-lg uppercase tracking-tight mb-2">Ansvar & motivation</h3>
            <p class="text-on-surface-dim leading-relaxed">En bokad tid är svårare att skippa. Din PT håller dig ansvarig och peppar dig framåt.</p>
          </div>
        </div>
      </div>
    </section>

    <!-- Methodology / Process -->
    <section class="section bg-surface-dim relative overflow-hidden">
      <div class="container relative z-10">
        <h2 class="text-section mb-16">Så funkar det</h2>
        <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <div v-for="(step, index) in methodologySteps" :key="step.step" class="group relative aspect-square md:aspect-[4/5] rounded-[2rem] md:rounded-[2.5rem] overflow-hidden shadow-lg transition-transform duration-500 hover:-translate-y-2">
            <!-- Background Image -->
            <img
              :src="step.image"
              :alt="step.trainer"
              loading="lazy"
              class="absolute inset-0 w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
            />

            <!-- White Overlay -->
            <div class="absolute inset-0 bg-white/75 group-hover:bg-white/70 transition-colors duration-500"></div>

            <!-- Step Number - Large with opacity -->
            <span class="absolute top-4 right-5 font-display font-black text-7xl md:text-8xl text-black/10 leading-none select-none pointer-events-none">
              {{ step.step }}
            </span>

            <!-- Content -->
            <div class="absolute inset-0 p-6 md:p-8 flex flex-col justify-end">
              <h3 class="font-display font-bold text-2xl md:text-3xl text-on-surface mb-3 uppercase tracking-tight">{{ step.title }}</h3>
              <p class="text-on-surface-dim text-sm md:text-base leading-relaxed font-medium">
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
                loading="lazy"
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

        <!-- Random PT picker -->
        <div class="mt-16 text-center">
          <div class="inline-block bg-surface-dim rounded-[2rem] p-8 md:p-10 max-w-md">
            <img src="/images/pt/pt-slumpa.png" alt="Slumpa PT" loading="lazy" class="w-24 h-24 mx-auto mb-4 object-contain" />
            <h3 class="font-display font-bold text-xl md:text-2xl uppercase tracking-tight mb-3">Svårt att välja?</h3>
            <p class="text-on-surface-dim mb-6 leading-relaxed">
              Alla våra PT:s är grymma. Låt ödet avgöra vem som blir din nya coach!
            </p>
            <button
              class="w-full px-8 py-4 bg-on-surface text-white hover:bg-black rounded-full transition-colors"
              @click="startSlotMachine"
            >
              <span class="font-display font-bold text-lg uppercase tracking-wide">Slumpa min PT</span>
            </button>
          </div>
        </div>
      </div>
    </section>

    <!-- Slot Machine Modal -->
    <Teleport to="body">
      <Transition name="fade">
        <div
          v-if="showSlotMachine"
          class="fixed inset-0 z-[300] bg-black/90 backdrop-blur-md flex items-center justify-center p-4"
          @click.self="closeSlotMachine"
        >
          <div class="bg-surface rounded-[2.5rem] p-8 md:p-10 max-w-md w-full text-center relative overflow-hidden">
            <!-- Close button -->
            <button
              class="absolute top-4 right-4 w-10 h-10 rounded-full bg-surface-dim hover:bg-surface-container flex items-center justify-center transition-colors"
              @click="closeSlotMachine"
            >
              <svg class="w-5 h-5 text-on-surface" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>

            <!-- Header text based on phase -->
            <div class="mb-8">
              <h3 class="font-display font-bold text-2xl md:text-3xl uppercase tracking-tight">
                <template v-if="spinPhase === 'spinning'">Vem blir det...</template>
                <template v-else-if="spinPhase === 'slowing'">Nästan...</template>
                <template v-else>Din PT är</template>
              </h3>
            </div>

            <!-- Spinning trainer display -->
            <div class="relative h-48 mb-6">
              <div
                v-if="trainers?.length"
                class="absolute inset-0 flex items-center justify-center"
              >
                <div
                  class="w-36 h-36 md:w-40 md:h-40 rounded-full overflow-hidden ring-4 transition-all duration-300"
                  :class="[
                    isSpinning ? 'ring-brand/40 scale-95' : 'ring-brand scale-100 shadow-2xl',
                    spinPhase === 'done' ? 'ring-8' : ''
                  ]"
                >
                  <img
                    v-if="trainers[slotIndex]?.imageUrl"
                    :src="trainers[slotIndex].imageUrl"
                    :alt="trainers[slotIndex].name"
                    class="w-full h-full object-cover transition-transform duration-300"
                    :class="spinPhase === 'done' ? 'scale-105' : ''"
                  />
                </div>
              </div>

              <!-- Spinning effect overlay -->
              <div
                v-if="isSpinning"
                class="absolute inset-0 pointer-events-none transition-opacity duration-300"
                :class="spinPhase === 'slowing' ? 'opacity-50' : 'opacity-100'"
                style="background: linear-gradient(to bottom, rgba(255,255,255,0.9) 0%, transparent 25%, transparent 75%, rgba(255,255,255,0.9) 100%)"
              />
            </div>

            <!-- Trainer name -->
            <div class="mb-8">
              <p
                class="font-display font-bold text-3xl md:text-4xl uppercase tracking-tight transition-all duration-300"
                :class="isSpinning ? 'opacity-40 scale-95' : 'opacity-100 scale-100'"
              >
                {{ trainers?.[slotIndex]?.name?.split(' ')[0] || '' }}
              </p>
            </div>

            <!-- Action button -->
            <div v-if="!isSpinning && selectedTrainer">
              <button
                class="w-full py-4 bg-brand text-white font-display font-bold text-lg uppercase tracking-wide rounded-full hover:bg-brand/90 transition-all hover:scale-[1.02] active:scale-[0.98]"
                @click="selectRandomTrainer"
              >
                Säg hej till {{ selectedTrainer.name.split(' ')[0] }}
              </button>
            </div>

            <!-- Loading state -->
            <div v-else-if="isSpinning" class="h-[104px] flex items-center justify-center">
              <div class="flex gap-1">
                <span class="w-2 h-2 bg-brand rounded-full animate-bounce" style="animation-delay: 0ms"></span>
                <span class="w-2 h-2 bg-brand rounded-full animate-bounce" style="animation-delay: 150ms"></span>
                <span class="w-2 h-2 bg-brand rounded-full animate-bounce" style="animation-delay: 300ms"></span>
              </div>
            </div>
          </div>
        </div>
      </Transition>
    </Teleport>

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
        <h2 class="font-display font-bold text-5xl md:text-6xl lg:text-7xl mb-8 uppercase tracking-tighter">Hitta rätt coach</h2>
        <p class="text-xl md:text-2xl text-white/90 mb-12 leading-relaxed font-medium">
          Vi hjälper dig hitta en PT som förstår dina mål. Skicka en förfrågan så hörs vi!
        </p>
        <button
          class="btn btn-light btn-xl"
          @click="openPTSheet()"
        >
          Boka kostnadsfri konsultation
        </button>
      </div>
    </section>
  </div>
</template>

<style scoped>
.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.3s ease;
}
.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}
</style>
