<script setup lang="ts">
const props = defineProps<{
  siteId: number
  siteName: string
}>()

// Carousel images - gruppträning
const carouselImages = [
  { src: '/images/yoga-class-group.webp', alt: 'Yoga' },
  { src: '/images/bodypump.webp', alt: 'Bodypump' },
  { src: '/images/classes/group-wod.webp', alt: 'Gruppträning' },
  { src: '/images/classes/strength.webp', alt: 'Styrka' },
  { src: '/images/classes/cycling.jpg', alt: 'Cykel' },
  { src: '/images/denise-biking.webp', alt: 'Spinning' },
  { src: '/images/yoga-class.webp', alt: 'Yoga' },
]

// Carousel ref and infinite scroll
const carouselRef = ref<HTMLElement | null>(null)
const isScrolling = ref(false)

// Triple the images for infinite scroll illusion
const infiniteImages = computed(() => [...carouselImages, ...carouselImages, ...carouselImages])

// Get item width based on screen size (matches CSS variables)
const getItemWidth = () => {
  if (typeof window === 'undefined') return 118 // SSR fallback
  if (window.innerWidth >= 1024) return 194 // 180 + 14
  if (window.innerWidth >= 768) return 172 // 160 + 12
  return 118 // 110 + 8
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
  <section class="section bg-surface-dim relative overflow-hidden">
    <div class="container relative z-10">
      <!-- Header - centered -->
      <div class="text-center max-w-4xl mx-auto mb-12">
        <span class="inline-block px-4 py-2 rounded-full bg-on-surface/10 text-on-surface mb-6 text-sm font-bold tracking-widest uppercase">
          Gruppträning
        </span>
        <h2 class="font-display font-bold text-4xl md:text-5xl lg:text-6xl uppercase tracking-tight mb-8 text-on-surface">Träna tillsammans</h2>

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

        <p class="text-xl md:text-2xl text-on-surface-dim leading-relaxed font-medium max-w-2xl mx-auto">
          Från lugn yoga till svettiga HIIT-pass — allt ingår i medlemskapet.
        </p>
      </div>

      <!-- Upcoming classes -->
      <div class="max-w-2xl mx-auto">
        <div v-if="loading" class="text-center py-12">
          <div class="w-6 h-6 border-2 border-on-surface border-t-transparent rounded-full animate-spin mx-auto" />
        </div>

        <div v-else class="space-y-2">

          <!-- LIVE: Class happening now -->
          <div v-if="liveClass" class="p-4 rounded-2xl bg-green-500/10 border border-green-500/20">
            <div class="flex items-center gap-4">
              <div class="flex-shrink-0">
                <span class="inline-flex items-center gap-2 px-3 py-1.5 bg-green-500 text-white text-xs font-semibold uppercase rounded-full">
                  <span class="w-2 h-2 bg-white rounded-full animate-pulse" />
                  Pågår nu
                </span>
              </div>
              <div class="flex-1 min-w-0">
                <h3 class="font-display font-bold text-lg text-on-surface uppercase tracking-tight">{{ liveClass.name }}</h3>
                <p class="text-sm text-on-surface-dim">{{ liveClass.instructor }}</p>
              </div>
            </div>
          </div>

          <!-- Next 3 classes -->
          <template v-if="nextThreeClasses.length > 0">
            <div
              v-for="cls in nextThreeClasses"
              :key="cls.id"
              class="p-4 bg-surface rounded-2xl"
            >
              <div class="flex items-center gap-4">
                <!-- Time -->
                <div class="flex-shrink-0 w-16">
                  <span class="font-display text-2xl font-black tracking-tight text-on-surface">{{ cls.time }}</span>
                </div>

                <!-- Class info -->
                <div class="flex-1 min-w-0">
                  <div class="flex items-center gap-2 mb-0.5">
                    <span
                      v-if="cls.isToday"
                      class="inline-flex px-2 py-0.5 bg-on-surface text-white text-[10px] font-bold uppercase tracking-wider rounded-full"
                    >Idag</span>
                    <span
                      v-else
                      class="text-xs font-bold text-on-surface-dim uppercase tracking-wide"
                    >{{ cls.dayName }}</span>
                  </div>
                  <h3 class="font-display font-bold text-lg uppercase tracking-tight truncate text-on-surface">{{ cls.name }}</h3>
                  <p class="text-sm text-on-surface-dim truncate">{{ cls.instructor }}</p>
                </div>
              </div>
            </div>
          </template>

          <!-- No classes -->
          <div v-else class="text-center py-8 text-on-surface-dim">
            <p>Inga schemalagda pass just nu</p>
          </div>

          <!-- Button -->
          <div class="pt-6">
            <NuxtLink
              :to="`/schema?site=${siteId}`"
              class="flex items-center justify-center w-full px-8 py-5 bg-on-surface text-white text-lg font-display font-bold uppercase tracking-wide rounded-full shadow-md hover:bg-black hover:shadow-lg hover:-translate-y-0.5 transition-all duration-300"
            >
              Se schema
            </NuxtLink>
          </div>

        </div>
      </div>
    </div>
  </section>
</template>

<style scoped>
.carousel-container {
  --item-size: 110px;
  --item-gap: 8px;
  position: relative;
  margin-left: -1.5rem;
  margin-right: -1.5rem;
  perspective: 600px;
}

@media (min-width: 768px) {
  .carousel-container {
    --item-size: 160px;
    --item-gap: 12px;
    margin-left: -3rem;
    margin-right: -3rem;
    perspective: 900px;
  }
}

@media (min-width: 1024px) {
  .carousel-container {
    --item-size: 180px;
    --item-gap: 14px;
    perspective: 1000px;
  }
}

.carousel-track {
  display: flex;
  gap: var(--item-gap);
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
  scroll-snap-align: center;
  border-radius: 1rem;
  overflow: hidden;
  box-shadow: 0 8px 32px -8px rgba(0, 0, 0, 0.5);
  position: relative;
  will-change: transform, opacity;
  transform-style: preserve-3d;

  /* CSS scroll-driven animation for 3D carousel */
  animation: carousel3d linear;
  animation-timeline: view(inline);
  animation-range: entry 0% exit 100%;
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

/* 3D Carousel effect - arc/curve with more visible items */
@keyframes carousel3d {
  0% {
    transform: rotateY(35deg) scale(0.7) translateZ(-60px);
    opacity: 0.5;
    filter: brightness(0.6);
    z-index: 1;
  }
  15% {
    transform: rotateY(25deg) scale(0.78) translateZ(-45px);
    opacity: 0.65;
    filter: brightness(0.7);
    z-index: 2;
  }
  30% {
    transform: rotateY(12deg) scale(0.88) translateZ(-25px);
    opacity: 0.85;
    filter: brightness(0.85);
    z-index: 3;
  }
  50% {
    transform: rotateY(0deg) scale(1) translateZ(0px);
    opacity: 1;
    filter: brightness(1);
    z-index: 5;
  }
  70% {
    transform: rotateY(-12deg) scale(0.88) translateZ(-25px);
    opacity: 0.85;
    filter: brightness(0.85);
    z-index: 3;
  }
  85% {
    transform: rotateY(-25deg) scale(0.78) translateZ(-45px);
    opacity: 0.65;
    filter: brightness(0.7);
    z-index: 2;
  }
  100% {
    transform: rotateY(-35deg) scale(0.7) translateZ(-60px);
    opacity: 0.5;
    filter: brightness(0.6);
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
