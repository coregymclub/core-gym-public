<script setup lang="ts">
import type { ClassItem } from '~/composables/useGroupTraining'

useHead({
  title: 'Gruppträning - Core Gym Club',
  meta: [{ name: 'description', content: 'Över 50 klasser i veckan. Les Mills, yoga, spinning och mer. Alltid inkluderat i ditt medlemskap.' }]
})

const route = useRoute()
const router = useRouter()

const { schedule, loading, error, selectedClass, fetchSchedule, selectClass, clearSelection, getClassCategory, SITE_NAMES } = useGroupTraining()

const selectedSite = ref<number | null>(null)
const showSiteSheet = ref(false)
const selectedClassType = ref<string | null>(null)

// Hero background images for visual impact
const heroImages = [
  '/images/yoga-class-group.webp',
  '/images/bodypump.webp',
  '/images/classes/group-wod.webp',
  '/images/mikaela-lauren-box.webp',
]
const currentHeroIndex = ref(0)
const currentHeroImage = computed(() => heroImages[currentHeroIndex.value])

// Auto-rotate hero image
let heroInterval: ReturnType<typeof setInterval>
onMounted(() => {
  heroInterval = setInterval(() => {
    currentHeroIndex.value = (currentHeroIndex.value + 1) % heroImages.length
  }, 6000)
})
onUnmounted(() => {
  clearInterval(heroInterval)
})

// Class type filters - cleaner labels
const classTypes = [
  { id: 'strength', name: 'Styrka', description: 'Bodypump, toning' },
  { id: 'cardio', name: 'Cardio', description: 'Dans, aerobics' },
  { id: 'mindbody', name: 'Yoga & stretch', description: 'Lugna pass' },
  { id: 'cycle', name: 'Cykel', description: 'Spinning, RPM' },
  { id: 'hiit', name: 'HIIT & WOD', description: 'Intensiva pass' },
]

// Trial form
const trialForm = ref({ name: '', email: '', phone: '' })
const formSubmitting = ref(false)
const formSuccess = ref(false)
const formError = ref<string | null>(null)

const filteredSchedule = computed(() => {
  return schedule.value.map(day => ({
    ...day,
    classes: day.classes.filter(c => {
      if (selectedSite.value && c.siteId !== selectedSite.value) return false
      if (selectedClassType.value && getClassCategory(c.name) !== selectedClassType.value) return false
      return true
    })
  })).filter(day => day.classes.length > 0)
})

const selectedSiteName = computed(() => {
  if (!selectedSite.value) return 'Alla gym'
  return SITE_NAMES[selectedSite.value] || 'Alla gym'
})

function getCategoryColor(name: string): string {
  const category = getClassCategory(name)
  const colors: Record<string, string> = {
    strength: 'bg-brand',
    cardio: 'bg-rose-500',
    mindbody: 'bg-teal-500',
    cycle: 'bg-blue-500',
    hiit: 'bg-purple-500',
    core: 'bg-amber-500',
    toning: 'bg-pink-400',
    special: 'bg-gradient-to-b from-yellow-400 to-orange-500',
    other: 'bg-on-surface-dim'
  }
  return colors[category] ?? colors.other!
}

function formatDateShort(dateStr: string): string {
  const [, month, day] = dateStr.split('-').map(Number)
  return `${day}/${month}`
}

function calculateDuration(startTime: string, endTime: string): string {
  const startParts = startTime.split(':').map(Number)
  const endParts = endTime.split(':').map(Number)
  const startH = startParts[0] ?? 0
  const startM = startParts[1] ?? 0
  const endH = endParts[0] ?? 0
  const endM = endParts[1] ?? 0
  const startMinutes = startH * 60 + startM
  const endMinutes = endH * 60 + endM
  const duration = endMinutes - startMinutes
  return `${duration} min`
}

const SITE_ABBREV: Record<number, string> = {
  1: 'VEGA',
  2: 'TUNG',
  3: 'VH'
}

function getSiteAbbrev(siteId: number): string {
  return SITE_ABBREV[siteId] || '?'
}

function selectSite(siteId: number | null) {
  selectedSite.value = siteId
  showSiteSheet.value = false
  if (siteId) {
    router.replace({ query: { ...route.query, site: siteId } })
  } else {
    const { site, ...restQuery } = route.query
    router.replace({ query: restQuery })
  }
}

function handleClassClick(cls: ClassItem) {
  selectClass(cls)
  formSuccess.value = false
  formError.value = null
  trialForm.value = { name: '', email: '', phone: '' }
  router.replace({ query: { ...route.query, pass: cls.id } })
}

function handleCloseSheet() {
  clearSelection()
  formSuccess.value = false
  formError.value = null
  const { pass, ...restQuery } = route.query
  router.replace({ query: restQuery })
}

async function submitTrialBooking() {
  if (!selectedClass.value) return
  if (!trialForm.value.name || !trialForm.value.email || !trialForm.value.phone) {
    formError.value = 'Fyll i alla fält'
    return
  }

  formSubmitting.value = true
  formError.value = null

  try {
    const classDate = schedule.value.find(d => d.classes.some(c => c.id === selectedClass.value?.id))
    const dateStr = classDate ? `${classDate.dayName} ${formatDateShort(classDate.date)}` : ''
    const fullDate = classDate?.date || ''
    const bookingUrl = `https://coregym.club/grupptraning2?pass=${selectedClass.value.id}`

    const response = await fetch('https://student-email.coregymclub.se/send', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        to: 'info@coregym.club',
        subject: `Provträning: ${selectedClass.value.name} - ${dateStr}`,
        html: `
          <h2>Ny förfrågan om provträning</h2>
          <p><strong>Namn:</strong> ${trialForm.value.name}</p>
          <p><strong>E-post:</strong> ${trialForm.value.email}</p>
          <p><strong>Telefon:</strong> ${trialForm.value.phone}</p>
          <hr>
          <h3>Passinfo</h3>
          <p><strong>Pass:</strong> ${selectedClass.value.name}</p>
          <p><strong>Tid:</strong> ${selectedClass.value.time} - ${selectedClass.value.endTime}</p>
          <p><strong>Datum:</strong> ${dateStr} (${fullDate})</p>
          <p><strong>Gym:</strong> ${selectedClass.value.site}</p>
          <p><strong>Instruktör:</strong> ${selectedClass.value.instructor || 'Ej angiven'}</p>
          <p><strong>Lediga platser:</strong> ${selectedClass.value.spotsLeft}</p>
          <hr>
          <p><a href="${bookingUrl}">Länk till passet</a></p>
        `
      })
    })

    if (response.ok) {
      formSuccess.value = true
    } else {
      throw new Error()
    }
  } catch (e) {
    formError.value = 'Något gick fel. Ring 08-509 245 49'
  } finally {
    formSubmitting.value = false
  }
}

function selectClassFromUrl() {
  const passId = route.query.pass
  if (passId && schedule.value.length > 0) {
    const id = Number(passId)
    for (const day of schedule.value) {
      const cls = day.classes.find(c => c.id === id)
      if (cls) {
        selectClass(cls)
        break
      }
    }
  }
}

function initSiteFromUrl() {
  const siteParam = route.query.site
  if (siteParam) {
    const siteId = Number(siteParam)
    if (SITE_NAMES[siteId]) {
      selectedSite.value = siteId
    }
  }
}

watch(schedule, () => {
  selectClassFromUrl()
})

onMounted(async () => {
  initSiteFromUrl()
  await fetchSchedule(7)
  selectClassFromUrl()
})
</script>

<template>
  <div class="min-h-screen">
    <!-- Full-screen Hero with Background Image -->
    <section class="relative min-h-[85vh] flex items-end overflow-hidden">
      <!-- Background Image with Transition -->
      <div class="absolute inset-0">
        <TransitionGroup name="hero-fade">
          <img
            v-for="(img, index) in heroImages"
            v-show="index === currentHeroIndex"
            :key="img"
            :src="img"
            alt=""
            class="absolute inset-0 w-full h-full object-cover"
          />
        </TransitionGroup>
        <!-- Gradient Overlay -->
        <div class="absolute inset-0 bg-gradient-to-t from-black via-black/50 to-transparent" />
      </div>

      <!-- Hero Content -->
      <div class="relative z-10 container pb-16 md:pb-24">
        <div class="max-w-3xl">
          <p class="text-white/60 text-sm md:text-base font-medium tracking-widest uppercase mb-4">
            Gruppträning
          </p>
          <h1 class="font-display font-bold text-5xl sm:text-6xl md:text-7xl lg:text-8xl leading-[0.9] text-white mb-6 tracking-tight">
            Hitta din<br />grej
          </h1>
          <p class="text-xl md:text-2xl text-white/80 mb-10 max-w-xl leading-relaxed">
            Från lugn yoga till svettiga HIIT-pass. Över 50 klasser varje vecka — alltid inkluderat.
          </p>

          <!-- Hero Indicators -->
          <div class="flex gap-2 mb-8">
            <button
              v-for="(img, index) in heroImages"
              :key="img"
              class="h-1 rounded-full transition-all duration-500"
              :class="index === currentHeroIndex ? 'w-8 bg-white' : 'w-4 bg-white/30 hover:bg-white/50'"
              @click="currentHeroIndex = index"
            />
          </div>
        </div>
      </div>
    </section>

    <!-- Filters Bar - Sticky -->
    <div class="sticky top-0 z-20 bg-surface border-b border-outline/10">
      <div class="container">
        <div class="flex items-center gap-6 py-4 overflow-x-auto scrollbar-hide">
          <!-- Site selector -->
          <button
            class="flex items-center gap-2 text-sm font-semibold text-on-surface hover:text-brand transition-colors whitespace-nowrap"
            @click="showSiteSheet = true"
          >
            <span class="w-2 h-2 rounded-full" :class="selectedSite ? 'bg-brand' : 'bg-on-surface-dim/30'" />
            {{ selectedSiteName }}
            <svg class="w-4 h-4 text-on-surface-dim" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7" />
            </svg>
          </button>

          <div class="w-px h-5 bg-outline/20" />

          <!-- Type filters as clean text -->
          <button
            class="text-sm font-medium transition-colors whitespace-nowrap"
            :class="selectedClassType === null ? 'text-on-surface font-semibold' : 'text-on-surface-dim hover:text-on-surface'"
            @click="selectedClassType = null"
          >
            Alla pass
          </button>
          <button
            v-for="type in classTypes"
            :key="type.id"
            class="text-sm font-medium transition-colors whitespace-nowrap"
            :class="selectedClassType === type.id ? 'text-on-surface font-semibold' : 'text-on-surface-dim hover:text-on-surface'"
            @click="selectedClassType = type.id"
          >
            {{ type.name }}
          </button>
        </div>
      </div>
    </div>

    <!-- Schedule Section -->
    <section class="section bg-surface">
      <div class="container">
        <!-- Loading -->
        <div v-if="loading" class="text-center py-24">
          <div class="w-10 h-10 border-2 border-brand border-t-transparent rounded-full animate-spin mx-auto mb-4" />
          <p class="text-on-surface-dim">Hämtar schemat...</p>
        </div>

        <!-- Error -->
        <div v-else-if="error" class="text-center py-24 max-w-md mx-auto">
          <p class="text-title mb-2">Hoppsan!</p>
          <p class="text-body text-on-surface-dim mb-6">{{ error }}</p>
          <button @click="fetchSchedule(7)" class="btn btn-secondary">Försök igen</button>
        </div>

        <!-- Schedule -->
        <div v-else-if="filteredSchedule.length > 0" class="max-w-4xl mx-auto">
          <div v-for="day in filteredSchedule" :key="day.date" class="mb-16">
            <!-- Day Header - Editorial Style -->
            <div class="mb-8">
              <h2 class="font-display font-bold text-4xl md:text-5xl lg:text-6xl capitalize text-on-surface tracking-tight">
                {{ day.dayName }}
              </h2>
              <p class="text-lg text-on-surface-dim mt-1">{{ formatDateShort(day.date) }}</p>
            </div>

            <!-- Classes Grid - Clean Cards -->
            <div class="grid gap-3">
              <button
                v-for="cls in day.classes"
                :key="cls.id"
                class="group relative w-full text-left bg-surface-dim hover:bg-surface-container rounded-2xl p-5 md:p-6 transition-all duration-200 border border-transparent hover:border-outline/10 hover:shadow-lg"
                @click="handleClassClick(cls)"
              >
                <div class="flex items-start gap-5">
                  <!-- Time Block -->
                  <div class="flex-shrink-0 text-center">
                    <span class="font-display font-bold text-2xl md:text-3xl text-on-surface tabular-nums block leading-none">
                      {{ cls.time }}
                    </span>
                    <span class="text-xs text-on-surface-dim/60 mt-1 block">
                      {{ calculateDuration(cls.time, cls.endTime) }}
                    </span>
                  </div>

                  <!-- Main Content -->
                  <div class="flex-1 min-w-0">
                    <div class="flex items-start justify-between gap-3">
                      <div>
                        <h3 class="font-display font-bold text-lg md:text-xl uppercase tracking-tight text-on-surface group-hover:text-brand transition-colors">
                          {{ cls.name }}
                        </h3>
                        <div class="flex items-center gap-3 mt-2 text-sm text-on-surface-dim">
                          <span v-if="cls.instructor" class="flex items-center gap-2">
                            <span v-if="cls.instructorImage" class="w-5 h-5 rounded-full overflow-hidden border border-outline/20">
                              <img :src="cls.instructorImage" :alt="cls.instructor" loading="lazy" class="w-full h-full object-cover" />
                            </span>
                            {{ cls.instructor }}
                          </span>
                          <span v-if="!selectedSite" class="text-on-surface-dim/50">
                            {{ getSiteAbbrev(cls.siteId) }}
                          </span>
                        </div>
                      </div>

                      <!-- Availability -->
                      <div class="flex-shrink-0">
                        <span v-if="cls.spotsLeft === 0" class="px-3 py-1 rounded-full text-xs font-bold bg-amber-100 text-amber-700">
                          Väntelista
                        </span>
                        <span v-else class="flex items-center gap-1.5 text-green-600 text-sm font-medium">
                          <span class="w-2 h-2 rounded-full bg-green-500" />
                          Ledigt
                        </span>
                      </div>
                    </div>
                  </div>
                </div>

                <!-- Category Indicator Line -->
                <div
                  class="absolute left-0 top-5 bottom-5 w-1 rounded-full"
                  :class="getCategoryColor(cls.name)"
                />
              </button>
            </div>
          </div>
        </div>

        <!-- Empty -->
        <div v-else class="text-center py-24 max-w-md mx-auto">
          <div class="w-16 h-16 bg-surface-dim rounded-full flex items-center justify-center mx-auto mb-6">
            <svg class="w-8 h-8 text-on-surface-dim" fill="none" stroke="currentColor" viewBox="0 0 24 24">
               <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
            </svg>
          </div>
          <h3 class="text-title mb-2">Inga pass hittades</h3>
          <p class="text-body text-on-surface-dim">Försök att välja ett annat gym eller kom tillbaka lite senare.</p>
        </div>
      </div>
    </section>

    <!-- Info Section -->
    <section class="section bg-[#2a2a2c] text-white">
      <div class="container max-w-5xl">
        <div class="grid md:grid-cols-2 gap-12 md:gap-16 items-start">
          <div>
            <h2 class="font-display font-bold text-4xl md:text-5xl uppercase tracking-tight mb-6">
              Alltid inkluderat
            </h2>
            <p class="text-xl text-white/70 leading-relaxed">
              Alla våra gruppträningspass ingår i medlemskapet. Inga dolda avgifter.
            </p>
          </div>
          <div class="space-y-6">
            <div class="flex items-start gap-4">
              <div class="w-10 h-10 rounded-full bg-white/10 flex items-center justify-center flex-shrink-0">
                <svg class="w-5 h-5 text-brand" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 18h.01M8 21h8a2 2 0 002-2V5a2 2 0 00-2-2H8a2 2 0 00-2 2v14a2 2 0 002 2z" />
                </svg>
              </div>
              <div>
                <h3 class="font-bold text-lg mb-1">Boka i appen</h3>
                <p class="text-white/60">Smidigt och snabbt, direkt i din mobil.</p>
              </div>
            </div>
            <div class="flex items-start gap-4">
              <div class="w-10 h-10 rounded-full bg-white/10 flex items-center justify-center flex-shrink-0">
                <svg class="w-5 h-5 text-brand" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <div>
                <h3 class="font-bold text-lg mb-1">Checka in 10 min innan</h3>
                <p class="text-white/60">Var på plats i tid så du inte missar din plats.</p>
              </div>
            </div>
            <div class="flex items-start gap-4">
              <div class="w-10 h-10 rounded-full bg-white/10 flex items-center justify-center flex-shrink-0">
                <svg class="w-5 h-5 text-brand" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                </svg>
              </div>
              <div>
                <h3 class="font-bold text-lg mb-1">Ta med en vän</h3>
                <p class="text-white/60">Första gången är gratis för vänner.</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>

    <!-- Site Selector Bottom Sheet -->
    <Teleport to="body">
      <Transition
        enter-active-class="transition duration-300 ease-out"
        enter-from-class="opacity-0"
        enter-to-class="opacity-100"
        leave-active-class="transition duration-200 ease-in"
        leave-from-class="opacity-100"
        leave-to-class="opacity-0"
      >
        <div v-if="showSiteSheet" class="fixed inset-0 z-[500] bg-black/40 backdrop-blur-sm" @click="showSiteSheet = false" />
      </Transition>

      <Transition
        enter-active-class="transition duration-400 cubic-bezier(0.32, 0.72, 0, 1)"
        enter-from-class="translate-y-full"
        enter-to-class="translate-y-0"
        leave-active-class="transition duration-250 ease-in"
        leave-from-class="translate-y-0"
        leave-to-class="translate-y-full"
      >
        <div v-if="showSiteSheet" class="fixed bottom-0 left-0 right-0 z-[501] bg-surface rounded-t-[2.5rem] shadow-2xl">
          <div class="pt-4 pb-2 flex justify-center" @click="showSiteSheet = false">
            <div class="w-12 h-1.5 bg-outline/50 rounded-full" />
          </div>

          <div class="px-6 pb-10 pt-2">
            <h3 class="font-display font-bold text-2xl text-center uppercase tracking-tight mb-6">Välj gym</h3>

            <div class="space-y-2 max-w-sm mx-auto">
              <button
                class="w-full flex items-center gap-4 px-5 py-4 rounded-2xl text-left text-lg transition-all"
                :class="selectedSite === null ? 'bg-brand text-white font-bold shadow-lg' : 'bg-surface-dim hover:bg-surface-container text-on-surface'"
                @click="selectSite(null)"
              >
                <span class="w-3 h-3 rounded-full border-2" :class="selectedSite === null ? 'bg-white border-white' : 'border-outline'" />
                <span class="flex-1">Alla gym</span>
              </button>

              <button
                v-for="(name, id) in SITE_NAMES"
                :key="id"
                class="w-full flex items-center gap-4 px-5 py-4 rounded-2xl text-left text-lg transition-all"
                :class="selectedSite === Number(id) ? 'bg-brand text-white font-bold shadow-lg' : 'bg-surface-dim hover:bg-surface-container text-on-surface'"
                @click="selectSite(Number(id))"
              >
                <span class="w-3 h-3 rounded-full border-2" :class="selectedSite === Number(id) ? 'bg-white border-white' : 'border-outline'" />
                <span class="flex-1">{{ name }}</span>
              </button>
            </div>
          </div>
        </div>
      </Transition>
    </Teleport>

    <!-- Class Details Bottom Sheet -->
    <Teleport to="body">
      <Transition
        enter-active-class="transition duration-300 ease-out"
        enter-from-class="opacity-0"
        enter-to-class="opacity-100"
        leave-active-class="transition duration-200 ease-in"
        leave-from-class="opacity-100"
        leave-to-class="opacity-0"
      >
        <div v-if="selectedClass" class="fixed inset-0 z-[400] bg-black/60 backdrop-blur-sm" @click="handleCloseSheet" />
      </Transition>

      <Transition
        enter-active-class="transition duration-500 cubic-bezier(0.32, 0.72, 0, 1)"
        enter-from-class="translate-y-full"
        enter-to-class="translate-y-0"
        leave-active-class="transition duration-300 ease-in"
        leave-from-class="translate-y-0"
        leave-to-class="translate-y-full"
      >
        <div v-if="selectedClass" class="fixed bottom-0 left-0 right-0 z-[401] bg-surface rounded-t-[2.5rem] max-h-[90vh] overflow-y-auto shadow-2xl">
          <div class="sticky top-0 bg-surface pt-4 pb-2 z-10 flex justify-center" @click="handleCloseSheet">
            <div class="w-12 h-1.5 bg-outline/50 rounded-full" />
          </div>

          <div class="px-5 sm:px-6 pb-10 pt-2 max-w-xl mx-auto">
            <!-- Header -->
            <div class="flex items-start justify-between gap-3 mb-8">
              <div class="flex-1 min-w-0">
                <p class="text-sm text-on-surface-dim font-medium mb-2">{{ selectedClass.site }}</p>
                <h2 class="font-display font-bold text-3xl sm:text-4xl uppercase tracking-tight text-on-surface">
                  {{ selectedClass.name }}
                </h2>
              </div>
              <button class="p-2 -mr-2 -mt-1 rounded-full hover:bg-surface-dim transition-colors text-on-surface-dim" @click="handleCloseSheet">
                <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>

            <!-- Time and Status -->
            <div class="flex items-center gap-4 mb-8">
              <div class="bg-surface-dim px-5 py-4 rounded-2xl">
                <span class="text-xs font-bold uppercase tracking-wider text-on-surface-dim block mb-1">Tid</span>
                <span class="font-display font-bold text-2xl">{{ selectedClass.time }}</span>
                <span class="text-on-surface-dim ml-1">{{ calculateDuration(selectedClass.time, selectedClass.endTime) }}</span>
              </div>
              <div class="flex items-center gap-2">
                <span v-if="selectedClass.spotsLeft === 0" class="px-4 py-2 rounded-full text-sm font-bold bg-amber-100 text-amber-700">Väntelista</span>
                <span v-else class="flex items-center gap-2 text-green-600 font-medium">
                  <span class="w-3 h-3 rounded-full bg-green-500" />
                  Ledigt
                </span>
              </div>
            </div>

            <!-- Instructor -->
            <div v-if="selectedClass.instructor" class="flex items-center gap-4 mb-8 bg-surface-dim rounded-2xl p-4">
              <div class="w-14 h-14 rounded-full overflow-hidden bg-surface flex-shrink-0">
                <img
                  v-if="selectedClass.instructorImage"
                  :src="selectedClass.instructorImage"
                  :alt="selectedClass.instructor"
                  class="w-full h-full object-cover"
                />
                <div v-else class="w-full h-full flex items-center justify-center bg-brand text-white">
                  <span class="text-xl font-bold">{{ selectedClass.instructor.charAt(0) }}</span>
                </div>
              </div>
              <div>
                <span class="text-xs font-bold uppercase tracking-wider text-on-surface-dim block">Instruktör</span>
                <span class="font-display font-bold text-xl">{{ selectedClass.instructor }}</span>
              </div>
            </div>

            <!-- Description -->
            <div v-if="selectedClass.description" class="mb-8">
              <h3 class="text-xs font-bold uppercase tracking-wider text-on-surface-dim mb-3">Om passet</h3>
              <p class="text-on-surface leading-relaxed text-lg">{{ selectedClass.description }}</p>
            </div>

            <!-- Booking Section -->
            <div v-if="selectedClass.spotsLeft > 0" class="border-t border-outline/30 pt-8">
              <div v-if="formSuccess" class="text-center py-8 bg-green-50 rounded-3xl border border-green-100">
                <div class="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <svg class="w-8 h-8 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7" />
                  </svg>
                </div>
                <h3 class="text-xl font-bold mb-2 text-green-900">Förfrågan mottagen!</h3>
                <p class="text-green-700">Vi återkommer via mail eller telefon.</p>
              </div>

              <form v-else @submit.prevent="submitTrialBooking" class="space-y-5">
                <div>
                  <h3 class="font-bold text-lg mb-1">Vill du prova?</h3>
                  <p class="text-sm text-on-surface-dim">Medlem? <a href="https://app.coregymclub.se" class="text-brand font-medium hover:underline">Boka i appen</a></p>
                </div>

                <div class="space-y-4">
                  <div>
                    <label class="block text-xs font-bold uppercase tracking-wider text-on-surface-dim mb-2 ml-1">Namn</label>
                    <input
                      v-model="trialForm.name"
                      type="text"
                      placeholder="För- och efternamn"
                      required
                      class="w-full px-5 py-4 bg-surface-dim rounded-2xl border-2 border-transparent focus:border-brand focus:bg-surface outline-none transition-all font-medium"
                    />
                  </div>

                  <div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label class="block text-xs font-bold uppercase tracking-wider text-on-surface-dim mb-2 ml-1">E-post</label>
                      <input
                        v-model="trialForm.email"
                        type="email"
                        placeholder="namn@exempel.se"
                        required
                        class="w-full px-5 py-4 bg-surface-dim rounded-2xl border-2 border-transparent focus:border-brand focus:bg-surface outline-none transition-all font-medium"
                      />
                    </div>
                    <div>
                      <label class="block text-xs font-bold uppercase tracking-wider text-on-surface-dim mb-2 ml-1">Telefon</label>
                      <input
                        v-model="trialForm.phone"
                        type="tel"
                        placeholder="070..."
                        required
                        class="w-full px-5 py-4 bg-surface-dim rounded-2xl border-2 border-transparent focus:border-brand focus:bg-surface outline-none transition-all font-medium"
                      />
                    </div>
                  </div>
                </div>

                <div v-if="formError" class="p-4 bg-red-50 text-red-600 rounded-xl text-sm font-medium border border-red-100 flex items-center gap-3">
                  <svg class="w-5 h-5 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  {{ formError }}
                </div>

                <button type="submit" :disabled="formSubmitting" class="btn btn-primary w-full justify-center py-5 text-xl rounded-2xl shadow-lg shadow-brand/20">
                  <span v-if="formSubmitting" class="flex items-center gap-2">
                    <svg class="animate-spin h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                      <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
                      <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    Skickar...
                  </span>
                  <span v-else>Skicka bokningsförfrågan</span>
                </button>
              </form>
            </div>

            <div v-else class="text-center py-8 bg-amber-50 rounded-3xl mt-8 border border-amber-100">
              <h3 class="text-xl font-bold mb-2 text-amber-800">Väntelista</h3>
              <p class="text-amber-700">Det här passet är fullt just nu.</p>
            </div>
          </div>
        </div>
      </Transition>
    </Teleport>
  </div>
</template>

<style scoped>
/* Hero fade transition */
.hero-fade-enter-active,
.hero-fade-leave-active {
  transition: opacity 1.5s ease;
}
.hero-fade-enter-from,
.hero-fade-leave-to {
  opacity: 0;
}

/* Hide scrollbar for filter bar */
.scrollbar-hide {
  -ms-overflow-style: none;
  scrollbar-width: none;
}
.scrollbar-hide::-webkit-scrollbar {
  display: none;
}
</style>
