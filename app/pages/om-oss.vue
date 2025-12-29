<script setup lang="ts">
useHead({
  title: 'Om oss - Core Gym Club',
  meta: [{ name: 'description', content: 'Familjeägt gym sedan 2012. Fyra gym i Haninge.' }]
})

const timeline = [
  { year: '2012', title: 'Tungelsta', desc: 'Per Karlsson öppnar första gymmet' },
  { year: '2019', title: 'Vegastaden', desc: 'Flaggskeppet öppnar - 2900 kvm' },
  { year: '2021', title: 'Västerhaninge', desc: 'Tredje gymmet med EGYM' },
  { year: '2026', title: 'Ösmo', desc: 'Vårt fjärde gym i familjen' },
]

const values = [
  { title: 'Gemenskap', desc: 'Här hälsar vi på varandra' },
  { title: 'Tillgänglighet', desc: 'Öppet 03:55–00:05 alla dagar' },
  { title: 'Inga pekpinnar', desc: 'Träning på dina villkor' },
]
</script>

<template>
  <div>
    <!-- Hero -->
    <section class="min-h-[50vh] flex items-center justify-center bg-on-surface text-white px-6 relative overflow-hidden">
      <!-- Background -->
       <div class="absolute inset-0 z-0 opacity-20">
         <img src="/images/bw-grid.jpg" alt="Background" class="w-full h-full object-cover" />
      </div>
      
      <div class="relative z-10 text-center max-w-xl">
        <span class="text-label text-brand mb-4 block uppercase tracking-wider">Sedan 2012</span>
        <h1 class="text-hero text-white mb-6">Om oss</h1>
        <p class="text-lead text-white/80">
          Familjeägt gym med en vision: att inspirera till rörelse utan krångel.
        </p>
      </div>
    </section>

    <!-- Founder Story -->
    <section class="section bg-surface">
      <div class="container">
        <div class="flex flex-col md:flex-row gap-12 items-center max-w-4xl mx-auto">
          <div class="w-48 h-48 md:w-64 md:h-64 flex-shrink-0 rounded-full overflow-hidden border-4 border-surface-dim shadow-elevated">
             <img 
              src="/images/founder-per.webp" 
              alt="Per Karlsson" 
              class="w-full h-full object-cover"
            />
          </div>
          <div>
            <h2 class="font-display font-bold text-2xl md:text-3xl mb-4 uppercase tracking-tight">Från skola till gym</h2>
            <p class="text-body-lg text-on-surface-dim mb-4">
              Per Karlsson, grundare. Idrottslärare i 25 år — tröttnade på att kämpa i motvind och startade Core 2012.
            </p>
            <p class="text-body text-on-surface-dim">
              "Jag ville skapa en plats där alla känner sig välkomna. Inga pekpinnar, ingen hets. Bara bra träning och en varm gemenskap. Det var sant 2012 i Tungelsta, och det är sant idag med fyra gym."
            </p>
          </div>
        </div>
      </div>
    </section>

    <!-- Timeline -->
    <section class="section bg-surface-dim">
      <div class="container">
        <h2 class="text-section mb-16">Vår resa</h2>
        <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 max-w-5xl mx-auto relative">
          <!-- Connector line (desktop) -->
          <div class="hidden lg:block absolute top-8 left-0 right-0 h-0.5 bg-outline -z-10" />
          
          <div v-for="t in timeline" :key="t.year" class="relative bg-surface-dim pt-4 text-center">
            <div class="w-4 h-4 bg-brand rounded-full mx-auto mb-4 border-4 border-white shadow-sm" />
            <span class="font-display font-bold text-4xl md:text-5xl text-brand/20 block mb-2">{{ t.year }}</span>
            <h3 class="text-title mb-2">{{ t.title }}</h3>
            <p class="text-body text-on-surface-dim text-sm max-w-[200px] mx-auto">{{ t.desc }}</p>
          </div>
        </div>
      </div>
    </section>

    <!-- Values -->
    <section class="section bg-surface">
      <div class="container">
        <h2 class="text-section mb-12">Det vi står för</h2>
        <div class="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-4xl mx-auto">
          <div v-for="v in values" :key="v.title" class="card text-center hover:-translate-y-1 transition-transform duration-300">
            <h3 class="text-title mb-2">{{ v.title }}</h3>
            <p class="text-body text-on-surface-dim">{{ v.desc }}</p>
          </div>
        </div>
      </div>
    </section>

    <!-- CTA -->
    <section class="section bg-brand relative overflow-hidden">
      <div class="absolute inset-0 z-0">
        <div class="absolute top-0 right-0 w-64 h-64 bg-white/10 rounded-full translate-x-1/2 -translate-y-1/2" />
        <div class="absolute bottom-0 left-0 w-48 h-48 bg-white/10 rounded-full -translate-x-1/2 translate-y-1/2" />
      </div>
      <div class="container text-center text-white relative z-10">
        <h2 class="text-section text-white mb-4">Bli en del av familjen</h2>
        <p class="text-lead text-white/80 mb-10">
          Ett medlemskap. Fyra gym. Inga bindningstider.
        </p>
        <NuxtLink to="/priser" class="btn bg-white text-brand hover:bg-surface-dim border-none shadow-lg">
          Bli medlem
        </NuxtLink>
      </div>
    </section>
  </div>
</template>
