<script setup lang="ts">
/**
 * NewsSection - Displays latest news from Core Gym API
 * Fetches from coregym-news-api and displays in a beautiful grid/carousel
 */

interface NewsItem {
  id: string
  title: string
  content: string | null
  summary: string | null
  imageUrl: string | null
  author: string | null
  published_at: string | null
  categories: string[]
}

interface Props {
  limit?: number
  title?: string
  showTitle?: boolean
}

const props = withDefaults(defineProps<Props>(), {
  limit: 4,
  title: 'Nyheter',
  showTitle: true
})

const NEWS_API = 'https://coregym-news-api.gustav-brydner.workers.dev'

const news = ref<NewsItem[]>([])
const isLoading = ref(true)
const selectedNews = ref<NewsItem | null>(null)
const showModal = ref(false)

// Carousel navigation
const carouselRef = ref<HTMLElement | null>(null)
const canScrollLeft = ref(false)
const canScrollRight = ref(true)

function updateScrollState() {
  if (!carouselRef.value) return
  const { scrollLeft, scrollWidth, clientWidth } = carouselRef.value
  canScrollLeft.value = scrollLeft > 10
  canScrollRight.value = scrollLeft < scrollWidth - clientWidth - 10
}

function scrollCarousel(direction: 'left' | 'right') {
  if (!carouselRef.value) return
  const scrollAmount = 420 // Card width + gap
  const newScrollLeft = carouselRef.value.scrollLeft + (direction === 'left' ? -scrollAmount : scrollAmount)
  carouselRef.value.scrollTo({ left: newScrollLeft, behavior: 'smooth' })
}

onMounted(() => {
  if (carouselRef.value) {
    carouselRef.value.addEventListener('scroll', updateScrollState)
    updateScrollState()
  }
})

// Fetch news on mount
onMounted(async () => {
  await fetchNews()
})

async function fetchNews() {
  if (import.meta.server) {
    isLoading.value = false
    return
  }

  try {
    const controller = new AbortController()
    const timeout = setTimeout(() => controller.abort(), 8000)

    const res = await fetch(`${NEWS_API}/news?limit=${props.limit}`, {
      signal: controller.signal
    })
    clearTimeout(timeout)

    if (res.ok) {
      const data = await res.json()
      news.value = data.news || []
    }
  } catch (e) {
    console.error('Failed to fetch news:', e)
  } finally {
    isLoading.value = false
  }
}

// Format date - Swedish
function formatDate(dateStr: string | null): string {
  if (!dateStr) return ''
  const date = new Date(dateStr)
  return date.toLocaleDateString('sv-SE', { day: 'numeric', month: 'short' })
}

function formatFullDate(dateStr: string | null): string {
  if (!dateStr) return ''
  const date = new Date(dateStr)
  return date.toLocaleDateString('sv-SE', { day: 'numeric', month: 'long', year: 'numeric' })
}

// Proxy Zoezi images through z.coregym.club
function getImageUrl(url: string | null): string | null {
  if (!url) return null
  return url.replace('coregymclub.zoezi.se', 'z.coregym.club')
}

// Extract location/category tags from news item
function getNewsTags(item: NewsItem): string[] {
  const tags: string[] = []
  const categories = item.categories || []
  const title = item.title.toLowerCase()
  const content = (item.content || '').toLowerCase()

  // Check categories first
  if (categories.includes('vegastaden')) tags.push('Vegastaden')
  if (categories.includes('tungelsta')) tags.push('Tungelsta')
  if (categories.includes('vasterhaninge')) tags.push('Västerhaninge')

  // Fallback to title/content parsing if no location category
  if (tags.length === 0) {
    if (title.includes('västerhaninge') || content.includes('västerhaninge')) tags.push('Västerhaninge')
    else if (title.includes('vasterhaninge') || content.includes('vasterhaninge')) tags.push('Västerhaninge')
    else if (title.includes('tungelsta') || content.includes('tungelsta')) tags.push('Tungelsta')
    else if (title.includes('vegastaden') || content.includes('vegastaden')) tags.push('Vegastaden')
    else if (title.includes('vega') || content.includes('i vega')) tags.push('Vegastaden')
  }

  return tags
}

// Hide "Zoezi Import" author
function getAuthor(item: NewsItem): string | null {
  if (!item.author) return null
  if (item.author.toLowerCase() === 'zoezi import') return null
  return item.author
}

// Check if news item should link to a specific page
function getNewsLink(item: NewsItem): string | null {
  const categories = item.categories || []
  const title = item.title.toLowerCase()

  // Check for barndans/zeydance
  if (categories.includes('barndans') || categories.includes('zeydance') ||
      title.includes('barndans') || title.includes('zey dance') || title.includes('zeydance')) {
    return '/barndans'
  }

  // Check for träningsresan
  if (categories.includes('traningsresan') || categories.includes('träningsresan') ||
      title.includes('träningsresa') || title.includes('traningsresa')) {
    return '/traningsresan'
  }

  return null
}

function openNews(item: NewsItem) {
  // Check if this news should navigate to a page instead
  const link = getNewsLink(item)
  if (link) {
    navigateTo(link)
    return
  }

  selectedNews.value = item
  showModal.value = true
  // Prevent body scroll
  document.body.style.overflow = 'hidden'
}

function closeModal() {
  showModal.value = false
  selectedNews.value = null
  document.body.style.overflow = ''
}

// Close on escape
onMounted(() => {
  const handleEscape = (e: KeyboardEvent) => {
    if (e.key === 'Escape' && showModal.value) closeModal()
  }
  window.addEventListener('keydown', handleEscape)
  onUnmounted(() => window.removeEventListener('keydown', handleEscape))
})
</script>

<template>
  <section v-if="!isLoading && news.length > 0" class="py-24 md:py-32 bg-[#f5f5f7] relative overflow-hidden">
    <div class="container">
      <!-- Header -->
      <div v-if="showTitle" class="text-center mb-10 md:mb-14">
        <h2 class="font-display font-bold text-4xl md:text-5xl text-[#1d1d1f] uppercase tracking-tight">
          {{ title }}
        </h2>
      </div>

      <!-- News Carousel -->
      <div class="relative">
        <div
          ref="carouselRef"
          class="flex gap-5 overflow-x-auto pb-4 snap-x snap-mandatory scrollbar-hide scroll-smooth"
        >
          <article
            v-for="item in news"
            :key="item.id"
            class="flex-shrink-0 w-[85%] md:w-[400px] snap-start cursor-pointer group"
            @click="openNews(item)"
          >
            <!-- Card with image background + glass overlay -->
            <div class="relative aspect-[4/5] md:aspect-[4/3] rounded-2xl overflow-hidden">
              <!-- Background image -->
              <img
                v-if="item.imageUrl"
                :src="getImageUrl(item.imageUrl)!"
                :alt="item.title"
                loading="lazy"
                class="absolute inset-0 w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
              />
              <div v-else class="absolute inset-0 bg-gradient-to-br from-[#1d1d1f] to-[#3a3a3c]" />

              <!-- Gradient overlay -->
              <div class="absolute inset-0 bg-gradient-to-t from-black/70 via-black/30 to-black/10" />

              <!-- Content -->
              <div class="absolute inset-0 p-5 md:p-6 flex flex-col justify-end">
                <!-- Tags -->
                <div v-if="getNewsTags(item).length > 0" class="flex flex-wrap gap-2 mb-3">
                  <span
                    v-for="tag in getNewsTags(item)"
                    :key="tag"
                    class="px-2.5 py-1 bg-white/20 backdrop-blur-sm rounded-full text-xs font-medium text-white border border-white/20"
                  >
                    {{ tag }}
                  </span>
                </div>

                <!-- Date -->
                <span class="text-sm text-white/70 mb-2">{{ formatDate(item.published_at) }}</span>

                <!-- Title -->
                <h3 class="font-display font-bold text-xl md:text-2xl text-white line-clamp-2 leading-tight">
                  {{ item.title }}
                </h3>

                <!-- Summary preview -->
                <p v-if="item.summary" class="text-sm text-white/60 mt-2 line-clamp-2">
                  {{ item.summary }}
                </p>

                <!-- Link indicator -->
                <div class="flex items-center gap-2 mt-3 text-white/80 group-hover:text-white transition-colors">
                  <span class="text-sm font-medium">Läs mer</span>
                  <svg class="w-4 h-4 transition-transform group-hover:translate-x-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 8l4 4m0 0l-4 4m4-4H3" />
                  </svg>
                </div>
              </div>
            </div>
          </article>
        </div>
      </div>

      <!-- Footer: Navigation arrows -->
      <div class="flex items-center justify-end mt-8">
        <div class="flex items-center gap-3">
          <button
            class="w-11 h-11 rounded-full bg-[#e8e8ed] flex items-center justify-center transition-all hover:bg-[#d2d2d7] active:scale-95 disabled:opacity-40"
            :disabled="!canScrollLeft"
            @click="scrollCarousel('left')"
          >
            <svg class="w-5 h-5 text-[#1d1d1f]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 19l-7-7 7-7" />
            </svg>
          </button>
          <button
            class="w-11 h-11 rounded-full bg-[#e8e8ed] flex items-center justify-center transition-all hover:bg-[#d2d2d7] active:scale-95 disabled:opacity-40"
            :disabled="!canScrollRight"
            @click="scrollCarousel('right')"
          >
            <svg class="w-5 h-5 text-[#1d1d1f]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7" />
            </svg>
          </button>
        </div>
      </div>
    </div>

    <!-- News Modal - Fullscreen -->
    <Teleport to="body">
      <Transition name="modal">
        <div
          v-if="showModal && selectedNews"
          class="fixed inset-0 z-[60] bg-surface overflow-hidden flex flex-col"
        >
          <!-- Header image -->
          <div class="relative flex-shrink-0">
            <div v-if="selectedNews.imageUrl" class="h-64 md:h-96 overflow-hidden">
              <img
                :src="getImageUrl(selectedNews.imageUrl)!"
                :alt="selectedNews.title"
                loading="lazy"
                class="w-full h-full object-cover"
              />
              <div class="absolute inset-0 bg-gradient-to-b from-black/40 via-transparent to-transparent" />
            </div>
            <div v-else class="h-32 bg-surface-dim" />

            <!-- Close button -->
            <button
              class="absolute top-6 right-6 w-12 h-12 rounded-full bg-black/30 backdrop-blur-md flex items-center justify-center transition-all hover:bg-black/50 hover:scale-105"
              @click="closeModal"
            >
              <svg class="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>

          <!-- Content -->
          <div class="flex-1 overflow-y-auto">
            <div class="max-w-3xl mx-auto px-6 py-8 md:py-12">
              <!-- Meta -->
              <div class="flex items-center gap-3 mb-4">
                <span class="text-sm text-on-surface-dim">{{ formatFullDate(selectedNews.published_at) }}</span>
              </div>

              <!-- Title -->
              <h1 class="font-display text-3xl md:text-5xl font-bold text-on-surface mb-8 leading-tight uppercase tracking-tight">
                {{ selectedNews.title }}
              </h1>

              <!-- Content -->
              <div
                class="prose prose-lg max-w-none text-on-surface-dim prose-headings:text-on-surface prose-a:text-brand"
                v-html="selectedNews.content || selectedNews.summary"
              />

              <!-- Author -->
              <div v-if="getAuthor(selectedNews)" class="mt-12 pt-8 border-t border-outline">
                <p class="text-sm text-on-surface-dim">
                  Skriven av <span class="text-on-surface font-medium">{{ getAuthor(selectedNews) }}</span>
                </p>
              </div>
            </div>
          </div>
        </div>
      </Transition>
    </Teleport>
  </section>

  <!-- Loading skeleton -->
  <section v-else-if="isLoading" class="py-24 md:py-32 bg-[#f5f5f7]">
    <div class="container">
      <div v-if="showTitle" class="text-center mb-10 md:mb-14">
        <div class="h-12 w-48 bg-[#e8e8ed] rounded-lg mx-auto animate-pulse" />
      </div>
      <div class="flex gap-5 overflow-hidden">
        <div v-for="i in 3" :key="i" class="flex-shrink-0 w-[85%] md:w-[400px]">
          <div class="aspect-[4/3] bg-[#e8e8ed] rounded-2xl animate-pulse" />
        </div>
      </div>
      <div class="flex items-center justify-between mt-8">
        <div class="h-12 w-40 bg-[#e8e8ed] rounded-full animate-pulse" />
        <div class="flex gap-3">
          <div class="w-11 h-11 bg-[#e8e8ed] rounded-full animate-pulse" />
          <div class="w-11 h-11 bg-[#e8e8ed] rounded-full animate-pulse" />
        </div>
      </div>
    </div>
  </section>
</template>

<style scoped>
.modal-enter-active {
  transition: opacity 0.3s ease, transform 0.3s cubic-bezier(0.32, 0.72, 0, 1);
}
.modal-leave-active {
  transition: opacity 0.2s ease, transform 0.2s ease;
}
.modal-enter-from {
  opacity: 0;
  transform: translateY(20px);
}
.modal-leave-to {
  opacity: 0;
  transform: translateY(20px);
}

.scrollbar-hide::-webkit-scrollbar {
  display: none;
}
.scrollbar-hide {
  -ms-overflow-style: none;
  scrollbar-width: none;
}
</style>
