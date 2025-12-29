/**
 * Composable for fetching reviews from Core Gym Reviews API
 */

const API_URL = 'https://coregym-reviews-api.gustav-brydner.workers.dev'

export interface Review {
  id: string
  type: 'club' | 'pt' | 'class' | 'general'
  authorName: string
  rating: number
  text: string
  publishTime: string
  clubId?: number
  clubName?: string
  targetId?: number
  targetName?: string
  featured?: boolean
  hidden?: boolean
}

export interface ReviewsResponse {
  reviews: Review[]
  total: number
  averageRating?: number
}

export interface ReviewClub {
  id: number
  name: string
  placeId: string
}

export function useReviews() {
  const reviews = ref<Review[]>([])
  const loading = ref(false)
  const error = ref<string | null>(null)

  /**
   * Fetch all reviews
   */
  async function fetchReviews(options?: {
    clubId?: number
    limit?: number
    featured?: boolean
  }): Promise<Review[]> {
    loading.value = true
    error.value = null

    try {
      const params = new URLSearchParams()
      if (options?.clubId) params.set('clubId', String(options.clubId))
      if (options?.limit) params.set('limit', String(options.limit))

      const endpoint = options?.featured ? '/reviews/featured' : '/reviews'
      const response = await fetch(`${API_URL}${endpoint}?${params}`)
      const data: ReviewsResponse = await response.json()

      reviews.value = data.reviews || []
      return reviews.value
    } catch (e) {
      error.value = 'Kunde inte ladda recensioner'
      console.error('Reviews fetch error:', e)
      return []
    } finally {
      loading.value = false
    }
  }

  /**
   * Fetch featured reviews (5-star with text)
   */
  async function fetchFeaturedReviews(limit = 10): Promise<Review[]> {
    return fetchReviews({ featured: true, limit })
  }

  /**
   * Fetch reviews for a specific club
   */
  async function fetchClubReviews(clubId: number, limit = 20): Promise<Review[]> {
    return fetchReviews({ clubId, limit })
  }

  /**
   * Fetch available clubs
   */
  async function fetchClubs(): Promise<Club[]> {
    try {
      const response = await fetch(`${API_URL}/reviews/clubs`)
      return await response.json()
    } catch (e) {
      console.error('Clubs fetch error:', e)
      return []
    }
  }

  /**
   * Fetch review types
   */
  async function fetchReviewTypes() {
    try {
      const response = await fetch(`${API_URL}/reviews/types`)
      return await response.json()
    } catch (e) {
      console.error('Types fetch error:', e)
      return []
    }
  }

  /**
   * Calculate average rating from reviews
   */
  function calculateAverageRating(reviewList: Review[]): number {
    if (reviewList.length === 0) return 0
    const sum = reviewList.reduce((acc, r) => acc + r.rating, 0)
    return Math.round((sum / reviewList.length) * 10) / 10
  }

  return {
    reviews,
    loading,
    error,
    fetchReviews,
    fetchFeaturedReviews,
    fetchClubReviews,
    fetchClubs,
    fetchReviewTypes,
    calculateAverageRating
  }
}
