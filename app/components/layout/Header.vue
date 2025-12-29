<script setup lang="ts">
// Expose scroll state for MobileLogoMenu
const scrolledPastHero = useState('scrolledPastHero', () => false)
const route = useRoute()

// Hide nav on membership page - only show logo
const showNav = computed(() => !route.path.startsWith('/bli-medlem'))

const navigation = [
  { name: 'Våra gym', href: '/anlaggningar' },
  { name: 'Bli medlem', href: '/bli-medlem' },
  { name: 'Om oss', href: '/om-oss' },
]

onMounted(() => {
  const handleScroll = () => {
    scrolledPastHero.value = window.scrollY > 150
  }
  window.addEventListener('scroll', handleScroll, { passive: true })
  handleScroll()
})
</script>

<template>
  <!-- Simple Fixed Header - Transparent -->
  <header class="fixed top-0 left-0 right-0 z-50">
    <nav class="container h-24 flex items-center relative">
      <!-- Mobile Logo - Only visible before scrolling (when FAB is hidden) -->
      <NuxtLink
        to="/"
        class="lg:hidden absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 transform transition-opacity duration-300"
        :class="scrolledPastHero ? 'opacity-0 pointer-events-none' : 'opacity-100'"
      >
        <img
          src="/images/logo.svg"
          alt="Core Gym Club"
          class="h-14 w-auto drop-shadow-lg"
        />
      </NuxtLink>

      <!-- Desktop Logo - Centered -->
      <NuxtLink
        to="/"
        class="hidden lg:block absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 transform hover:scale-105 transition-transform duration-300"
      >
        <img
          src="/images/logo.svg"
          alt="Core Gym Club"
          class="h-14 w-auto drop-shadow-lg"
        />
      </NuxtLink>

      <!-- Desktop Nav (Right) - Hidden on pricing page -->
      <div v-if="showNav" class="hidden lg:flex items-center gap-8 ml-auto">
        <NuxtLink
          v-for="item in navigation"
          :key="item.name"
          :to="item.href"
          class="text-white/90 hover:text-white font-medium text-lg transition-colors drop-shadow-md"
        >
          {{ item.name }}
        </NuxtLink>
        <NuxtLink
          to="/bli-medlem"
          class="btn bg-white text-brand hover:bg-white/90 shadow-lg border-none px-6 py-2.5 min-h-0 h-auto text-base"
        >
          Bli medlem
        </NuxtLink>
      </div>
    </nav>
  </header>
</template>
