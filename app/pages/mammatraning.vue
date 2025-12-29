<script setup lang="ts">
useHead({
  title: 'Mammaträning - Core Gym Club',
  meta: [
    { name: 'description', content: 'Mammaträning i Haninge. Träna med bebis på Core Gym Club. Anpassade övningar efter graviditet. 4 pass i veckan på Vegastaden och Tungelsta.' },
  ]
})

// Theme color for iOS Safari and body background
useThemeColor('#881337')

const { schedule, loading, fetchSchedule } = useGroupTraining()

const mammaSchedule = computed(() => {
  return schedule.value.map(day => ({
    ...day,
    classes: day.classes.filter(c => {
      const lower = c.name.toLowerCase()
      return lower.includes('mamma') || lower.includes('bebis') || lower.includes('gravidträning')
    })
  })).filter(day => day.classes.length > 0)
})

const benefits = [
  {
    title: 'Stärk kroppen',
    description: 'Anpassade övningar för att bygga upp styrka efter graviditet.',
  },
  {
    title: 'Träffa andra mammor',
    description: 'Gemenskap och stöd i en liknande livssituation.',
  },
  {
    title: 'Bebis med',
    description: 'Ta med bebis och träna tryggt. Inga barnvakter krävs.',
  },
  {
    title: 'Flexibelt schema',
    description: '4 pass i veckan på två gym ger dig möjlighet att hitta en tid som passar.',
  },
]

function formatDateShort(dateStr: string): string {
  const [, month, day] = dateStr.split('-').map(Number)
  return `${day}/${month}`
}

onMounted(async () => {
  await fetchSchedule(7)
})
</script>

<template>
  <div>
    <!-- Hero -->
    <section class="min-h-[70vh] flex items-center justify-center bg-rose-900 text-white px-6 relative overflow-hidden">
      <div class="absolute inset-0 z-0">
        <div class="absolute inset-0 bg-gradient-to-br from-rose-900 via-pink-900 to-rose-800" />
        <!-- Decorative circles -->
        <div class="absolute top-1/4 -left-32 w-64 h-64 rounded-full border border-white/10" />
        <div class="absolute top-1/4 -left-32 w-96 h-96 rounded-full border border-white/5" />
        <div class="absolute bottom-1/4 -right-32 w-64 h-64 rounded-full border border-white/10" />
        <div class="absolute bottom-1/4 -right-32 w-96 h-96 rounded-full border border-white/5" />
      </div>

      <div class="text-center relative z-10 max-w-5xl mx-auto pt-32 pb-40">
        <span class="inline-block px-6 py-2 rounded-full bg-rose-500/20 text-rose-300 mb-8 text-sm font-bold tracking-widest uppercase">
          För nyblivna mammor
        </span>
        <h1 class="font-display font-bold text-5xl md:text-7xl lg:text-[6rem] leading-[0.9] text-white mb-8 uppercase tracking-tighter">
          Mammaträning
        </h1>
        <p class="text-xl md:text-2xl lg:text-3xl text-white/80 mb-12 max-w-2xl mx-auto leading-tight font-medium">
          Träna med bebis i Haninge. <br class="hidden md:inline" />
          Stärk kroppen och träffa andra mammor.
        </p>
        <a href="#schema" class="btn bg-rose-500 hover:bg-rose-400 text-white border-none px-12 py-6 h-auto text-xl rounded-full shadow-lg">
          Se schemat
        </a>
      </div>
    </section>

    <!-- Info Section -->
    <section class="section bg-surface relative z-10 -mt-16 rounded-t-[3rem] pt-24">
      <div class="container">
        <div class="text-center mb-20 max-w-3xl mx-auto">
          <h2 class="font-display font-bold text-4xl md:text-5xl mb-6 text-on-surface uppercase tracking-tight">
            Träning anpassad för dig
          </h2>
          <p class="text-2xl text-on-surface-dim font-medium">
            Efter graviditeten är kroppen i förändring. Våra mammapass är utformade för att hjälpa dig tillbaka — i din egen takt.
          </p>
        </div>

        <div class="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-4xl mx-auto">
          <div
            v-for="benefit in benefits"
            :key="benefit.title"
            class="p-8 rounded-[2rem] bg-gradient-to-br from-rose-50 to-pink-50 border border-rose-100"
          >
            <div class="flex items-start gap-4">
              <div class="w-10 h-10 rounded-full bg-rose-100 flex items-center justify-center flex-shrink-0">
                <svg class="w-5 h-5 text-rose-500" fill="currentColor" viewBox="0 0 20 20">
                  <path fill-rule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clip-rule="evenodd" />
                </svg>
              </div>
              <div>
                <h3 class="font-display font-bold text-xl text-rose-900 mb-2">{{ benefit.title }}</h3>
                <p class="text-lg text-on-surface-dim leading-relaxed">{{ benefit.description }}</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>

    <!-- Locations -->
    <section class="section bg-surface-dim">
      <div class="container">
        <div class="text-center mb-16 max-w-3xl mx-auto">
          <h2 class="font-display font-bold text-4xl md:text-5xl mb-6 text-on-surface uppercase tracking-tight">
            Två gym — fyra pass
          </h2>
          <p class="text-2xl text-on-surface-dim font-medium">
            Mammaträning finns på både Vegastaden och Tungelsta. Totalt 4 tillfällen i veckan.
          </p>
        </div>

        <div class="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-4xl mx-auto">
          <!-- Vegastaden -->
          <div class="bg-surface rounded-[2rem] overflow-hidden shadow-lg">
            <div class="aspect-video">
              <img src="/images/gyms/vegastaden.webp" alt="Core Gym Vegastaden" class="w-full h-full object-cover" />
            </div>
            <div class="p-8">
              <h3 class="font-display font-bold text-2xl text-on-surface mb-4">Vegastaden</h3>
              <NuxtLink to="/vegastaden" class="text-rose-600 font-bold hover:text-rose-700 transition-colors">
                Läs mer om Vegastaden →
              </NuxtLink>
            </div>
          </div>

          <!-- Tungelsta -->
          <div class="bg-surface rounded-[2rem] overflow-hidden shadow-lg">
            <div class="aspect-video">
              <img src="/images/gyms/tungelsta.webp" alt="Core Gym Tungelsta" class="w-full h-full object-cover" />
            </div>
            <div class="p-8">
              <h3 class="font-display font-bold text-2xl text-on-surface mb-4">Tungelsta</h3>
              <NuxtLink to="/tungelsta" class="text-rose-600 font-bold hover:text-rose-700 transition-colors">
                Läs mer om Tungelsta →
              </NuxtLink>
            </div>
          </div>
        </div>
      </div>
    </section>

    <!-- Schedule -->
    <section id="schema" class="section bg-surface">
      <div class="container">
        <div class="text-center mb-16 max-w-3xl mx-auto">
          <h2 class="font-display font-bold text-4xl md:text-5xl mb-6 text-on-surface uppercase tracking-tight">
            Schema
          </h2>
          <p class="text-2xl text-on-surface-dim font-medium">
            Kommande mammapass på våra gym
          </p>
        </div>

        <div v-if="loading" class="text-center py-24">
          <div class="w-10 h-10 border-2 border-rose-500 border-t-transparent rounded-full animate-spin mx-auto mb-4" />
          <p class="text-on-surface-dim">Hämtar schemat...</p>
        </div>

        <div v-else-if="mammaSchedule.length > 0" class="space-y-12 max-w-3xl mx-auto">
          <div
            v-for="day in mammaSchedule"
            :key="day.date"
            class="bg-gradient-to-r from-rose-50 to-pink-50 rounded-[2rem] p-8"
          >
            <div class="flex items-baseline gap-4 mb-6">
              <h3 class="font-display font-bold text-3xl text-rose-900 capitalize">{{ day.dayName }}</h3>
              <span class="text-xl text-rose-600/60 font-medium">{{ formatDateShort(day.date) }}</span>
            </div>
            <div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <NuxtLink
                v-for="cls in day.classes"
                :key="cls.id"
                :to="`/schema?pass=${cls.id}`"
                class="flex items-center justify-between p-5 bg-white rounded-2xl hover:shadow-lg transition-all duration-300 group"
              >
                <div>
                  <div class="font-display font-bold text-lg text-rose-900 group-hover:text-rose-600 transition-colors">{{ cls.name }}</div>
                  <div class="text-on-surface-dim font-medium">{{ cls.time }} - {{ cls.endTime }}</div>
                </div>
                <span class="text-sm text-on-surface-dim/60 font-medium">{{ cls.site }}</span>
              </NuxtLink>
            </div>
          </div>
        </div>

        <div v-else class="text-center py-24 max-w-md mx-auto">
          <div class="w-16 h-16 bg-rose-100 rounded-full flex items-center justify-center mx-auto mb-6">
            <svg class="w-8 h-8 text-rose-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
            </svg>
          </div>
          <h3 class="font-display font-bold text-2xl mb-2 text-on-surface">Inga mammapass just nu</h3>
          <p class="text-lg text-on-surface-dim">Kolla hela schemat för alla pass.</p>
        </div>

        <div class="text-center mt-12">
          <NuxtLink to="/schema" class="btn bg-surface-dim hover:bg-surface-container text-on-surface border-none px-10 py-5 h-auto text-lg rounded-full font-bold">
            Se hela schemat
          </NuxtLink>
        </div>
      </div>
    </section>

    <!-- CTA -->
    <section class="py-32 bg-gradient-to-br from-rose-600 to-pink-600 text-white relative overflow-hidden">
      <div class="absolute top-0 left-0 w-[800px] h-[800px] bg-white/10 rounded-full -translate-x-1/3 -translate-y-1/3 blur-3xl" />
      <div class="absolute bottom-0 right-0 w-[600px] h-[600px] bg-black/10 rounded-full translate-x-1/3 translate-y-1/3 blur-3xl" />

      <div class="container text-center relative z-10 max-w-4xl mx-auto">
        <h2 class="font-display font-bold text-4xl md:text-5xl lg:text-6xl mb-10 uppercase tracking-tighter">
          Välkommen tillbaka
        </h2>
        <p class="text-2xl text-white/80 mb-16 max-w-2xl mx-auto leading-relaxed font-medium">
          Ta första steget mot att hitta tillbaka till träningen — tillsammans med ditt barn och andra mammor.
        </p>
        <NuxtLink to="/bli-medlem" class="btn bg-white text-rose-700 hover:bg-rose-50 border-none px-14 py-7 h-auto text-2xl shadow-2xl rounded-full">
          Bli medlem
        </NuxtLink>
      </div>
    </section>
  </div>
</template>
