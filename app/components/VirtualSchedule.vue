<script setup lang="ts">
interface Video {
  id: string
  name: string
  brand?: string | null
  category?: string | null
  duration?: string | null
}

interface ScheduleClass {
  time: string
  duration: number
  video: Video
}

interface Day {
  key: string
  name: string
  date: string
  classes: ScheduleClass[]
}

interface Week {
  weekNumber: number
  year: number
  days: Day[]
}

interface ScheduleData {
  generatedAt: string
  currentWeek: number
  currentYear: number
  weeks: Week[]
}

const props = defineProps<{
  compact?: boolean
}>()

// Import the schedule data directly from public folder
const schedule = ref<ScheduleData | null>(null)

onMounted(async () => {
  try {
    const response = await fetch('/data/virtual-schedule.json')
    if (response.ok) {
      schedule.value = await response.json()
    }
  } catch (e) {
    console.error('Failed to load virtual schedule:', e)
  }
})

const selectedWeekIndex = ref(0)

const today = computed(() => new Date().toISOString().split('T')[0])

// Flatten all days from all weeks and filter to show only today and future (max 7 days)
const upcomingDays = computed(() => {
  if (!schedule.value) return []

  const allDays = schedule.value.weeks.flatMap(week => week.days)
  const todayStr = today.value

  return allDays
    .filter(day => day.date >= todayStr)
    .slice(0, 7) // Show max 7 days ahead
})

const selectedWeek = computed(() => schedule.value?.weeks[selectedWeekIndex.value])

function formatDate(dateStr: string) {
  const date = new Date(dateStr)
  return date.toLocaleDateString('sv-SE', { day: 'numeric', month: 'short' })
}

function formatClassName(name: string) {
  // Remove numbers and clean up the name
  return name.replace(/\s*\d+\s*$/, '').replace(/\s+\d+$/, '')
}

function isToday(dateStr: string) {
  return dateStr === today.value
}

// Simple dot color per class type
function getDotColor(name: string): string {
  const lower = name.toLowerCase()
  if (lower.includes('pump')) return 'bg-red-500'
  if (lower.includes('combat')) return 'bg-amber-500'
  if (lower.includes('balance') || lower.includes('yoga')) return 'bg-teal-500'
  if (lower.includes('attack')) return 'bg-green-500'
  if (lower.includes('rpm') || lower.includes('sprint')) return 'bg-blue-500'
  if (lower.includes('core')) return 'bg-orange-500'
  if (lower.includes('tone')) return 'bg-pink-500'
  if (lower.includes('grit')) return 'bg-purple-500'
  if (lower.includes('trip')) return 'bg-indigo-500'
  return 'bg-brand'
}
</script>

<template>
  <div v-if="schedule && upcomingDays.length > 0" class="virtual-schedule">
    <!-- Schedule Grid - Shows today + next days -->
    <div
      class="grid gap-3 md:gap-2"
      :class="[
        upcomingDays.length <= 3 ? 'grid-cols-1 md:grid-cols-3' :
        upcomingDays.length <= 5 ? 'grid-cols-1 md:grid-cols-5' :
        'grid-cols-1 md:grid-cols-7'
      ]"
    >
      <div
        v-for="day in upcomingDays"
        :key="day.date"
        class="rounded-3xl p-5 md:p-4 transition-all"
        :class="[
          isToday(day.date) ? 'bg-brand/5 ring-1 ring-brand/20' : 'bg-surface-dim',
          day.classes.length === 0 ? 'opacity-40' : ''
        ]"
      >
        <!-- Day Header -->
        <div class="flex items-baseline justify-between mb-4">
          <div class="flex items-baseline gap-2">
            <h3 class="font-display font-bold text-xl uppercase tracking-tight text-on-surface">
              {{ day.name }}
            </h3>
            <span class="text-sm text-on-surface-dim">{{ formatDate(day.date) }}</span>
          </div>
          <span v-if="isToday(day.date)" class="text-xs font-bold text-brand uppercase tracking-widest">
            Idag
          </span>
        </div>

        <!-- Classes List -->
        <div v-if="day.classes.length > 0" class="bg-white rounded-2xl shadow-sm overflow-hidden">
          <div
            v-for="(cls, idx) in day.classes"
            :key="idx"
            class="flex items-center gap-3 px-4 py-3 border-b border-surface-dim last:border-0"
          >
            <span class="w-2 h-2 rounded-full flex-shrink-0" :class="getDotColor(cls.video.name)" />
            <div class="flex-1 min-w-0">
              <p class="font-medium text-on-surface truncate">
                {{ formatClassName(cls.video.name) }}
              </p>
            </div>
            <span class="text-sm text-on-surface-dim tabular-nums">
              {{ cls.time }}
            </span>
          </div>
        </div>

        <!-- Empty State -->
        <div v-else class="text-center py-4">
          <p class="text-sm text-on-surface-dim">Inga pass</p>
        </div>
      </div>
    </div>

    <!-- Footer -->
    <p v-if="!compact" class="text-center text-sm text-on-surface-dim mt-8">
      Visar kommande {{ upcomingDays.length }} dagar
    </p>
  </div>

  <!-- Loading State -->
  <div v-else class="text-center py-16">
    <div class="w-12 h-12 border-4 border-brand border-t-transparent rounded-full animate-spin mx-auto mb-4" />
    <p class="text-on-surface-dim">Laddar schema...</p>
  </div>
</template>
