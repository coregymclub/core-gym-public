const ZOEZI_API = 'https://coregymclub.zoezi.se/api/public/workout/get/all'

// Categories to exclude from public schedule
const EXCLUDED_CATEGORIES = [
  5,  // Virtual Les Mills classes
  10, // Staff schedule entries (e.g., "Bemannade tider")
]

interface WorkoutType {
  id: number
  name: string
  description: string
  color: string
  category_id: number
}

interface Resource {
  id: number
  firstname: string | null
  lastname: string
  resourceType?: string
}

interface Staff {
  id: number
  firstname: string | null
  lastname: string | null
  imagekey?: string | null
}

interface Workout {
  id: number
  workoutType: WorkoutType
  startTime: string
  endTime: string
  space: number
  numBooked: number
  site_id: number
  extra_title: string | null
  description: string | null
  resources: Resource[]
  staffs: Staff[]
  bookableForCustomer: boolean
}

interface ApiResponse {
  workouts: Workout[]
}

export interface ClassItem {
  id: number
  time: string
  endTime: string
  name: string
  description: string
  color: string
  spots: number
  spotsLeft: number
  site: string
  siteId: number
  room: string
  extraTitle: string
  bookable: boolean
  instructor: string | null
  instructorImage: string | null
}

interface DaySchedule {
  date: string
  dayName: string
  classes: ClassItem[]
}

const SITE_NAMES: Record<number, string> = {
  1: 'Vegastaden',
  2: 'Tungelsta',
  3: 'Västerhaninge'
}

const DAY_NAMES = ['Söndag', 'Måndag', 'Tisdag', 'Onsdag', 'Torsdag', 'Fredag', 'Lördag']

export function useGroupTraining() {
  const schedule = ref<DaySchedule[]>([])
  const loading = ref(false)
  const error = ref<string | null>(null)
  const selectedClass = ref<ClassItem | null>(null)

  function formatDate(date: Date): string {
    const year = date.getFullYear()
    const month = String(date.getMonth() + 1).padStart(2, '0')
    const day = String(date.getDate()).padStart(2, '0')
    return `${year}-${month}-${day}`
  }

  function parseDate(dateStr: string): { year: number; month: number; day: number; dayOfWeek: number } {
    const [year, month, day] = dateStr.split('-').map(Number)
    const d = new Date(year, month - 1, day)
    return { year, month, day, dayOfWeek: d.getDay() }
  }

  function cleanText(text: string): string {
    if (!text) return ''
    return text
      .replace(/[\u200B-\u200D\u2060\u034F\u061C\u115F\u180E\u2000-\u206F\uFEFF\u00AD\u034F]/g, '')
      .replace(/[^\x20-\x7E\xA0-\xFF\u0100-\u017F™®©åäöÅÄÖ]/g, '')
      .replace(/\s+/g, ' ')
      .trim()
  }

  function stripHtml(html: string): string {
    if (!html) return ''
    return html
      .replace(/<[^>]*>/g, ' ')
      .replace(/&nbsp;/g, ' ')
      .replace(/&amp;/g, '&')
      .replace(/\s+/g, ' ')
      .trim()
  }

  function getClassCategory(name: string): string {
    const lower = name.toLowerCase()
    if (lower.includes('pump') || lower.includes('strength')) return 'strength'
    if (lower.includes('combat') || lower.includes('attack')) return 'cardio'
    if (lower.includes('balance') || lower.includes('yoga') || lower.includes('yinyoga')) return 'mindbody'
    if (lower.includes('pilates')) return 'mindbody'
    if (lower.includes('rpm') || lower.includes('sprint') || lower.includes('trip') || lower.includes('cycling')) return 'cycle'
    if (lower.includes('grit') || lower.includes('hiit') || lower.includes('tabata') || lower.includes('wod')) return 'hiit'
    if (lower.includes('core')) return 'core'
    if (lower.includes('shape')) return 'toning'
    return 'other'
  }

  function getRoomName(resources: Resource[]): string {
    if (!resources || resources.length === 0) return ''
    // Find resource with type 'room'
    const room = resources.find(r => r.resourceType === 'room') || resources[0]
    const name = cleanText(room.lastname || room.firstname || '')
    return name
  }

  function getInstructorName(staffs: Staff[]): string | null {
    if (!staffs || staffs.length === 0) return null
    const staff = staffs[0]
    const firstName = cleanText(staff.firstname || '')
    const lastName = cleanText(staff.lastname || '')
    if (firstName && lastName) return `${firstName} ${lastName}`
    return firstName || lastName || null
  }

  function getInstructorImage(staffs: Staff[]): string | null {
    if (!staffs || staffs.length === 0) return null
    const staff = staffs[0]
    if (!staff.imagekey) return null
    return `https://coregymclub.zoezi.se/api/utils/file/download?key=${staff.imagekey}`
  }

  async function fetchSchedule(daysAhead: number = 7) {
    loading.value = true
    error.value = null

    try {
      const today = new Date()
      const endDate = new Date()
      endDate.setDate(today.getDate() + daysAhead)

      const url = `${ZOEZI_API}?fromDate=${formatDate(today)}&toDate=${formatDate(endDate)}`
      const response = await fetch(url)

      if (!response.ok) {
        throw new Error('Kunde inte hämta schemat')
      }

      const data: ApiResponse = await response.json()

      // Group by date, excluding internal categories
      const byDate: Record<string, ClassItem[]> = {}

      for (const workout of data.workouts) {
        // Skip excluded categories (virtual classes, staff schedules, etc.)
        if (EXCLUDED_CATEGORIES.includes(workout.workoutType?.category_id)) {
          continue
        }

        const dateMatch = workout.startTime.match(/^(\d{4}-\d{2}-\d{2})/)
        if (!dateMatch) continue

        const date = dateMatch[1]
        const time = workout.startTime.substring(11, 16)
        const endTime = workout.endTime?.substring(11, 16) || ''

        if (!byDate[date]) {
          byDate[date] = []
        }

        const cleanedName = cleanText(workout.workoutType?.name || 'Okänt pass')
        const description = stripHtml(workout.workoutType?.description || '')

        byDate[date].push({
          id: workout.id,
          time,
          endTime,
          name: cleanedName,
          description,
          color: workout.workoutType?.color || '#666',
          spots: workout.space || 0,
          spotsLeft: (workout.space || 0) - (workout.numBooked || 0),
          site: SITE_NAMES[workout.site_id] || 'Okänd',
          siteId: workout.site_id,
          room: getRoomName(workout.resources),
          extraTitle: cleanText(workout.extra_title || ''),
          bookable: workout.bookableForCustomer,
          instructor: getInstructorName(workout.staffs),
          instructorImage: getInstructorImage(workout.staffs)
        })
      }

      // Convert to array and sort
      schedule.value = Object.entries(byDate)
        .map(([date, classes]) => {
          const parsed = parseDate(date)
          return {
            date,
            dayName: DAY_NAMES[parsed.dayOfWeek],
            classes: classes.sort((a, b) => a.time.localeCompare(b.time))
          }
        })
        .sort((a, b) => a.date.localeCompare(b.date))

    } catch (e) {
      console.error('Failed to fetch schedule:', e)
      error.value = 'Kunde inte hämta schemat'
    } finally {
      loading.value = false
    }
  }

  function selectClass(cls: ClassItem) {
    selectedClass.value = cls
  }

  function clearSelection() {
    selectedClass.value = null
  }

  return {
    schedule,
    loading,
    error,
    selectedClass,
    fetchSchedule,
    selectClass,
    clearSelection,
    getClassCategory,
    SITE_NAMES
  }
}
