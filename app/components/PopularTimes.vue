<script setup lang="ts">
const hours = [
  { hour: 4, label: '', value: 5 },
  { hour: 5, label: '05', value: 10 },
  { hour: 6, label: '', value: 15 },
  { hour: 7, label: '', value: 25 },
  { hour: 8, label: '08', value: 35 },
  { hour: 9, label: '', value: 30 },
  { hour: 10, label: '', value: 35 },
  { hour: 11, label: '11', value: 40 },
  { hour: 12, label: '', value: 45 },
  { hour: 13, label: '', value: 40 },
  { hour: 14, label: '14', value: 35 },
  { hour: 15, label: '', value: 45 },
  { hour: 16, label: '', value: 65 },
  { hour: 17, label: '17', value: 95 }, // Peak
  { hour: 18, label: '', value: 85 },
  { hour: 19, label: '', value: 75 },
  { hour: 20, label: '20', value: 60 },
  { hour: 21, label: '', value: 45 },
  { hour: 22, label: '', value: 30 },
  { hour: 23, label: '23', value: 20 },
  { hour: 0, label: '', value: 10 },
]

const currentHour = new Date().getHours()

// Helper to determine bar color based on status
function getBarColor(hour: number) {
  // If it's the current hour, highlight it
  if (hour === currentHour) return 'bg-brand'
  return 'bg-surface-dim'
}
</script>

<template>
  <section class="py-12 bg-surface-dim">
    <div class="container max-w-4xl">
      <div class="card bg-surface p-8 md:p-12">
        <div class="text-center mb-10">
          <h2 class="text-title mb-2">Populära tider</h2>
          <div class="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-green-100 text-green-700 text-sm font-medium">
            <span class="relative flex h-2 w-2">
              <span class="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75"></span>
              <span class="relative inline-flex rounded-full h-2 w-2 bg-green-500"></span>
            </span>
            Lugnt just nu
          </div>
        </div>

        <!-- Chart container -->
        <div class="relative h-48 flex items-end justify-between gap-1 mb-8 px-2 md:px-8">
          <!-- Bars -->
          <div 
            v-for="h in hours" 
            :key="h.hour" 
            class="flex flex-col items-center justify-end h-full flex-1 group"
          >
            <!-- Bar -->
            <div 
              class="w-full rounded-t-sm transition-all duration-500 hover:bg-brand/60 relative min-h-[4px]"
              :class="getBarColor(h.hour)"
              :style="{ height: `${Math.max(h.value, 5)}%` }"
            >
               <!-- Tooltip (simple) -->
               <div class="absolute bottom-full mb-2 left-1/2 -translate-x-1/2 bg-on-surface text-surface text-xs py-1 px-2 rounded opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap pointer-events-none shadow-sm z-10 font-medium">
                 kl {{ h.hour.toString().padStart(2, '0') }}:00
               </div>
            </div>
            
            <!-- Label (only for specific hours) -->
            <div class="h-6 mt-3 flex items-center justify-center">
              <span v-if="h.label" class="text-xs text-on-surface-dim font-medium">{{ h.label }}</span>
            </div>
          </div>
        </div>

        <!-- Footer info -->
        <div class="flex flex-col md:flex-row items-center justify-between pt-8 border-t border-outline/50 gap-6 text-center md:text-left">
          <div>
            <span class="block text-brand font-bold mb-1">Mest folk kl 17:00</span>
            <span class="text-sm text-on-surface-dim">Vanligtvis lite väntetid</span>
          </div>
          <div class="text-right">
            <span class="block font-medium mb-1 text-on-surface">03:55 – 00:05</span>
            <span class="text-sm text-on-surface-dim">Öppet varje dag</span>
          </div>
        </div>
      </div>
    </div>
  </section>
</template>