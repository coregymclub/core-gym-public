// Types for trainers - matches /api/trainers response
export interface TrainerReview {
  text: string
  author: string
}

export interface Trainer {
  id: string
  name: string
  shortName: string
  email: string
  phone: string
  quote: string
  shortQuote: string
  bio: string
  imageKey: string
  imageUrl: string
  actionImageUrl?: string
  instagram?: string
  specialties: string[]
  reviews: TrainerReview[]
}

// Sheet state types
interface PTSheetState {
  isOpen: boolean
  trainer: Trainer | null
}

interface PTDetailSheetState {
  isOpen: boolean
  trainer: Trainer | null
}

interface ContactSheetState {
  isOpen: boolean
  subject?: string
}

interface GroupTrainingSheetState {
  isOpen: boolean
  classType?: string
  gym?: string
}

// Global sheet state - shared across all components
const ptSheet = ref<PTSheetState>({
  isOpen: false,
  trainer: null,
})

const ptDetailSheet = ref<PTDetailSheetState>({
  isOpen: false,
  trainer: null,
})

const contactSheet = ref<ContactSheetState>({
  isOpen: false,
  subject: undefined,
})

const groupTrainingSheet = ref<GroupTrainingSheetState>({
  isOpen: false,
  classType: undefined,
  gym: undefined,
})

export function useSheets() {
  // PT Sheet methods
  const openPTSheet = (trainer?: Trainer) => {
    ptSheet.value = {
      isOpen: true,
      trainer: trainer || null,
    }
  }

  const closePTSheet = () => {
    ptSheet.value = {
      isOpen: false,
      trainer: null,
    }
  }

  // PT Detail Sheet methods
  const openPTDetailSheet = (trainer: Trainer) => {
    ptDetailSheet.value = {
      isOpen: true,
      trainer,
    }
  }

  const closePTDetailSheet = () => {
    ptDetailSheet.value = {
      isOpen: false,
      trainer: null,
    }
  }

  // Contact Sheet methods
  const openContactSheet = (subject?: string) => {
    contactSheet.value = {
      isOpen: true,
      subject,
    }
  }

  const closeContactSheet = () => {
    contactSheet.value = {
      isOpen: false,
      subject: undefined,
    }
  }

  // Group Training Sheet methods
  const openGroupTrainingSheet = (options?: { classType?: string; gym?: string }) => {
    groupTrainingSheet.value = {
      isOpen: true,
      classType: options?.classType,
      gym: options?.gym,
    }
  }

  const closeGroupTrainingSheet = () => {
    groupTrainingSheet.value = {
      isOpen: false,
      classType: undefined,
      gym: undefined,
    }
  }

  // Close all sheets
  const closeAllSheets = () => {
    closePTSheet()
    closePTDetailSheet()
    closeContactSheet()
    closeGroupTrainingSheet()
  }

  return {
    // PT Sheet
    ptSheet: readonly(ptSheet),
    openPTSheet,
    closePTSheet,

    // PT Detail Sheet
    ptDetailSheet: readonly(ptDetailSheet),
    openPTDetailSheet,
    closePTDetailSheet,

    // Contact Sheet
    contactSheet: readonly(contactSheet),
    openContactSheet,
    closeContactSheet,

    // Group Training Sheet
    groupTrainingSheet: readonly(groupTrainingSheet),
    openGroupTrainingSheet,
    closeGroupTrainingSheet,

    // Utilities
    closeAllSheets,
  }
}
