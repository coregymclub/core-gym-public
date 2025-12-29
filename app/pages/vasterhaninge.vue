<script setup lang="ts">
useHead({
  title: 'Västerhaninge - Core Gym Club',
  meta: [{ name: 'description', content: 'Core Gym Västerhaninge - centralt gym med modern utrustning och gruppträning.' }]
})

const { fetchToday, getStaffingStatus } = useStaffing()
const { schedule, loading, fetchSchedule } = useGroupTraining()
const { stats: gymStats, fetchStats: fetchGymStats, startAutoRefresh } = useGymStats()

const SITE_ID = 3

const filteredSchedule = computed(() => {
  return schedule.value.map(day => ({
    ...day,
    classes: day.classes.filter(c => c.siteId === SITE_ID)
  })).filter(day => day.classes.length > 0).slice(0, 3)
})

onMounted(async () => {
  await Promise.all([fetchToday(), fetchSchedule(7), fetchGymStats()])
  startAutoRefresh(120000)
})
</script>

<template>
  <div>
    <!-- Hero -->
    <section class="min-h-[80vh] flex items-center justify-center bg-on-surface text-white px-6 relative overflow-hidden">
      <!-- Image: Västerhaninge -->
      <div class="absolute inset-0 z-0">
        <img src="/images/gyms/vasterhaninge.webp" alt="Västerhaninge" class="w-full h-full object-cover opacity-50" />
        <div class="absolute inset-0 bg-gradient-to-t from-on-surface via-transparent to-transparent" />
      </div>

      <div class="text-center relative z-10 max-w-4xl mx-auto mt-20">
        <span class="inline-block px-4 py-2 rounded-full border border-white/20 bg-brand text-white mb-8 text-sm font-bold tracking-widest uppercase animate-fade">
          Klassiskt
        </span>
        <h1 class="font-display font-bold text-5xl md:text-7xl lg:text-display-lg text-white mb-8 animate-slide-up uppercase tracking-tighter">Västerhaninge</h1>
        <p class="text-xl md:text-2xl lg:text-3xl text-white/90 mb-12 animate-slide-up leading-tight font-medium" style="animation-delay: 0.1s">
          Centralt gym med modern utrustning. <br class="hidden md:inline" />
          Mitt i vardagen, nära till allt.
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
            Centrumvägen 4
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

    <!-- EGYM Section - with EGYM brand colors -->
    <section class="section egym-section text-white relative overflow-hidden">
      <!-- Background pattern -->
      <div class="absolute inset-0 z-0 opacity-10" 
           style="background-image: radial-gradient(#fff 1px, transparent 1px); background-size: 32px 32px;">
      </div>
      
      <div class="container relative z-10">
        <div class="max-w-xl mx-auto text-center">
          <span class="inline-block px-4 py-2 rounded-full bg-white/10 border border-white/20 text-orange-100 mb-8 text-sm font-bold tracking-widest uppercase">
            I samma byggnad
          </span>
          <h2 class="font-display font-bold text-4xl md:text-5xl lg:text-6xl mb-8 tracking-[0.05em] uppercase">EGYM</h2>
          <p class="text-xl md:text-2xl text-white/90 mb-12 leading-relaxed font-medium">
            Intelligent styrketräning med egen ingång. Maskinerna ställer in sig automatiskt efter dig.
          </p>

          <div class="grid grid-cols-2 gap-y-4 gap-x-8 mb-12 text-left max-w-sm mx-auto">
            <div v-for="f in ['Automatisk vikt', 'Digital dagbok', 'Personliga program', 'Egen ingång']" :key="f"
              class="flex items-center gap-3 text-white/90 font-medium">
              <svg class="w-5 h-5 text-orange-300 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                <path fill-rule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clip-rule="evenodd" />
              </svg>
              <span>{{ f }}</span>
            </div>
          </div>

          <NuxtLink to="/egym" class="btn bg-white text-orange-800 hover:bg-orange-50 border-none px-10 py-5 text-lg">
            Läs mer om EGYM
          </NuxtLink>
        </div>
      </div>
    </section>

    <!-- Schedule -->
    <UpcomingClasses :site-id="SITE_ID" site-name="Västerhaninge" />

    <!-- News & Updates -->
    <div class="grid md:grid-cols-2 gap-12 container py-32">
      <NewsSection title="Nyheter" site="vasterhaninge" :limit="3" />
      <UpdatesBanner :club-id="2" mode="compact" :limit="3" />
    </div>

    <!-- Reviews -->
    <ReviewsSection title="Sagt om Västerhaninge" :club-id="2" :limit="6" />

    <!-- Map -->
    <section class="section bg-surface-dim">
      <div class="container">
        <div class="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          <div>
            <h2 class="font-display font-bold text-4xl md:text-5xl mb-6 text-on-surface uppercase tracking-tight">
              Hitta hit
            </h2>
            <div class="space-y-2 text-xl text-on-surface-dim">
              <p class="font-bold text-on-surface text-2xl">Core Gym Club Västerhaninge</p>
              <p>Ringvägen 26, 137 61 Västerhaninge</p>
            </div>
          </div>
          <div class="h-[400px] rounded-[2rem] overflow-hidden shadow-elevated">
            <ClientOnly>
              <AppleMap
                :single-gym="{ name: 'Västerhaninge', address: 'Ringvägen 26', lat: 59.1258, lng: 18.0731, href: '/vasterhaninge' }"
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
        <h2 class="font-display font-bold text-5xl md:text-6xl lg:text-7xl mb-8 uppercase tracking-tighter">Börja träna</h2>
        <p class="text-xl md:text-2xl text-white/90 mb-12 leading-relaxed font-medium">
          Bli medlem på Västerhaninge idag.
        </p>
        <NuxtLink to="/bli-medlem" class="btn bg-white text-brand hover:bg-surface-dim border-none px-12 py-6 h-auto text-xl shadow-xl hover:shadow-2xl hover:-translate-y-1 transition-all">
          Se medlemskap
        </NuxtLink>
      </div>
    </section>
  </div>
</template>

<style scoped>
/* EGYM section with brand colors */
.egym-section {
  background: linear-gradient(135deg, #8B4528 0%, #5C2E1A 100%);
}
</style>