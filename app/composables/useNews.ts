/**
 * Composable for fetching news from Core Gym News API
 */

const API_URL = 'https://coregym-news-api.gustav-brydner.workers.dev'

export interface NewsItem {
  id: string
  title: string
  content: string
  summary: string
  categories: string[]
  imageUrl: string | null
  author: string
  status: 'draft' | 'pending' | 'published' | 'rejected'
  created_at: string
  published_at: string | null
  source: 'staff' | 'zoezi'
}

export interface NewsResponse {
  news: NewsItem[]
  total: number
  limit: number
  offset: number
  hasMore: boolean
}

export interface NewsCategories {
  sites: { id: string; name: string; siteId: number }[]
  activities: { id: string; name: string }[]
  special: { id: string; name: string }[]
}

// Site ID mapping
const SITE_SLUGS: Record<string, string> = {
  vegastaden: 'vegastaden',
  tungelsta: 'tungelsta',
  vasterhaninge: 'vasterhaninge'
}

export function useNews() {
  const news = ref<NewsItem[]>([])
  const loading = ref(false)
  const error = ref<string | null>(null)
  const categories = ref<NewsCategories | null>(null)

  /**
   * Fetch published news
   */
  async function fetchNews(options?: {
    site?: string
    categories?: string[]
    limit?: number
    offset?: number
  }): Promise<NewsItem[]> {
    loading.value = true
    error.value = null

    try {
      const params = new URLSearchParams()
      if (options?.site) params.set('site', options.site)
      if (options?.categories?.length) params.set('categories', options.categories.join(','))
      if (options?.limit) params.set('limit', String(options.limit))
      if (options?.offset) params.set('offset', String(options.offset))

      const response = await fetch(`${API_URL}/news?${params}`)
      const data: NewsResponse = await response.json()

      news.value = data.news || []
      return news.value
    } catch (e) {
      error.value = 'Kunde inte ladda nyheter'
      console.error('News fetch error:', e)
      return []
    } finally {
      loading.value = false
    }
  }

  /**
   * Fetch news for a specific site (includes global news)
   */
  async function fetchSiteNews(siteSlug: string, limit = 5): Promise<NewsItem[]> {
    return fetchNews({ site: siteSlug, limit })
  }

  /**
   * Fetch global news (shown everywhere)
   */
  async function fetchGlobalNews(limit = 5): Promise<NewsItem[]> {
    return fetchNews({ categories: ['global'], limit })
  }

  /**
   * Fetch news by activity category
   */
  async function fetchActivityNews(activity: string, limit = 5): Promise<NewsItem[]> {
    return fetchNews({ categories: [activity], limit })
  }

  /**
   * Fetch categories
   */
  async function fetchCategories(): Promise<NewsCategories | null> {
    try {
      const response = await fetch(`${API_URL}/news/categories`)
      const data = await response.json()
      categories.value = data
      return data
    } catch (e) {
      console.error('Categories fetch error:', e)
      return null
    }
  }

  /**
   * Fetch a single news item by ID
   */
  async function fetchNewsItem(id: string): Promise<NewsItem | null> {
    try {
      const response = await fetch(`${API_URL}/news/${id}`)
      if (!response.ok) return null
      return await response.json()
    } catch (e) {
      console.error('News item fetch error:', e)
      return null
    }
  }

  /**
   * Strip HTML tags from content for preview
   */
  function stripHtml(html: string): string {
    return html.replace(/<[^>]*>/g, '').trim()
  }

  /**
   * Get excerpt from content
   */
  function getExcerpt(content: string, maxLength = 150): string {
    const text = stripHtml(content)
    if (text.length <= maxLength) return text
    return text.substring(0, maxLength).trim() + '...'
  }

  /**
   * Format date for display
   */
  function formatDate(dateStr: string): string {
    const date = new Date(dateStr)
    return date.toLocaleDateString('sv-SE', {
      day: 'numeric',
      month: 'long',
      year: 'numeric'
    })
  }

  return {
    news,
    loading,
    error,
    categories,
    fetchNews,
    fetchSiteNews,
    fetchGlobalNews,
    fetchActivityNews,
    fetchCategories,
    fetchNewsItem,
    stripHtml,
    getExcerpt,
    formatDate
  }
}
