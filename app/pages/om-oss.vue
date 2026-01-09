<script setup lang="ts">
useHead({
  title: 'Om oss - Core Gym Club',
  meta: [{ name: 'description', content: 'Familjeägt gym sedan 2012. Fyra gym i Haninge där du får komma som du är. Inga pekpinnar, bara bra träning.' }]
})

const timeline = [
  { year: '2012', title: 'Tungelsta', desc: 'Per Karlsson öppnar första gymmet i "Gammelkyrkan"' },
  { year: '2016', title: 'Västerhaninge', desc: 'Mitt i centrum – effektivt och nära' },
  { year: '2022', title: 'Vegastaden', desc: 'Flaggskeppet öppnar - 2900 kvm träningsglädje' },
  { year: '2025', title: 'EGYM', desc: 'Vi lanserar intelligent träning i Västerhaninge' },
  { year: '2026', title: 'Ösmo', desc: 'Snart öppnar vi vårt fjärde gym' },
]

const values = [
  { title: 'Gemenskap', desc: 'Ett hej kostar inget' },
  { title: 'Tillgänglighet', desc: 'Öppet 03:55–00:05 alla dagar' },
  { title: 'Inga pekpinnar', desc: 'Träna hur du vill, när du vill' },
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
        <span class="text-label text-white/60 mb-4 block uppercase tracking-wider">Sedan 2012</span>
        <h1 class="text-hero text-white mb-6">Om Core</h1>
        <p class="text-lead text-white/80">
          Fyra gym, en familj. Och en enkel idé: träning utan trösklar.
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
            <h2 class="font-display font-bold text-2xl md:text-3xl mb-4 uppercase tracking-tight">Från skolkatalogen till gymmet</h2>
            <p class="text-body-lg text-on-surface-dim mb-4">
              Per Karlsson, grundare. Efter 25 år som idrottslärare i Haninge (ni kanske känner igen honom från Brandbergsskolan?) bestämde han sig för att starta eget.
            </p>
            <p class="text-body text-on-surface-dim">
              "Jag ville skapa en plats med samma värme som i skolan, men utan prestationskraven. Inga pekpinnar, ingen hets. Bara bra träning och en varm gemenskap. Det var sant 2012, och det är sant idag."
            </p>
          </div>
        </div>
      </div>
    </section>

    <!-- Timeline -->
    <section class="section bg-surface-dim">
      <div class="container">
        <h2 class="text-section mb-16">Vår resa</h2>
        <div class="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-5 gap-8 max-w-7xl mx-auto relative">
          <!-- Connector line (desktop) -->
          <div class="hidden lg:block absolute top-8 left-0 right-0 h-0.5 bg-outline -z-10" />
          
          <div v-for="t in timeline" :key="t.year" class="relative bg-surface-dim pt-4 text-center">
            <div class="w-4 h-4 bg-on-surface rounded-full mx-auto mb-4 border-4 border-white shadow-sm" />
            <span class="font-display font-bold text-4xl md:text-5xl text-on-surface/20 block mb-2">{{ t.year }}</span>
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
        <h2 class="text-section text-white mb-4">En del av familjen</h2>
        <p class="text-lead text-white/80 mb-10">
          Ett medlemskap. Fyra gym. Träning på dina villkor.
        </p>
        <NuxtLink to="/bli-medlem" class="btn btn-light btn-lg">
          Bli medlem
        </NuxtLink>
      </div>
    </section>
  </div>
</template>
