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
  title: 'Våra medlemmar har sagt sitt',
  limit: 20,
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
    // With clubId filter, just random sort
    return result
      .filter(r => r.text && r.text.length > 20 && r.rating >= 4)
      .sort(() => Math.random() - 0.5)
      .slice(0, props.limit)
  }

  // Filter good reviews first
  result = result.filter(r => r.text && r.text.length > 20 && r.rating >= 4)

  // Group reviews by club
  const byClub: Record<number, Review[]> = {}
  for (const review of result) {
    const clubId = review.clubId || 0
    if (!byClub[clubId]) byClub[clubId] = []
    byClub[clubId].push(review)
  }

  // Shuffle each club's reviews
  for (const clubId in byClub) {
    byClub[clubId].sort(() => Math.random() - 0.5)
  }

  // Interleave reviews from all clubs (round-robin)
  const clubIds = Object.keys(byClub).map(Number)
  const interleaved: Review[] = []
  while (interleaved.length < props.limit && clubIds.some(id => byClub[id].length > 0)) {
    for (const clubId of clubIds) {
      if (byClub[clubId].length > 0 && interleaved.length < props.limit) {
        interleaved.push(byClub[clubId].shift()!)
      }
    }
  }

  return interleaved
})

// For mobile: paginated reviews
const mobileReviewsLimit = ref(6)
const mobileReviews = computed(() => filteredReviews.value.slice(0, mobileReviewsLimit.value))
const hasMoreReviews = computed(() => mobileReviewsLimit.value < filteredReviews.value.length)

function loadMoreReviews() {
  mobileReviewsLimit.value += 4
}

// Club name mapping
const clubNames: Record<number, string> = {
  1: 'Core Vegastaden',
  2: 'Core Västerhaninge',
  3: 'Core Tungelsta',
}

// Split reviews into two rows for marquee (desktop)
const topRowReviews = computed(() => filteredReviews.value.filter((_, i) => i % 2 === 0))
const bottomRowReviews = computed(() => filteredReviews.value.filter((_, i) => i % 2 === 1))

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

// Mobile carousel navigation
const mobileCarouselRef = ref<HTMLElement | null>(null)
const canScrollLeft = ref(false)
const canScrollRight = ref(true)

function updateMobileScrollState() {
  if (!mobileCarouselRef.value) return
  const { scrollLeft, scrollWidth, clientWidth } = mobileCarouselRef.value
  canScrollLeft.value = scrollLeft > 10
  canScrollRight.value = scrollLeft < scrollWidth - clientWidth - 10
}

function scrollMobileCarousel(direction: 'left' | 'right') {
  if (!mobileCarouselRef.value) return
  const cardWidth = mobileCarouselRef.value.querySelector('.mobile-card')?.clientWidth || 280
  const scrollAmount = cardWidth + 16 // card width + gap
  const newScrollLeft = mobileCarouselRef.value.scrollLeft + (direction === 'left' ? -scrollAmount : scrollAmount)
  mobileCarouselRef.value.scrollTo({ left: newScrollLeft, behavior: 'smooth' })
}

onMounted(() => {
  if (mobileCarouselRef.value) {
    mobileCarouselRef.value.addEventListener('scroll', updateMobileScrollState)
    updateMobileScrollState()
  }
})
</script>

<template>
  <section v-if="!loading && filteredReviews.length > 0" class="py-16 md:py-28 bg-surface overflow-hidden">
    <!-- Header -->
    <div class="container mb-8 md:mb-16">
      <div class="text-center max-w-3xl mx-auto">
        <h2 class="font-display font-bold text-3xl md:text-5xl text-on-surface">
          {{ title }} ❤️
        </h2>
      </div>
    </div>

    <!-- Mobile: Swipeable cards -->
    <div class="md:hidden">
      <div ref="mobileCarouselRef" class="mobile-carousel" @scroll="updateMobileScrollState">
        <article
          v-for="review in mobileReviews"
          :key="review.id"
          class="mobile-card"
        >
          <!-- Google icon -->
          <div class="flex items-center gap-2 mb-3">
            <svg class="w-4 h-4 flex-shrink-0" viewBox="0 0 24 24">
              <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/>
              <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
              <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05"/>
              <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/>
            </svg>
            <span v-if="review.clubId && clubNames[review.clubId]" class="text-xs text-on-surface/40">{{ clubNames[review.clubId] }}</span>
          </div>
          <p class="review-text-mobile">"{{ review.text }}"</p>
          <div class="review-footer">
            <span class="review-author">{{ review.authorName.split(' ')[0] }}</span>
            <div class="review-stars">
              <svg v-for="i in review.rating" :key="i" class="w-3.5 h-3.5 text-on-surface/30" viewBox="0 0 20 20" fill="currentColor">
                <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z"/>
              </svg>
            </div>
          </div>
        </article>
        <!-- Load more card at the end -->
        <button
          v-if="hasMoreReviews"
          class="mobile-card load-more-card"
          @click="loadMoreReviews"
        >
          <div class="flex flex-col items-center justify-center h-full gap-3">
            <div class="w-12 h-12 rounded-full bg-on-surface/10 flex items-center justify-center">
              <svg class="w-6 h-6 text-on-surface" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v16m8-8H4" />
              </svg>
            </div>
            <span class="text-on-surface font-medium">Ladda fler</span>
            <span class="text-on-surface/50 text-sm">recensioner</span>
          </div>
        </button>
      </div>
      <!-- Footer: Navigation arrows -->
      <div class="flex items-center justify-end mt-6 px-6">
        <div class="flex items-center gap-3">
          <button
            class="w-10 h-10 rounded-full bg-on-surface/10 flex items-center justify-center transition-all hover:bg-on-surface/20 active:scale-95 disabled:opacity-30"
            :disabled="!canScrollLeft"
            @click="scrollMobileCarousel('left')"
          >
            <svg class="w-5 h-5 text-on-surface" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 19l-7-7 7-7" />
            </svg>
          </button>
          <button
            class="w-10 h-10 rounded-full bg-on-surface/10 flex items-center justify-center transition-all hover:bg-on-surface/20 active:scale-95 disabled:opacity-30"
            :disabled="!canScrollRight"
            @click="scrollMobileCarousel('right')"
          >
            <svg class="w-5 h-5 text-on-surface" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7" />
            </svg>
          </button>
        </div>
      </div>
    </div>

    <!-- Desktop: Marquee Row 1 - scrolls left -->
    <div class="hidden md:block marquee-container mb-4">
      <div class="marquee-track animate-marquee">
        <div class="marquee-content">
          <article
            v-for="review in topRowReviews"
            :key="review.id"
            class="review-card"
          >
            <div class="flex items-center gap-2 mb-3">
              <svg class="w-4 h-4 flex-shrink-0" viewBox="0 0 24 24">
                <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/>
                <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
                <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05"/>
                <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/>
              </svg>
              <span v-if="review.clubId && clubNames[review.clubId]" class="text-xs text-on-surface/40">{{ clubNames[review.clubId] }}</span>
            </div>
            <p class="review-text">"{{ review.text }}"</p>
            <div class="review-footer">
              <span class="review-author">{{ review.authorName.split(' ')[0] }}</span>
              <div class="review-stars">
                <svg v-for="i in review.rating" :key="i" class="w-3.5 h-3.5 text-on-surface/30" viewBox="0 0 20 20" fill="currentColor">
                  <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z"/>
                </svg>
              </div>
            </div>
          </article>
        </div>
        <!-- Duplicate for seamless loop -->
        <div class="marquee-content" aria-hidden="true">
          <article
            v-for="review in topRowReviews"
            :key="'dup-' + review.id"
            class="review-card"
          >
            <div class="flex items-center gap-2 mb-3">
              <svg class="w-4 h-4 flex-shrink-0" viewBox="0 0 24 24">
                <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/>
                <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
                <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05"/>
                <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/>
              </svg>
              <span v-if="review.clubId && clubNames[review.clubId]" class="text-xs text-on-surface/40">{{ clubNames[review.clubId] }}</span>
            </div>
            <p class="review-text">"{{ review.text }}"</p>
            <div class="review-footer">
              <span class="review-author">{{ review.authorName.split(' ')[0] }}</span>
              <div class="review-stars">
                <svg v-for="i in review.rating" :key="i" class="w-3.5 h-3.5 text-on-surface/30" viewBox="0 0 20 20" fill="currentColor">
                  <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z"/>
                </svg>
              </div>
            </div>
          </article>
        </div>
      </div>
    </div>

    <!-- Desktop: Marquee Row 2 - scrolls right -->
    <div class="hidden md:block marquee-container">
      <div class="marquee-track animate-marquee-reverse">
        <div class="marquee-content">
          <article
            v-for="review in bottomRowReviews"
            :key="review.id"
            class="review-card"
          >
            <div class="flex items-center gap-2 mb-3">
              <svg class="w-4 h-4 flex-shrink-0" viewBox="0 0 24 24">
                <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/>
                <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
                <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05"/>
                <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/>
              </svg>
              <span v-if="review.clubId && clubNames[review.clubId]" class="text-xs text-on-surface/40">{{ clubNames[review.clubId] }}</span>
            </div>
            <p class="review-text">"{{ review.text }}"</p>
            <div class="review-footer">
              <span class="review-author">{{ review.authorName.split(' ')[0] }}</span>
              <div class="review-stars">
                <svg v-for="i in review.rating" :key="i" class="w-3.5 h-3.5 text-on-surface/30" viewBox="0 0 20 20" fill="currentColor">
                  <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z"/>
                </svg>
              </div>
            </div>
          </article>
        </div>
        <!-- Duplicate for seamless loop -->
        <div class="marquee-content" aria-hidden="true">
          <article
            v-for="review in bottomRowReviews"
            :key="'dup-' + review.id"
            class="review-card"
          >
            <div class="flex items-center gap-2 mb-3">
              <svg class="w-4 h-4 flex-shrink-0" viewBox="0 0 24 24">
                <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/>
                <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
                <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05"/>
                <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/>
              </svg>
              <span v-if="review.clubId && clubNames[review.clubId]" class="text-xs text-on-surface/40">{{ clubNames[review.clubId] }}</span>
            </div>
            <p class="review-text">"{{ review.text }}"</p>
            <div class="review-footer">
              <span class="review-author">{{ review.authorName.split(' ')[0] }}</span>
              <div class="review-stars">
                <svg v-for="i in review.rating" :key="i" class="w-3.5 h-3.5 text-on-surface/30" viewBox="0 0 20 20" fill="currentColor">
                  <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z"/>
                </svg>
              </div>
            </div>
          </article>
        </div>
      </div>
    </div>
  </section>
</template>

<style scoped>
/* Mobile carousel */
.mobile-carousel {
  display: flex;
  gap: 1rem;
  overflow-x: auto;
  scroll-snap-type: x mandatory;
  scroll-padding: 0 1.5rem;
  padding: 0 1.5rem;
  -webkit-overflow-scrolling: touch;
  scrollbar-width: none;
  -ms-overflow-style: none;
}

.mobile-carousel::-webkit-scrollbar {
  display: none;
}

.mobile-card {
  flex-shrink: 0;
  width: calc(100vw - 5.5rem);
  padding: 1.25rem 1.5rem;
  background: white;
  border: 1px solid rgba(28, 27, 29, 0.08);
  border-radius: 1.25rem;
  scroll-snap-align: start;
  box-shadow: 0 2px 8px rgba(28, 27, 29, 0.06);
}

.load-more-card {
  min-height: 180px;
  border: 1px dashed rgba(28, 27, 29, 0.2);
  background: rgba(28, 27, 29, 0.03);
  box-shadow: none;
  transition: all 0.2s ease;
}

.load-more-card:active {
  transform: scale(0.98);
  background: rgba(28, 27, 29, 0.06);
}

.review-text-mobile {
  font-size: 1rem;
  line-height: 1.6;
  color: rgba(28, 27, 29, 0.85);
  margin-bottom: 1rem;
  display: -webkit-box;
  -webkit-line-clamp: 5;
  -webkit-box-orient: vertical;
  overflow: hidden;
}

/* Desktop marquee */
.marquee-container {
  width: 100%;
  overflow: hidden;
  mask-image: linear-gradient(to right, transparent, black 5%, black 95%, transparent);
  -webkit-mask-image: linear-gradient(to right, transparent, black 5%, black 95%, transparent);
}

.marquee-track {
  display: flex;
  width: fit-content;
}

.marquee-content {
  display: flex;
  gap: 1rem;
  padding-right: 1rem;
}

.review-card {
  flex-shrink: 0;
  width: 340px;
  padding: 1.5rem 1.75rem;
  background: white;
  border: 1px solid rgba(28, 27, 29, 0.08);
  border-radius: 1.5rem;
  transition: all 0.3s ease;
  box-shadow: 0 2px 8px rgba(28, 27, 29, 0.06);
}

.review-card:hover {
  box-shadow: 0 4px 16px rgba(28, 27, 29, 0.1);
}

.review-text {
  font-size: 1rem;
  line-height: 1.6;
  color: rgba(28, 27, 29, 0.85);
  margin-bottom: 1rem;
  display: -webkit-box;
  -webkit-line-clamp: 4;
  -webkit-box-orient: vertical;
  overflow: hidden;
}

.review-footer {
  display: flex;
  align-items: center;
  justify-content: space-between;
}

.review-author {
  font-size: 0.875rem;
  color: rgba(28, 27, 29, 0.5);
  font-weight: 600;
}

.review-stars {
  display: flex;
  gap: 0.125rem;
}

@keyframes marquee {
  from {
    transform: translateX(0);
  }
  to {
    transform: translateX(-50%);
  }
}

@keyframes marquee-reverse {
  from {
    transform: translateX(-50%);
  }
  to {
    transform: translateX(0);
  }
}

.animate-marquee {
  animation: marquee 80s linear infinite;
}

.animate-marquee-reverse {
  animation: marquee-reverse 90s linear infinite;
}

/* Pause on hover */
.marquee-container:hover .marquee-track {
  animation-play-state: paused;
}
</style>
