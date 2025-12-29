<script setup lang="ts">
useHead({
  title: 'Yoga - Core Gym Club',
  meta: [
    { name: 'description', content: 'Yoga på Core Gym Club. YinYoga, Vinyasa och BODYBALANCE. Hitta lugnet och stärk kroppen. Alla nivåer välkomna.' },
  ]
})

// Theme color for iOS Safari and body background
useThemeColor('#134e4a')

const { schedule, loading, fetchSchedule } = useGroupTraining()

const yogaSchedule = computed(() => {
  return schedule.value.map(day => ({
    ...day,
    classes: day.classes.filter(c => {
      const lower = c.name.toLowerCase()
      return lower.includes('yoga') || lower.includes('balance') || lower.includes('pilates')
    })
  })).filter(day => day.classes.length > 0)
})

const yogaTypes = [
  {
    name: 'YinYoga',
    description: 'Lugn och meditativ yoga där du håller positioner längre. Perfekt för att öka rörlighet och hitta inre lugn.',
    benefits: ['Ökad flexibilitet', 'Djup avslappning', 'Stressreducering'],
    level: 'Alla nivåer',
  },
  {
    name: 'Vinyasa',
    description: 'Dynamisk yoga där rörelser flyter samman med andningen. En fysisk och mental utmaning.',
    benefits: ['Styrka & kondition', 'Koordination', 'Fokus'],
    level: 'Nybörjare till avancerad',
  },
  {
    name: 'BODYBALANCE',
    description: 'Les Mills-pass som kombinerar yoga, tai chi och pilates. Musik och rörelse i harmoni.',
    benefits: ['Helkroppsträning', 'Balans', 'Core-styrka'],
    level: 'Alla nivåer',
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
    <section class="min-h-[70vh] flex items-center justify-center bg-teal-900 text-white px-6 relative overflow-hidden">
      <div class="absolute inset-0 z-0">
        <div class="absolute inset-0 bg-gradient-to-br from-teal-900 via-slate-900 to-emerald-900" />
        <!-- Decorative circles -->
        <div class="absolute top-1/4 -left-32 w-64 h-64 rounded-full border border-white/10" />
        <div class="absolute top-1/4 -left-32 w-96 h-96 rounded-full border border-white/5" />
        <div class="absolute bottom-1/4 -right-32 w-64 h-64 rounded-full border border-white/10" />
        <div class="absolute bottom-1/4 -right-32 w-96 h-96 rounded-full border border-white/5" />
      </div>

      <div class="text-center relative z-10 max-w-5xl mx-auto pt-32 pb-40">
        <span class="inline-block px-6 py-2 rounded-full bg-teal-500/20 text-teal-300 mb-8 text-sm font-bold tracking-widest uppercase">
          Mind & Body
        </span>
        <h1 class="font-display font-bold text-5xl md:text-7xl lg:text-[7rem] leading-[0.9] text-white mb-8 uppercase tracking-tighter">
          Yoga
        </h1>
        <p class="text-xl md:text-2xl lg:text-3xl text-white/80 mb-12 max-w-2xl mx-auto leading-tight font-medium">
          Hitta balans mellan kropp och sinne. <br class="hidden md:inline" />
          Våra yogapass passar alla nivåer.
        </p>
        <a href="#schema" class="btn bg-teal-500 hover:bg-teal-400 text-white border-none px-12 py-6 h-auto text-xl rounded-full shadow-lg">
          Se yogaschema
        </a>
      </div>
    </section>

    <!-- Yoga Types -->
    <section class="section bg-surface relative z-10 -mt-16 rounded-t-[3rem] pt-24">
      <div class="container">
        <div class="text-center mb-20 max-w-3xl mx-auto">
          <h2 class="font-display font-bold text-4xl md:text-5xl mb-6 text-on-surface uppercase tracking-tight">
            Våra yogaformer
          </h2>
          <p class="text-2xl text-on-surface-dim font-medium">
            Vi erbjuder olika typer av yoga för att möta dig där du är.
          </p>
        </div>

        <div class="grid grid-cols-1 lg:grid-cols-3 gap-8 max-w-6xl mx-auto">
          <div
            v-for="type in yogaTypes"
            :key="type.name"
            class="p-10 rounded-[2rem] bg-gradient-to-br from-teal-50 to-emerald-50 border border-teal-100 hover:shadow-xl transition-shadow duration-500"
          >
            <h3 class="font-display font-bold text-3xl text-teal-900 mb-4 uppercase tracking-tight">{{ type.name }}</h3>
            <p class="text-lg text-on-surface-dim mb-8 leading-relaxed">{{ type.description }}</p>

            <div class="space-y-3 mb-8">
              <div
                v-for="benefit in type.benefits"
                :key="benefit"
                class="flex items-center gap-3 text-teal-700 font-medium"
              >
                <svg class="w-5 h-5 text-teal-500" fill="currentColor" viewBox="0 0 20 20">
                  <path fill-rule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clip-rule="evenodd" />
                </svg>
                {{ benefit }}
              </div>
            </div>

            <span class="inline-block px-4 py-2 bg-teal-100 text-teal-700 rounded-full text-sm font-bold tracking-wide">
              {{ type.level }}
            </span>
          </div>
        </div>
      </div>
    </section>

    <!-- Benefits -->
    <section class="section bg-surface-dim">
      <div class="container">
        <div class="grid grid-cols-1 lg:grid-cols-2 gap-20 items-center max-w-6xl mx-auto">
          <div>
            <h2 class="font-display font-bold text-4xl md:text-5xl mb-8 text-on-surface uppercase tracking-tight">
              Varför yoga?
            </h2>
            <p class="text-xl text-on-surface-dim mb-12 leading-relaxed">
              Yoga är mer än bara stretching. Det är en komplett träningsform som stärker
              både kropp och sinne. Regelbunden yoga kan hjälpa dig att:
            </p>

            <div class="space-y-8">
              <div class="flex items-start gap-6 group">
                <div class="w-14 h-14 rounded-full bg-teal-100 flex items-center justify-center flex-shrink-0 group-hover:scale-110 transition-transform">
                  <span class="font-display font-bold text-xl text-teal-600">1</span>
                </div>
                <div>
                  <h4 class="font-display font-bold text-xl mb-2 text-on-surface">Minska stress</h4>
                  <p class="text-lg text-on-surface-dim">Andningstekniker och närvaro hjälper kroppen att slappna av.</p>
                </div>
              </div>
              <div class="flex items-start gap-6 group">
                <div class="w-14 h-14 rounded-full bg-teal-100 flex items-center justify-center flex-shrink-0 group-hover:scale-110 transition-transform">
                  <span class="font-display font-bold text-xl text-teal-600">2</span>
                </div>
                <div>
                  <h4 class="font-display font-bold text-xl mb-2 text-on-surface">Öka rörligheten</h4>
                  <p class="text-lg text-on-surface-dim">Regelbunden stretch motverkar stelhet från stillasittande.</p>
                </div>
              </div>
              <div class="flex items-start gap-6 group">
                <div class="w-14 h-14 rounded-full bg-teal-100 flex items-center justify-center flex-shrink-0 group-hover:scale-110 transition-transform">
                  <span class="font-display font-bold text-xl text-teal-600">3</span>
                </div>
                <div>
                  <h4 class="font-display font-bold text-xl mb-2 text-on-surface">Bygga styrka</h4>
                  <p class="text-lg text-on-surface-dim">Många positioner kräver och bygger muskelstyrka.</p>
                </div>
              </div>
              <div class="flex items-start gap-6 group">
                <div class="w-14 h-14 rounded-full bg-teal-100 flex items-center justify-center flex-shrink-0 group-hover:scale-110 transition-transform">
                  <span class="font-display font-bold text-xl text-teal-600">4</span>
                </div>
                <div>
                  <h4 class="font-display font-bold text-xl mb-2 text-on-surface">Förbättra sömnen</h4>
                  <p class="text-lg text-on-surface-dim">Avslappning och minskad stress leder till bättre sömnkvalitet.</p>
                </div>
              </div>
            </div>
          </div>

          <div class="relative px-8">
            <div class="absolute inset-0 bg-gradient-to-br from-teal-200 to-emerald-200 rounded-[3rem] transform rotate-3" />
            <div class="relative aspect-[4/5] rounded-[2.5rem] overflow-hidden bg-teal-100 shadow-2xl">
              <img
                src="/images/classes/strength.webp"
                alt="Yoga"
                class="w-full h-full object-cover opacity-80"
              />
              <div class="absolute inset-0 bg-gradient-to-t from-teal-900/60 to-transparent" />
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
            Yogaschema
          </h2>
          <p class="text-2xl text-on-surface-dim font-medium">
            Kommande yogapass på alla våra gym
          </p>
        </div>

        <div v-if="loading" class="text-center py-24">
          <div class="w-10 h-10 border-2 border-teal-500 border-t-transparent rounded-full animate-spin mx-auto mb-4" />
          <p class="text-on-surface-dim">Hämtar schemat...</p>
        </div>

        <div v-else-if="yogaSchedule.length > 0" class="space-y-12 max-w-3xl mx-auto">
          <div
            v-for="day in yogaSchedule"
            :key="day.date"
            class="bg-gradient-to-r from-teal-50 to-emerald-50 rounded-[2rem] p-8"
          >
            <div class="flex items-baseline gap-4 mb-6">
              <h3 class="font-display font-bold text-3xl text-teal-900 capitalize">{{ day.dayName }}</h3>
              <span class="text-xl text-teal-600/60 font-medium">{{ formatDateShort(day.date) }}</span>
            </div>
            <div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <NuxtLink
                v-for="cls in day.classes"
                :key="cls.id"
                :to="`/schema?pass=${cls.id}`"
                class="flex items-center justify-between p-5 bg-white rounded-2xl hover:shadow-lg transition-all duration-300 group"
              >
                <div>
                  <div class="font-display font-bold text-lg text-teal-900 group-hover:text-teal-600 transition-colors">{{ cls.name }}</div>
                  <div class="text-on-surface-dim font-medium">{{ cls.time }} - {{ cls.endTime }}</div>
                </div>
                <span class="text-sm text-on-surface-dim/60 font-medium">{{ cls.site }}</span>
              </NuxtLink>
            </div>
          </div>
        </div>

        <div v-else class="text-center py-24 max-w-md mx-auto">
          <div class="w-16 h-16 bg-teal-100 rounded-full flex items-center justify-center mx-auto mb-6">
            <svg class="w-8 h-8 text-teal-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
            </svg>
          </div>
          <h3 class="font-display font-bold text-2xl mb-2 text-on-surface">Inga yogapass just nu</h3>
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
    <section class="py-32 bg-gradient-to-br from-teal-600 to-emerald-600 text-white relative overflow-hidden">
      <div class="absolute top-0 left-0 w-[800px] h-[800px] bg-white/10 rounded-full -translate-x-1/3 -translate-y-1/3 blur-3xl" />
      <div class="absolute bottom-0 right-0 w-[600px] h-[600px] bg-black/10 rounded-full translate-x-1/3 translate-y-1/3 blur-3xl" />

      <div class="container text-center relative z-10 max-w-4xl mx-auto">
        <h2 class="font-display font-bold text-4xl md:text-5xl lg:text-6xl mb-10 uppercase tracking-tighter">
          Börja din resa
        </h2>
        <p class="text-2xl text-white/80 mb-16 max-w-2xl mx-auto leading-relaxed font-medium">
          Oavsett om du aldrig provat yoga eller tränat i åratal – du är välkommen hos oss.
        </p>
        <NuxtLink to="/bli-medlem" class="btn bg-white text-teal-700 hover:bg-teal-50 border-none px-14 py-7 h-auto text-2xl shadow-2xl rounded-full">
          Bli medlem
        </NuxtLink>
      </div>
    </section>
  </div>
</template>
