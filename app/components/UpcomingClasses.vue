<script setup lang="ts">
const props = defineProps<{
  siteId: number
  siteName: string
}>()

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
})
</script>

<template>
  <section class="section bg-surface">
    <div class="container">
      <div class="max-w-xl mx-auto">

        <!-- Header -->
        <div class="mb-6">
          <h2 class="text-section">Gruppträning</h2>
        </div>

        <div v-if="loading" class="text-center py-12">
          <div class="w-6 h-6 border-2 border-brand border-t-transparent rounded-full animate-spin mx-auto" />
        </div>

        <div v-else class="space-y-4">

          <!-- LIVE: Class happening now -->
          <div v-if="liveClass" class="card border-2 border-brand bg-surface">
            <div class="flex items-center gap-4">
              <div class="flex-shrink-0">
                <span class="inline-flex items-center gap-2 px-3 py-1.5 bg-brand text-white text-xs font-semibold uppercase rounded-full">
                  <span class="w-2 h-2 bg-white rounded-full animate-pulse" />
                  Pågår nu
                </span>
              </div>
              <div class="flex-1 min-w-0">
                <h3 class="text-title">{{ liveClass.name }}</h3>
                <p class="text-label text-on-surface-dim">{{ liveClass.instructor }}</p>
              </div>
            </div>
          </div>

          <!-- Next 3 classes -->
          <template v-if="nextThreeClasses.length > 0">
            <NuxtLink
              v-for="cls in nextThreeClasses"
              :key="cls.id"
              :to="`/schema?site=${siteId}&pass=${cls.id}`"
              class="card hover:bg-surface-dim transition-colors block"
            >
              <div class="flex items-center gap-4">
                <div class="w-16 text-center flex-shrink-0">
                  <span v-if="!cls.isToday" class="text-xs text-on-surface-dim block">{{ cls.dayName }}</span>
                  <span v-else class="text-xs text-brand font-medium block">Idag</span>
                  <span class="text-title">{{ cls.time }}</span>
                </div>
                <span class="w-2.5 h-2.5 rounded-full flex-shrink-0" :class="getClassColor(cls.name)" />
                <div class="flex-1 min-w-0">
                  <h3 class="text-title truncate">{{ cls.name }}</h3>
                  <p class="text-label text-on-surface-dim truncate">{{ cls.instructor }}</p>
                </div>
                <svg class="w-5 h-5 text-on-surface-dim flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7" />
                </svg>
              </div>
            </NuxtLink>
          </template>

          <!-- No classes -->
          <div v-else class="text-center py-8 text-on-surface-dim">
            <p>Inga schemalagda pass just nu</p>
          </div>

          <!-- Button -->
          <div class="pt-6">
            <NuxtLink
              :to="`/schema?site=${siteId}`"
              class="btn w-full justify-center bg-surface-dim hover:bg-surface-container text-on-surface border border-outline"
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
  </section>
</template>
