/**
 * Composable for fetching live gym occupancy stats
 * Uses kiosk-api /entries/today endpoint (same as admin/status.html)
 */

const KIOSK_API = 'https://coregym-kiosk-api.gustav-brydner.workers.dev'
const CHECKOUT_MINUTES = 90

const SITE_IDS = [1, 2, 3] // Vegastaden, Tungelsta, Västerhaninge

export interface GymSiteStats {
  id: number
  name: string
  shortName: string
  gym: number      // People in gym area
  group: number    // People in group training
  total: number    // Total people
  lastUpdate: string | null
}

export interface GymStatsResponse {
  timestamp: string
  total: number
  sites: Record<number, GymSiteStats>
}

export function useGymStats() {
  const stats = ref<Record<number, GymSiteStats>>({})
  const loading = ref(false)
  const error = ref<string | null>(null)
  const lastFetch = ref<Date | null>(null)

  async function fetchStats(): Promise<Record<number, GymSiteStats>> {
    // Only fetch on client side
    if (import.meta.server) {
      return {}
    }

    loading.value = true
    error.value = null

    try {
      const now = Date.now()

      // Fetch entries for all 3 sites in parallel with timeout
      const fetches = SITE_IDS.map(async siteId => {
        const controller = new AbortController()
        const timeout = setTimeout(() => controller.abort(), 5000)

        try {
          const r = await fetch(`${KIOSK_API}/entries/today?site=${siteId}`, { signal: controller.signal })
          clearTimeout(timeout)
          return r.ok ? r.json() : { entries: [], siteName: '' }
        } catch {
          clearTimeout(timeout)
          return { entries: [], siteName: '' }
        }
      })

      const results = await Promise.all(fetches)

      // Process entries - count unique members within last 90 minutes
      const result: Record<number, GymSiteStats> = {}

      results.forEach((data, index) => {
        const siteId = SITE_IDS[index]
        const entries = data.entries || []

        // Filter to entries within last 90 minutes
        const recentMembers = new Map<number, { time: string }>()

        for (const entry of entries) {
          if (!entry.memberId) continue

          // Handle "2025-12-20 15:18:00" format (replace space with T for proper ISO parsing)
          const timeStr = entry.time?.replace(' ', 'T') || ''
          const entryTime = new Date(timeStr)
          if (isNaN(entryTime.getTime())) continue

          const minutesSince = (now - entryTime.getTime()) / 1000 / 60
          if (minutesSince > CHECKOUT_MINUTES) continue

          // Keep most recent entry per member
          const existing = recentMembers.get(entry.memberId)
          if (!existing || entryTime > new Date(existing.time)) {
            recentMembers.set(entry.memberId, { time: entryTime.toISOString() })
          }
        }

        // Find last update time
        let lastUpdate: string | null = null
        for (const m of recentMembers.values()) {
          if (!lastUpdate || new Date(m.time) > new Date(lastUpdate)) {
            lastUpdate = m.time
          }
        }

        const total = recentMembers.size

        result[siteId] = {
          id: siteId,
          name: data.siteName || `Gym ${siteId}`,
          shortName: (data.siteName || '').substring(0, 4).toUpperCase() || 'GYM',
          total,
          gym: total,
          group: 0,
          lastUpdate
        }
      })

      stats.value = result
      lastFetch.value = new Date()
      return result
    } catch (e) {
      error.value = 'Kunde inte hämta statistik'
      console.error('Stats fetch error:', e)
      return {}
    } finally {
      loading.value = false
    }
  }

  function getStatsForSite(siteId: number): GymSiteStats | null {
    return stats.value[siteId] || null
  }

  function getTotalVisitors(): number {
    return Object.values(stats.value).reduce((sum, site) => sum + site.total, 0)
  }

  // Auto-refresh every 2 minutes
  let refreshInterval: ReturnType<typeof setInterval> | null = null

  function startAutoRefresh(intervalMs = 120000) {
    if (import.meta.server) return
    stopAutoRefresh()
    refreshInterval = setInterval(fetchStats, intervalMs)
  }

  function stopAutoRefresh() {
    if (refreshInterval) {
      clearInterval(refreshInterval)
      refreshInterval = null
    }
  }

  onUnmounted(() => {
    stopAutoRefresh()
  })

  return {
    stats,
    loading,
    error,
    lastFetch,
    fetchStats,
    getStatsForSite,
    getTotalVisitors,
    startAutoRefresh,
    stopAutoRefresh
  }
}
