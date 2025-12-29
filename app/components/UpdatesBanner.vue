<script setup lang="ts">
/**
 * Updates Banner - Short updates from instructors/staff
 */

interface Update {
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
  pinned: boolean
}

interface Props {
  clubId?: number
  limit?: number
}

const props = withDefaults(defineProps<Props>(), {
  limit: 3,
})

const API_URL = 'https://coregym-updates-api.gustav-brydner.workers.dev'

const updates = ref<Update[]>([])
const loading = ref(true)
const dismissed = ref<Set<string>>(new Set())

const CLUB_NAMES: Record<number, string> = {
  1: 'Vegastaden',
  2: 'Västerhaninge',
  3: 'Tungelsta',
}

const visibleUpdates = computed(() =>
  updates.value.filter(u => !dismissed.value.has(u.id))
)

async function fetchUpdates() {
  if (import.meta.server) {
    loading.value = false
    return
  }

  loading.value = true

  try {
    const controller = new AbortController()
    const timeout = setTimeout(() => controller.abort(), 5000)

    const params = new URLSearchParams()
    if (props.clubId) params.set('clubId', String(props.clubId))
    params.set('limit', String(props.limit))

    const response = await fetch(`${API_URL}/updates?${params}`, { signal: controller.signal })
    clearTimeout(timeout)

    if (response.ok) {
      const data = await response.json()
      updates.value = data.updates || []
    }
  } catch (e) {
    console.error('Updates fetch error:', e)
  } finally {
    loading.value = false
  }
}

function dismiss(id: string) {
  dismissed.value.add(id)
  try {
    const stored = JSON.parse(sessionStorage.getItem('dismissedUpdates') || '[]')
    stored.push(id)
    sessionStorage.setItem('dismissedUpdates', JSON.stringify(stored))
  } catch (e) {
    // Ignore
  }
}

function formatRelativeTime(dateStr: string): string {
  const date = new Date(dateStr)
  const now = new Date()
  const diffMs = now.getTime() - date.getTime()
  const diffMins = Math.floor(diffMs / 60000)
  const diffHours = Math.floor(diffMins / 60)
  const diffDays = Math.floor(diffHours / 24)

  if (diffMins < 1) return 'Just nu'
  if (diffMins < 60) return `${diffMins} min`
  if (diffHours < 24) return `${diffHours} tim`
  if (diffDays === 1) return 'Igår'
  if (diffDays < 7) return `${diffDays} dagar`

  return date.toLocaleDateString('sv-SE', { day: 'numeric', month: 'short' })
}

function getClubNames(update: Update): string {
  if (update.global) return ''
  return update.clubIds.map(id => CLUB_NAMES[id] || '').filter(Boolean).join(', ')
}

function getFirstName(name: string): string {
  return name?.split(' ')[0] || ''
}

onMounted(() => {
  try {
    const stored = JSON.parse(sessionStorage.getItem('dismissedUpdates') || '[]')
    dismissed.value = new Set(stored)
  } catch (e) {
    // Ignore
  }

  fetchUpdates()
})
</script>

<template>
  <section v-if="!loading && visibleUpdates.length > 0" class="section bg-surface">
    <div class="container">
      <div class="flex items-center justify-center gap-2 mb-8">
        <span class="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
        <h2 class="text-title">Senaste nytt</h2>
      </div>

      <div class="space-y-3 max-w-xl mx-auto">
        <div
          v-for="update in visibleUpdates"
          :key="update.id"
          class="card flex items-start gap-4"
        >
          <!-- Author image or emoji -->
          <div class="flex-shrink-0">
            <img
              v-if="update.authorImageUrl"
              :src="update.authorImageUrl"
              :alt="update.authorName"
              class="w-10 h-10 rounded-full object-cover"
            />
            <span v-else-if="update.emoji" class="text-2xl">{{ update.emoji }}</span>
            <span v-else class="w-10 h-10 rounded-full bg-on-surface flex items-center justify-center text-label font-bold text-white">
              {{ update.authorName?.charAt(0) || '?' }}
            </span>
          </div>

          <div class="flex-1 min-w-0">
            <p class="text-body">{{ update.message }}</p>
            <div class="flex items-center gap-2 mt-2 text-label text-on-surface-dim">
              <span v-if="update.authorName" class="font-medium">{{ getFirstName(update.authorName) }}</span>
              <span>· {{ formatRelativeTime(update.createdAt) }}</span>
              <span v-if="update.pinned" class="px-2 py-0.5 bg-on-surface text-white rounded text-xs font-medium">Pinnad</span>
              <span v-if="!update.global && getClubNames(update)">· {{ getClubNames(update) }}</span>
            </div>
          </div>

          <button
            @click="dismiss(update.id)"
            class="p-1 hover:bg-surface-dim rounded transition-colors flex-shrink-0"
            aria-label="Stäng"
          >
            <svg class="w-4 h-4 text-on-surface-dim" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"/>
            </svg>
          </button>
        </div>
      </div>
    </div>
  </section>
</template>
