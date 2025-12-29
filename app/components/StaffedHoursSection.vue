<script setup lang="ts">
interface Props {
  siteId: number
  title?: string
}

const props = withDefaults(defineProps<Props>(), {
  title: 'Bemannade tider'
})

const { weekData, fetchWeek, getStaffingStatus } = useStaffing()
const { fetchToday } = useStaffing()

const loading = ref(true)

const weeklySchedule = computed(() => {
  if (!weekData.value) return []

  return weekData.value.days.map(day => {
    const club = day.clubs[String(props.siteId)]
    return {
      date: day.date,
      dayName: day.dayName,
      dayId: day.dayId,
      closed: club?.closed ?? true,
      staffed: club?.staffed ?? false,
      displayText: club?.displayText || '',
      isHoliday: day.isHoliday || false,
      holidayName: day.holidayName || null,
      isOverride: club?.isOverride || false
    }
  })
})

const hasAnyStaffedHours = computed(() => {
  return weeklySchedule.value.some(day => day.staffed)
})

const currentStatus = computed(() => {
  return getStaffingStatus(props.siteId)
})

onMounted(async () => {
  loading.value = true
  await Promise.all([fetchToday(), fetchWeek()])
  loading.value = false
})
</script>

<template>
  <section v-if="!loading && hasAnyStaffedHours" class="section bg-on-surface text-white relative overflow-hidden">
    <!-- Subtle gradient overlay -->
    <div class="absolute inset-0 bg-gradient-to-br from-brand/10 to-transparent" />

    <div class="container relative">
      <div class="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center max-w-4xl mx-auto">

        <!-- Left: Info -->
        <div class="text-center lg:text-left">
          <h2 class="text-section text-white mb-4">{{ title }}</h2>
          <p class="text-lead text-white/60 mb-6">
            Personal på plats för frågor, hjälp med utrustning och träningsråd.
          </p>

          <!-- Live status -->
          <div
            v-if="currentStatus.status === 'staffed-now'"
            class="inline-flex items-center gap-3 px-5 py-3 rounded-xl bg-green-500/20 border border-green-500/30"
          >
            <span class="w-2.5 h-2.5 rounded-full bg-green-400 animate-pulse" />
            <span class="text-title text-green-300">{{ currentStatus.text }}</span>
            <span v-if="currentStatus.subtext" class="text-body text-green-300/60">{{ currentStatus.subtext }}</span>
          </div>

          <div
            v-else-if="currentStatus.status === 'staffed-today'"
            class="inline-flex items-center gap-3 px-5 py-3 rounded-xl bg-amber-500/20 border border-amber-500/30"
          >
            <span class="text-title text-amber-300">{{ currentStatus.text }}</span>
            <span v-if="currentStatus.subtext" class="text-body text-amber-300/60">{{ currentStatus.subtext }}</span>
          </div>

          <div
            v-else-if="currentStatus.status === 'next-staffed'"
            class="inline-flex items-center gap-3 px-5 py-3 rounded-xl bg-white/5 border border-white/10"
          >
            <span class="text-title text-white/80">{{ currentStatus.text }}</span>
            <span v-if="currentStatus.subtext" class="text-body text-white/50">{{ currentStatus.subtext }}</span>
          </div>

          <!-- Always open note -->
          <p class="text-body text-white/40 mt-6">
            Gymmet är öppet 04–00 varje dag, även utan personal.
          </p>
        </div>

        <!-- Right: Schedule -->
        <div class="bg-white/5 backdrop-blur-sm rounded-2xl border border-white/10 overflow-hidden">
          <div class="px-6 py-4 border-b border-white/10">
            <span class="text-label text-white/60">Veckans schema</span>
          </div>
          <div class="divide-y divide-white/5">
            <div
              v-for="day in weeklySchedule"
              :key="day.dayId"
              class="flex items-center justify-between px-6 py-4"
              :class="!day.staffed ? 'opacity-40' : ''"
            >
              <div class="flex flex-col min-w-0">
                <div class="flex items-center gap-2">
                  <span class="text-body font-medium text-white">{{ day.dayName }}</span>
                  <span
                    v-if="day.isHoliday"
                    class="px-2 py-0.5 text-xs font-medium rounded-full bg-red-500/20 text-red-300 border border-red-500/30"
                  >
                    {{ day.holidayName }}
                  </span>
                </div>
              </div>
              <span v-if="!day.staffed" class="text-body text-white/40 ml-4">—</span>
              <span v-else class="text-body text-white/80 font-mono ml-4 whitespace-nowrap">{{ day.displayText }}</span>
            </div>
          </div>
        </div>

      </div>
    </div>
  </section>
</template>
