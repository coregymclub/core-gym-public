<script setup lang="ts">
const route = useRoute()

// Hide on specific pages (conversion-focused pages)
const hiddenRoutes = ['/bli-medlem']
const isHiddenOnRoute = computed(() => hiddenRoutes.includes(route.path))

// Shared state for menu visibility
const isMenuOpen = useState('isMenuOpen', () => false)
const shouldOpenToChat = useState('shouldOpenToChat', () => false)
const currentView = ref<'menu' | 'chat' | 'utbud'>('menu')
const slideDirection = ref<'slide-left' | 'slide-right'>('slide-left')
const isOnDark = ref(false)
const isScrollingDown = ref(false)
const lastScrollY = ref(0)

// Theme color for mobile menu (Apple Music warm red)
const brandColor = '#FA2D48'
const defaultColor = '#ffffff'
const isMobile = ref(false)

// Check if mobile on mount
onMounted(() => {
  isMobile.value = window.innerWidth < 1024
  window.addEventListener('resize', () => {
    isMobile.value = window.innerWidth < 1024
  })
})

// Dynamic theme color based on menu state
useHead({
  meta: [
    {
      name: 'theme-color',
      content: computed(() => isMenuOpen.value && isMobile.value ? brandColor : defaultColor)
    }
  ]
})

// Chat bubble animation states (disabled for now)
// const showChatBubble = ref(false)
// const currentBubbleImage = ref('')
// const bubblePhase = ref<'greeting' | 'action'>('greeting')
// let bubbleSwapTimer: ReturnType<typeof setTimeout> | null = null

// Get shared scroll state from Header
const scrolledPastHero = useState('scrolledPastHero', () => false)

// Greeting bubbles (disabled for now)
// const greetingBubbles = [
//   '/images/chat-bubbles/men-tjena.png',
//   '/images/chat-bubbles/barafråga.png',
//   '/images/chat-bubbles/några-frågor.png',
// ]

// Action bubble (disabled for now)
// const actionBubble = '/images/chat-bubbles/öppnachatten.png'

// Live data
const { fetchToday } = useStaffing()
const { fetchStats: fetchGymStats } = useGymStats()

// Fetch live data when menu opens
watch(isMenuOpen, async (open) => {
  if (open) {
    document.body.style.overflow = 'hidden'
    currentView.value = 'menu'
    slideDirection.value = 'slide-left'
    await Promise.all([fetchToday(), fetchGymStats()])
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

// Chat functions (disabled for now)
// function openChat() {
//   slideDirection.value = 'slide-left'
//   currentView.value = 'chat'
// }

// function closeChat() {
//   slideDirection.value = 'slide-right'
//   currentView.value = 'menu'
// }

function openUtbud() {
  slideDirection.value = 'slide-left'
  currentView.value = 'utbud'
}

function closeUtbud() {
  slideDirection.value = 'slide-right'
  currentView.value = 'menu'
}

// Open menu directly to chat (disabled for now)
// function openChatDirectly() {
//   shouldOpenToChat.value = true
//   isMenuOpen.value = true
// }

// Navigation structure
const primaryLinks = [
  { name: 'Våra gym', href: '/anlaggningar' },
  { name: 'Vårt utbud', href: null, action: 'utbud' },
  { name: 'Om oss', href: '/om-oss' },
  { name: 'Kontakt', href: '/kontakt' },
  { name: 'Bli medlem', href: '/bli-medlem' },
  { name: 'Logga in', href: 'https://member.coregym.club', external: true },
]

const exploreLinks = [
  { name: 'Schema', href: '/schema' },
  { name: 'Personlig Träning', href: '/pt' },
  { name: 'EGYM', href: '/egym' },
  { name: 'Yoga', href: '/yoga' },
  { name: 'Mammaträning', href: '/mammatraning' },
  { name: 'Ungdom', href: '/ungdomstraning' },
  { name: 'Barndans', href: '/barndans' },
  { name: 'Weight Trainer', href: '/weight-trainer' },
  { name: 'InBody', href: '/inbody' },
  { name: 'Foodbox', href: '/foodbox' },
]

// Scroll up detection for expanded menu hint
const isScrollingUp = ref(false)
let scrollUpTimeout: ReturnType<typeof setTimeout> | null = null

// Background check for FAB color + scroll direction
onMounted(() => {
  let scrollTimeout: ReturnType<typeof setTimeout> | null = null
  let rafId: number | null = null
  let darkElements: NodeListOf<Element> | null = null

  function updateState() {
    const scrollY = window.scrollY
    const viewportHeight = window.innerHeight
    const logoPosition = scrollY + viewportHeight - 60

    const delta = scrollY - lastScrollY.value
    if (Math.abs(delta) > 15) {
      isScrollingDown.value = delta > 0

      // Track scroll up for expanded hint
      if (delta < 0 && scrollY > 100) {
        isScrollingUp.value = true
        if (scrollUpTimeout) clearTimeout(scrollUpTimeout)
        scrollUpTimeout = setTimeout(() => { isScrollingUp.value = false }, 2500)
      } else if (delta > 0) {
        isScrollingUp.value = false
        if (scrollUpTimeout) clearTimeout(scrollUpTimeout)
      }

      lastScrollY.value = scrollY
      if (scrollTimeout) clearTimeout(scrollTimeout)
      scrollTimeout = setTimeout(() => { isScrollingDown.value = false }, 600)
    }

    if (!darkElements) {
      darkElements = document.querySelectorAll('.bg-on-surface, .bg-brand, .bg-brand-dark, .egym-hero, .egym-section, .egym-dark, .egym-darker, .egym-cta, footer')
    }

    let onDark = false
    for (let i = 0; i < darkElements.length; i++) {
      const el = darkElements[i]
      if (!el) continue
      const rect = el.getBoundingClientRect()
      if (rect.top < viewportHeight && rect.bottom > viewportHeight - 100) {
         const elTop = rect.top + scrollY
         const elBottom = elTop + rect.height
         if (logoPosition >= elTop && logoPosition <= elBottom) {
           onDark = true
           break 
         }
      }
    }
    isOnDark.value = onDark
    rafId = null
  }

  function onScroll() {
    if (!rafId) rafId = requestAnimationFrame(updateState)
  }

  window.addEventListener('scroll', onScroll, { passive: true })
  updateState()
})
</script>

<template>
  <!-- Logo Button (FAB) - Mobile Only -->
  <!-- Hidden on conversion pages (bli-medlem) and when chat view is active -->
  <button
    v-if="!isHiddenOnRoute && !(isMenuOpen && currentView === 'chat')"
    class="logo-btn lg:hidden"
    :class="[
      scrolledPastHero || isMenuOpen ? 'is-visible' : 'is-hidden',
      {
        'on-dark': isOnDark && !isMenuOpen,
        'is-menu-open': isMenuOpen,
        'is-scrolling-down': isScrollingDown && !isMenuOpen
      }
    ]"
    @click="toggleMenu"
    :aria-label="isMenuOpen ? 'Stäng meny' : 'Öppna meny'"
  >
    <!-- Fingerprint overlay (shows when scrolling up) -->
    <div
      class="absolute inset-0 rounded-full flex items-center justify-center transition-opacity duration-500 pointer-events-none overflow-hidden"
      :class="isScrollingUp && !isMenuOpen ? 'opacity-100' : 'opacity-0'"
    >
      <img
        src="/images/finger-print.svg"
        alt=""
        class="w-[95%] h-[95%] object-contain opacity-25 fingerprint-red"
      />
    </div>

    <!-- Logo / Close icon -->
    <div class="relative w-11 h-11 flex items-center justify-center transition-transform duration-500" :class="{ 'rotate-180': isMenuOpen }">
      <img
        :src="isOnDark ? '/images/logo.svg' : '/images/logo-dark.svg'"
        alt="Core Gym Club"
        class="h-full w-auto absolute transition-all duration-300"
        :class="[
          isMenuOpen ? 'opacity-0 scale-50' : 'opacity-100 scale-100',
          isScrollingUp && !isMenuOpen ? 'opacity-40' : ''
        ]"
      />
      <svg
        class="w-7 h-7 absolute transition-all duration-300"
        :class="[
          isMenuOpen ? 'opacity-100 scale-100 rotate-0 text-black' : 'opacity-0 scale-50 -rotate-90 text-on-surface'
        ]"
        fill="none"
        stroke="currentColor"
        viewBox="0 0 24 24"
      >
        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
      </svg>
    </div>
  </button>


  <!-- Global Menu Overlay -->
  <Teleport to="body">
    <!-- Backdrop (Desktop Only) -->
    <Transition
      enter-active-class="transition-opacity duration-500 ease-out"
      enter-from-class="opacity-0"
      enter-to-class="opacity-100"
      leave-active-class="transition-opacity duration-300 ease-in"
      leave-from-class="opacity-100"
      leave-to-class="opacity-0"
    >
      <div 
        v-if="isMenuOpen" 
        class="hidden lg:block fixed inset-0 z-40 bg-black/40 backdrop-blur-sm"
        @click="closeMenu"
      ></div>
    </Transition>

    <!-- Menu Panel -->
    <Transition name="responsive-menu">
      <div
        v-if="isMenuOpen"
        class="menu-overlay fixed z-50 overflow-hidden shadow-2xl
               inset-0 lg:left-auto lg:right-0 lg:w-[600px] lg:h-full bg-brand-warm lg:bg-surface"
      >
        
        <!-- Sliding Container -->
        <Transition :name="slideDirection">
          
          <!-- MENU VIEW -->
          <div v-if="currentView === 'menu'" class="absolute inset-0 flex flex-col h-full overflow-hidden bg-transparent">
            
            <!-- Desktop Close Button - positioned below chat bubble -->
            <div class="hidden lg:flex absolute top-8 left-16 z-30">
              <button 
                @click="closeMenu"
                class="w-10 h-10 flex items-center justify-center rounded-full bg-surface-container/50 hover:bg-surface-container transition-colors group"
              >
                <svg class="w-6 h-6 text-on-surface group-hover:rotate-90 transition-transform duration-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>

            <!-- Scrollable Content -->
            <div class="flex-1 overflow-y-auto pt-top-safe lg:p-0 relative scrollbar-hide">

              <!-- Layout: Vertical Stack -->
              <div class="min-h-full flex flex-col px-8 lg:px-16 lg:py-16">

                <!-- Mobile: Clean centered menu -->
                <div class="lg:hidden flex-1 flex flex-col justify-center -mt-12">
                  <nav class="space-y-2">
                    <template v-for="(item, index) in primaryLinks" :key="item.name">
                      <!-- Action item (Vårt utbud) -->
                      <button
                        v-if="item.action === 'utbud'"
                        class="group flex items-center gap-3 w-full py-2 transition-colors animate-slide-up"
                        :style="{ animationDelay: `${index * 60}ms` }"
                        @click="openUtbud"
                      >
                        <span class="font-display font-bold text-5xl tracking-tight text-black">{{ item.name }}</span>
                        <svg class="w-7 h-7 text-black/40 group-active:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7" />
                        </svg>
                      </button>

                      <!-- External link -->
                      <a
                        v-else-if="item.external"
                        :href="item.href"
                        target="_blank"
                        rel="noopener"
                        class="group block py-2 transition-colors animate-slide-up"
                        :style="{ animationDelay: `${index * 60}ms` }"
                        @click="closeMenu"
                      >
                        <span class="font-display font-bold text-5xl tracking-tight text-black/60">{{ item.name }}</span>
                      </a>

                      <!-- Internal link -->
                      <NuxtLink
                        v-else
                        :to="item.href"
                        class="group block py-2 transition-colors animate-slide-up"
                        :style="{ animationDelay: `${index * 60}ms` }"
                        @click="closeMenu"
                      >
                        <span class="font-display font-bold text-5xl tracking-tight text-black">{{ item.name }}</span>
                      </NuxtLink>
                    </template>
                  </nav>
                </div>

                <!-- Desktop: Keep original large links -->
                <div class="hidden lg:block mb-10">
                  <div class="space-y-6">
                    <template v-for="(item, index) in primaryLinks" :key="'desktop-' + item.name">
                      <NuxtLink
                        v-if="item.href"
                        :to="item.href"
                        class="block group animate-slide-up"
                        :style="{ animationDelay: `${index * 50}ms` }"
                        @click="closeMenu"
                      >
                        <span class="font-display font-bold text-5xl uppercase tracking-tighter text-on-surface hover:text-brand transition-colors duration-200">
                          {{ item.name }}
                        </span>
                      </NuxtLink>
                    </template>
                  </div>
                </div>

                <!-- Desktop: Divider -->
                <div class="hidden lg:block w-full h-px bg-outline/10 mb-10"></div>

                <!-- Desktop: Explore Links -->
                <div class="hidden lg:block">
                  <div class="flex flex-wrap gap-x-4 gap-y-2">
                    <NuxtLink
                      v-for="(link, index) in exploreLinks"
                      :key="link.name"
                      :to="link.href"
                      class="inline-flex px-0 py-1 text-sm font-medium text-on-surface-dim hover:text-brand transition-colors animate-slide-up"
                      :style="{ animationDelay: `${(index + primaryLinks.length) * 30}ms` }"
                      @click="closeMenu"
                    >
                      {{ link.name }}
                    </NuxtLink>
                  </div>
                </div>

                <!-- Footer Legal (Desktop) -->
                <div class="hidden lg:flex items-center gap-6 mt-auto pt-12 border-t border-outline/5 text-xs text-on-surface-dim/50">
                  <NuxtLink to="/integritetspolicy" class="hover:text-on-surface-dim transition-colors" @click="closeMenu">Integritetspolicy</NuxtLink>
                  <NuxtLink to="/villkor" class="hover:text-on-surface-dim transition-colors" @click="closeMenu">Villkor</NuxtLink>
                  <span class="ml-auto">© 2025 Core Gym Club</span>
                </div>

              </div>

            </div>
          </div>

          <!-- UTBUD VIEW -->
          <div v-else-if="currentView === 'utbud'" class="absolute inset-0 h-full flex flex-col bg-brand-warm lg:bg-surface overflow-hidden">
            <!-- Header with back button -->
            <div class="utbud-header flex items-center z-10 flex-shrink-0">
              <button
                @click="closeUtbud"
                class="w-14 h-14 flex items-center justify-center rounded-full text-black lg:text-on-surface hover:bg-black/10 lg:hover:bg-surface-container transition-colors active:scale-95"
              >
                <svg class="w-7 h-7" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 19l-7-7 7-7" />
                </svg>
              </button>
            </div>

            <!-- Large title -->
            <div class="px-8 pt-4 lg:hidden">
              <h2 class="font-display font-bold text-5xl tracking-tight text-black">Vårt utbud</h2>
            </div>

            <!-- Utbud content -->
            <div class="flex-1 overflow-y-auto px-6 py-6">
              <div class="flex flex-wrap gap-3">
                <NuxtLink
                  v-for="(link, index) in exploreLinks"
                  :key="link.name"
                  :to="link.href"
                  class="px-5 py-3 rounded-full bg-black/15 lg:bg-surface-container text-black lg:text-on-surface text-base font-medium active:bg-black/25 lg:active:bg-surface-dim active:scale-95 transition-all animate-slide-up"
                  :style="{ animationDelay: `${index * 40}ms` }"
                  @click="closeMenu"
                >
                  {{ link.name }}
                </NuxtLink>
              </div>
            </div>
          </div>

        </Transition>

      </div>
    </Transition>
  </Teleport>
</template>

<style scoped>
/* Menu Overlay - Solid background (no transparency) */
/* On desktop, use light surface color; on mobile, Tailwind bg-brand handles it */
@media (min-width: 1024px) {
  .menu-overlay {
    background-color: #fcfcfc;
    background: #fcfcfc;
  }
}

/* Ensure content respects safe area on iOS */
.pt-top-safe {
  padding-top: max(1.5rem, env(safe-area-inset-top) + 1rem);
}
.pb-32 {
  padding-bottom: max(8rem, env(safe-area-inset-bottom) + 2rem);
}
.pb-safe {
  padding-bottom: env(safe-area-inset-bottom);
}

/* Chat header with safe area */
.chat-header {
  padding-top: max(1rem, env(safe-area-inset-top) + 0.5rem);
  padding-bottom: 0.75rem;
  padding-left: 0.5rem;
  padding-right: 1rem;
}

/* Utbud header with safe area */
.utbud-header {
  padding-top: max(1rem, env(safe-area-inset-top) + 0.5rem);
  padding-bottom: 0.75rem;
  padding-left: 0.5rem;
  padding-right: 1rem;
}

/* Hand-drawn Chat Bubble Button */
.bubble-btn {
  cursor: pointer;
  -webkit-tap-highlight-color: transparent;
}

.bubble-btn:active {
  transform: scale(0.95);
  transition: transform 0.1s ease;
}

/* Bubble entrance animation */
.bubble-enter-active {
  animation: bubblePop 0.4s cubic-bezier(0.34, 1.56, 0.64, 1) forwards;
}

.bubble-enter-from {
  opacity: 0;
  transform: scale(0) rotate(-10deg);
}

.bubble-leave-active {
  animation: bubbleOut 0.2s ease-in forwards;
}

.bubble-leave-to {
  opacity: 0;
  transform: scale(0);
}

@keyframes bubblePop {
  0% {
    opacity: 0;
    transform: scale(0) rotate(-10deg);
  }
  60% {
    transform: scale(1.1) rotate(2deg);
  }
  100% {
    opacity: 1;
    transform: scale(1) rotate(0deg);
  }
}

@keyframes bubbleOut {
  0% {
    opacity: 1;
    transform: scale(1);
  }
  100% {
    opacity: 0;
    transform: scale(0);
  }
}

/* Logo Button (FAB) */
.logo-btn {
  position: fixed;
  bottom: 24px;
  left: 50%;
  z-index: 51;
  border-radius: 9999px;
  padding: 16px 24px;
  cursor: pointer;
  background: linear-gradient(
    135deg,
    rgba(255, 255, 255, 0.4) 0%,
    rgba(255, 255, 255, 0.1) 50%,
    rgba(255, 255, 255, 0.25) 100%
  );
  backdrop-filter: blur(40px) saturate(200%) brightness(1.1);
  -webkit-backdrop-filter: blur(40px) saturate(200%) brightness(1.1);
  border: 1px solid rgba(255, 255, 255, 0.35);
  box-shadow:
    0 8px 32px rgba(0, 0, 0, 0.1),
    0 2px 8px rgba(0, 0, 0, 0.05),
    inset 0 1px 1px rgba(255, 255, 255, 0.6),
    inset 0 -1px 1px rgba(0, 0, 0, 0.05);
  will-change: transform, opacity, background-color;
}

.logo-btn.is-hidden {
  transform: translateX(-50%) translateY(120px) scale(0.8);
  opacity: 0;
  pointer-events: none;
  transition: all 0.4s cubic-bezier(0.4, 0, 1, 1);
}

.logo-btn.is-visible {
  transform: translateX(-50%) translateY(0) scale(1);
  opacity: 1;
  transition: transform 0.4s cubic-bezier(0.25, 0.46, 0.45, 0.94), opacity 0.4s ease, background 0.3s ease, box-shadow 0.3s ease;
}

.logo-btn.is-visible:hover {
  transform: translateX(-50%) translateY(-4px) scale(1.02);
  box-shadow: 0 12px 40px rgba(0, 0, 0, 0.15), 0 4px 12px rgba(0, 0, 0, 0.08);
}

.logo-btn.is-visible:active {
  transform: translateX(-50%) translateY(2px) scale(0.92);
  transition: transform 0.08s cubic-bezier(0.4, 0, 0.2, 1);
}

.logo-btn.is-visible:not(:active) {
  transition: transform 0.5s cubic-bezier(0.34, 1.56, 0.64, 1), opacity 0.4s ease, background 0.3s ease, box-shadow 0.3s ease;
}

.logo-btn.is-menu-open {
  background: #FA2D48;
  backdrop-filter: none;
  -webkit-backdrop-filter: none;
  border: 2px dotted rgba(0, 0, 0, 0.15);
  color: white;
  transform: translateX(-50%) translateY(0) scale(1);
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.15), 0 2px 8px rgba(0, 0, 0, 0.1);
  transition: border-radius 0.2s cubic-bezier(0.34, 1.56, 0.64, 1), transform 0.2s ease, background 0.3s ease;
}

.logo-btn.is-menu-open:active {
  border-radius: 24px;
  transform: translateX(-50%) translateY(2px) scale(0.95);
  background: #E8253D;
}

.logo-btn.on-dark {
  background: linear-gradient(135deg, rgba(60, 60, 60, 0.5) 0%, rgba(30, 30, 30, 0.3) 50%, rgba(50, 50, 50, 0.4) 100%);
  border-color: rgba(255, 255, 255, 0.1);
  box-shadow: 0 8px 32px rgba(0, 0, 0, 0.3), 0 2px 8px rgba(0, 0, 0, 0.2), inset 0 1px 1px rgba(255, 255, 255, 0.1), inset 0 -1px 1px rgba(0, 0, 0, 0.2);
}

.logo-btn.is-scrolling-down {
  transform: translateX(-50%) translateY(0) scale(0.85);
  background: linear-gradient(135deg, rgba(255, 255, 255, 0.2) 0%, rgba(255, 255, 255, 0.05) 50%, rgba(255, 255, 255, 0.15) 100%);
  border-color: rgba(255, 255, 255, 0.15);
  box-shadow: 0 4px 16px rgba(0, 0, 0, 0.06), inset 0 1px 1px rgba(255, 255, 255, 0.3);
  backdrop-filter: blur(24px) saturate(150%) brightness(1.05);
  -webkit-backdrop-filter: blur(24px) saturate(150%) brightness(1.05);
}

.logo-btn.is-scrolling-down.on-dark {
  background: linear-gradient(135deg, rgba(40, 40, 40, 0.3) 0%, rgba(20, 20, 20, 0.15) 50%, rgba(35, 35, 35, 0.25) 100%);
  border-color: rgba(255, 255, 255, 0.05);
  box-shadow: 0 4px 16px rgba(0, 0, 0, 0.15), inset 0 1px 1px rgba(255, 255, 255, 0.05);
}

/* Fingerprint red color filter + thumbprint shape */
.fingerprint-red {
  filter: invert(27%) sepia(89%) saturate(1789%) hue-rotate(341deg) brightness(87%) contrast(97%);
  transform: scaleX(1.1);
}


/* RESPONSIVE MENU TRANSITIONS */
/* Default (Mobile): Slide Up / Down */
.responsive-menu-enter-active {
  transition: all 0.5s cubic-bezier(0.16, 1, 0.3, 1);
}
.responsive-menu-leave-active {
  transition: all 0.3s cubic-bezier(0.16, 1, 0.3, 1);
}
.responsive-menu-enter-from {
  opacity: 0;
  transform: translateY(100%);
}
.responsive-menu-leave-to {
  opacity: 0;
  transform: translateY(100%);
}

@media (min-width: 1024px) {
  /* Desktop: Slide Right (from Right edge) */
  .responsive-menu-enter-from {
    opacity: 0;
    transform: translateX(100%);
  }
  .responsive-menu-leave-to {
    opacity: 0;
    transform: translateX(100%);
  }
}

/* INNER CONTENT SLIDE ANIMATIONS */
.slide-left-enter-active,
.slide-left-leave-active,
.slide-right-enter-active,
.slide-right-leave-active {
  transition: all 0.4s cubic-bezier(0.16, 1, 0.3, 1);
}

.slide-left-enter-from {
  transform: translateX(100%);
}
.slide-left-leave-to {
  transform: translateX(-30%);
  opacity: 0;
}

.slide-right-enter-from {
  transform: translateX(-30%);
  opacity: 0;
}
.slide-right-leave-to {
  transform: translateX(100%);
}

</style>