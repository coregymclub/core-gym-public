/**
 * Auth composable for Core Gym Club public website
 * Checks if user is logged in via Zoezi session
 */

export interface User {
  id: number
  firstname: string
  lastname: string
  email?: string
  personnummer?: string
  hasValidCard?: boolean
}

export const useAuth = () => {
  const user = useState<User | null>('auth-user', () => null)
  const isLoading = useState('auth-loading', () => true)
  const isChecked = useState('auth-checked', () => false)

  const isLoggedIn = computed(() => !!user.value)

  // Check auth state from localStorage and optionally verify with API
  const checkAuth = async (verify = false): Promise<boolean> => {
    // Only run on client
    if (!import.meta.client) {
      isLoading.value = false
      return false
    }

    // Already checked this session
    if (isChecked.value && !verify) {
      isLoading.value = false
      return !!user.value
    }

    isLoading.value = true

    try {
      // Check localStorage for stored session
      const stored = localStorage.getItem('zoeziSession')
      if (!stored) {
        user.value = null
        isLoading.value = false
        isChecked.value = true
        return false
      }

      const { token, user: storedUser } = JSON.parse(stored)
      if (!token) {
        user.value = null
        isLoading.value = false
        isChecked.value = true
        return false
      }

      // Set user from stored data immediately
      if (storedUser) {
        user.value = {
          id: storedUser.id,
          firstname: storedUser.firstname,
          lastname: storedUser.lastname
        }
      }

      // Optionally verify session is still valid via API
      if (verify) {
        const res = await fetch('/api/z/api/memberapi/get/current', {
          credentials: 'include'
        })

        if (res.ok) {
          const data = await res.json()
          if (data?.id) {
            user.value = {
              id: data.id,
              firstname: data.firstname,
              lastname: data.lastname,
              email: data.mail || data.email,
              personnummer: data.personnummer,
              hasValidCard: false // Could fetch training cards if needed
            }
          } else {
            // Session invalid, clear it
            localStorage.removeItem('zoeziSession')
            user.value = null
          }
        } else {
          // API error, keep stored user but don't clear (might be network issue)
        }
      }

      isLoading.value = false
      isChecked.value = true
      return !!user.value

    } catch (e) {
      console.error('[useAuth] Check failed:', e)
      isLoading.value = false
      isChecked.value = true
      return false
    }
  }

  // Logout - clear session and redirect
  const logout = async () => {
    try {
      await fetch('/api/z/api/memberapi/logout', {
        method: 'POST',
        credentials: 'include'
      })
    } catch (e) {
      console.error('[useAuth] Logout failed:', e)
    }

    // Clear local storage
    localStorage.removeItem('zoeziSession')

    // Clear cookies
    document.cookie = 'zoeziId=; Path=/; Expires=Thu, 01 Jan 1970 00:00:00 GMT'
    document.cookie = 'zoeziId=; Path=/; Domain=.coregym.club; Expires=Thu, 01 Jan 1970 00:00:00 GMT'

    user.value = null
    isChecked.value = false
  }

  // Redirect to BankID login
  const login = (returnUrl?: string) => {
    const callbackUrl = `${window.location.origin}/callback`

    // Store return URL if provided
    if (returnUrl) {
      sessionStorage.setItem('authFlow', JSON.stringify({
        flow: 'login',
        redirect: returnUrl
      }))
    }

    window.location.href = `https://z.coregym.club/auth?callback=${encodeURIComponent(callbackUrl)}`
  }

  // Get initials for avatar
  const getInitials = computed(() => {
    if (!user.value) return '?'
    return ((user.value.firstname?.[0] || '') + (user.value.lastname?.[0] || '')).toUpperCase() || '?'
  })

  return {
    user: readonly(user),
    isLoading: readonly(isLoading),
    isLoggedIn,
    getInitials,
    checkAuth,
    login,
    logout
  }
}
