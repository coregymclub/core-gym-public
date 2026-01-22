<script setup lang="ts">
useHead({
  title: 'Vegastaden - Core Gym Club',
  meta: [{ name: 'description', content: '2900 kvm träning i tre våningar. Takterrass, padel och gruppträning.' }]
})

useThemeColor('#1a1a1a')

const { fetchToday, fetchWeek, getStaffingStatus, weekData } = useStaffing()
const { stats: gymStats, fetchStats: fetchGymStats, startAutoRefresh } = useGymStats()

const SITE_ID = 1

// Gym carousel slides
const gymSlides = [
  {
    src: '/images/vega-squat-rack.avif',
    alt: 'Friviktsyta på Vegastaden',
    caption: 'Plats att ta i ordentligt'
  },
  {
    src: '/images/vega-sled-push.webp',
    alt: 'Sled push på Vegastaden',
    caption: 'Gott om plats att öka takten'
  },
  {
    src: '/images/johan-i-gymmet.webp',
    alt: 'Träning på Vegastaden',
    caption: 'Fokus på det som räknas'
  },
  {
    src: '/images/roof-by-night.webp',
    alt: 'Takterrassen på kvällen',
    caption: 'Träna under stjärnorna'
  },
  {
    src: '/images/vegastaden.webp',
    alt: 'Översikt av gymmet',
    caption: 'Alltid en ledig maskin'
  },
  {
    src: '/images/vega-handstand.webp',
    alt: 'Funktionell träning',
    caption: 'Vänd på perspektiven'
  },
  {
    src: '/images/johan-atlantis.avif',
    alt: 'Atlantis maskiner',
    caption: 'Premiumutrustning från Atlantis'
  }
]

// Expanderbar info-sheet state
const activeCard = ref<string | null>(null)

function toggleCard(card: string) {
  activeCard.value = activeCard.value === card ? null : card
}

// Veckans bemanningstider
const weeklySchedule = computed(() => {
  if (!weekData.value) return []
  const today = new Date().toISOString().split('T')[0]
  return weekData.value.days.map(day => {
    const clubData = day.clubs[String(SITE_ID)]
    return {
      ...day,
      displayText: clubData?.displayText || '',
      staffed: clubData?.staffed ?? false,
      isToday: day.date === today
    }
  })
})

onMounted(async () => {
  await Promise.all([fetchToday(), fetchWeek(), fetchGymStats()])
  startAutoRefresh(120000)
})
</script>

<template>
  <div>
    <!-- Hero -->
    <section class="min-h-[100svh] flex items-center justify-center bg-on-surface text-white px-6 relative overflow-hidden">
      <!-- Image: Vegastaden Aerial -->
      <div class="absolute inset-0 z-0">
        <img src="/images/gyms/vegastaden-hero-mobile.webp" alt="Vegastaden" class="w-full h-full object-cover" />
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
        <div class="flex flex-wrap justify-center gap-3 animate-slide-up" style="animation-delay: 0.2s;">
          <span
            v-if="gymStats?.[SITE_ID]?.total > 0"
            class="inline-flex items-center gap-2 px-5 py-2.5 rounded-full text-sm font-bold bg-white/10 backdrop-blur-md border border-white/20"
          >
            <span class="w-2.5 h-2.5 rounded-full bg-green-400 animate-pulse shadow-[0_0_10px_rgba(74,222,128,0.5)]" />
            {{ gymStats[SITE_ID].total }} tränar nu
          </span>
          <span
            v-if="getStaffingStatus(SITE_ID).status === 'staffed-now'"
            class="inline-flex items-center gap-2 px-5 py-2.5 rounded-full text-sm font-bold bg-green-500/20 backdrop-blur-md border border-green-500/30"
          >
            <span class="w-2.5 h-2.5 rounded-full bg-green-400 animate-pulse shadow-[0_0_10px_rgba(74,222,128,0.5)]" />
            Bemannat {{ getStaffingStatus(SITE_ID).subtext }}
          </span>
          <span
            v-else-if="getStaffingStatus(SITE_ID).status === 'staffed-today'"
            class="inline-flex items-center gap-2 px-5 py-2.5 rounded-full text-sm font-bold bg-white/10 backdrop-blur-md border border-white/20"
          >
            Bemannat idag {{ getStaffingStatus(SITE_ID).subtext }}
          </span>
          <span
            v-else
            class="inline-flex items-center gap-2 px-5 py-2.5 rounded-full text-sm font-bold bg-white/10 backdrop-blur-md border border-white/20"
          >
            Obemannat idag
          </span>
        </div>
      </div>
    </section>

    <!-- ============ INFO + PULSEN ============ -->
    <section class="py-12 md:py-16 bg-surface-dim">
      <div class="container max-w-5xl">
        <div class="grid grid-cols-1 lg:grid-cols-2 gap-6 lg:gap-8 items-start">

          <!-- Accordion-kort (vänster) -->
          <div class="bg-surface rounded-[2rem] md:rounded-[2.5rem] px-6 md:px-10 shadow-sm border border-outline/10 divide-y divide-outline/10">

            <!-- Bemannade tider -->
            <div class="py-6">
              <button
                @click="toggleCard('staffing')"
                class="w-full flex items-center justify-between text-left group"
              >
                <span class="font-display font-bold text-lg md:text-xl text-on-surface uppercase tracking-tight">Bemannade tider</span>
                <span
                  class="w-11 h-11 rounded-full bg-surface-container flex items-center justify-center transition-all duration-300 group-hover:bg-surface-container-high"
                  :class="activeCard === 'staffing' ? 'rotate-45 !bg-on-surface' : ''"
                >
                  <svg
                    class="w-5 h-5 transition-colors duration-300"
                    :class="activeCard === 'staffing' ? 'text-white' : 'text-on-surface-dim'"
                    fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2"
                  >
                    <path stroke-linecap="round" stroke-linejoin="round" d="M12 6v12m6-6H6" />
                  </svg>
                </span>
              </button>

              <div
                class="grid transition-[grid-template-rows] duration-300 ease-out"
                :class="activeCard === 'staffing' ? 'grid-rows-[1fr]' : 'grid-rows-[0fr]'"
              >
                <div class="overflow-hidden">
                  <div class="pt-6 space-y-3">
                    <div
                      v-for="day in weeklySchedule"
                      :key="day.dayId"
                      class="flex items-center justify-between"
                      :class="day.isToday ? 'text-on-surface' : 'text-on-surface-dim'"
                    >
                      <span class="capitalize">
                        {{ day.dayName }}
                        <span v-if="day.isToday" class="text-xs ml-2 px-2 py-0.5 rounded-full bg-on-surface text-white font-bold uppercase tracking-wide">Idag</span>
                      </span>
                      <span class="tabular-nums font-medium">{{ day.staffed ? day.displayText : '–' }}</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <!-- Provträna -->
            <div class="py-6">
              <button
                @click="toggleCard('trial')"
                class="w-full flex items-center justify-between text-left group"
              >
                <span class="font-display font-bold text-lg md:text-xl text-on-surface uppercase tracking-tight">Provträna</span>
                <span
                  class="w-11 h-11 rounded-full bg-surface-container flex items-center justify-center transition-all duration-300 group-hover:bg-surface-container-high"
                  :class="activeCard === 'trial' ? 'rotate-45 !bg-on-surface' : ''"
                >
                  <svg
                    class="w-5 h-5 transition-colors duration-300"
                    :class="activeCard === 'trial' ? 'text-white' : 'text-on-surface-dim'"
                    fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2"
                  >
                    <path stroke-linecap="round" stroke-linejoin="round" d="M12 6v12m6-6H6" />
                  </svg>
                </span>
              </button>

              <div
                class="grid transition-[grid-template-rows] duration-300 ease-out"
                :class="activeCard === 'trial' ? 'grid-rows-[1fr]' : 'grid-rows-[0fr]'"
              >
                <div class="overflow-hidden">
                  <div class="pt-6 space-y-5">
                    <div>
                      <p class="font-medium text-on-surface mb-1">Funderar du på att bli medlem?</p>
                      <p class="text-on-surface-dim">Sväng förbi under bemannade tider – vi visar runt och du får testa gratis.</p>
                    </div>

                    <div>
                      <p class="font-medium text-on-surface mb-1">Vill du testa gruppträning?</p>
                      <p class="text-on-surface-dim">
                        Du är välkommen att hoppa in på ett pass i mån av plats.
                        <NuxtLink to="/schema" class="underline">Se schemat</NuxtLink>
                      </p>
                    </div>

                    <div>
                      <p class="font-medium text-on-surface mb-1">Engångsbesök</p>
                      <p class="text-on-surface-dim">Träna en gång för 150 kr. Gäller under bemannade tider.</p>
                    </div>

                    <p class="text-on-surface-dim text-sm">
                      Vegastaden har 18-årsgräns.
                    </p>
                  </div>
                </div>
              </div>
            </div>

            <!-- Kontakt -->
            <div class="py-6">
              <button
                @click="toggleCard('contact')"
                class="w-full flex items-center justify-between text-left group"
              >
                <span class="font-display font-bold text-lg md:text-xl text-on-surface uppercase tracking-tight">Kontakt</span>
                <span
                  class="w-11 h-11 rounded-full bg-surface-container flex items-center justify-center transition-all duration-300 group-hover:bg-surface-container-high"
                  :class="activeCard === 'contact' ? 'rotate-45 !bg-on-surface' : ''"
                >
                  <svg
                    class="w-5 h-5 transition-colors duration-300"
                    :class="activeCard === 'contact' ? 'text-white' : 'text-on-surface-dim'"
                    fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2"
                  >
                    <path stroke-linecap="round" stroke-linejoin="round" d="M12 6v12m6-6H6" />
                  </svg>
                </span>
              </button>

              <div
                class="grid transition-[grid-template-rows] duration-300 ease-out"
                :class="activeCard === 'contact' ? 'grid-rows-[1fr]' : 'grid-rows-[0fr]'"
              >
                <div class="overflow-hidden">
                  <div class="pt-6 space-y-3">
                    <a href="tel:0850924549" class="flex items-center justify-between py-2 hover:text-on-surface transition-colors text-on-surface-dim">
                      <span class="text-on-surface font-medium">Telefon</span>
                      <span>08-509 245 49</span>
                    </a>
                    <a href="mailto:info@coregym.club" class="flex items-center justify-between py-2 hover:text-on-surface transition-colors text-on-surface-dim">
                      <span class="text-on-surface font-medium">E-post</span>
                      <span>info@coregym.club</span>
                    </a>
                    <div class="flex items-center justify-between py-2 text-on-surface-dim">
                      <span class="text-on-surface font-medium">Adress</span>
                      <span>Vega Allé 2, 136 57 Vega</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>

          </div>

          <!-- Pulsen-kort (höger) -->
          <div class="bg-surface rounded-[2rem] md:rounded-[2.5rem] p-6 md:p-8 shadow-sm border border-outline/10 border-l-4 border-l-brand relative overflow-hidden">
            <!-- Live-indikator -->
            <span class="absolute top-5 right-5 flex h-3 w-3">
              <span class="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75"></span>
              <span class="relative inline-flex rounded-full h-3 w-3 bg-green-500"></span>
            </span>

            <!-- Grid background pattern -->
            <div class="absolute inset-0 opacity-[0.03] pointer-events-none"
                 style="background-image: linear-gradient(to right, currentColor 1px, transparent 1px), linear-gradient(to bottom, currentColor 1px, transparent 1px); background-size: 24px 24px;" />

            <div class="relative z-10">
              <!-- Header -->
              <div class="flex items-center gap-3 mb-6">
                <img src="/images/icons/pulsen.png" alt="Pulsen-ikon" loading="lazy" class="w-6 h-6" />
                <h3 class="font-display font-bold text-on-surface text-lg uppercase tracking-tight">Pulsen</h3>
              </div>

              <!-- Chart -->
              <PopularTimesChart />

              <!-- Footer hint -->
              <div class="mt-6 flex items-center justify-center gap-4 text-xs text-on-surface-dim">
                <span class="flex items-center gap-1.5">
                  <span class="w-2 h-2 rounded-full bg-on-surface/20" />
                  Vanligt
                </span>
                <span class="flex items-center gap-1.5">
                  <span class="w-2 h-2 rounded-full bg-on-surface" />
                  Nu
                </span>
              </div>
            </div>
          </div>

        </div>
      </div>
    </section>

    <!-- Schedule -->
    <UpcomingClasses :site-id="SITE_ID" site-name="Vegastaden" />

    <!-- Gymmet Section -->
    <section class="pt-16 md:pt-20 pb-24 md:pb-32 bg-surface">
      <div class="container">
        <div class="max-w-5xl mx-auto">
          <!-- Centered text intro -->
          <div class="text-center mb-10 md:mb-12">
            <div class="mb-12">
              <StickySectionChip label="Gymmet" />
            </div>
            <h2 class="font-display font-bold text-4xl md:text-6xl mb-5 text-on-surface uppercase tracking-tight">
              Allt du behöver
            </h2>
            <p class="text-xl md:text-2xl text-on-surface-dim leading-relaxed max-w-2xl mx-auto">
              Frivikter, maskiner, kardio — oavsett hur du tränar finns det plats för dig här.
            </p>
          </div>

          <!-- Image Carousel -->
          <ImageCarousel :slides="gymSlides" />
        </div>
      </div>
    </section>

    <!-- Takterrass Section -->
    <section class="pt-16 md:pt-20 pb-24 md:pb-32 bg-surface-dim">
      <div class="container">
        <div class="max-w-5xl mx-auto">
          <!-- Centered text intro -->
          <div class="text-center mb-10 md:mb-12">
            <div class="mb-12">
              <StickySectionChip label="Takterrass" />
            </div>
            <h2 class="font-display font-bold text-4xl md:text-6xl mb-5 text-on-surface uppercase tracking-tight">
              Träna under öppen himmel
            </h2>
            <p class="text-xl md:text-2xl text-on-surface-dim leading-relaxed max-w-2xl mx-auto">
              Löparbana och frivikter utomhus. Öppet året runt.
            </p>
          </div>

          <!-- Image -->
          <div class="aspect-[16/9] rounded-3xl overflow-hidden mb-12">
            <img
              src="/images/vega-roof.webp"
              alt="Takterrassen på Core Gym Vegastaden"
              loading="lazy"
              class="w-full h-full object-cover"
            />
          </div>

          <!-- Features -->
          <div class="flex flex-wrap justify-center gap-4 md:gap-6">
            <span class="px-5 py-3 rounded-full border border-on-surface/20 text-on-surface font-medium">
              Löparbana
            </span>
            <span class="px-5 py-3 rounded-full border border-on-surface/20 text-on-surface font-medium">
              Frivikter
            </span>
            <span class="px-5 py-3 rounded-full border border-on-surface/20 text-on-surface font-medium">
              Öppet året runt
            </span>
          </div>
        </div>
      </div>
    </section>

    <!-- Yoga Section -->
    <section class="pt-16 md:pt-20 pb-24 md:pb-32 bg-[#f4f7f5]">
      <div class="container">
        <div class="max-w-5xl mx-auto">
          <!-- Centered text intro -->
          <div class="text-center mb-10 md:mb-12">
            <div class="mb-12">
              <StickySectionChip label="Yoga" color="green" />
            </div>
            <h2 class="font-display font-bold text-4xl md:text-6xl text-[#1d1d1f] uppercase tracking-tight mb-5">
              Hitta lugnet
            </h2>
            <p class="text-xl md:text-2xl text-[#6e6e73] leading-relaxed max-w-2xl mx-auto">
              Helt ljudisolerad sal dedikerad till yoga. Här kan du andas ut vardagen i lugn och ro — oavsett vad som händer på gymgolvet utanför.
            </p>
          </div>

          <!-- Image -->
          <div class="aspect-[16/9] rounded-3xl overflow-hidden mb-12">
            <img
              src="/images/yoga-angela-movement.avif"
              alt="Yogasal på Core Gym Vegastaden"
              loading="lazy"
              class="w-full h-full object-cover"
            />
          </div>

          <!-- Tags + CTA -->
          <div class="text-center">
            <div class="flex flex-wrap justify-center gap-3 mb-8">
              <span class="px-4 py-2 rounded-full border border-[#1d1d1f]/15 text-[#1d1d1f] font-medium">Vinyasa</span>
              <span class="px-4 py-2 rounded-full border border-[#1d1d1f]/15 text-[#1d1d1f] font-medium">Yin yoga</span>
              <span class="px-4 py-2 rounded-full border border-[#1d1d1f]/15 text-[#1d1d1f] font-medium">Power yoga</span>
            </div>
            <NuxtLink to="/yoga" class="btn btn-dark btn-lg">
              Om yoga
            </NuxtLink>
          </div>
        </div>
      </div>
    </section>

    <!-- Mammaträning Section -->
    <section class="pt-16 md:pt-20 pb-24 md:pb-32 bg-[#fdf6f7]">
      <div class="container">
        <div class="max-w-5xl mx-auto">
          <!-- Centered text intro -->
          <div class="text-center mb-10 md:mb-12">
            <div class="mb-12">
              <StickySectionChip label="Mammaträning" color="rose" />
            </div>
            <h2 class="font-display font-bold text-4xl md:text-6xl text-[#1d1d1f] uppercase tracking-tight mb-5">
              Träna med bebis
            </h2>
            <p class="text-xl md:text-2xl text-[#6e6e73] leading-relaxed max-w-2xl mx-auto">
              Kom igång efter förlossningen tillsammans med andra mammor. Anpassade pass där bebis är välkommen — och en chans att träffa andra i samma situation.
            </p>
          </div>

          <!-- Image -->
          <div class="aspect-[16/9] rounded-3xl overflow-hidden mb-12">
            <img
              src="/images/mamma-training.webp"
              alt="Mammaträning på Core Gym Vegastaden"
              loading="lazy"
              class="w-full h-full object-cover"
            />
          </div>

          <!-- CTA -->
          <div class="text-center">
            <NuxtLink to="/mammatraning" class="btn btn-dark btn-lg">
              Om mammaträning
            </NuxtLink>
          </div>
        </div>
      </div>
    </section>

    <!-- 18+ Section -->
    <section class="pt-16 md:pt-20 pb-24 md:pb-32 bg-on-surface text-white">
      <div class="container">
        <div class="max-w-5xl mx-auto">
          <!-- Centered text intro -->
          <div class="text-center mb-10 md:mb-12">
            <div class="mb-12">
              <StickySectionChip label="18+" dark />
            </div>
            <h2 class="font-display font-bold text-4xl md:text-6xl mb-5 uppercase tracking-tight">
              Vuxengym
            </h2>
            <p class="text-xl md:text-2xl text-white/70 leading-relaxed max-w-2xl mx-auto">
              Vegastaden har 18-årsgräns. Det ger en lugnare miljö, mer fokus och utrustning som alltid finns tillgänglig. För ungdomar finns våra andra gym.
            </p>
          </div>

          <!-- Image -->
          <div class="aspect-[16/9] rounded-3xl overflow-hidden mb-12">
            <img
              src="/images/vega-squat-rack.webp"
              alt="Träning på Core Gym Vegastaden"
              loading="lazy"
              class="w-full h-full object-cover"
            />
          </div>

          <!-- Info chips -->
          <div class="flex flex-wrap justify-center gap-3">
            <span class="px-5 py-3 rounded-full border border-white/20 text-white font-medium">
              Lugn atmosfär
            </span>
            <span class="px-5 py-3 rounded-full border border-white/20 text-white font-medium">
              Utrustning tillgänglig
            </span>
            <span class="px-5 py-3 rounded-full border border-white/20 text-white font-medium">
              Fokuserad träning
            </span>
          </div>
        </div>
      </div>
    </section>

    <!-- Les Mills Virtual -->
    <section class="pt-16 md:pt-20 pb-24 md:pb-32 bg-surface">
      <div class="container">
        <div class="max-w-5xl mx-auto">
          <!-- Centered text intro -->
          <div class="text-center mb-10 md:mb-12">
            <div class="mb-12">
              <StickySectionChip label="Virtual" />
            </div>
            <h2 class="font-display font-bold text-4xl md:text-6xl mb-5 text-on-surface uppercase tracking-tight">
              Träna när du vill
            </h2>
            <p class="text-xl md:text-2xl text-on-surface-dim leading-relaxed max-w-2xl mx-auto">
              Missa aldrig ett pass. Med Les Mills Virtual kan du köra dina favoriter precis när det passar ditt schema.
            </p>
          </div>

          <!-- Tags -->
          <div class="flex flex-wrap justify-center gap-3 mb-10">
            <span v-for="p in ['BODYPUMP', 'BODYBALANCE', 'BODYCOMBAT', 'RPM', 'GRIT', 'SH\'BAM']" :key="p"
              class="px-5 py-3 rounded-full border border-on-surface/20 text-on-surface font-medium">
              {{ p }}
            </span>
          </div>

          <div class="text-center">
            <NuxtLink to="/virtuellt" class="btn btn-dark btn-lg">
              Läs mer om Virtual
            </NuxtLink>
          </div>
        </div>
      </div>
    </section>

    <!-- News -->
    <NewsSection title="Senaste nytt" site="vegastaden" :limit="3" />

    <!-- Reviews -->
    <ReviewsSection title="Sagt om Vegastaden" :club-id="1" :limit="3" />

    <!-- Map -->
    <section class="pt-16 md:pt-20 pb-24 md:pb-32 bg-surface">
      <div class="container">
        <div class="max-w-5xl mx-auto">
          <!-- Centered text intro -->
          <div class="text-center mb-10 md:mb-12">
            <h2 class="font-display font-bold text-4xl md:text-6xl mb-5 text-on-surface uppercase tracking-tight">
              Hitta hit
            </h2>
            <p class="text-xl md:text-2xl text-on-surface-dim leading-relaxed">
              Vega Allé 2, 136 57 Vega
            </p>
          </div>

          <!-- Map -->
          <div class="aspect-square md:aspect-[16/9] rounded-3xl overflow-hidden mb-12">
            <ClientOnly>
              <AppleMap
                :single-gym="{ name: 'Vegastaden', address: 'Vega allé 2, 136 47 Haninge', lat: 59.1864555, lng: 18.1446918, href: '/vegastaden' }"
              />
            </ClientOnly>
          </div>

          <!-- Contact info -->
          <div class="flex flex-wrap justify-center gap-4 md:gap-6">
            <a href="tel:0850924549" class="px-5 py-3 rounded-full border border-on-surface/20 text-on-surface font-medium hover:bg-surface-container transition-colors">
              08-509 245 49
            </a>
            <a href="mailto:info@coregym.club" class="px-5 py-3 rounded-full border border-on-surface/20 text-on-surface font-medium hover:bg-surface-container transition-colors">
              info@coregym.club
            </a>
          </div>
        </div>
      </div>
    </section>

    <!-- CTA -->
    <section class="py-16 md:py-24 lg:py-32 bg-surface">
      <div class="container">
        <div class="relative overflow-hidden rounded-3xl lg:rounded-[2.5rem] bg-brand">
          <!-- Decorative blurs -->
          <div class="absolute top-0 left-0 w-[800px] h-[800px] bg-white/10 rounded-full -translate-x-1/2 -translate-y-1/2 blur-3xl" />
          <div class="absolute bottom-0 right-0 w-[600px] h-[600px] bg-black/20 rounded-full translate-x-1/2 translate-y-1/2 blur-3xl" />

          <div class="py-24 md:py-32 lg:py-40 px-6 md:px-12 text-center text-white relative z-10 max-w-4xl mx-auto">
            <h2 class="font-display font-bold text-4xl md:text-6xl mb-8 uppercase tracking-tight">Upplev Vegastaden</h2>
            <p class="text-xl md:text-2xl text-white/80 mb-12 leading-relaxed">
              Störst, modernast och öppet nästan dygnet runt.
            </p>
            <div class="flex flex-col sm:flex-row justify-center gap-4">
              <NuxtLink to="/bli-medlem" class="btn btn-light btn-xl">
                Se medlemskap
              </NuxtLink>
              <NuxtLink to="/kontakt" class="btn btn-ghost-light btn-xl">
                Kontakta oss
              </NuxtLink>
            </div>
          </div>
        </div>
      </div>
    </section>
  </div>
</template>
