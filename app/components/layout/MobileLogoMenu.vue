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

// Theme color for mobile menu (dark theme)
const brandColor = '#0a0a0a'
const defaultColor = '#ffffff'
const isMobile = ref(false)

// Check if mobile on mount + detect Samsung Internet
onMounted(() => {
  isMobile.value = window.innerWidth < 1024
  window.addEventListener('resize', () => {
    isMobile.value = window.innerWidth < 1024
  })

  // Detect Samsung Internet (has bottom toolbar that overlaps)
  if (navigator.userAgent.includes('SamsungBrowser')) {
    document.body.classList.add('samsung-browser')
  }
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

// Gym submenu removed - gyms visible on homepage

// Navigation structure - Simplified, no "Våra gym" (visible on homepage)
const primaryLinks = [
  { name: 'Schema', href: '/schema' },
  { name: 'Vårt utbud', href: null, action: 'utbud' },
  { name: 'Om oss', href: '/om-oss' },
  { name: 'Kontakt', href: '/kontakt' },
  { name: 'Bli medlem', href: '/bli-medlem' },
  { name: 'Logga in', href: '/logga-in' },
]

// Grouped offerings for better organization
const offeringCategories = [
  {
    title: 'Gruppträning',
    links: [
      { name: 'Schema', href: '/schema' },
      { name: 'Yoga', href: '/yoga' },
      { name: 'Mammaträning', href: '/mammatraning' },
    ]
  },
  {
    title: 'Specialiserat',
    links: [
      { name: 'EGYM', href: '/egym' },
      { name: 'Personlig Träning', href: '/pt' },
      { name: 'InBody', href: '/inbody' },
      { name: 'Weight Trainer', href: '/weight-trainer' },
    ]
  },
  {
    title: 'Ungdom & Mat',
    links: [
      { name: 'Ungdomsträning', href: '/ungdomstraning' },
      { name: 'Barndans', href: '/barndans' },
      { name: 'Foodbox', href: '/foodbox' },
    ]
  }
]

// Flat list for desktop
const exploreLinks = offeringCategories.flatMap(cat => cat.links)

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
  <!-- SVG Filter for Liquid Glass Refraction (Chrome only) -->
  <svg class="liquid-glass-svg">
    <defs>
      <filter id="mobile-liquid-glass" x="-50%" y="-50%" width="200%" height="200%" color-interpolation-filters="sRGB">
        <feTurbulence type="fractalNoise" baseFrequency="0.012 0.012" numOctaves="2" seed="8" result="noise" />
        <feGaussianBlur in="noise" stdDeviation="1.5" result="softNoise" />
        <feDisplacementMap in="SourceGraphic" in2="softNoise" scale="6" xChannelSelector="R" yChannelSelector="G" />
      </filter>
    </defs>
  </svg>

  <!-- FAB Background (liquid glass) - Fades out when menu opens -->
  <Transition name="fab-fade">
    <button
      v-if="!isHiddenOnRoute && !isMenuOpen"
      class="fab-glass lg:hidden"
      :class="[
        scrolledPastHero ? 'is-visible' : 'is-hidden',
        {
          'on-dark': isOnDark,
          'is-scrolling-down': isScrollingDown,
          'is-scrolling-up': isScrollingUp
        }
      ]"
      @click="toggleMenu"
      aria-label="Öppna meny"
    >
      <!-- Specular highlight overlay -->
      <div class="btn-specular" :class="{ 'specular-dark': isOnDark }"></div>

      <!-- Fingerprint overlay (shows when scrolling up) -->
      <div
        class="fingerprint-container absolute inset-0 flex items-center justify-center pointer-events-none overflow-hidden"
        :class="isScrollingUp ? 'fingerprint-active' : 'fingerprint-hidden'"
      >
        <img
          src="/images/finger-print.svg"
          alt=""
          class="fingerprint-img"
        />
      </div>
    </button>
  </Transition>

  <!-- Floating Logo - Stays on top of everything, acts as menu toggle -->
  <button
    v-if="!isHiddenOnRoute"
    class="floating-logo lg:hidden"
    :class="[
      scrolledPastHero || isMenuOpen ? 'is-visible' : 'is-hidden',
      {
        'is-scrolling-down': isScrollingDown && !isMenuOpen,
        'is-menu-open': isMenuOpen
      }
    ]"
    @click="toggleMenu"
    :aria-label="isMenuOpen ? 'Stäng meny' : 'Öppna meny'"
  >
    <img
      :src="isMenuOpen ? '/images/logo.svg' : (isOnDark ? '/images/logo.svg' : '/images/logo-dark.svg')"
      alt="Core Gym Club"
      class="h-full w-auto transition-all duration-300"
      :class="isScrollingUp && !isMenuOpen ? 'opacity-50' : 'opacity-100'"
    />
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
               inset-0 lg:left-auto lg:right-0 lg:w-[600px] lg:h-full bg-[#0a0a0a] lg:bg-surface"
      >
        
        <!-- Sliding Container -->
        <Transition :name="slideDirection">
          
          <!-- MENU VIEW (handles both menu and utbud states) -->
          <div v-if="currentView === 'menu' || currentView === 'utbud'" class="absolute inset-0 flex flex-col h-full overflow-hidden bg-transparent">
            
            <!-- Header: Close button (right only) -->
            <div class="absolute z-30 menu-header-position flex items-center justify-end w-full px-4 lg:px-8">
              <button
                @click="closeMenu"
                class="w-10 h-10 flex items-center justify-center rounded-full
                       bg-[#FA2D48]/10 lg:bg-surface-container/50
                       hover:bg-[#FA2D48]/20 lg:hover:bg-surface-container
                       active:scale-95 transition-all group"
              >
                <svg class="w-5 h-5 lg:w-6 lg:h-6 text-[#FA2D48] lg:text-on-surface transition-transform duration-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>

            <!-- Scrollable Content -->
            <div class="flex-1 overflow-y-auto pt-top-safe lg:p-0 relative scrollbar-hide">

              <!-- Layout: Vertical Stack -->
              <div class="min-h-full flex flex-col px-8 lg:px-16 lg:py-16">

                <!-- Mobile: Two-tone menu (black + red) -->
                <!-- Positioned with top padding for visual balance -->
                <div class="lg:hidden flex-1 flex flex-col items-center justify-center pb-28 relative">

                  <!-- All content centered -->
                  <div class="w-full flex flex-col items-center gap-5">

                    <!-- TOP: Slogan -->
                    <p class="text-[10px] tracking-[0.35em] text-[#FA2D48]/40 animate-slide-up" style="animation-delay: 0ms">
                      STARKARE ÄN DU TROR
                    </p>

                    <!-- CENTER: Main navigation -->
                    <div class="relative w-full">
                      <!-- MENU - dims and blurs when utbud is shown -->
                      <nav
                        class="w-full text-center space-y-1 transition-all duration-300"
                        :class="currentView === 'utbud' ? 'opacity-15 pointer-events-none blur-sm' : 'opacity-100 blur-0'"
                      >
                        <NuxtLink
                          to="/om-oss"
                          class="block py-0.5 animate-slide-up"
                          style="animation-delay: 50ms"
                          @click="closeMenu"
                        >
                          <span class="font-display font-black text-[2.75rem] tracking-tight text-[#FA2D48]">OM CORE</span>
                        </NuxtLink>

                        <NuxtLink
                          to="/kontakt"
                          class="block py-0.5 animate-slide-up"
                          style="animation-delay: 80ms"
                          @click="closeMenu"
                        >
                          <span class="font-display font-black text-[2.75rem] tracking-tight text-[#FA2D48]">KONTAKT</span>
                        </NuxtLink>

                        <NuxtLink
                          to="/schema"
                          class="block py-0.5 animate-slide-up"
                          style="animation-delay: 110ms"
                          @click="closeMenu"
                        >
                          <span class="font-display font-black text-[2.75rem] tracking-tight text-[#FA2D48]">SCHEMA</span>
                        </NuxtLink>

                        <!-- GÅ MED | LOGGA IN -->
                        <div class="flex items-center justify-center gap-5 pt-6 animate-slide-up" style="animation-delay: 140ms">
                          <NuxtLink
                            to="/bli-medlem"
                            class="font-display font-black text-[1.75rem] tracking-tight text-[#FA2D48]"
                            @click="closeMenu"
                          >
                            GÅ MED
                          </NuxtLink>
                          <span class="text-[#FA2D48]/20 text-2xl">|</span>
                          <NuxtLink
                            to="/logga-in"
                            class="font-display font-bold text-[1.75rem] tracking-tight text-[#FA2D48]/50"
                            @click="closeMenu"
                          >
                            LOGGA IN
                          </NuxtLink>
                        </div>
                      </nav>

                      <!-- UTBUD - Fades in over dimmed menu -->
                      <Transition name="fade">
                        <div v-if="currentView === 'utbud'" class="absolute inset-0 flex items-center justify-center px-3">
                          <div class="offerings-dynamic">
                            <NuxtLink to="/yoga" class="offering-pill" @click="closeMenu">YOGA</NuxtLink>
                            <NuxtLink to="/pt" class="offering-pill offering-lg" @click="closeMenu">PT</NuxtLink>
                            <NuxtLink to="/egym" class="offering-pill" @click="closeMenu">EGYM</NuxtLink>
                            <NuxtLink to="/mammatraning" class="offering-pill" @click="closeMenu">MAMMA</NuxtLink>
                            <NuxtLink to="/inbody" class="offering-pill" @click="closeMenu">INBODY</NuxtLink>
                            <NuxtLink to="/barndans" class="offering-pill" @click="closeMenu">BARNDANS</NuxtLink>
                            <NuxtLink to="/ungdomstraning" class="offering-pill" @click="closeMenu">UNGDOM</NuxtLink>
                            <NuxtLink to="/foodbox" class="offering-pill" @click="closeMenu">FOODBOX</NuxtLink>
                            <NuxtLink to="/weight-trainer" class="offering-pill" @click="closeMenu">WEIGHTS</NuxtLink>
                          </div>
                        </div>
                      </Transition>
                    </div>

                    <!-- UTBUD button -->
                    <button
                      @click="currentView === 'utbud' ? closeUtbud() : openUtbud()"
                      class="utbud-badge animate-slide-up mt-4"
                      :class="{ 'is-active': currentView === 'utbud' }"
                      style="animation-delay: 180ms"
                    >
                      <span>{{ currentView === 'utbud' ? '✕' : '+' }}</span>
                      UTBUD
                    </button>

                    <!-- Gym info - only visible when utbud is open -->
                    <Transition name="fade">
                      <p v-if="currentView === 'utbud'" class="text-center text-[11px] tracking-[0.15em] text-[#FA2D48]/60 animate-slide-up leading-relaxed">
                        4 GYM I HANINGE (SNART 5!)
                      </p>
                    </Transition>

                  </div>

                </div>

                <!-- Desktop: Navigation now in header, this menu is mobile-only -->
                <!-- Keep explore links for reference on desktop if menu is opened -->
                <div class="hidden lg:block">
                  <p class="text-on-surface-dim text-sm mb-6">Utforska vårt utbud:</p>
                  <div class="flex flex-wrap gap-3">
                    <NuxtLink
                      v-for="(link, index) in exploreLinks"
                      :key="link.name"
                      :to="link.href"
                      class="px-4 py-2 rounded-full bg-surface-container text-on-surface text-sm font-medium hover:bg-surface-dim transition-colors animate-slide-up"
                      :style="{ animationDelay: `${index * 30}ms` }"
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

/* Menu header position with safe area */
.menu-header-position {
  top: max(2rem, env(safe-area-inset-top) + 1.25rem);
  left: 0;
  right: 0;
}

@media (min-width: 1024px) {
  .menu-header-position {
    top: 2rem;
  }
}

/* Menu bottom logo */
.menu-bottom-logo {
  position: absolute;
  bottom: 0;
  left: 0;
  right: 0;
  padding: 1.5rem;
  padding-bottom: max(1.5rem, env(safe-area-inset-bottom) + 1rem);
  display: flex;
  justify-content: center;
  cursor: pointer;
  -webkit-tap-highlight-color: transparent;
}

/* Grid Menu */
.menu-grid {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 1px;
  background: rgba(0, 0, 0, 0.08);
  border: 1px solid rgba(0, 0, 0, 0.08);
  border-radius: 2px;
}

.menu-grid-item {
  position: relative;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 1.75rem 1rem;
  background: var(--color-brand-warm, #FAE8D4);
  cursor: pointer;
  -webkit-tap-highlight-color: transparent;
  transition: background 0.15s ease;
}

.menu-grid-item:active {
  background: rgba(0, 0, 0, 0.05);
}

.menu-grid-text {
  font-family: var(--font-display);
  font-weight: 700;
  font-size: 1.125rem;
  letter-spacing: -0.01em;
  color: #000;
  text-transform: uppercase;
  letter-spacing: 0.05em;
}

.menu-grid-cta {
  background: #000;
}

.menu-grid-cta:active {
  background: #1a1a1a;
}

.menu-grid-text-cta {
  font-family: var(--font-display);
  font-weight: 700;
  font-size: 1.125rem;
  color: #fff;
  text-transform: uppercase;
  letter-spacing: 0.05em;
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

/* Hidden SVG for filters */
.liquid-glass-svg {
  position: absolute;
  width: 0;
  height: 0;
  pointer-events: none;
}

/* FAB Glass Background - Premium liquid glass effect */
.fab-glass {
  position: fixed;
  bottom: 20px;
  left: 50%;
  z-index: 51;
  border-radius: 9999px;
  width: 76px;
  height: 68px;
  cursor: pointer;
  overflow: hidden;
  /* Liquid glass gradient */
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
  will-change: transform, opacity;
  transition: all 0.35s cubic-bezier(0.34, 1.56, 0.64, 1);
}

/* Specular highlight overlay */
.btn-specular {
  position: absolute;
  top: 0;
  left: 10%;
  right: 10%;
  height: 50%;
  background: linear-gradient(
    180deg,
    rgba(255, 255, 255, 0.4) 0%,
    rgba(255, 255, 255, 0.1) 50%,
    transparent 100%
  );
  border-radius: 9999px 9999px 50% 50%;
  pointer-events: none;
}

.btn-specular.specular-dark {
  background: linear-gradient(
    180deg,
    rgba(255, 255, 255, 0.15) 0%,
    rgba(255, 255, 255, 0.03) 50%,
    transparent 100%
  );
}

.fab-glass.is-hidden {
  transform: translateX(-50%) translateY(100px) scale(0.9);
  opacity: 0;
  pointer-events: none;
  transition: all 0.3s ease-out;
}

.fab-glass.is-visible {
  transform: translateX(-50%) translateY(0) scale(1);
  opacity: 1;
}

.fab-glass.is-visible:active {
  transform: translateX(-50%) scale(0.95);
  transition: transform 0.1s ease;
}

/* On dark backgrounds */
.fab-glass.on-dark {
  background: linear-gradient(
    135deg,
    rgba(60, 60, 60, 0.5) 0%,
    rgba(30, 30, 30, 0.3) 50%,
    rgba(50, 50, 50, 0.4) 100%
  );
  border-color: rgba(255, 255, 255, 0.1);
  box-shadow:
    0 8px 32px rgba(0, 0, 0, 0.3),
    0 2px 8px rgba(0, 0, 0, 0.2),
    inset 0 1px 1px rgba(255, 255, 255, 0.1),
    inset 0 -1px 1px rgba(0, 0, 0, 0.2);
}

/* Scrolling Down - shrink and soften */
.fab-glass.is-scrolling-down {
  transform: translateX(-50%) scale(0.85);
  background: linear-gradient(
    135deg,
    rgba(255, 255, 255, 0.2) 0%,
    rgba(255, 255, 255, 0.05) 50%,
    rgba(255, 255, 255, 0.15) 100%
  );
  border-color: rgba(255, 255, 255, 0.15);
  box-shadow: 0 4px 16px rgba(0, 0, 0, 0.06), inset 0 1px 1px rgba(255, 255, 255, 0.3);
  backdrop-filter: blur(24px) saturate(150%) brightness(1.05);
  -webkit-backdrop-filter: blur(24px) saturate(150%) brightness(1.05);
}

.fab-glass.is-scrolling-down.on-dark {
  background: linear-gradient(
    135deg,
    rgba(40, 40, 40, 0.3) 0%,
    rgba(20, 20, 20, 0.15) 50%,
    rgba(35, 35, 35, 0.25) 100%
  );
  border-color: rgba(255, 255, 255, 0.05);
  box-shadow: 0 4px 16px rgba(0, 0, 0, 0.15), inset 0 1px 1px rgba(255, 255, 255, 0.05);
}

/* Scrolling Up - normal */
.fab-glass.is-scrolling-up {
  transform: translateX(-50%) scale(1);
}

/* Fingerprint overlay */
.fingerprint-container {
  border-radius: 9999px;
  transition: opacity 0.5s ease;
}

.fingerprint-container.fingerprint-hidden {
  opacity: 0;
}

.fingerprint-container.fingerprint-active {
  opacity: 1;
}

.fingerprint-img {
  width: 95%;
  height: 95%;
  object-fit: contain;
  opacity: 0.25;
  /* Red color filter */
  filter: invert(27%) sepia(89%) saturate(1789%) hue-rotate(341deg) brightness(87%) contrast(97%);
  transform: scaleX(1.1);
  animation: fingerprint-pulse 2s ease-in-out infinite;
}

@keyframes fingerprint-pulse {
  0%, 100% {
    opacity: 0.2;
  }
  50% {
    opacity: 0.35;
  }
}

/* Floating Logo - Stays on top of everything */
.floating-logo {
  position: fixed;
  /* Center in FAB: FAB is 76x68 at bottom: 20px */
  bottom: 38px;
  left: 50%;
  transform: translateX(-50%);
  z-index: 60;
  height: 32px;
  padding: 0;
  background: none;
  border: none;
  cursor: pointer;
  -webkit-tap-highlight-color: transparent;
  transition: all 0.4s cubic-bezier(0.25, 0.46, 0.45, 0.94);
}

.floating-logo.is-hidden {
  opacity: 0;
  transform: translateX(-50%) translateY(30px);
  pointer-events: none;
}

.floating-logo.is-visible {
  opacity: 1;
  transform: translateX(-50%);
}

.floating-logo.is-scrolling-down {
  transform: translateX(-50%) scale(0.85);
  opacity: 0.5;
}

.floating-logo.is-menu-open {
  /* Larger logo at bottom of menu */
  bottom: max(36px, env(safe-area-inset-bottom) + 20px);
  height: 56px;
  opacity: 0.6;
}

/* Red color filter for logo in menu */
.floating-logo.is-menu-open img {
  filter: brightness(0) saturate(100%) invert(26%) sepia(89%) saturate(2137%) hue-rotate(340deg) brightness(97%) contrast(101%);
}

.floating-logo:active {
  transform: translateX(-50%) scale(0.95);
}

/* FAB fade transition */
.fab-fade-enter-active {
  transition: all 0.35s ease-out;
}

.fab-fade-leave-active {
  transition: all 0.25s ease-in;
}

.fab-fade-enter-from {
  opacity: 0;
  transform: translateX(-50%) translateY(20px);
}

.fab-fade-leave-to {
  opacity: 0;
  transform: translateX(-50%) translateY(10px);
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

/* Samsung Internet - has bottom toolbar (~56-64px) that overlaps fixed elements */
:global(body.samsung-browser) .fab-glass {
  bottom: 80px;
}

:global(body.samsung-browser) .floating-logo {
  bottom: 96px; /* Center in FAB: 80 + 36 = 116, minus half logo = 96 */
}

:global(body.samsung-browser) .floating-logo.is-menu-open {
  bottom: max(100px, env(safe-area-inset-bottom) + 84px);
}

/* Quick links in dark menu */
.menu-quick-link {
  font-size: 10px;
  letter-spacing: 0.15em;
  color: rgba(255, 255, 255, 0.4);
  transition: color 0.2s ease;
  padding: 4px 0;
  background: none;
  border: none;
  cursor: pointer;
  -webkit-tap-highlight-color: transparent;
}

.menu-quick-link:hover,
.menu-quick-link:active {
  color: rgba(255, 255, 255, 0.8);
}

/* Quick links in two-tone RED theme */
.menu-quick-link-red {
  font-size: 10px;
  letter-spacing: 0.15em;
  color: rgba(250, 45, 72, 0.5); /* #FA2D48 at 50% */
  transition: color 0.2s ease;
  padding: 4px 0;
  background: none;
  border: none;
  cursor: pointer;
  -webkit-tap-highlight-color: transparent;
}

.menu-quick-link-red:hover,
.menu-quick-link-red:active {
  color: rgba(250, 45, 72, 0.9); /* #FA2D48 at 90% */
}

/* Pill buttons for quick links */
.menu-pill-red {
  display: inline-block;
  padding: 12px 20px;
  border-radius: 12px;
  background: rgba(250, 45, 72, 0.08);
  border: 1px solid rgba(250, 45, 72, 0.2);
  color: #FA2D48;
  font-size: 13px;
  font-weight: 600;
  letter-spacing: 0.02em;
  transition: all 0.2s ease;
  -webkit-tap-highlight-color: transparent;
}

.menu-pill-red:hover,
.menu-pill-red:active {
  background: rgba(250, 45, 72, 0.15);
  border-color: rgba(250, 45, 72, 0.35);
}

/* Horizontal scrolling offerings - edge to edge */
.offerings-row {
  -webkit-overflow-scrolling: touch;
  scroll-snap-type: x proximity;
  padding: 0; /* No horizontal padding - edge to edge */
}

.offerings-row::-webkit-scrollbar {
  display: none;
}

.offerings-row > *:first-child {
  margin-left: 0;
}

.offerings-row > *:last-child {
  margin-right: 16px;
}

.offerings-row > * {
  scroll-snap-align: start;
  flex-shrink: 0;
}

/* Menu/Utbud swap transitions */
.menu-swap-enter-active,
.menu-swap-leave-active {
  transition: all 0.35s cubic-bezier(0.16, 1, 0.3, 1);
}

.menu-swap-enter-from {
  opacity: 0;
  transform: translateX(-30px);
}

.menu-swap-leave-to {
  opacity: 0;
  transform: translateX(-30px);
}

.utbud-swap-enter-active,
.utbud-swap-leave-active {
  transition: all 0.35s cubic-bezier(0.16, 1, 0.3, 1);
}

.utbud-swap-enter-from {
  opacity: 0;
  transform: translateX(30px);
}

.utbud-swap-leave-to {
  opacity: 0;
  transform: translateX(30px);
}

/* Simple fade transition */
.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.3s ease;
}

.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}

/* Dynamic offerings layout */
.offerings-dynamic {
  display: flex;
  flex-wrap: wrap;
  justify-content: center;
  gap: 10px 12px;
  max-width: 100%;
}

/* Offering pills - ALL CAPS with blur background */
.offering-pill {
  padding: 12px 20px;
  min-width: 72px;
  border-radius: 24px;
  background: rgba(10, 10, 10, 0.85);
  backdrop-filter: blur(12px);
  -webkit-backdrop-filter: blur(12px);
  border: 1px solid rgba(250, 45, 72, 0.2);
  color: #FA2D48;
  font-size: 12px;
  font-weight: 700;
  letter-spacing: 0.08em;
  text-align: center;
  transition: all 0.2s ease;
  -webkit-tap-highlight-color: transparent;
}

.offering-pill:active {
  background: rgba(250, 45, 72, 0.15);
  transform: scale(0.96);
}

/* Larger pill for short important words like PT */
.offering-pill.offering-lg {
  padding: 14px 26px;
  font-size: 14px;
  font-weight: 800;
}


/* Flowing menu links */
.menu-flow {
  line-height: 2.2;
}

.menu-flow-link {
  font-family: var(--font-display);
  font-weight: 800;
  font-size: 28px;
  letter-spacing: -0.02em;
  color: #FA2D48;
  transition: opacity 0.2s ease;
  -webkit-tap-highlight-color: transparent;
}

.menu-flow-link:active {
  opacity: 0.6;
}

.menu-flow-link.menu-flow-secondary {
  color: rgba(250, 45, 72, 0.5);
}

.menu-flow-divider {
  color: rgba(250, 45, 72, 0.2);
  font-weight: 300;
  font-size: 24px;
  margin: 0 8px;
}

/* UTBUD badge button */
.utbud-badge {
  display: inline-flex;
  align-items: center;
  gap: 8px;
  color: rgba(250, 45, 72, 0.5);
  font-size: 11px;
  font-weight: 600;
  letter-spacing: 0.15em;
  padding: 10px 20px;
  border-radius: 24px;
  background: transparent;
  border: 1px solid rgba(250, 45, 72, 0.15);
  transition: all 0.3s ease;
  -webkit-tap-highlight-color: transparent;
}

.utbud-badge span {
  font-size: 14px;
  font-weight: 400;
}

.utbud-badge:active {
  transform: scale(0.96);
}

.utbud-badge.is-active {
  color: #FA2D48;
  background: rgba(250, 45, 72, 0.1);
  border-color: rgba(250, 45, 72, 0.3);
}

</style>