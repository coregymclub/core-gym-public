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

  const today = new Date().toISOString().split('T')[0]

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
      isOverride: club?.isOverride || false,
      isToday: day.date === today
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
  <section v-if="!loading && hasAnyStaffedHours" class="section bg-surface-dim">
    <div class="container">
      <div class="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-20 items-start">

        <!-- Left: Info & Status -->
        <div class="order-2 lg:order-1">
          <div class="sticky top-32">
            <span class="inline-block px-4 py-2 rounded-full bg-brand/10 text-brand text-sm font-bold tracking-widest uppercase mb-6">
              Personlig service
            </span>
            <h2 class="text-section text-on-surface text-left mb-6">{{ title }}</h2>
            <p class="text-lead text-on-surface-dim text-left mb-10">
              Vi finns här för att hjälpa dig med allt från träningsråd till medlemsfrågor.
            </p>

            <!-- Status Card -->
            <div class="card card-elevated p-8 mb-8 border-l-4" 
                 :class="[
                   currentStatus.status === 'staffed-now' ? 'border-l-success' : 
                   currentStatus.status === 'staffed-today' ? 'border-l-warning' : 'border-l-on-surface-dim'
                 ]">
              <div class="flex items-start gap-4">
                <!-- Icon based on status -->
                <div class="w-12 h-12 rounded-full flex items-center justify-center flex-shrink-0"
                     :class="[
                       currentStatus.status === 'staffed-now' ? 'bg-success/10 text-success' : 
                       currentStatus.status === 'staffed-today' ? 'bg-warning/10 text-warning' : 'bg-surface-container text-on-surface-dim'
                     ]">
                  <svg v-if="currentStatus.status === 'staffed-now'" class="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7" />
                  </svg>
                  <svg v-else-if="currentStatus.status === 'staffed-today'" class="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  <svg v-else class="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z" />
                  </svg>
                </div>
                
                <div>
                  <h3 class="text-xl font-bold text-on-surface mb-1">
                    {{ currentStatus.text }}
                  </h3>
                  <p v-if="currentStatus.subtext" class="text-on-surface-dim">
                    {{ currentStatus.subtext }}
                  </p>
                </div>
              </div>
            </div>

            <!-- Always open note -->
            <div class="flex items-center gap-4 text-on-surface-dim bg-white p-4 rounded-2xl border border-outline/50">
              <div class="w-10 h-10 rounded-full bg-surface-container flex items-center justify-center flex-shrink-0">
                <svg class="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 7a2 2 0 012 2m4 0a6 6 0 01-7.743 5.743L11 17H9v2H7v2H4a1 1 0 01-1-1v-2.586a1 1 0 01.293-.707l5.964-5.964A6 6 0 1121 9z" />
                </svg>
              </div>
              <p class="text-sm font-medium">
                Gymmet är öppet <span class="text-on-surface font-bold">03:55–00:05</span> varje dag för medlemmar.
              </p>
            </div>
          </div>
        </div>

        <!-- Right: Schedule List -->
        <div class="order-1 lg:order-2">
          <div class="bg-surface rounded-[2rem] shadow-elevated overflow-hidden border border-outline/20">
            <!-- Header -->
            <div class="bg-surface-container/50 px-8 py-6 border-b border-outline/20 flex justify-between items-center">
              <span class="font-display font-bold text-lg uppercase tracking-wide text-on-surface">Veckans schema</span>
              <span class="text-sm font-medium text-on-surface-dim bg-white px-3 py-1 rounded-full border border-outline/50">
                v. {{ weekData?.weekNumber }}
              </span>
            </div>

            <div class="divide-y divide-outline/20">
              <div
                v-for="day in weeklySchedule"
                :key="day.dayId"
                class="group flex items-center justify-between px-6 md:px-8 py-5 transition-colors hover:bg-surface-container/30"
                :class="[
                  day.isToday ? 'bg-brand/5' : '',
                  !day.staffed ? 'opacity-60' : ''
                ]"
              >
                <div class="flex items-center gap-4">
                  <!-- Day Circle -->
                  <div class="w-12 h-12 rounded-full flex flex-col items-center justify-center border"
                       :class="[
                         day.isToday 
                           ? 'bg-brand text-white border-brand shadow-lg shadow-brand/20 scale-110' 
                           : 'bg-surface border-outline text-on-surface-dim'
                       ]">
                    <span class="text-[10px] uppercase font-bold tracking-wider leading-none mb-0.5">
                      {{ day.dayName.substring(0, 3) }}
                    </span>
                    <span class="text-lg font-bold leading-none">
                      {{ new Date(day.date).getDate() }}
                    </span>
                  </div>
                  
                  <div class="flex flex-col">
                    <div class="flex items-center gap-2">
                      <span class="font-bold text-on-surface text-lg capitalize">
                        {{ day.dayName }}
                      </span>
                      <span
                        v-if="day.isToday"
                        class="px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider rounded-full bg-brand text-white"
                      >
                        Idag
                      </span>
                      <span
                        v-if="day.isHoliday"
                        class="px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider rounded-full bg-red-100 text-red-700"
                      >
                        {{ day.holidayName }}
                      </span>
                    </div>
                    <span v-if="!day.staffed" class="text-sm text-on-surface-dim">Obemannat</span>
                  </div>
                </div>

                <div class="text-right">
                  <span v-if="day.staffed" class="font-display font-bold text-xl text-on-surface">
                    {{ day.displayText }}
                  </span>
                  <span v-else class="text-on-surface-dim/50 font-medium">
                    —
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>

      </div>
    </div>
  </section>
</template>