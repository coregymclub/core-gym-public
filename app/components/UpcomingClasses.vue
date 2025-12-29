<script setup lang="ts">
const props = defineProps<{
  siteId: number
  siteName: string
}>()

// Carousel images
const carouselImages = [
  { src: '/images/classes/strength.webp', alt: 'Styrka' },
  { src: '/images/classes/cycling.jpg', alt: 'Cykel' },
  { src: '/images/lifting-eleiko-nike-dark.webp', alt: 'Träning' },
  { src: '/images/gyms/vegastaden.webp', alt: 'Vegastaden' },
  { src: '/images/hero-red.webp', alt: 'Gemenskap' },
  { src: '/images/denise-hero.webp', alt: 'Träning' },
]

// Carousel ref and infinite scroll
const carouselRef = ref<HTMLElement | null>(null)
const isScrolling = ref(false)

// Triple the images for infinite scroll illusion
const infiniteImages = computed(() => [...carouselImages, ...carouselImages, ...carouselImages])

// Get item width based on screen size (matches CSS variables)
const getItemWidth = () => {
  if (typeof window === 'undefined') return 105 // SSR fallback
  return window.innerWidth >= 768 ? 180 : 105 // item-size + item-gap
}

// Handle infinite scroll - loop seamlessly
const onCarouselScroll = () => {
  if (!carouselRef.value || isScrolling.value) return

  const container = carouselRef.value
  const itemWidth = getItemWidth()
  const singleSetWidth = carouselImages.length * itemWidth
  const scrollLeft = container.scrollLeft

  // If scrolled past the second set, jump back to first set
  if (scrollLeft >= singleSetWidth * 2 - container.clientWidth / 2) {
    isScrolling.value = true
    container.scrollLeft = scrollLeft - singleSetWidth
    requestAnimationFrame(() => { isScrolling.value = false })
  }
  // If scrolled before the first set, jump to second set
  else if (scrollLeft <= singleSetWidth / 2) {
    isScrolling.value = true
    container.scrollLeft = scrollLeft + singleSetWidth
    requestAnimationFrame(() => { isScrolling.value = false })
  }
}

// Start in the middle set
const scrollToCenter = () => {
  if (!carouselRef.value) return
  const container = carouselRef.value
  const itemWidth = getItemWidth()
  // Start at the middle of the second (center) set
  const centerPosition = carouselImages.length * itemWidth + (carouselImages.length / 2) * itemWidth
  container.scrollTo({ left: centerPosition, behavior: 'instant' })
}

const { schedule, loading, fetchSchedule, getClassCategory } = useGroupTraining()

// Category colors
const categoryColors: Record<string, string> = {
  strength: 'bg-brand',
  cardio: 'bg-rose-500',
  mindbody: 'bg-teal-500',
  cycle: 'bg-blue-500',
  hiit: 'bg-purple-500',
  core: 'bg-amber-500',
  toning: 'bg-pink-500',
  other: 'bg-on-surface-dim'
}

const getClassColor = (name: string) => {
  const category = getClassCategory(name)
  return categoryColors[category] || categoryColors.other
}

// Site names for display
const siteNames: Record<number, string> = {
  1: 'Vegastaden',
  2: 'Tungelsta',
  3: 'Västerhaninge'
}

const now = computed(() => new Date())

const currentHour = computed(() => now.value.getHours())
const currentMinutes = computed(() => now.value.getMinutes())

// Parse time string "17:30" to minutes since midnight
const parseTime = (timeStr: string) => {
  const [h, m] = timeStr.split(':').map(Number)
  return h * 60 + m
}

const nowMinutes = computed(() => currentHour.value * 60 + currentMinutes.value)

// Get all classes for this site
const siteClasses = computed(() => {
  return schedule.value.map(day => ({
    ...day,
    classes: day.classes.filter(c => c.siteId === props.siteId)
  })).filter(day => day.classes.length > 0)
})

// Today's classes
const todayClasses = computed(() => {
  const today = siteClasses.value[0]
  if (!today) return []

  const todayDate = new Date().toISOString().split('T')[0]
  if (today.date !== todayDate) return []

  return today.classes
})

// Class happening right now (started within last 60 min)
const liveClass = computed(() => {
  return todayClasses.value.find(cls => {
    const startMinutes = parseTime(cls.time)
    const diff = nowMinutes.value - startMinutes
    return diff >= 0 && diff < 60 // Started within last hour
  })
})

// Upcoming classes today (haven't started yet) - show 3
const upcomingToday = computed(() => {
  return todayClasses.value.filter(cls => {
    const startMinutes = parseTime(cls.time)
    return startMinutes > nowMinutes.value
  }).slice(0, 3)
})

// Get 3 upcoming classes across all days
const nextThreeClasses = computed(() => {
  const classes: any[] = []
  const todayDate = new Date().toISOString().split('T')[0]

  for (const day of siteClasses.value) {
    for (const cls of day.classes) {
      // Skip past classes today
      if (day.date === todayDate) {
        const startMinutes = parseTime(cls.time)
        if (startMinutes <= nowMinutes.value) continue
      }

      classes.push({
        ...cls,
        dayName: day.dayName,
        date: day.date,
        isToday: day.date === todayDate
      })

      if (classes.length >= 3) break
    }
    if (classes.length >= 3) break
  }

  return classes
})

// Next class (tomorrow or later)
const nextClass = computed(() => {
  if (upcomingToday.value.length > 0) return null

  // Find first class from tomorrow onwards
  for (const day of siteClasses.value) {
    const todayDate = new Date().toISOString().split('T')[0]
    if (day.date <= todayDate) continue
    if (day.classes.length > 0) {
      return {
        ...day.classes[0],
        dayName: day.dayName,
        date: day.date
      }
    }
  }
  return null
})

onMounted(() => {
  if (schedule.value.length === 0) {
    fetchSchedule(7)
  }

  // Scroll carousel to center
  nextTick(() => {
    scrollToCenter()
  })
})
</script>

<template>
  <section class="section bg-[#0c0c0c] text-white relative overflow-hidden">
    <!-- Subtle pattern background -->
    <div class="absolute inset-0 z-0">
      <div class="absolute inset-0 opacity-[0.05]"
           style="background-image: radial-gradient(#fff 1px, transparent 1px); background-size: 32px 32px;">
      </div>
    </div>

    <div class="container relative z-10">
      <!-- Header - centered -->
      <div class="text-center max-w-4xl mx-auto mb-12">
        <h2 class="font-display font-bold text-5xl md:text-6xl uppercase tracking-tight mb-8 text-white">Gruppträning</h2>

        <!-- M3 Hero Carousel with infinite scroll -->
        <div class="carousel-container mb-8">
          <div ref="carouselRef" class="carousel-track" @scroll="onCarouselScroll">
            <div
              v-for="(image, index) in infiniteImages"
              :key="index"
              class="carousel-item"
            >
              <img :src="image.src" :alt="image.alt" />
            </div>
          </div>
        </div>

        <p class="text-2xl md:text-3xl text-white/70 leading-relaxed tracking-tight font-medium">
          Från lugn yoga till svettiga HIIT-pass — allt ingår i medlemskapet. Bara att boka och dyka upp.
        </p>
      </div>

      <!-- Upcoming classes in card -->
      <div class="-mx-3 sm:mx-0 sm:max-w-2xl sm:mx-auto">
        <div class="bg-white/5 backdrop-blur-sm border border-white/10 rounded-2xl md:rounded-3xl p-4 sm:p-6 md:p-8">

          <div v-if="loading" class="text-center py-12">
            <div class="w-6 h-6 border-2 border-brand border-t-transparent rounded-full animate-spin mx-auto" />
          </div>

          <div v-else class="space-y-3">

            <!-- LIVE: Class happening now -->
            <div v-if="liveClass" class="p-4 rounded-2xl border-2 border-brand bg-brand/10">
              <div class="flex items-center gap-4">
                <div class="flex-shrink-0">
                  <span class="inline-flex items-center gap-2 px-3 py-1.5 bg-brand text-white text-xs font-semibold uppercase rounded-full">
                    <span class="w-2 h-2 bg-white rounded-full animate-pulse" />
                    Pågår nu
                  </span>
                </div>
                <div class="flex-1 min-w-0">
                  <h3 class="font-display font-bold text-lg text-white uppercase tracking-tight">{{ liveClass.name }}</h3>
                  <p class="text-sm text-white/60">{{ liveClass.instructor }}</p>
                </div>
              </div>
            </div>

            <!-- Next 3 classes -->
            <template v-if="nextThreeClasses.length > 0">
              <NuxtLink
                v-for="cls in nextThreeClasses"
                :key="cls.id"
                :to="`/schema?site=${siteId}&pass=${cls.id}`"
                class="block p-4 bg-white/5 hover:bg-white/10 rounded-2xl transition-colors group"
              >
                <div class="flex items-center gap-4">
                  <!-- Time -->
                  <div class="flex-shrink-0">
                    <span class="font-display text-xl md:text-2xl font-black tracking-tight text-white">{{ cls.time }}</span>
                  </div>

                  <!-- Color dot -->
                  <span class="w-3 h-3 rounded-full flex-shrink-0" :class="getClassColor(cls.name)" />

                  <!-- Class info -->
                  <div class="flex-1 min-w-0">
                    <div class="flex items-center gap-2 mb-1">
                      <span
                        v-if="cls.isToday"
                        class="inline-flex px-2.5 py-0.5 bg-white/10 border border-white/20 text-white text-[10px] font-bold uppercase tracking-wider rounded-full"
                      >Idag</span>
                      <span
                        v-else
                        class="text-xs font-bold text-white/50 uppercase tracking-wide"
                      >{{ cls.dayName }}</span>
                    </div>
                    <h3 class="font-display font-bold text-xl md:text-2xl uppercase tracking-tight truncate text-white group-hover:text-brand transition-colors">{{ cls.name }}</h3>
                    <p class="text-sm text-white/50 truncate mt-0.5">{{ cls.instructor }}</p>
                  </div>

                  <!-- Arrow -->
                  <svg class="w-5 h-5 text-white/30 flex-shrink-0 hidden sm:block group-hover:text-brand group-hover:translate-x-1 transition-all" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7" />
                  </svg>
                </div>
              </NuxtLink>
            </template>

            <!-- No classes -->
            <div v-else class="text-center py-8 text-white/50">
              <p>Inga schemalagda pass just nu</p>
            </div>

            <!-- Button -->
            <div class="pt-4">
              <NuxtLink
                :to="`/schema?site=${siteId}`"
                class="btn w-full justify-center bg-white text-on-surface hover:bg-white/90"
              >
                Se hela schemat
                <svg class="w-4 h-4 ml-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 8l4 4m0 0l-4 4m4-4H3" />
                </svg>
              </NuxtLink>
            </div>

          </div>
        </div>
      </div>
    </div>
  </section>
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

  /* CSS scroll-driven animation for 3D carousel */
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

/* 3D Carousel effect - like rotating on a cylinder */
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

/* Fallback for browsers without scroll-driven animations */
@supports not (animation-timeline: view()) {
  .carousel-item {
    animation: none;
    transition: transform 0.3s ease, opacity 0.3s ease;
  }
}
</style>
