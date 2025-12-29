/**
 * Composable for fetching updates from Core Gym Updates API
 *
 * Updates are short messages (max 500 chars) that expire after a set time.
 * They can be global or targeted to specific clubs.
 */

const API_URL = 'https://coregym-updates-api.gustav-brydner.workers.dev'

export interface Update {
  id: string
  message: string
  emoji: string | null
  clubIds: number[]
  global: boolean
  authorName: string
  authorId: number | null
  authorImageUrl: string | null
  createdAt: string
  expiresAt: string
  daysActive: number
  pinned: boolean
  hidden: boolean
  views: number
}

export interface UpdatesResponse {
  updates: Update[]
  total: number
}

export interface UpdateClub {
  id: number
  name: string
  slug: string
}

// Club ID to slug mapping
const CLUB_SLUGS: Record<number, string> = {
  1: 'vegastaden',
  2: 'vasterhaninge',
  3: 'tungelsta'
}

export function useUpdates() {
  const updates = ref<Update[]>([])
  const loading = ref(false)
  const error = ref<string | null>(null)

  /**
   * Fetch active updates
   */
  async function fetchUpdates(options?: {
    clubId?: number
    limit?: number
  }): Promise<Update[]> {
    loading.value = true
    error.value = null

    try {
      const params = new URLSearchParams()
      if (options?.clubId) params.set('clubId', String(options.clubId))
      if (options?.limit) params.set('limit', String(options.limit))

      const response = await fetch(`${API_URL}/updates?${params}`)
      const data: UpdatesResponse = await response.json()

      updates.value = data.updates || []
      return updates.value
    } catch (e) {
      error.value = 'Kunde inte ladda uppdateringar'
      console.error('Updates fetch error:', e)
      return []
    } finally {
      loading.value = false
    }
  }

  /**
   * Fetch updates for a specific club (includes global)
   */
  async function fetchClubUpdates(clubId: number, limit = 5): Promise<Update[]> {
    return fetchUpdates({ clubId, limit })
  }

  /**
   * Fetch all active updates (global)
   */
  async function fetchAllUpdates(limit = 10): Promise<Update[]> {
    return fetchUpdates({ limit })
  }

  /**
   * Get the most important update (pinned first, then newest)
   */
  function getTopUpdate(): Update | null {
    if (updates.value.length === 0) return null
    // Already sorted by API (pinned first, then by date)
    return updates.value[0]
  }

  /**
   * Format relative time (e.g., "2 timmar sedan")
   */
  function formatRelativeTime(dateStr: string): string {
    const date = new Date(dateStr)
    const now = new Date()
    const diffMs = now.getTime() - date.getTime()
    const diffMins = Math.floor(diffMs / 60000)
    const diffHours = Math.floor(diffMins / 60)
    const diffDays = Math.floor(diffHours / 24)

    if (diffMins < 1) return 'Just nu'
    if (diffMins < 60) return `${diffMins} min sedan`
    if (diffHours < 24) return `${diffHours} tim sedan`
    if (diffDays === 1) return 'Igår'
    if (diffDays < 7) return `${diffDays} dagar sedan`

    return date.toLocaleDateString('sv-SE', { day: 'numeric', month: 'short' })
  }

  /**
   * Get days left until expiration
   */
  function getDaysLeft(update: Update): number {
    if (!update.expiresAt) return 0
    const expires = new Date(update.expiresAt)
    const now = new Date()
    const diffMs = expires.getTime() - now.getTime()
    return Math.max(0, Math.ceil(diffMs / (1000 * 60 * 60 * 24)))
  }

  /**
   * Check if update is expiring soon (within 2 days)
   */
  function isExpiringSoon(update: Update): boolean {
    return getDaysLeft(update) <= 2
  }

  /**
   * Get club name from ID
   */
  function getClubName(clubId: number): string {
    const names: Record<number, string> = {
      1: 'Vegastaden',
      2: 'Västerhaninge',
      3: 'Tungelsta'
    }
    return names[clubId] || 'Okänd'
  }

  /**
   * Get formatted club names for an update
   */
  function getClubNames(update: Update): string {
    if (update.global) return 'Alla gym'
    return update.clubIds.map(id => getClubName(id)).join(', ')
  }

  return {
    updates,
    loading,
    error,
    fetchUpdates,
    fetchClubUpdates,
    fetchAllUpdates,
    getTopUpdate,
    formatRelativeTime,
    getDaysLeft,
    isExpiringSoon,
    getClubName,
    getClubNames
  }
}
