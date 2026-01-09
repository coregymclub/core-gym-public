<script setup lang="ts">
const hours = [
  { hour: 5, value: 10 },
  { hour: 6, value: 15 },
  { hour: 7, value: 25 },
  { hour: 8, label: '08', value: 35 },
  { hour: 9, value: 30 },
  { hour: 10, value: 35 },
  { hour: 11, value: 40 },
  { hour: 12, label: '12', value: 45 },
  { hour: 13, value: 40 },
  { hour: 14, value: 35 },
  { hour: 15, value: 45 },
  { hour: 16, label: '16', value: 65 },
  { hour: 17, value: 95 },
  { hour: 18, value: 85 },
  { hour: 19, value: 75 },
  { hour: 20, label: '20', value: 60 },
  { hour: 21, value: 45 },
  { hour: 22, value: 30 },
  { hour: 23, value: 20 },
]

const currentHour = new Date().getHours()

function getBarColor(hour: number) {
  if (hour === currentHour) return 'bg-on-surface'
  return 'bg-on-surface/20'
}

function getBarHeight(value: number) {
  return `${Math.max(value, 8)}%`
}

function isCurrentHour(hour: number) {
  return hour === currentHour
}
</script>

<template>
  <section class="pb-12 md:pb-16 bg-surface-dim">
    <div class="container max-w-2xl">
      <!-- iOS Widget Style Card - connected to info sheet above -->
      <div class="rounded-b-[2rem] md:rounded-b-[2.5rem] p-5 md:p-6 pt-0 shadow-sm border border-outline/10 border-t-0 relative overflow-hidden bg-gradient-to-b from-surface via-surface to-surface-dim/30">

        <!-- Dashed connector to info sheet above -->
        <div class="border-t border-dashed border-outline/30 -mx-5 md:-mx-6 mb-5" />

        <!-- Grid background pattern -->
        <div class="absolute inset-0 opacity-[0.05] pointer-events-none"
             style="background-image: linear-gradient(to right, currentColor 1px, transparent 1px), linear-gradient(to bottom, currentColor 1px, transparent 1px); background-size: 24px 24px;" />

        <div class="relative z-10">
          <!-- Header -->
          <div class="flex items-center justify-between mb-5">
            <div class="flex items-center gap-3">
              <img src="/images/icons/pulsen.png" alt="" class="w-5 h-5" />
              <h3 class="font-display font-bold text-on-surface text-base uppercase tracking-tight">Pulsen</h3>
            </div>

          </div>

          <!-- Chart -->
          <div class="relative h-28 md:h-32 flex items-end gap-[3px] md:gap-1">
            <div
              v-for="h in hours"
              :key="h.hour"
              class="relative flex flex-col items-center justify-end h-full flex-1"
            >
              <!-- Bar -->
              <div
                class="w-full rounded-full transition-all duration-300"
                :class="getBarColor(h.hour)"
                :style="{ height: getBarHeight(h.value) }"
              />

              <!-- Hour label -->
              <span
                v-if="h.label"
                class="absolute -bottom-5 text-[10px] font-bold tabular-nums"
                :class="isCurrentHour(h.hour) ? 'text-on-surface' : 'text-on-surface-dim/50'"
              >
                {{ h.label }}
              </span>
            </div>
          </div>

          <!-- Footer hint -->
          <div class="mt-8 flex items-center justify-center gap-4 text-xs text-on-surface-dim">
            <span class="flex items-center gap-1.5">
              <span class="w-2 h-2 rounded-full bg-on-surface/20" />
              Vanligt
            </span>
            <span class="flex items-center gap-1.5">
              <span class="w-2 h-2 rounded-full bg-on-surface" />
              Nu
            </span>
          </div>
        </div>
      </div>
    </div>
  </section>
</template>
