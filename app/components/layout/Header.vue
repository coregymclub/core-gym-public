<script setup lang="ts">
// Shared state
const isMenuOpen = useState('isMenuOpen')
const scrolledPastHero = useState('scrolledPastHero', () => false)
const route = useRoute()

// Hide nav actions on membership page if desired, or keep them for consistency
const showActions = computed(() => !route.path.startsWith('/bli-medlem'))

// Check if on bli-medlem page for larger logo
const isMembershipPage = computed(() => route.path === '/bli-medlem')

onMounted(() => {
  const handleScroll = () => {
    scrolledPastHero.value = window.scrollY > 50
  }
  window.addEventListener('scroll', handleScroll, { passive: true })
  handleScroll()
})
</script>

<template>
  <!-- Google Design Inspired Header -->
  <header
    class="fixed top-0 left-0 right-0 z-30 transition-all duration-500 header-safe-area"
    :class="[
      scrolledPastHero ? 'header-scrolled' : 'header-top',
      isMenuOpen ? 'opacity-0 pointer-events-none delay-0 duration-200' : 'opacity-100 delay-300'
    ]"
  >
    <nav class="container flex items-center justify-between relative h-14 lg:h-12">
      
      <!-- Center: Logo (Desktop Only) - Hidden at top, visible after scroll -->
      <div
        class="hidden lg:block absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 z-50 transition-opacity duration-300"
        :class="scrolledPastHero ? 'opacity-100' : 'opacity-0 pointer-events-none'"
      >
        <NuxtLink
          to="/"
          class="block group"
        >
          <img
            src="/images/logo-dark.svg"
            alt="Core Gym Club"
            class="h-10 lg:h-12 w-auto transition-transform duration-300 group-hover:scale-105"
          />
        </NuxtLink>
      </div>

      <!-- Mobile Logo (Shown only when FAB is hidden/not visible) -->
      <div
        class="lg:hidden absolute left-1/2 -translate-x-1/2 z-50 transition-all duration-300"
        :class="[
          scrolledPastHero ? 'opacity-0 pointer-events-none' : 'opacity-100',
          isMembershipPage ? 'membership-logo' : 'top-1/2 -translate-y-1/2'
        ]"
      >
        <NuxtLink
          to="/"
          class="block group"
        >
          <img
            src="/images/logo.svg"
            alt="Core Gym Club"
            class="w-auto transition-transform duration-300"
            :class="isMembershipPage ? 'h-24' : 'h-14'"
          />
        </NuxtLink>
      </div>

      <!-- Left: Empty for balance (or could put something here later) -->
      <div class="hidden lg:block w-24"></div>

      <!-- Right: Actions -->
      <div class="flex items-center gap-3 sm:gap-6 ml-auto">
        
        <!-- CTA Button (Desktop) - Liquid Glass -->
        <NuxtLink
          v-if="showActions"
          to="/bli-medlem"
          class="hidden lg:inline-flex items-center justify-center px-6 py-2.5 rounded-full font-display font-bold text-sm tracking-wide transition-all duration-300 backdrop-blur-xl border shadow-lg hover:scale-105"
          :class="scrolledPastHero
            ? 'bg-white/70 text-on-surface border-white/50 hover:bg-white/90'
            : 'bg-white/20 text-white border-white/30 hover:bg-white/30'"
        >
          Bli medlem
        </NuxtLink>

        <!-- Menu Button - Liquid Glass -->
        <button
          @click="isMenuOpen = true"
          class="hidden lg:flex group items-center justify-center w-12 h-12 rounded-full transition-all duration-300 backdrop-blur-xl border hover:scale-105"
          :class="scrolledPastHero
            ? 'bg-white/50 border-white/50 hover:bg-white/70'
            : 'bg-white/10 border-white/20 hover:bg-white/20'"
          aria-label="Öppna meny"
        >
          <div class="flex flex-col gap-1.5 items-end">
            <span
              class="h-0.5 rounded-full transition-all duration-300 group-hover:w-6"
              :class="[
                scrolledPastHero ? 'bg-on-surface' : 'bg-white',
                'w-6'
              ]"
            ></span>
            <span
              class="h-0.5 rounded-full transition-all duration-300 group-hover:w-6"
              :class="[
                scrolledPastHero ? 'bg-on-surface' : 'bg-white',
                'w-4'
              ]"
            ></span>
          </div>
        </button>

      </div>
    </nav>
  </header>
</template>

<style scoped>
/* Mobile header with safe area support */
.header-safe-area {
  /* Base padding that respects safe area on iOS */
  padding-top: max(1.75rem, calc(env(safe-area-inset-top) + 1rem));
  padding-bottom: 1rem;
}

/* When at top of page - more breathing room */
.header-top {
  padding-top: max(2rem, calc(env(safe-area-inset-top) + 1.25rem));
  padding-bottom: 1rem;
}

/* When scrolled - compact */
.header-scrolled {
  padding-top: max(0.75rem, calc(env(safe-area-inset-top) + 0.5rem));
  padding-bottom: 0.75rem;
}

/* Membership page logo - positioned in hero above tagline */
.membership-logo {
  position: fixed;
  top: 25%;
  left: 50%;
  transform: translateX(-50%);
}

/* Desktop overrides */
@media (min-width: 1024px) {
  .header-top {
    padding-top: 1.5rem;
    padding-bottom: 1.5rem;
  }

  .header-scrolled {
    padding-top: 0.75rem;
    padding-bottom: 0.75rem;
  }
}
</style>
