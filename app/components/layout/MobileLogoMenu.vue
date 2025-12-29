<script setup lang="ts">
const isMenuOpen = ref(false)
const isOnDark = ref(false)

// Get shared scroll state from Header
const scrolledPastHero = useState('scrolledPastHero', () => false)

// Club context
const { currentClub, isClubContext } = useClubContext()

// Live data (only used for subtle indicator)
const { fetchToday, getStaffingStatus } = useStaffing()
const { stats: gymStats, fetchStats: fetchGymStats } = useGymStats()

// Updates/News Logic
interface Update {
  id: string
  message: string
  emoji: string | null
  createdAt: string
  clubIds: number[]
  global: boolean
}

const updates = ref<Update[]>([])
const loadingUpdates = ref(false)

async function fetchUpdates() {
  try {
    loadingUpdates.value = true
    const response = await fetch('https://coregym-updates-api.gustav-brydner.workers.dev/updates?limit=2')
    if (response.ok) {
      const data = await response.json()
      updates.value = data.updates || []
    }
  } catch (e) {
    console.error(e)
  } finally {
    loadingUpdates.value = false
  }
}

// Fetch live data when menu opens
watch(isMenuOpen, async (open) => {
  if (open) {
    document.body.style.overflow = 'hidden'
    await Promise.all([fetchToday(), fetchGymStats(), fetchUpdates()])
  } else {
    document.body.style.overflow = ''
  }
})

function toggleMenu() {
  isMenuOpen.value = !isMenuOpen.value
}

function closeMenu() {
  isMenuOpen.value = false
}

const mainLinks = [
  { name: 'Våra gym', href: '/anlaggningar' },
  { name: 'Schema', href: '/schema' },
  { name: 'Priser', href: '/priser' },
  { name: 'PT', href: '/pt' },
]

const secondaryLinks = [
  { name: 'Om oss', href: '/om-oss' },
  { name: 'Kontakt', href: '/kontakt' },
  { name: 'EGYM', href: '/egym' },
  { name: 'Barndans', href: '/barndans' },
  { name: 'Ungdom', href: '/ungdomstraning' },
  { name: 'Yoga', href: '/yoga' },
]

// Background check for FAB color
onMounted(() => {
  function checkBackground() {
    const scrollY = window.scrollY
    const viewportHeight = window.innerHeight
    const logoPosition = scrollY + viewportHeight - 60

    let onDark = false
    document.querySelectorAll('.bg-on-surface, .bg-brand, .bg-brand-dark, .egym-hero, .egym-section, .egym-dark, .egym-darker, .egym-cta, footer').forEach(el => {
      const rect = el.getBoundingClientRect()
      const elTop = rect.top + scrollY
      const elBottom = elTop + rect.height
      if (logoPosition >= elTop && logoPosition <= elBottom) {
        onDark = true
      }
    })
    isOnDark.value = onDark
  }

  window.addEventListener('scroll', checkBackground, { passive: true })
  checkBackground()
})
</script>

<template>
  <!-- Logo Button (FAB) -->
  <button
    class="logo-btn lg:hidden"
    :class="[
      scrolledPastHero || isMenuOpen ? 'is-visible' : 'is-hidden',
      { 'on-dark': isOnDark && !isMenuOpen, 'is-menu-open': isMenuOpen }
    ]"
    @click="toggleMenu"
    :aria-label="isMenuOpen ? 'Stäng meny' : 'Öppna meny'"
  >
    <div class="relative w-8 h-8 flex items-center justify-center transition-transform duration-500" :class="{ 'rotate-180': isMenuOpen }">
      <!-- Logo -->
      <img
        :src="isOnDark ? '/images/logo.svg' : '/images/logo-dark.svg'"
        alt="Core Gym Club"
        class="h-full w-auto absolute transition-all duration-300"
        :class="isMenuOpen ? 'opacity-0 scale-50' : 'opacity-100 scale-100'"
      />
      <!-- Close Icon (Cross) -->
      <svg
        class="w-6 h-6 text-on-surface absolute transition-all duration-300"
        :class="isMenuOpen ? 'opacity-100 scale-100 rotate-0' : 'opacity-0 scale-50 -rotate-90'"
        fill="none"
        stroke="currentColor"
        viewBox="0 0 24 24"
      >
        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
      </svg>
    </div>
  </button>

  <!-- Full Screen Menu Overlay -->
  <Teleport to="body">
    <Transition
      enter-active-class="transition-all duration-500 cubic-bezier(0.16, 1, 0.3, 1)"
      enter-from-class="opacity-0 translate-y-full"
      enter-to-class="opacity-100 translate-y-0"
      leave-active-class="transition-all duration-300 cubic-bezier(0.16, 1, 0.3, 1)"
      leave-from-class="opacity-100 translate-y-0"
      leave-to-class="opacity-0 translate-y-full"
    >
      <div v-if="isMenuOpen" class="fixed inset-0 z-40 bg-surface flex flex-col overflow-hidden">
        
        <!-- Header spacer -->
        <div class="h-24"></div>

        <!-- Scrollable Content -->
        <div class="flex-1 overflow-y-auto px-8 pb-32">
          <div class="max-w-lg mx-auto py-8">
            
            <!-- Main Links (Apple Style: Big, Clean, Animated) -->
            <nav class="space-y-6 mb-16">
              <div 
                v-for="(link, index) in mainLinks"
                :key="link.name"
                class="animate-slide-up"
                :style="{ animationDelay: `${index * 50}ms` }"
              >
                <NuxtLink
                  :to="link.href"
                  class="block text-4xl font-display font-bold text-on-surface hover:text-on-surface-dim transition-colors"
                  @click="closeMenu"
                >
                  {{ link.name }}
                </NuxtLink>
              </div>
            </nav>

            <!-- Secondary Links (Subtle grid) -->
            <div class="grid grid-cols-2 gap-y-4 gap-x-8 animate-slide-up mb-16" style="animation-delay: 200ms">
              <NuxtLink
                v-for="link in secondaryLinks"
                :key="link.name"
                :to="link.href"
                class="text-sm font-medium text-on-surface-dim hover:text-on-surface transition-colors"
                @click="closeMenu"
              >
                {{ link.name }}
              </NuxtLink>
            </div>

            <!-- News / Updates Section -->
            <div v-if="updates.length > 0" class="animate-slide-up" style="animation-delay: 300ms">
              <h4 class="text-xs font-bold uppercase tracking-widest text-on-surface-dim/50 mb-6">Aktuellt</h4>
              <div class="space-y-6">
                <div v-for="update in updates" :key="update.id" class="group">
                  <div class="flex items-start gap-4">
                    <span v-if="update.emoji" class="text-xl bg-surface-dim w-10 h-10 flex items-center justify-center rounded-full flex-shrink-0">{{ update.emoji }}</span>
                    <div class="flex-1">
                      <p class="text-base font-medium text-on-surface leading-snug mb-1">{{ update.message }}</p>
                      <span class="text-xs text-on-surface-dim">
                        {{ new Date(update.createdAt).toLocaleDateString('sv-SE', { day: 'numeric', month: 'short' }) }}
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            </div>

          </div>
        </div>

        <!-- Sticky Bottom Actions -->
        <!-- Removed per "Clean" request, keeping only essential if needed later -->
        
      </div>
    </Transition>
  </Teleport>
</template>

<style scoped>
/* Logo Button (FAB) - M3 Expressive Animation */
.logo-btn {
  position: fixed;
  bottom: 24px;
  left: 50%;
  z-index: 50;
  border-radius: 9999px;
  padding: 16px 24px;
  cursor: pointer;

  /* Glassmorphism Default */
  background: rgba(255, 255, 255, 0.9);
  backdrop-filter: blur(20px) saturate(180%);
  -webkit-backdrop-filter: blur(20px) saturate(180%);
  border: 1px solid rgba(255, 255, 255, 0.5);
  box-shadow:
    0 8px 32px rgba(0, 0, 0, 0.12),
    0 2px 8px rgba(0, 0, 0, 0.05);
}

/* Hidden state - slides down */
.logo-btn.is-hidden {
  transform: translateX(-50%) translateY(120px) scale(0.8);
  opacity: 0;
  pointer-events: none;
  transition: all 0.4s cubic-bezier(0.4, 0, 1, 1);
}

/* Visible state - M3 spring bounce entrance */
.logo-btn.is-visible {
  transform: translateX(-50%) translateY(0) scale(1);
  opacity: 1;
  transition:
    transform 0.6s cubic-bezier(0.34, 1.56, 0.64, 1),
    opacity 0.4s cubic-bezier(0.2, 0, 0, 1),
    background 0.3s ease,
    box-shadow 0.3s ease;
  animation: fabEntrance 0.6s cubic-bezier(0.34, 1.56, 0.64, 1);
}

@keyframes fabEntrance {
  0% {
    transform: translateX(-50%) translateY(80px) scale(0.5);
    opacity: 0;
  }
  50% {
    transform: translateX(-50%) translateY(-8px) scale(1.05);
  }
  100% {
    transform: translateX(-50%) translateY(0) scale(1);
    opacity: 1;
  }
}

/* Hover - subtle lift */
.logo-btn.is-visible:hover {
  transform: translateX(-50%) translateY(-4px) scale(1.02);
  box-shadow:
    0 12px 40px rgba(0, 0, 0, 0.15),
    0 4px 12px rgba(0, 0, 0, 0.08);
}

/* Active/Press - M3 press response */
.logo-btn.is-visible:active {
  transform: translateX(-50%) translateY(0) scale(0.95);
  transition: transform 0.1s cubic-bezier(0.4, 0, 0.2, 1);
}

/* When menu is open - transforms to close state */
.logo-btn.is-menu-open {
  background: var(--color-surface);
  color: var(--color-on-surface);
  transform: translateX(-50%) translateY(0) scale(1);
  box-shadow: 0 4px 12px rgba(0,0,0,0.1);
  animation: fabPulse 0.4s cubic-bezier(0.34, 1.56, 0.64, 1);
}

@keyframes fabPulse {
  0% { transform: translateX(-50%) scale(1); }
  50% { transform: translateX(-50%) scale(1.1); }
  100% { transform: translateX(-50%) scale(1); }
}

.logo-btn.is-menu-open:hover {
  transform: translateX(-50%) scale(1.05);
}

.logo-btn.is-menu-open:active {
  transform: translateX(-50%) scale(0.95);
}

/* Dark mode FAB variant */
.logo-btn.on-dark {
  background: rgba(20, 20, 20, 0.85);
  border-color: rgba(255, 255, 255, 0.15);
  box-shadow: 0 8px 32px rgba(0, 0, 0, 0.4);
}

.logo-btn.on-dark:hover {
  box-shadow: 0 12px 40px rgba(0, 0, 0, 0.5);
}
</style>