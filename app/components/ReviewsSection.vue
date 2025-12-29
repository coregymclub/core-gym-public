<script setup lang="ts">
interface Review {
  id: string
  authorName: string
  rating: number
  text: string
  publishTime: string
  clubId?: number
  clubName?: string
}

interface Props {
  title?: string
  clubId?: number
  limit?: number
  googleRating?: number
}

const props = withDefaults(defineProps<Props>(), {
  title: 'Recensioner',
  limit: 6,
})

// Google ratings per club (fetched manually from Google)
const googleRatings: Record<number, number> = {
  1: 4.8, // Vegastaden
  2: 4.7, // Västerhaninge
  3: 4.9, // Tungelsta
}

const displayRating = computed(() => {
  if (props.googleRating) return props.googleRating
  if (props.clubId && googleRatings[props.clubId]) return googleRatings[props.clubId]
  return averageRating.value
})

const API_URL = 'https://coregym-reviews-api.gustav-brydner.workers.dev'

const reviews = ref<Review[]>([])
const loading = ref(true)

const filteredReviews = computed(() => {
  let result = reviews.value

  if (props.clubId) {
    result = result.filter(r => r.clubId === props.clubId)
  }

  // Randomize and limit
  return result
    .filter(r => r.text && r.text.length > 20 && r.rating >= 4)
    .sort(() => Math.random() - 0.5)
    .slice(0, props.limit)
})

const averageRating = computed(() => {
  const relevant = props.clubId
    ? reviews.value.filter(r => r.clubId === props.clubId)
    : reviews.value

  if (relevant.length === 0) return 0
  const sum = relevant.reduce((acc, r) => acc + r.rating, 0)
  return Math.round((sum / relevant.length) * 10) / 10
})

const totalReviews = computed(() => {
  if (props.clubId) return reviews.value.filter(r => r.clubId === props.clubId).length
  return reviews.value.length
})

async function fetchReviews() {
  if (import.meta.server) {
    loading.value = false
    return
  }

  loading.value = true

  try {
    const controller = new AbortController()
    const timeout = setTimeout(() => controller.abort(), 5000)

    const response = await fetch(`${API_URL}/reviews?limit=50`, { signal: controller.signal })
    clearTimeout(timeout)

    if (response.ok) {
      const data = await response.json()
      reviews.value = data.reviews || []
    }
  } catch (e) {
    console.error('Reviews fetch error:', e)
  } finally {
    loading.value = false
  }
}

onMounted(() => {
  fetchReviews()
})
</script>

<template>
  <section v-if="!loading && filteredReviews.length > 0" class="section bg-surface-dim">
    <div class="container">
      <h2 class="text-section mb-4">{{ title }}</h2>

      <!-- Rating summary -->
      <div class="flex items-center justify-center gap-3 mb-12">
        <div class="flex items-center gap-0.5">
          <svg v-for="i in 5" :key="i" class="w-5 h-5" :class="i <= Math.round(displayRating) ? 'text-yellow-400' : 'text-on-surface-dim/30'" fill="currentColor" viewBox="0 0 20 20">
            <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z"/>
          </svg>
        </div>
        <span class="text-title">{{ displayRating }}</span>
        <span class="text-label text-on-surface-dim">på Google</span>
      </div>

      <!-- Reviews grid -->
      <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 max-w-4xl mx-auto">
        <article
          v-for="review in filteredReviews"
          :key="review.id"
          class="card"
        >
          <!-- Stars -->
          <div class="flex items-center justify-between mb-3">
            <div class="flex gap-0.5">
              <svg v-for="i in 5" :key="i" class="w-4 h-4" :class="i <= review.rating ? 'text-yellow-400' : 'text-on-surface-dim/20'" fill="currentColor" viewBox="0 0 20 20">
                <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z"/>
              </svg>
            </div>
            <!-- Google icon -->
            <svg class="w-4 h-4" viewBox="0 0 24 24">
              <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/>
              <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
              <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05"/>
              <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/>
            </svg>
          </div>

          <!-- Review text -->
          <p class="text-body text-on-surface-dim line-clamp-3 mb-3">"{{ review.text }}"</p>

          <!-- Author -->
          <span class="text-label font-medium">{{ review.authorName }}</span>
        </article>
      </div>
    </div>
  </section>
</template>
