<script setup lang="ts">
interface Props {
  siteId?: number | string  // If set, show only this site
  compact?: boolean         // Compact inline display
  showTotal?: boolean       // Show total across all gyms
}

const props = withDefaults(defineProps<Props>(), {
  compact: false,
  showTotal: false
})

const { stats, loading, fetchStats, getStatsForSite, getTotalVisitors, startAutoRefresh } = useGymStats()

const siteStats = computed(() => {
  if (props.siteId) {
    return getStatsForSite(props.siteId)
  }
  return null
})

const allSites = computed(() => {
  // Filter out EGYM for public display, only show main 3 gyms
  return Object.values(stats.value).filter(s =>
    typeof s.id === 'number' && s.id <= 3
  )
})

onMounted(async () => {
  await fetchStats()
  startAutoRefresh(120000) // Refresh every 2 min
})
</script>

<template>
  <!-- Single site compact (for gym page headers) -->
  <div v-if="siteId && compact" class="inline-flex items-center gap-2">
    <template v-if="loading">
      <div class="w-16 h-5 bg-white/20 rounded animate-pulse" />
    </template>
    <template v-else-if="siteStats">
      <span class="flex items-center gap-1.5 px-3 py-1.5 bg-white/10 backdrop-blur-sm rounded-full text-sm">
        <span class="w-2 h-2 rounded-full bg-green-400 animate-pulse" />
        <span class="font-medium">{{ siteStats.total }}</span>
        <span class="text-white/70">här nu</span>
      </span>
    </template>
  </div>

  <!-- All sites overview (for landing page) -->
  <div v-else-if="!siteId && !compact" class="grid grid-cols-1 sm:grid-cols-3 gap-4">
    <template v-if="loading">
      <div v-for="i in 3" :key="i" class="bg-white rounded-xl p-4 animate-pulse">
        <div class="h-4 bg-core-gray-200 rounded w-20 mb-2" />
        <div class="h-8 bg-core-gray-200 rounded w-12" />
      </div>
    </template>
    <template v-else>
      <div
        v-for="site in allSites"
        :key="site.id"
        class="bg-white rounded-xl p-4 text-center"
      >
        <p class="text-xs text-core-gray-400 uppercase tracking-wide mb-1">{{ site.name }}</p>
        <div class="flex items-center justify-center gap-2">
          <span class="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
          <span class="text-2xl font-bold text-core-dark">{{ site.total }}</span>
        </div>
        <p class="text-xs text-core-gray-400 mt-1">personer just nu</p>
      </div>
    </template>
  </div>

  <!-- Compact all sites (for hero section) -->
  <div v-else-if="!siteId && compact" class="flex flex-wrap justify-center gap-3">
    <template v-if="loading">
      <div v-for="i in 3" :key="i" class="px-4 py-2 bg-white/10 rounded-full animate-pulse">
        <div class="h-4 w-24 bg-white/20 rounded" />
      </div>
    </template>
    <template v-else>
      <div
        v-for="site in allSites"
        :key="site.id"
        class="flex items-center gap-2 px-4 py-2 bg-white/10 backdrop-blur-sm rounded-full"
      >
        <span class="w-1.5 h-1.5 rounded-full bg-green-400 animate-pulse" />
        <span class="text-sm font-medium text-white">{{ site.shortName }}</span>
        <span class="text-sm text-white/70">{{ site.total }}</span>
      </div>
    </template>
  </div>

  <!-- Show total badge -->
  <div v-if="showTotal && !loading" class="inline-flex items-center gap-2 px-4 py-2 bg-core-gray-100 rounded-full">
    <span class="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
    <span class="font-semibold text-core-dark">{{ getTotalVisitors() }}</span>
    <span class="text-core-gray-500">tränar just nu</span>
  </div>
</template>
