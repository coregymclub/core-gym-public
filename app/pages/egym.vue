<script setup lang="ts">
useHead({
  title: 'EGYM - Core Gym Club',
  meta: [
    { name: 'description', content: 'EGYM Smart Strength. Automatisk styrketräning som anpassar sig efter dig. Finns på Core Gym Club Vegastaden och Västerhaninge.' }
  ]
})

useThemeColor('#ffffff')

const { openEGYMSheet } = useSheets()

const features = [
  {
    title: 'Automatisk',
    desc: 'Maskinen ställer in sig efter din kropp och styrka. Håll armbandet mot skärmen, klart.',
    icon: 'M13 10V3L4 14h7v7l9-11h-7z'
  },
  {
    title: 'Effektiv',
    desc: 'Träna igenom hela kroppen på 15 minuter. Perfekt för dig med lite tid.',
    icon: 'M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z'
  },
  {
    title: 'Säker',
    desc: 'Guidad teknik på skärmen. Omöjligt att göra fel. Passar alla nivåer.',
    icon: 'M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z'
  },
  {
    title: 'Mätbart',
    desc: 'Följ din utveckling i appen. Regelbundna styrketester håller dig på rätt nivå.',
    icon: 'M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z'
  },
]

const steps = [
  { num: '01', title: 'Boka intro', desc: 'Vi ställer in alla maskiner efter din kropp och gör ett styrketest. Tar ca 30 minuter.' },
  { num: '02', title: 'Få armband', desc: 'Dina inställningar sparas på ett personligt armband. Håll mot maskinen – den ställer in sig automatiskt.' },
  { num: '03', title: 'Träna', desc: 'Följ cirkeln runt. Ca 2 minuter per maskin. Skärmen visar exakt vad du ska göra.' },
  { num: '04', title: 'Följ upp', desc: 'Var 6:e pass gör du ett nytt styrketest. Vikterna justeras automatiskt efter din utveckling.' },
]
</script>

<template>
  <div>
    <!-- Hero -->
    <section class="min-h-[90vh] flex items-center justify-center bg-surface px-6 relative overflow-hidden">
      <!-- Background Elements - Subtle orange glow -->
      <div class="absolute inset-0 z-0">
        <div class="absolute top-1/4 left-1/4 w-[600px] h-[600px] bg-[#c75300]/5 rounded-full blur-[150px]" />
        <div class="absolute bottom-0 right-0 w-[400px] h-[400px] bg-[#c75300]/5 rounded-full blur-[100px]" />
      </div>

      <div class="container relative z-10 text-center pt-32 pb-40">
        <span class="inline-block px-6 py-2 rounded-full bg-[#c75300]/10 border border-[#c75300]/20 mb-8 text-sm font-bold tracking-widest uppercase text-[#c75300]">
          Smart Strength
        </span>

        <h1 class="font-display font-bold text-5xl md:text-7xl lg:text-[8rem] leading-[0.9] text-on-surface mb-8 uppercase tracking-tighter">
          EGYM
        </h1>

        <p class="text-xl md:text-2xl text-on-surface-dim max-w-2xl mx-auto mb-12 leading-relaxed font-medium">
          Maskinen ställer in sig efter dig. <br class="hidden md:inline" />
          Träna hela kroppen på 15 minuter.
        </p>

        <div class="flex flex-col sm:flex-row gap-4 justify-center">
          <button @click="openEGYMSheet" class="btn bg-[#c75300] hover:bg-[#a84600] text-white border-none px-12 py-5 h-auto text-lg rounded-full shadow-lg shadow-[#c75300]/20 font-display font-bold uppercase tracking-wide">
            Boka gratis intro
          </button>
          <a href="#hur-funkar-det" class="btn bg-surface-dim text-on-surface border border-outline hover:bg-surface-container px-10 py-5 h-auto text-lg rounded-full font-display font-bold uppercase tracking-wide">
            Se hur det funkar
          </a>
        </div>
      </div>
    </section>

    <!-- Features -->
    <section class="section bg-surface-dim relative z-10">
      <div class="container">
        <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <div
            v-for="feature in features"
            :key="feature.title"
            class="p-8 rounded-3xl bg-white border border-outline hover:border-[#c75300]/30 hover:shadow-elevated transition-all duration-500 group"
          >
            <div class="mb-6">
              <svg class="w-10 h-10 text-[#c75300]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" :d="feature.icon" />
              </svg>
            </div>
            <h3 class="font-display font-bold text-2xl text-on-surface mb-3 uppercase tracking-tight">{{ feature.title }}</h3>
            <p class="text-lg text-on-surface-dim leading-relaxed">{{ feature.desc }}</p>
          </div>
        </div>
      </div>
    </section>

    <!-- Personal Guidance Section -->
    <section class="py-20 bg-surface relative overflow-hidden">
      <div class="container">
        <div class="grid md:grid-cols-2 gap-8 lg:gap-12 items-center max-w-6xl mx-auto">
          <!-- Images -->
          <div class="relative">
            <div class="grid grid-cols-2 gap-4">
              <div class="aspect-[3/4] rounded-2xl overflow-hidden shadow-elevated">
                <img src="/images/egym-brostpress.avif" alt="EGYM Bröstpress" loading="lazy" class="w-full h-full object-cover" />
              </div>
              <div class="aspect-[3/4] rounded-2xl overflow-hidden mt-8 shadow-elevated">
                <img src="/images/egym-per-new.avif" alt="Per hjälper kund med EGYM" loading="lazy" class="w-full h-full object-cover" />
              </div>
            </div>
          </div>

          <!-- Text -->
          <div>
            <h2 class="font-display font-bold text-3xl md:text-4xl lg:text-5xl uppercase tracking-tight mb-6 text-on-surface">
              Personlig introduktion
            </h2>
            <p class="text-lg md:text-xl text-on-surface-dim leading-relaxed mb-8">
              Vår ägare Per guidar dig genom din första EGYM-upplevelse. Du får en skräddarsydd introduktion där vi ställer in alla maskiner efter just din kropp och gör ett styrketest för att hitta rätt nivå.
            </p>
            <ul class="space-y-4 text-on-surface mb-10">
              <li class="flex items-center gap-3">
                <span class="w-2 h-2 bg-[#c75300] rounded-full flex-shrink-0" />
                <span>30 minuters personlig genomgång</span>
              </li>
              <li class="flex items-center gap-3">
                <span class="w-2 h-2 bg-[#c75300] rounded-full flex-shrink-0" />
                <span>Alla maskiner anpassas efter dig</span>
              </li>
              <li class="flex items-center gap-3">
                <span class="w-2 h-2 bg-[#c75300] rounded-full flex-shrink-0" />
                <span>Styrketest för optimal träningsnivå</span>
              </li>
            </ul>

            <!-- Onboarding times -->
            <div class="p-6 rounded-2xl bg-surface-dim border border-outline">
              <h3 class="font-bold text-lg text-on-surface mb-4">Drop-in för introduktion</h3>
              <div class="space-y-2 text-on-surface-dim">
                <div class="flex justify-between">
                  <span>Tisdagar</span>
                  <span class="text-on-surface font-medium">15:00–18:00</span>
                </div>
                <div class="flex justify-between">
                  <span>Fredagar</span>
                  <span class="text-on-surface font-medium">10:30–12:30</span>
                </div>
              </div>
              <p class="text-sm text-on-surface-muted mt-4">Kom förbi under dessa tider — ingen bokning krävs.</p>
            </div>
          </div>
        </div>
      </div>
    </section>

    <!-- How it works -->
    <section id="hur-funkar-det" class="section bg-surface">
      <div class="container">
        <div class="text-center mb-20 max-w-3xl mx-auto">
          <h2 class="font-display font-bold text-4xl md:text-5xl mb-6 text-on-surface uppercase tracking-tight">
            Så funkar det
          </h2>
          <p class="text-2xl text-on-surface-dim font-medium">
            Från första besöket till regelbunden träning
          </p>
        </div>

        <div class="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-5xl mx-auto">
          <div
            v-for="step in steps"
            :key="step.num"
            class="relative p-10 rounded-[2rem] bg-surface-dim hover:bg-surface-container transition-colors duration-300 group"
          >
            <span class="absolute top-8 right-8 text-8xl font-black text-on-surface/5 select-none">{{ step.num }}</span>
            <div class="relative z-10">
              <div class="w-12 h-1.5 rounded-full mb-6 bg-gradient-to-r from-[#c75300] to-[#c75300]/30"></div>
              <h3 class="font-display font-bold text-3xl text-on-surface mb-4 uppercase tracking-tight">{{ step.title }}</h3>
              <p class="text-lg text-on-surface-dim leading-relaxed">{{ step.desc }}</p>
            </div>
          </div>
        </div>
      </div>
    </section>

    <!-- CTA -->
    <section class="py-32 bg-[#c75300] text-white relative overflow-hidden">
      <div class="absolute inset-0">
        <div class="absolute top-0 left-0 w-[600px] h-[600px] bg-white/10 rounded-full -translate-x-1/2 -translate-y-1/2 blur-3xl" />
        <div class="absolute bottom-0 right-0 w-[600px] h-[600px] bg-black/10 rounded-full translate-x-1/3 translate-y-1/3 blur-3xl" />
      </div>

      <div class="container text-center relative z-10 max-w-4xl mx-auto">
        <h2 class="font-display font-bold text-4xl md:text-5xl lg:text-6xl mb-10 uppercase tracking-tighter">
          Redo att testa?
        </h2>
        <p class="text-xl md:text-2xl text-white/90 mb-16 max-w-2xl mx-auto leading-relaxed font-medium">
          Boka en gratis introduktion så visar vi hur EGYM fungerar.
          30 minuter som förändrar hur du tränar.
        </p>
        <button @click="openEGYMSheet" class="btn bg-white hover:bg-white/90 text-[#c75300] border-none px-14 py-7 h-auto text-2xl shadow-2xl rounded-full font-display font-bold uppercase tracking-wide">
          Boka intro
        </button>
      </div>
    </section>
  </div>
</template>
