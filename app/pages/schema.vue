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

// Trial form
const trialForm = ref({ name: '', email: '', phone: '' })
const formSubmitting = ref(false)
const formSuccess = ref(false)
const formError = ref<string | null>(null)

const filteredSchedule = computed(() => {
  if (!selectedSite.value) return schedule.value
  return schedule.value.map(day => ({
    ...day,
    classes: day.classes.filter(c => c.siteId === selectedSite.value)
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
    other: 'bg-on-surface-dim'
  }
  return colors[category] || colors.other
}

function formatDateShort(dateStr: string): string {
  const [, month, day] = dateStr.split('-').map(Number)
  return `${day}/${month}`
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

    const response = await fetch('https://hooks.zapier.com/hooks/catch/22018aborb/trial-booking/', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        type: 'trial_booking',
        name: trialForm.value.name,
        email: trialForm.value.email,
        phone: trialForm.value.phone,
        class_name: selectedClass.value.name,
        class_time: selectedClass.value.time,
        class_date: dateStr,
        class_site: selectedClass.value.site,
        instructor: selectedClass.value.instructor
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

function handleClickOutside(event: MouseEvent) {
  const target = event.target as HTMLElement
  if (!target.closest('.dropdown-container')) {
    showDropdown.value = false
  }
}

onMounted(() => {
  document.addEventListener('click', handleClickOutside)
})

onUnmounted(() => {
  document.removeEventListener('click', handleClickOutside)
})
</script>

<template>
  <div>
    <!-- Hero -->
    <section class="min-h-[70vh] flex items-center justify-center bg-brand-dark text-white px-6 relative overflow-hidden">
      <!-- Background Image with Red Overlay -->
      <div class="absolute inset-0 z-0">
        <img 
          src="/images/classes/strength.webp" 
          alt="Gruppträning" 
          class="w-full h-full object-cover opacity-30 mix-blend-luminosity"
        />
        <!-- Strong red gradient overlay to match reference -->
        <div class="absolute inset-0 bg-gradient-to-t from-brand-dark/90 via-brand/80 to-brand-dark/80 mix-blend-multiply" />
        <div class="absolute inset-0 bg-gradient-to-b from-black/40 to-transparent" />
      </div>

      <div class="text-center relative z-10 max-w-5xl mx-auto mt-10">
        <span class="inline-block px-6 py-2 rounded-full bg-[#D93636] text-white mb-8 text-sm font-bold tracking-widest uppercase shadow-lg">
          Gruppträning
        </span>
        <h1 class="font-display font-bold text-5xl md:text-7xl lg:text-[7rem] leading-[0.9] text-white mb-8 uppercase tracking-tighter">
          Hitta din grej
        </h1>
        <p class="text-xl md:text-2xl lg:text-3xl text-white/90 mb-12 max-w-2xl mx-auto leading-tight font-medium">
          Från lugn yoga till svettiga HIIT-pass. <br class="hidden md:inline" />
          Välj det som får dig att må bra.
        </p>

        <!-- Site filter -->
        <div class="flex justify-center pb-20">
          <div class="dropdown-container relative z-30">
            <button
              class="flex items-center gap-4 px-8 py-4 bg-white text-on-surface shadow-xl hover:shadow-2xl hover:scale-105 rounded-full text-xl font-bold transition-all border border-white/20"
              @click.stop="showDropdown = !showDropdown"
            >
              <span class="w-3 h-3 rounded-full" :class="selectedSite ? 'bg-brand' : 'bg-surface-dim'" />
              {{ selectedSiteName }}
              <svg class="w-5 h-5 text-on-surface-dim transition-transform duration-300" :class="showDropdown ? 'rotate-180' : ''" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7" />
              </svg>
            </button>

            <Transition
              enter-active-class="transition duration-200 ease-out"
              enter-from-class="opacity-0 scale-95 -translate-y-2"
              enter-to-class="opacity-100 scale-100 translate-y-0"
              leave-active-class="transition duration-150 ease-in"
              leave-from-class="opacity-100 scale-100 translate-y-0"
              leave-to-class="opacity-0 scale-95 -translate-y-2"
            >
              <div v-if="showDropdown" class="absolute top-full left-1/2 -translate-x-1/2 mt-3 w-64 bg-white rounded-2xl shadow-xl border border-outline/50 overflow-hidden">
                <button
                  class="w-full flex items-center gap-4 px-6 py-4 text-left text-lg hover:bg-surface-dim transition-colors text-on-surface"
                  :class="selectedSite === null ? 'font-bold bg-surface-dim/50' : ''"
                  @click="selectSite(null)"
                >
                  <span class="w-2 h-2 rounded-full" :class="selectedSite === null ? 'bg-brand' : 'bg-outline'" />
                  Alla gym
                </button>
                <button
                  v-for="(name, id) in SITE_NAMES"
                  :key="id"
                  class="w-full flex items-center gap-4 px-6 py-4 text-left text-lg hover:bg-surface-dim transition-colors text-on-surface"
                  :class="selectedSite === Number(id) ? 'font-bold bg-surface-dim/50' : ''"
                  @click="selectSite(Number(id))"
                >
                  <span class="w-2 h-2 rounded-full" :class="selectedSite === Number(id) ? 'bg-brand' : 'bg-outline'" />
                  {{ name }}
                </button>
              </div>
            </Transition>
          </div>
        </div>
      </div>
    </section>

    <!-- Schedule -->
    <section class="section bg-surface relative z-10 -mt-16 rounded-t-[3rem] pt-16">
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

        <!-- Schedule Grid -->
        <div v-else-if="filteredSchedule.length > 0" class="space-y-20 max-w-4xl mx-auto">
          <div v-for="day in filteredSchedule" :key="day.date">
            <!-- Day Header -->
            <div class="flex items-baseline gap-4 mb-8 border-b border-outline/30 pb-4">
              <h3 class="font-display font-bold text-3xl sm:text-4xl md:text-5xl capitalize text-on-surface">{{ day.dayName }}</h3>
              <span class="text-2xl md:text-3xl text-on-surface-dim/40 font-medium">{{ formatDateShort(day.date) }}</span>
            </div>

            <!-- Classes -->
            <div class="grid gap-4">
              <button
                v-for="cls in day.classes"
                :key="cls.id"
                class="group relative w-full text-left bg-surface hover:bg-surface-dim rounded-2xl p-4 md:py-6 md:px-6 transition-all duration-200 hover:shadow-sm"
                @click="handleClassClick(cls)"
              >
                <div class="flex items-center gap-6">
                  <!-- Time -->
                  <div class="flex flex-col items-start w-16 flex-shrink-0">
                    <span class="font-display font-bold text-2xl leading-none mb-1 text-on-surface">{{ cls.time }}</span>
                    <span class="text-sm font-medium text-on-surface-dim/60">{{ cls.endTime }}</span>
                  </div>

                  <!-- Vertical Line Indicator -->
                  <div class="w-1.5 h-12 rounded-full flex-shrink-0" :class="getCategoryColor(cls.name)" />

                  <!-- Info -->
                  <div class="flex-1 min-w-0">
                    <h4 class="font-display font-bold text-xl md:text-2xl uppercase tracking-tight mb-1 truncate group-hover:text-brand transition-colors text-on-surface">{{ cls.name }}</h4>
                    <div class="flex flex-wrap items-center gap-x-6 gap-y-1 text-base font-medium text-on-surface-dim">
                      <span v-if="cls.instructor" class="flex items-center gap-2">
                        <svg class="w-5 h-5 opacity-40" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" /></svg>
                        {{ cls.instructor }}
                      </span>
                      <span v-if="!selectedSite" class="flex items-center gap-2">
                        <svg class="w-5 h-5 opacity-40" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" /><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" /></svg>
                        {{ cls.site }}
                      </span>
                    </div>
                  </div>

                  <!-- Spots (Hidden on mobile if needed, or shown) -->
                  <div class="hidden sm:flex flex-col items-end gap-2 flex-shrink-0">
                    <span
                      v-if="cls.spotsLeft === 0"
                      class="px-3 py-1 rounded-full text-xs font-bold tracking-wide uppercase bg-red-100 text-red-700"
                    >
                      Fullt
                    </span>
                    <span v-else-if="cls.spotsLeft < 5" class="text-sm font-bold text-brand">
                      {{ cls.spotsLeft }} platser
                    </span>
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

          <div class="px-6 pb-12 pt-4 max-w-2xl mx-auto">
            <!-- Header -->
            <div class="flex items-start justify-between gap-4 mb-8">
              <div>
                <div class="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-surface-dim mb-4">
                  <span class="w-2 h-2 rounded-full" :class="getCategoryColor(selectedClass.name)" />
                  <span class="text-xs font-bold uppercase tracking-wider text-on-surface-dim">{{ getClassCategory(selectedClass.name) }}</span>
                </div>
                <h2 class="text-display text-3xl mb-2">{{ selectedClass.name }}</h2>
                <div class="flex items-center gap-2 text-on-surface-dim font-medium">
                  <svg class="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" /><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" /></svg>
                  {{ selectedClass.site }}
                </div>
              </div>
              <button class="p-3 -mr-3 rounded-full hover:bg-surface-dim transition-colors text-on-surface-dim" @click="handleCloseSheet">
                <svg class="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>

            <!-- Details Grid -->
            <div class="grid grid-cols-2 gap-4 mb-8">
              <div class="bg-surface-dim p-5 rounded-2xl">
                <span class="text-xs font-bold uppercase tracking-wider text-on-surface-dim block mb-1">Tid</span>
                <span class="text-title text-xl">{{ selectedClass.time }} - {{ selectedClass.endTime }}</span>
              </div>
              <div class="bg-surface-dim p-5 rounded-2xl">
                <span class="text-xs font-bold uppercase tracking-wider text-on-surface-dim block mb-1">Platser</span>
                <span class="text-title text-xl" :class="selectedClass.spotsLeft === 0 ? 'text-red-500' : ''">
                  {{ selectedClass.spotsLeft }} <span class="text-base font-normal text-on-surface-dim">/ {{ selectedClass.spots }}</span>
                </span>
              </div>
            </div>

            <!-- Instructor -->
            <div v-if="selectedClass.instructor" class="bg-surface-dim p-5 rounded-2xl flex items-center gap-5 mb-8">
              <div class="w-14 h-14 rounded-full overflow-hidden bg-surface flex-shrink-0 border-2 border-surface">
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
                <span class="text-xs font-bold uppercase tracking-wider text-on-surface-dim block mb-0.5">Din instruktör</span>
                <span class="text-title text-xl">{{ selectedClass.instructor }}</span>
              </div>
            </div>

            <!-- Booking Section -->
            <div v-if="selectedClass.spotsLeft > 0" class="border-t border-outline/50 pt-8">
              <div v-if="formSuccess" class="text-center py-6 bg-green-50 rounded-3xl border border-green-100">
                <div class="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4 animate-bounce">
                  <svg class="w-8 h-8 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7" />
                  </svg>
                </div>
                <h3 class="text-title mb-2 text-green-900">Bokningsförfrågan skickad!</h3>
                <p class="text-body text-green-700">Vi hör av oss till dig inom kort.</p>
              </div>

              <form v-else @submit.prevent="submitTrialBooking" class="space-y-6">
                <div>
                  <h3 class="text-display text-2xl mb-2">Prova på detta pass</h3>
                  <p class="text-body text-on-surface-dim">Är du medlem? <a href="https://app.coregymclub.se" class="text-brand font-bold hover:underline">Boka i appen istället</a></p>
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

            <div v-else class="text-center py-8 bg-surface-dim rounded-3xl mt-8">
              <span class="block text-2xl mb-2">😔</span>
              <h3 class="text-title mb-2">Fullbokat</h3>
              <p class="text-body text-on-surface-dim">Håll utkik i appen om någon avbokar.</p>
            </div>
          </div>
        </div>
      </Transition>
    </Teleport>
  </div>
</template>