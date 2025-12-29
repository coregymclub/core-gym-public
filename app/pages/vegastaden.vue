<script setup lang="ts">
useHead({
  title: 'Vegastaden - Core Gym Club',
  meta: [{ name: 'description', content: '2900 kvm träning i tre våningar. Takterrass, padel och gruppträning.' }]
})

const { fetchToday, getStaffingStatus } = useStaffing()
const { stats: gymStats, fetchStats: fetchGymStats, startAutoRefresh } = useGymStats()

const SITE_ID = 1

onMounted(async () => {
  await Promise.all([fetchToday(), fetchGymStats()])
  startAutoRefresh(120000)
})
</script>

<template>
  <div>
    <!-- Hero -->
    <section class="min-h-[80vh] flex items-center justify-center bg-on-surface text-white px-6 relative overflow-hidden">
      <!-- Image: Vegastaden Aerial -->
      <div class="absolute inset-0 z-0">
        <img src="/images/gyms/vegastaden-roof.webp" alt="Vegastaden Takterrass" class="w-full h-full object-cover opacity-50" />
        <div class="absolute inset-0 bg-gradient-to-t from-on-surface via-transparent to-transparent" />
      </div>

      <div class="text-center relative z-10 max-w-4xl mx-auto mt-20">
        <span class="inline-block px-4 py-2 rounded-full border border-white/20 bg-brand text-white mb-8 text-sm font-bold tracking-widest uppercase animate-fade">
          Flaggskeppet
        </span>
        <h1 class="font-display font-bold text-5xl md:text-7xl lg:text-display-lg text-white mb-8 animate-slide-up uppercase tracking-tighter">Vegastaden</h1>
        <p class="text-xl md:text-2xl lg:text-3xl text-white/90 mb-12 animate-slide-up leading-tight font-medium" style="animation-delay: 0.1s">
          2 900 kvadratmeter möjligheter. <br class="hidden md:inline" />
          Takterrass, yoga, padel — allt finns här.
        </p>

        <!-- Live badges -->
        <div class="flex flex-wrap justify-center gap-4 animate-slide-up" style="animation-delay: 0.2s;">
          <span
            v-if="gymStats?.[SITE_ID]?.total > 0"
            class="inline-flex items-center gap-3 px-6 py-3 rounded-full text-base font-bold bg-white/10 backdrop-blur-md border border-white/20"
          >
            <span class="w-3 h-3 rounded-full bg-green-400 animate-pulse shadow-[0_0_10px_rgba(74,222,128,0.5)]" />
            {{ gymStats?.[SITE_ID]?.total || 0 }} tränar just nu
          </span>
          <span
            v-if="getStaffingStatus(SITE_ID).status === 'staffed-now'"
            class="inline-flex items-center gap-3 px-6 py-3 rounded-full text-base font-bold bg-green-500/20 backdrop-blur-md border border-green-500/30 text-green-100"
          >
            <span class="w-3 h-3 rounded-full bg-green-400 animate-pulse shadow-[0_0_10px_rgba(74,222,128,0.5)]" />
            Bemannat
          </span>
        </div>
      </div>
    </section>

    <!-- Quick info -->
    <section class="bg-surface border-b border-outline">
      <div class="container py-8">
        <div class="flex flex-wrap justify-center gap-8 md:gap-16 text-body-lg text-on-surface-dim font-medium">
          <span class="flex items-center gap-3">
            <svg class="w-6 h-6 text-brand" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" /><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" /></svg>
            Vega Allé 2
          </span>
          <span class="flex items-center gap-3">
            <svg class="w-6 h-6 text-brand" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
            03:55–00:05 alla dagar
          </span>
          <a href="tel:+4687452220" class="flex items-center gap-3 hover:text-brand transition-colors">
            <svg class="w-6 h-6 text-brand" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" /></svg>
            08-745 22 20
          </a>
        </div>
      </div>
    </section>

    <!-- Staffed hours -->
    <StaffedHoursSection :site-id="SITE_ID" />

    <!-- Popular Times -->
    <PopularTimes />

    <!-- Schedule -->
    <UpcomingClasses :site-id="SITE_ID" site-name="Vegastaden" />

    <!-- Les Mills Virtual -->
    <section class="py-32 bg-on-surface text-white relative overflow-hidden">
      <!-- Tech pattern background -->
      <div class="absolute inset-0 z-0 bg-[#0c0c0c]">
        <div class="absolute inset-0 opacity-10" 
             style="background-image: radial-gradient(#fff 1px, transparent 1px); background-size: 32px 32px;">
        </div>
      </div>
      
      <div class="container text-center relative z-10">
        <span class="inline-block px-4 py-2 rounded-full border border-white/20 bg-white/10 backdrop-blur mb-8 text-sm font-bold tracking-widest uppercase">
          Exklusivt för Vegastaden
        </span>
        <h2 class="font-display font-bold text-4xl md:text-5xl lg:text-6xl mb-8 uppercase tracking-tight">Träna när du vill</h2>
        <p class="text-xl md:text-2xl text-white/80 mb-12 max-w-3xl mx-auto leading-relaxed font-medium">
          Missa aldrig ett pass. Med Virtual kan du köra dina favoriter från Les Mills precis när det passar ditt schema.
          Bara att kliva in och köra igång.
        </p>

        <div class="flex flex-wrap justify-center gap-4 mb-12">
          <span v-for="p in ['BODYPUMP', 'BODYBALANCE', 'BODYCOMBAT', 'RPM', 'GRIT', 'SH\'BAM']" :key="p"
            class="px-6 py-3 bg-white/5 border border-white/10 rounded-full text-base font-medium hover:bg-white/10 hover:border-white/30 transition-all cursor-default">
            {{ p }}
          </span>
        </div>
      </div>
    </section>

    <!-- News & Updates -->
    <div class="grid md:grid-cols-2 gap-12 container py-32">
      <NewsSection title="Nyheter" site="vegastaden" :limit="3" />
      <UpdatesBanner :club-id="1" mode="compact" :limit="3" />
    </div>

    <!-- Reviews -->
    <ReviewsSection title="Sagt om Vegastaden" :club-id="1" :limit="3" />

    <!-- Map -->
    <section class="section bg-surface-dim">
      <div class="container">
        <div class="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          <div>
            <h2 class="font-display font-bold text-4xl md:text-5xl mb-6 text-on-surface uppercase tracking-tight">
              Hitta hit
            </h2>
            <div class="space-y-2 text-xl text-on-surface-dim">
              <p class="font-bold text-on-surface text-2xl">Core Gym Club Vegastaden</p>
              <p>Vega Allé 2, 136 57 Vega</p>
            </div>
          </div>
          <div class="h-[400px] rounded-[2rem] overflow-hidden shadow-elevated">
            <ClientOnly>
              <AppleMap
                :single-gym="{ name: 'Vegastaden', address: 'Vega Allé 2, Vega', lat: 59.1847, lng: 18.1089, href: '/vegastaden' }"
              />
            </ClientOnly>
          </div>
        </div>
      </div>
    </section>

    <!-- CTA -->
    <section class="py-40 bg-brand relative overflow-hidden">
      <div class="absolute inset-0 z-0">
         <div class="absolute top-0 right-0 w-[800px] h-[800px] bg-white/10 rounded-full translate-x-1/2 -translate-y-1/2 blur-3xl" />
         <div class="absolute bottom-0 left-0 w-[600px] h-[600px] bg-white/10 rounded-full -translate-x-1/2 translate-y-1/2 blur-3xl" />
      </div>
      <div class="container text-center text-white relative z-10 max-w-4xl mx-auto">
        <h2 class="font-display font-bold text-5xl md:text-6xl lg:text-7xl mb-8 uppercase tracking-tighter">Upplev Vegastaden</h2>
        <p class="text-xl md:text-2xl text-white/90 mb-12 leading-relaxed font-medium">
          Störst, modernast och öppet nästan dygnet runt.
        </p>
        <NuxtLink to="/priser" class="btn bg-white text-brand hover:bg-surface-dim border-none px-12 py-6 h-auto text-xl shadow-xl hover:shadow-2xl hover:-translate-y-1 transition-all">
          Se medlemskap
        </NuxtLink>
      </div>
    </section>
  </div>
</template>
