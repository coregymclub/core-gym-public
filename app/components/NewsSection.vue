<script setup lang="ts">
interface NewsItem {
  id: string
  title: string
  content: string
  summary: string
  categories: string[]
  imageUrl: string | null
  author: string
  published_at: string | null
}

interface Props {
  title?: string
  site?: string
  limit?: number
}

const props = withDefaults(defineProps<Props>(), {
  title: 'Nyheter',
  limit: 3,
})

const API_URL = 'https://coregym-news-api.gustav-brydner.workers.dev'

const news = ref<NewsItem[]>([])
const loading = ref(true)

async function fetchNews() {
  if (import.meta.server) {
    loading.value = false
    return
  }

  loading.value = true

  try {
    const controller = new AbortController()
    const timeout = setTimeout(() => controller.abort(), 5000)

    const params = new URLSearchParams()
    if (props.site) params.set('site', props.site)
    params.set('limit', String(props.limit))

    const response = await fetch(`${API_URL}/news?${params}`, { signal: controller.signal })
    clearTimeout(timeout)

    if (response.ok) {
      const data = await response.json()
      news.value = data.news || []
    }
  } catch (e) {
    console.error('News fetch error:', e)
  } finally {
    loading.value = false
  }
}

function stripHtml(html: string): string {
  return html.replace(/<[^>]*>/g, '').trim()
}

function getExcerpt(content: string, maxLength = 100): string {
  const text = stripHtml(content)
  if (text.length <= maxLength) return text
  return text.substring(0, maxLength).trim() + '...'
}

function formatDate(dateStr: string | null): string {
  if (!dateStr) return ''
  const date = new Date(dateStr)
  return date.toLocaleDateString('sv-SE', { day: 'numeric', month: 'short' })
}

onMounted(() => {
  fetchNews()
})
</script>

<template>
  <section v-if="!loading && news.length > 0" class="section bg-surface">
    <div class="container">
      <h2 class="text-section mb-12">{{ title }}</h2>

      <div class="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-4xl mx-auto">
        <article
          v-for="item in news"
          :key="item.id"
          class="card spring-hover overflow-hidden group"
        >
          <!-- Image -->
          <div v-if="item.imageUrl" class="h-40 -mx-6 -mt-6 mb-4 overflow-hidden">
            <img
              :src="item.imageUrl"
              :alt="item.title"
              class="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
              loading="lazy"
            />
          </div>
          <div v-else class="h-24 -mx-6 -mt-6 mb-4 bg-on-surface flex items-center justify-center">
            <svg class="w-8 h-8 text-white/30" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 20H5a2 2 0 01-2-2V6a2 2 0 012-2h10a2 2 0 012 2v1m2 13a2 2 0 01-2-2V7m2 13a2 2 0 002-2V9a2 2 0 00-2-2h-2m-4-3H9M7 16h6M7 8h6v4H7V8z"/>
            </svg>
          </div>

          <!-- Content -->
          <span class="text-label text-on-surface-dim mb-2 block">{{ formatDate(item.published_at) }}</span>
          <h3 class="text-title mb-2 group-hover:text-brand transition-colors line-clamp-2">{{ item.title }}</h3>
          <p class="text-body text-on-surface-dim line-clamp-2">{{ getExcerpt(item.content) }}</p>
        </article>
      </div>
    </div>
  </section>
</template>
