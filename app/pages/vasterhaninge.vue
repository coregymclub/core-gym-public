<script setup lang="ts">
useHead({
  title: 'Västerhaninge - Core Gym Club',
  meta: [{ name: 'description', content: 'Core Gym Västerhaninge - centralt gym med modern utrustning och gruppträning.' }]
})

useThemeColor('#1a1a1a')

const { fetchToday, fetchWeek, getStaffingStatus, weekData } = useStaffing()
const { stats: gymStats, fetchStats: fetchGymStats, startAutoRefresh } = useGymStats()

const SITE_ID = 3

// Expanderbar info-sheet state
const activeCard = ref<string | null>(null)

function toggleCard(card: string) {
  activeCard.value = activeCard.value === card ? null : card
}

// Klubbar för bemanningsväljare
const clubs = [
  { id: 3, name: 'Västerhaninge' },
  { id: 2, name: 'Tungelsta' },
  { id: 1, name: 'Vegastaden' },
]

const selectedClubId = ref(SITE_ID)

// Veckans bemanningstider för vald klubb
const weeklySchedule = computed(() => {
  if (!weekData.value) return []
  const today = new Date().toISOString().split('T')[0]
  const clubId = selectedClubId.value

  // För Vegastaden, visa alla dagar. För andra, bara bemannade.
  const days = weekData.value.days.map(day => {
    const clubData = day.clubs[String(clubId)]
    return {
      ...day,
      displayText: clubData?.displayText || '',
      staffed: clubData?.staffed ?? false,
      isToday: day.date === today
    }
  })

  return clubId === 1 ? days : days.filter(day => day.staffed)
})

onMounted(async () => {
  await Promise.all([fetchToday(), fetchWeek(), fetchGymStats()])
  startAutoRefresh(120000)
})
</script>

<template>
  <div>
    <!-- Hero -->
    <section class="min-h-[80vh] flex items-center justify-center bg-on-surface text-white px-6 relative overflow-hidden">
      <!-- Image: Västerhaninge -->
      <div class="absolute inset-0 z-0">
        <img src="/images/gyms/vasterhaninge-gym-new-2.webp" alt="Västerhaninge" class="w-full h-full object-cover opacity-50" />
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
        </div>
      </div>
    </section>

    <!-- ============ INFO SHEET ============ -->
    <section class="pt-12 md:pt-16 bg-surface-dim">
      <div class="container max-w-2xl">
        <div class="bg-surface rounded-t-[2rem] md:rounded-t-[2.5rem] px-6 md:px-10 shadow-sm border border-outline/10 border-b-0 divide-y divide-outline/10">

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
                <div class="pt-6">
                  <!-- Klubbväljare -->
                  <div class="relative mb-5">
                    <select
                      v-model.number="selectedClubId"
                      class="w-full appearance-none bg-surface-container rounded-xl px-4 py-3 pr-10 text-on-surface font-medium cursor-pointer focus:outline-none focus:ring-2 focus:ring-on-surface/20"
                    >
                      <option v-for="club in clubs" :key="club.id" :value="club.id">
                        {{ club.name }}
                      </option>
                    </select>
                    <svg class="absolute right-4 top-1/2 -translate-y-1/2 w-4 h-4 text-on-surface-dim pointer-events-none" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
                      <path stroke-linecap="round" stroke-linejoin="round" d="M19 9l-7 7-7-7" />
                    </svg>
                  </div>

                  <!-- Info om att besöka andra klubbar -->
                  <p class="text-sm text-on-surface-dim mb-5">
                    Alla ärenden kan hanteras på vilken klubb som helst.
                  </p>

                  <!-- Tider -->
                  <div class="space-y-3">
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
                    <p v-if="weeklySchedule.length === 0" class="text-on-surface-dim text-sm">
                      Inga bemannade tider denna vecka.
                    </p>
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
                    <p class="text-on-surface-dim">Kom förbi under bemannade tider så visar vi runt och du får testa gymmet kostnadsfritt.</p>
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
                    <p class="text-on-surface-dim">Träna en gång för 100 kr. Gäller under bemannade tider.</p>
                  </div>
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
                    <span>Centrumvägen 4, Västerhaninge</span>
                  </div>
                </div>
              </div>
            </div>
          </div>

        </div>
      </div>
    </section>

    <!-- Popular Times -->
    <PopularTimes />

    <!-- EGYM Section -->
    <section class="pt-16 md:pt-20 pb-24 md:pb-32 bg-on-surface text-white">
      <div class="container">
        <div class="max-w-5xl mx-auto">
          <!-- Centered text intro -->
          <div class="text-center mb-10 md:mb-12">
            <div class="mb-12">
              <StickySectionChip label="EGYM" dark />
            </div>
            <h2 class="font-display font-bold text-4xl md:text-6xl mb-5 uppercase tracking-tight">
              Intelligent träning
            </h2>
            <p class="text-xl md:text-2xl text-white/70 leading-relaxed max-w-2xl mx-auto">
              Maskinerna ställer in sig automatiskt efter dig. Finns i samma byggnad med egen ingång.
            </p>
          </div>

          <!-- Image -->
          <div class="aspect-[16/9] rounded-3xl overflow-hidden mb-12">
            <img
              src="/images/egym-section.webp"
              alt="EGYM på Core Gym Västerhaninge"
              class="w-full h-full object-cover"
            />
          </div>

          <!-- Features -->
          <div class="flex flex-wrap justify-center gap-3 mb-10">
            <span class="px-5 py-3 rounded-full border border-white/20 text-white font-medium">
              Automatisk vikt
            </span>
            <span class="px-5 py-3 rounded-full border border-white/20 text-white font-medium">
              Digital dagbok
            </span>
            <span class="px-5 py-3 rounded-full border border-white/20 text-white font-medium">
              Personliga program
            </span>
            <span class="px-5 py-3 rounded-full border border-white/20 text-white font-medium">
              Egen ingång
            </span>
          </div>

          <div class="text-center">
            <NuxtLink to="/egym" class="btn btn-light btn-lg">
              Läs mer om EGYM
            </NuxtLink>
          </div>
        </div>
      </div>
    </section>

    <!-- Tungelsta access -->
    <section class="pt-16 md:pt-20 pb-24 md:pb-32 bg-surface">
      <div class="container">
        <div class="max-w-5xl mx-auto">
          <!-- Centered text intro -->
          <div class="text-center mb-10 md:mb-12">
            <div class="mb-12">
              <StickySectionChip label="Nyhet" color="green" />
            </div>
            <h2 class="font-display font-bold text-4xl md:text-6xl mb-5 text-on-surface uppercase tracking-tight">
              Nu ingår Tungelsta
            </h2>
            <p class="text-xl md:text-2xl text-on-surface-dim leading-relaxed max-w-2xl mx-auto">
              Alla med Västerhaninge-kort har nu även tillgång till Tungelsta — med gruppträning, yoga och mycket mer.
            </p>
          </div>

          <!-- Features -->
          <div class="flex flex-wrap justify-center gap-3 mb-10">
            <span class="px-5 py-3 rounded-full border border-on-surface/20 text-on-surface font-medium">
              Gruppträning
            </span>
            <span class="px-5 py-3 rounded-full border border-on-surface/20 text-on-surface font-medium">
              Yoga
            </span>
            <span class="px-5 py-3 rounded-full border border-on-surface/20 text-on-surface font-medium">
              Familjär atmosfär
            </span>
          </div>

          <div class="text-center">
            <NuxtLink to="/tungelsta" class="btn btn-dark btn-lg">
              Utforska Tungelsta
            </NuxtLink>
          </div>
        </div>
      </div>
    </section>

    <!-- News -->
    <NewsSection title="Senaste nytt" site="vasterhaninge" :limit="3" />

    <!-- Reviews -->
    <ReviewsSection title="Sagt om Västerhaninge" :club-id="2" :limit="6" />

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
              Centrumvägen 4, 137 61 Västerhaninge
            </p>
          </div>

          <!-- Map -->
          <div class="aspect-[16/9] rounded-3xl overflow-hidden mb-12">
            <ClientOnly>
              <AppleMap
                :single-gym="{ name: 'Västerhaninge', address: 'Centrumvägen 4', lat: 59.1258, lng: 18.0731, href: '/vasterhaninge' }"
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
            <h2 class="font-display font-bold text-4xl md:text-6xl mb-8 uppercase tracking-tight">Börja träna</h2>
            <p class="text-xl md:text-2xl text-white/80 mb-12 leading-relaxed">
              Bli medlem på Västerhaninge idag.
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

