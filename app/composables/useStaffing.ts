const STAFFING_API = 'https://coregym-staffed-hours-api.gustav-brydner.workers.dev'

interface StaffingSlot {
  open: string
  close: string
}

interface ClubStaffing {
  id: number
  name: string
  shortName: string
  siteId: number
  comingSoon: boolean
  closed: boolean
  staffed: boolean
  slots: StaffingSlot[]
  displayText: string
  isCurrentlyStaffed: boolean
}

interface TodayResponse {
  date: string
  dayId: string
  dayName: string
  clubs: Record<string, ClubStaffing>
}

interface WeekDay {
  date: string
  dayId: string
  dayName: string
  clubs: Record<string, ClubStaffing>
}

interface WeekResponse {
  days: WeekDay[]
}

export function useStaffing() {
  const todayData = ref<TodayResponse | null>(null)
  const weekData = ref<WeekResponse | null>(null)
  const loading = ref(false)
  const error = ref<string | null>(null)

  async function fetchToday() {
    if (import.meta.server) return

    try {
      loading.value = true
      const controller = new AbortController()
      const timeout = setTimeout(() => controller.abort(), 5000)

      const response = await fetch(`${STAFFING_API}/today`, { signal: controller.signal })
      clearTimeout(timeout)

      if (response.ok) {
        todayData.value = await response.json()
      }
    } catch (e) {
      if ((e as Error).name !== 'AbortError') {
        error.value = 'Kunde inte hämta bemanningsdata'
        console.error('Staffing API error:', e)
      }
    } finally {
      loading.value = false
    }
  }

  async function fetchWeek() {
    if (import.meta.server) return

    try {
      loading.value = true
      const controller = new AbortController()
      const timeout = setTimeout(() => controller.abort(), 5000)

      const response = await fetch(`${STAFFING_API}/week`, { signal: controller.signal })
      clearTimeout(timeout)

      if (response.ok) {
        weekData.value = await response.json()
      }
    } catch (e) {
      if ((e as Error).name !== 'AbortError') {
        error.value = 'Kunde inte hämta bemanningsdata'
        console.error('Staffing API error:', e)
      }
    } finally {
      loading.value = false
    }
  }

  function getClubToday(clubId: number): ClubStaffing | null {
    if (!todayData.value) return null
    return todayData.value.clubs[String(clubId)] || null
  }

  function getNextStaffedTime(clubId: number): { day: string; time: string } | null {
    if (!weekData.value) return null

    const now = new Date()
    const currentTime = now.getHours() * 60 + now.getMinutes()

    for (const day of weekData.value.days) {
      const club = day.clubs[String(clubId)]
      if (club?.staffed && club.slots.length > 0) {
        // Check if this is today
        const isToday = day.date === todayData.value?.date

        for (const slot of club.slots) {
          const [hours, minutes] = slot.open.split(':').map(Number)
          const slotTime = hours * 60 + minutes

          // If today, only show future slots
          if (isToday && slotTime <= currentTime) continue

          return {
            day: isToday ? 'Idag' : day.dayName,
            time: slot.open
          }
        }
      }
    }
    return null
  }

  function getStaffingStatus(clubId: number): {
    status: 'staffed-now' | 'staffed-today' | 'next-staffed' | 'unstaffed'
    text: string
    subtext?: string
  } {
    const club = getClubToday(clubId)

    if (!club) {
      return { status: 'unstaffed', text: 'Obemannat' }
    }

    if (club.isCurrentlyStaffed) {
      const currentSlot = club.slots.find(slot => {
        const now = new Date()
        const currentTime = now.getHours() * 100 + now.getMinutes()
        const [openH, openM] = slot.open.split(':').map(Number)
        const [closeH, closeM] = slot.close.split(':').map(Number)
        const openTime = openH * 100 + openM
        const closeTime = closeH * 100 + closeM
        return currentTime >= openTime && currentTime < closeTime
      })

      return {
        status: 'staffed-now',
        text: 'Bemannat nu',
        subtext: currentSlot ? `Till ${currentSlot.close}` : undefined
      }
    }

    if (club.staffed) {
      return {
        status: 'staffed-today',
        text: 'Bemannat idag',
        subtext: club.displayText
      }
    }

    const next = getNextStaffedTime(clubId)
    if (next) {
      return {
        status: 'next-staffed',
        text: `Nästa: ${next.day}`,
        subtext: next.time
      }
    }

    return { status: 'unstaffed', text: 'Obemannat' }
  }

  return {
    todayData,
    weekData,
    loading,
    error,
    fetchToday,
    fetchWeek,
    getClubToday,
    getNextStaffedTime,
    getStaffingStatus
  }
}
