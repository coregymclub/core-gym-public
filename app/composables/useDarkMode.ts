export function useDarkMode() {
  const isDark = ref(false)
  const STORAGE_KEY = 'cgc_dark_mode'

  // Initialize from localStorage or system preference
  function init() {
    if (import.meta.server) return

    const saved = localStorage.getItem(STORAGE_KEY)
    if (saved !== null) {
      isDark.value = saved === 'true'
    } else {
      // Check system preference
      isDark.value = window.matchMedia('(prefers-color-scheme: dark)').matches
    }
    applyTheme()

    // Listen for system preference changes
    window.matchMedia('(prefers-color-scheme: dark)').addEventListener('change', (e) => {
      if (localStorage.getItem(STORAGE_KEY) === null) {
        isDark.value = e.matches
        applyTheme()
      }
    })
  }

  function applyTheme() {
    if (import.meta.server) return

    if (isDark.value) {
      document.documentElement.classList.add('dark')
    } else {
      document.documentElement.classList.remove('dark')
    }
  }

  function toggle() {
    isDark.value = !isDark.value
    localStorage.setItem(STORAGE_KEY, String(isDark.value))
    applyTheme()
  }

  function setDark(value: boolean) {
    isDark.value = value
    localStorage.setItem(STORAGE_KEY, String(value))
    applyTheme()
  }

  // Watch for changes
  watch(isDark, () => {
    applyTheme()
  })

  return {
    isDark: readonly(isDark),
    toggle,
    setDark,
    init
  }
}
