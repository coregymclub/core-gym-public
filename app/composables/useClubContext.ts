/**
 * Composable for detecting and providing club context
 * Used by navigation to show club-specific content
 */

export interface ClubOffering {
  name: string
  href: string
  icon: string
  locations?: number[] // siteIds where this is available (empty = all)
}

export interface Club {
  id: number
  siteId: number
  name: string
  shortName: string
  slug: string
  ageRestriction?: number
  openingHours: string
  address: string
  offerings: string[] // keys from allOfferings
}

// All clubs
const clubs: Club[] = [
  {
    id: 1,
    siteId: 1,
    name: 'Vegastaden',
    shortName: 'Vega',
    slug: 'vegastaden',
    ageRestriction: 18,
    openingHours: '04–00',
    address: 'Stjärntorget 1',
    offerings: ['gym', 'grupptraning', 'pt', 'bastu']
  },
  {
    id: 2,
    siteId: 3,
    name: 'Västerhaninge',
    shortName: 'VH',
    slug: 'vasterhaninge',
    openingHours: '04–00',
    address: 'Centrumvägen 4',
    offerings: ['gym', 'grupptraning', 'pt', 'egym', 'barndans', 'ungdomstraning']
  },
  {
    id: 3,
    siteId: 2,
    name: 'Tungelsta',
    shortName: 'Tung',
    slug: 'tungelsta',
    openingHours: '04–23',
    address: 'Madenvägen 5B',
    offerings: ['gym', 'grupptraning', 'pt', 'yoga', 'barndans', 'ungdomstraning', 'weighttrainer']
  }
]

// All available offerings with their details
const allOfferings: Record<string, ClubOffering> = {
  gym: {
    name: 'Gym',
    href: '/anlaggningar',
    icon: 'dumbbell',
    locations: [] // all
  },
  grupptraning: {
    name: 'Gruppträning',
    href: '/schema',
    icon: 'users',
    locations: []
  },
  pt: {
    name: 'Personlig träning',
    href: '/pt',
    icon: 'user-check',
    locations: []
  },
  egym: {
    name: 'EGYM',
    href: '/egym',
    icon: 'cpu',
    locations: [3] // Västerhaninge only
  },
  yoga: {
    name: 'Yoga',
    href: '/yoga',
    icon: 'heart',
    locations: [2] // Tungelsta only
  },
  barndans: {
    name: 'Barndans',
    href: '/barndans',
    icon: 'music',
    locations: [2, 3] // Tungelsta, Västerhaninge
  },
  ungdomstraning: {
    name: 'Ungdomsträning',
    href: '/ungdomstraning',
    icon: 'zap',
    locations: [2, 3] // Tungelsta, Västerhaninge
  },
  weighttrainer: {
    name: 'Weight Trainer',
    href: '/schema',
    icon: 'target',
    locations: [2] // Tungelsta only
  },
  bastu: {
    name: 'Bastu',
    href: '/vegastaden',
    icon: 'flame',
    locations: [1] // Vegastaden only
  }
}

export function useClubContext() {
  const route = useRoute()

  // Current club based on route
  const currentClub = computed<Club | null>(() => {
    const path = route.path

    // Check if we're on a club page
    for (const club of clubs) {
      if (path === `/${club.slug}` || path.startsWith(`/${club.slug}/`)) {
        return club
      }
      // Also check /anlaggningar/[slug]
      if (path === `/anlaggningar/${club.slug}`) {
        return club
      }
    }
    return null
  })

  // Are we in club context?
  const isClubContext = computed(() => currentClub.value !== null)

  // Get offerings for current club (or all if not in club context)
  const currentOfferings = computed<ClubOffering[]>(() => {
    if (!currentClub.value) {
      // Return all offerings for general view
      return Object.values(allOfferings)
    }

    // Return offerings available at this club
    return currentClub.value.offerings
      .map(key => allOfferings[key])
      .filter(Boolean)
  })

  // Get all offerings with location info (for general menu)
  const allOfferingsWithLocations = computed(() => {
    return Object.entries(allOfferings).map(([key, offering]) => {
      const availableAt = offering.locations?.length
        ? clubs.filter(c => offering.locations!.includes(c.siteId))
        : clubs // all clubs if no locations specified

      return {
        ...offering,
        key,
        availableAt,
        isGlobal: !offering.locations?.length
      }
    })
  })

  // Get club by slug or siteId
  function getClub(slugOrSiteId: string | number): Club | null {
    if (typeof slugOrSiteId === 'number') {
      return clubs.find(c => c.siteId === slugOrSiteId) || null
    }
    return clubs.find(c => c.slug === slugOrSiteId) || null
  }

  // Get all clubs
  function getAllClubs(): Club[] {
    return clubs
  }

  return {
    currentClub,
    isClubContext,
    currentOfferings,
    allOfferingsWithLocations,
    getClub,
    getAllClubs,
    allOfferings
  }
}
