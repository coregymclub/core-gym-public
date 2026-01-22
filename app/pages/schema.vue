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
const showDropdown = ref(false)
const selectedClassType = ref<string | null>(null)

// Carousel images for visual display
const carouselImages = [
  { src: '/images/yoga-class-group.webp', alt: 'Yoga' },
  { src: '/images/bodypump.webp', alt: 'Bodypump' },
  { src: '/images/mikaela-lauren-box.webp', alt: 'Boxning med Mikaela Lauren' },
  { src: '/images/classes/cycling.jpg', alt: 'Cykel' },
  { src: '/images/denise-biking.webp', alt: 'Spinning' },
  { src: '/images/yoga-class.webp', alt: 'Yoga' },
]

const carouselRef = ref<HTMLElement | null>(null)
const isScrolling = ref(false)
const infiniteImages = computed(() => [...carouselImages, ...carouselImages, ...carouselImages])

const getItemWidth = () => {
  if (typeof window === 'undefined') return 105
  return window.innerWidth >= 768 ? 180 : 105
}

const onCarouselScroll = () => {
  if (!carouselRef.value || isScrolling.value) return
  const container = carouselRef.value
  const itemWidth = getItemWidth()
  const singleSetWidth = carouselImages.length * itemWidth
  const scrollLeft = container.scrollLeft

  if (scrollLeft >= singleSetWidth * 2 - container.clientWidth / 2) {
    isScrolling.value = true
    container.scrollLeft = scrollLeft - singleSetWidth
    requestAnimationFrame(() => { isScrolling.value = false })
  } else if (scrollLeft <= singleSetWidth / 2) {
    isScrolling.value = true
    container.scrollLeft = scrollLeft + singleSetWidth
    requestAnimationFrame(() => { isScrolling.value = false })
  }
}

const scrollToCenter = () => {
  if (!carouselRef.value) return
  const container = carouselRef.value
  const itemWidth = getItemWidth()
  const centerPosition = carouselImages.length * itemWidth + (carouselImages.length / 2) * itemWidth
  container.scrollTo({ left: centerPosition, behavior: 'instant' })
}

// Class type filters
const classTypes = [
  { id: 'strength', name: 'Styrka', color: 'bg-brand' },
  { id: 'cardio', name: 'Cardio', color: 'bg-rose-500' },
  { id: 'mindbody', name: 'Yoga', color: 'bg-teal-500' },
  { id: 'cycle', name: 'Cykel', color: 'bg-blue-500' },
  { id: 'hiit', name: 'HIIT', color: 'bg-purple-500' },
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
      // Filter by site
      if (selectedSite.value && c.siteId !== selectedSite.value) return false
      // Filter by class type category (from chips)
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
  showDropdown.value = false
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
    const bookingUrl = `https://coregym.club/schema?pass=${selectedClass.value.id}`

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

      // Skicka också till team-chatten
      try {
        await fetch('https://teamchat.coregym.club/api/chat/reception', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            message: `🏋️ **Provträning**\n${trialForm.value.name} vill prova **${selectedClass.value.name}**\n📅 ${dateStr} kl ${selectedClass.value.time}\n📍 ${selectedClass.value.site}\n📧 ${trialForm.value.email}\n📱 ${trialForm.value.phone}`,
            author: 'System'
          })
        })
      } catch (e) {
        // Ignorera chat-fel, mejlet gick iväg
      }
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

function handleClickOutside(event: MouseEvent) {
  const target = event.target as HTMLElement
  if (!target.closest('.dropdown-container')) {
    showDropdown.value = false
  }
}

onMounted(() => {
  document.addEventListener('click', handleClickOutside)
  // Scroll carousel to center
  nextTick(() => {
    scrollToCenter()
  })
})

onUnmounted(() => {
  document.removeEventListener('click', handleClickOutside)
})
</script>

<template>
  <div class="overflow-x-hidden">
    <!-- Hero -->
    <section class="flex flex-col justify-center bg-[#2a2a2e] px-6 relative overflow-hidden pt-24 pb-24">
      <div class="text-center relative z-10 max-w-4xl mx-auto mb-6">
        <span class="inline-block px-5 py-1.5 rounded-full text-xs font-bold tracking-widest uppercase border border-white/15 text-white/60 bg-white/5 mb-6">
          Gruppträning
        </span>
        <h1 class="font-display font-bold text-5xl md:text-7xl lg:text-8xl leading-[0.9] text-white mb-6 uppercase tracking-tighter">
          Hitta din grej
        </h1>
        <p class="text-xl md:text-2xl text-white/70 mb-8 max-w-2xl mx-auto leading-relaxed font-medium">
          Från lugn yoga till svettiga HIIT-pass. Över 50 klasser i veckan. <br class="hidden md:inline" />
          Alltid inkluderat i ditt medlemskap.
        </p>

        <!-- Site filter -->
        <div class="flex justify-center">
          <div class="dropdown-container relative">
            <button
              class="flex items-center gap-3 px-6 py-3 bg-white/10 hover:bg-white/15 text-white shadow-lg hover:shadow-xl hover:-translate-y-0.5 rounded-full text-lg font-bold transition-all backdrop-blur-sm"
              @click.stop="showDropdown = !showDropdown"
            >
              <span class="w-2.5 h-2.5 rounded-full" :class="selectedSite ? 'bg-brand' : 'bg-white/40'" />
              {{ selectedSiteName }}
              <svg class="w-5 h-5 text-white/60 transition-transform duration-300" :class="showDropdown ? 'rotate-180' : ''" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7" />
              </svg>
            </button>
          </div>
        </div>
      </div>

      <!-- Visual Carousel -->
      <div class="carousel-container relative z-10 mt-4">
        <div ref="carouselRef" class="carousel-track" @scroll="onCarouselScroll">
          <div
            v-for="(image, index) in infiniteImages"
            :key="index"
            class="carousel-item"
          >
            <img :src="image.src" :alt="image.alt" loading="lazy" />
          </div>
        </div>
      </div>
    </section>

    <!-- Schedule -->
    <section class="section bg-surface relative z-10 -mt-12 rounded-t-[2.5rem] pt-8">
      <div class="container">

        <!-- Clean Text Filters -->
        <div class="mb-10 max-w-4xl mx-auto">
          <div class="flex items-center justify-center gap-6 md:gap-8 flex-wrap">
            <button
              class="text-base md:text-lg font-medium transition-colors"
              :class="selectedClassType === null ? 'text-on-surface font-bold' : 'text-on-surface-dim hover:text-on-surface'"
              @click="selectedClassType = null"
            >
              Alla pass
            </button>
            <button
              v-for="type in classTypes"
              :key="type.id"
              class="text-base md:text-lg font-medium transition-colors"
              :class="selectedClassType === type.id ? 'text-on-surface font-bold' : 'text-on-surface-dim hover:text-on-surface'"
              @click="selectedClassType = type.id"
            >
              {{ type.name }}
            </button>
          </div>
        </div>
        
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

        <!-- Schedule Grid - Responsive -->
        <div v-else-if="filteredSchedule.length > 0" class="space-y-16 lg:space-y-24 max-w-7xl mx-auto">
          <div v-for="day in filteredSchedule" :key="day.date">
            <!-- Day Header - Editorial Style -->
            <div class="mb-8 lg:mb-10">
              <h3 class="font-display font-bold text-4xl sm:text-5xl md:text-6xl capitalize text-on-surface tracking-tight">{{ day.dayName }}</h3>
              <p class="text-lg md:text-xl text-on-surface-dim/50 mt-2">{{ formatDateShort(day.date) }}</p>
            </div>

            <!-- Classes - Vertical list -->
            <div class="flex flex-col gap-3 overflow-hidden max-w-3xl">
              <button
                v-for="cls in day.classes"
                :key="cls.id"
                class="group relative w-full text-left bg-surface-dim hover:bg-surface-container rounded-2xl p-4 sm:p-5 lg:p-6 transition-all duration-200 overflow-hidden border border-transparent hover:border-outline/10 hover:shadow-md"
                @click="handleClassClick(cls)"
              >
                <div class="flex items-center gap-4 sm:gap-5">
                  <!-- Time & Duration -->
                  <div class="flex flex-col items-center w-16 sm:w-20 flex-shrink-0">
                    <span class="font-display font-bold text-2xl sm:text-3xl leading-none text-on-surface tabular-nums">{{ cls.time }}</span>
                    <span class="text-xs sm:text-sm font-medium text-on-surface-dim/50 mt-1.5">{{ calculateDuration(cls.time, cls.endTime) }}</span>
                  </div>

                  <!-- Vertical Line Indicator -->
                  <div class="w-1.5 h-14 sm:h-16 rounded-full flex-shrink-0" :class="getCategoryColor(cls.name)" />

                  <!-- Info -->
                  <div class="flex-1 min-w-0">
                    <h4 class="font-display font-bold text-lg sm:text-xl lg:text-2xl uppercase tracking-tight truncate group-hover:text-brand transition-colors text-on-surface mb-1.5">{{ cls.name }}</h4>
                    <div class="flex items-center gap-2 text-sm sm:text-base text-on-surface-dim/70">
                      <span v-if="cls.instructorImage" class="w-6 h-6 rounded-full overflow-hidden flex-shrink-0 border border-outline/20">
                        <img :src="cls.instructorImage" :alt="cls.instructor || ''" loading="lazy" class="w-full h-full object-cover" />
                      </span>
                      <span v-if="cls.instructor" class="truncate">{{ cls.instructor }}</span>
                    </div>
                  </div>

                  <!-- Right side: Site + Availability -->
                  <div class="flex items-center gap-3 flex-shrink-0">
                    <!-- Site indicator (only when showing all gyms) -->
                    <span
                      v-if="!selectedSite"
                      class="px-2.5 py-1 rounded-lg bg-surface text-xs sm:text-sm font-bold text-on-surface-dim/60 tracking-wide"
                    >
                      {{ getSiteAbbrev(cls.siteId) }}
                    </span>
                    <!-- Availability indicator -->
                    <div class="flex items-center justify-center min-w-[3rem]">
                      <span v-if="cls.spotsLeft === 0" class="px-3 py-1 rounded-full text-xs font-bold bg-amber-100 text-amber-700">Kö</span>
                      <span v-else class="flex items-center gap-1.5 text-green-600 text-sm font-medium">
                        <span class="w-2.5 h-2.5 rounded-full bg-green-500" />
                        <span class="hidden sm:inline">Ledigt</span>
                      </span>
                    </div>
                  </div>
                </div>
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

    <!-- Info Block -->
    <section class="section bg-surface-dim">
      <div class="container max-w-5xl">
        <div class="grid md:grid-cols-2 gap-12 items-center">
          <div>
            <h2 class="font-display font-bold text-4xl md:text-5xl uppercase tracking-tight mb-6">Alltid inkluderat</h2>
            <p class="text-xl md:text-2xl text-on-surface-dim mb-8 leading-relaxed">
              Alla våra gruppträningspass ingår i medlemskapet. Inga dolda avgifter, inga krångliga tillägg.
            </p>
            <ul class="space-y-6">
              <li class="flex items-start gap-4">
                <svg class="w-6 h-6 text-[#D93636] flex-shrink-0 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2.5" d="M5 13l4 4L19 7" /></svg>
                <span class="text-body-lg font-medium">Boka smidigt direkt i appen</span>
              </li>
              <li class="flex items-start gap-4">
                <svg class="w-6 h-6 text-[#D93636] flex-shrink-0 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2.5" d="M5 13l4 4L19 7" /></svg>
                <span class="text-body-lg font-medium">Checka in 10 minuter innan</span>
              </li>
              <li class="flex items-start gap-4">
                <svg class="w-6 h-6 text-[#D93636] flex-shrink-0 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2.5" d="M5 13l4 4L19 7" /></svg>
                <span class="text-body-lg font-medium">Ta med en vän på provträning (kontakta oss först)</span>
              </li>
            </ul>
          </div>
          <div class="bg-white p-10 md:p-14 rounded-[3rem] shadow-xl text-center">
            <h3 class="font-display font-bold text-3xl mb-6 uppercase tracking-tight">Aldrig tränat gruppträning?</h3>
            <p class="text-lg text-on-surface-dim mb-10 leading-relaxed">
              Ingen fara. Våra instruktörer hjälper dig till rätta med inställningar och teknik. Kom 15 minuter innan passet så löser vi det.
            </p>
            <NuxtLink to="/kontakt" class="inline-block px-8 py-3 bg-surface-dim hover:bg-surface-container rounded-full font-bold text-on-surface transition-colors">
              Hör av dig om du undrar något
            </NuxtLink>
          </div>
        </div>
      </div>
    </section>

    <!-- Gym Selector Bottom Sheet -->
    <Teleport to="body">
      <Transition
        enter-active-class="transition duration-300 ease-out"
        enter-from-class="opacity-0"
        enter-to-class="opacity-100"
        leave-active-class="transition duration-200 ease-in"
        leave-from-class="opacity-100"
        leave-to-class="opacity-0"
      >
        <div v-if="showDropdown" class="fixed inset-0 z-[500] bg-black/40 backdrop-blur-sm" @click="showDropdown = false" />
      </Transition>

      <Transition
        enter-active-class="transition duration-400 cubic-bezier(0.32, 0.72, 0, 1)"
        enter-from-class="translate-y-full"
        enter-to-class="translate-y-0"
        leave-active-class="transition duration-250 ease-in"
        leave-from-class="translate-y-0"
        leave-to-class="translate-y-full"
      >
        <div v-if="showDropdown" class="fixed bottom-0 left-0 right-0 z-[501] bg-surface rounded-t-[2.5rem] shadow-2xl">
          <!-- Handle -->
          <div class="pt-4 pb-2 flex justify-center" @click="showDropdown = false">
            <div class="w-12 h-1.5 bg-outline/50 rounded-full" />
          </div>

          <div class="px-6 pb-10 pt-2">
            <!-- Logo that rotates -->
            <div class="flex justify-center mb-6">
              <div class="w-16 h-16 relative">
                <img
                  src="/images/logo.svg"
                  alt="Core Gym"
                  class="w-full h-full transition-transform duration-500"
                  :class="showDropdown ? 'rotate-[360deg]' : ''"
                />
              </div>
            </div>

            <h3 class="font-display font-bold text-2xl text-center uppercase tracking-tight mb-6">Välj gym</h3>

            <!-- Gym options -->
            <div class="space-y-2 max-w-sm mx-auto">
              <button
                class="w-full flex items-center gap-4 px-5 py-4 rounded-2xl text-left text-lg transition-all"
                :class="selectedSite === null ? 'bg-brand text-white font-bold shadow-lg' : 'bg-surface-dim hover:bg-surface-container text-on-surface'"
                @click="selectSite(null)"
              >
                <span class="w-3 h-3 rounded-full border-2" :class="selectedSite === null ? 'bg-white border-white' : 'border-outline'" />
                <span class="flex-1">Alla gym</span>
                <span v-if="selectedSite === null" class="text-sm opacity-80">Visar allt</span>
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

    <!-- Bottom Sheet Details -->
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
          <!-- Handle -->
          <div class="sticky top-0 bg-surface pt-4 pb-2 z-10 flex justify-center" @click="handleCloseSheet">
            <div class="w-12 h-1.5 bg-outline/50 rounded-full" />
          </div>

          <div class="px-5 sm:px-6 pb-10 pt-2 max-w-xl mx-auto">
            <!-- Header -->
            <div class="flex items-start justify-between gap-3 mb-6">
              <div class="flex-1 min-w-0">
                <div class="inline-flex items-center gap-2 px-2.5 py-1 rounded-full bg-surface-dim mb-3">
                  <span class="w-2 h-2 rounded-full" :class="getCategoryColor(selectedClass.name)" />
                  <span class="text-[11px] font-bold uppercase tracking-wider text-on-surface-dim">{{ getClassCategory(selectedClass.name) }}</span>
                </div>
                <h2 class="font-display font-bold text-3xl sm:text-4xl uppercase tracking-tight mb-1.5 text-on-surface">{{ selectedClass.name }}</h2>
                <div class="flex items-center gap-1.5 text-sm text-on-surface-dim font-medium">
                  <svg class="w-4 h-4 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" /><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" /></svg>
                  {{ selectedClass.site }}
                </div>
              </div>
              <button class="p-2 -mr-2 -mt-1 rounded-full hover:bg-surface-dim transition-colors text-on-surface-dim" @click="handleCloseSheet">
                <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>

            <!-- Compact info row -->
            <div class="flex items-center gap-3 mb-6">
              <div class="flex-1 bg-surface-dim px-4 py-3 rounded-xl">
                <span class="text-[11px] font-bold uppercase tracking-wider text-on-surface-dim block mb-0.5">Tid</span>
                <span class="font-display font-bold text-lg">{{ selectedClass.time }} <span class="text-on-surface-dim font-normal">({{ calculateDuration(selectedClass.time, selectedClass.endTime) }})</span></span>
              </div>
              <div class="flex items-center gap-2 px-4 py-3">
                <span v-if="selectedClass.spotsLeft === 0" class="px-3 py-1.5 rounded-full text-xs font-bold bg-amber-500/10 text-amber-600">Kö</span>
                <template v-else>
                  <span class="w-2.5 h-2.5 rounded-full bg-green-500/60" />
                  <span class="text-sm font-medium text-green-600/80">Ledigt</span>
                </template>
              </div>
            </div>

            <!-- Instructor -->
            <div v-if="selectedClass.instructor" class="bg-surface-dim px-4 py-3 rounded-xl flex items-center gap-4 mb-6">
              <div class="w-12 h-12 rounded-full overflow-hidden bg-surface flex-shrink-0">
                <img
                  v-if="selectedClass.instructorImage"
                  :src="selectedClass.instructorImage"
                  :alt="selectedClass.instructor"
                  class="w-full h-full object-cover"
                />
                <div v-else class="w-full h-full flex items-center justify-center bg-brand text-white">
                  <span class="text-lg font-bold">{{ selectedClass.instructor.charAt(0) }}</span>
                </div>
              </div>
              <div>
                <span class="text-[11px] font-bold uppercase tracking-wider text-on-surface-dim block">Instruktör</span>
                <span class="font-display font-bold text-lg">{{ selectedClass.instructor }}</span>
              </div>
            </div>

            <!-- Description -->
            <div v-if="selectedClass.description" class="mb-6">
              <h3 class="text-[11px] font-bold uppercase tracking-wider text-on-surface-dim mb-2">Om passet</h3>
              <p class="text-on-surface leading-relaxed">{{ selectedClass.description }}</p>
            </div>

            <!-- Booking Section -->
            <div v-if="selectedClass.spotsLeft > 0" class="border-t border-outline/50 pt-8">
              <div v-if="formSuccess" class="text-center py-6 bg-green-50 rounded-3xl border border-green-100">
                <div class="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <svg class="w-8 h-8 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7" />
                  </svg>
                </div>
                <h3 class="text-title mb-2 text-green-900">Förfrågan mottagen!</h3>
                <p class="text-body text-green-700">Vi kollar om det finns plats och återkommer till dig via mail eller telefon.</p>
              </div>

              <form v-else @submit.prevent="submitTrialBooking" class="space-y-5">
                <div>
                  <h3 class="font-bold text-lg mb-1">Vill du prova?</h3>
                  <p class="text-sm text-on-surface-dim">Är du medlem? <a href="https://app.coregymclub.se" class="text-brand font-medium hover:underline">Boka i appen</a></p>
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
                  <svg class="w-5 h-5 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
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
              <h3 class="text-title mb-2 text-amber-800">Kö</h3>
              <p class="text-body text-amber-700">Det här passet är fullt just nu.</p>
            </div>
          </div>
        </div>
      </Transition>
    </Teleport>
  </div>
</template>

<style scoped>
.carousel-container {
  --item-size: 140px;
  --item-gap: -35px;
  position: relative;
  margin-left: -1.5rem;
  margin-right: -1.5rem;
  perspective: 800px;
}

@media (min-width: 768px) {
  .carousel-container {
    --item-size: 240px;
    --item-gap: -60px;
    margin-left: -3rem;
    margin-right: -3rem;
    perspective: 1200px;
  }
}

.carousel-track {
  display: flex;
  gap: 0;
  overflow-x: auto;
  scroll-snap-type: x mandatory;
  scrollbar-width: none;
  -ms-overflow-style: none;
  padding: 2rem calc(50% - var(--item-size) / 2);
  scroll-behavior: auto;
  transform-style: preserve-3d;
}

.carousel-track::-webkit-scrollbar {
  display: none;
}

.carousel-item {
  flex-shrink: 0;
  width: var(--item-size);
  height: var(--item-size);
  margin-right: var(--item-gap);
  scroll-snap-align: center;
  border-radius: 1rem;
  overflow: hidden;
  box-shadow: 0 8px 32px -8px rgba(0, 0, 0, 0.6);
  position: relative;
  will-change: transform, opacity;
  transform-style: preserve-3d;
  animation: carousel3d linear;
  animation-timeline: view(inline);
  animation-range: entry 0% exit 100%;
}

.carousel-item:last-child {
  margin-right: 0;
}

@media (min-width: 768px) {
  .carousel-item {
    border-radius: 1.25rem;
  }
}

.carousel-item img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

@keyframes carousel3d {
  0% {
    transform: rotateY(45deg) scale(0.6) translateZ(-100px);
    opacity: 0.3;
    filter: brightness(0.4);
    z-index: 1;
  }
  15% {
    transform: rotateY(30deg) scale(0.7) translateZ(-60px);
    opacity: 0.5;
    filter: brightness(0.5);
    z-index: 2;
  }
  30% {
    transform: rotateY(15deg) scale(0.85) translateZ(-30px);
    opacity: 0.75;
    filter: brightness(0.7);
    z-index: 3;
  }
  50% {
    transform: rotateY(0deg) scale(1) translateZ(0px);
    opacity: 1;
    filter: brightness(1);
    z-index: 5;
  }
  70% {
    transform: rotateY(-15deg) scale(0.85) translateZ(-30px);
    opacity: 0.75;
    filter: brightness(0.7);
    z-index: 3;
  }
  85% {
    transform: rotateY(-30deg) scale(0.7) translateZ(-60px);
    opacity: 0.5;
    filter: brightness(0.5);
    z-index: 2;
  }
  100% {
    transform: rotateY(-45deg) scale(0.6) translateZ(-100px);
    opacity: 0.3;
    filter: brightness(0.4);
    z-index: 1;
  }
}

@supports not (animation-timeline: view()) {
  .carousel-item {
    animation: none;
    transition: transform 0.3s ease, opacity 0.3s ease;
  }
}
</style>