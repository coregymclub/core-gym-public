<script setup lang="ts">
// Shared state
const isMenuOpen = useState('isMenuOpen')
const scrolledPastHero = useState('scrolledPastHero', () => false)
const route = useRoute()

// Hide nav actions on membership page
const showActions = computed(() => !route.path.startsWith('/bli-medlem'))

// Check if on homepage (for hiding logo at top)
const isHomepage = computed(() => route.path === '/')

// Check if on bli-medlem page for larger logo
const isMembershipPage = computed(() => route.path === '/bli-medlem')

// Navigation links
const navLinks = [
  { name: 'Schema', href: '/schema' },
  { name: 'Om oss', href: '/om-oss' },
  { name: 'Kontakt', href: '/kontakt' },
]

onMounted(() => {
  const handleScroll = () => {
    scrolledPastHero.value = window.scrollY > 50
  }
  window.addEventListener('scroll', handleScroll, { passive: true })
  handleScroll()
})
</script>

<template>
  <!-- SVG Filter for Liquid Glass Refraction (Chrome only) -->
  <svg style="position: absolute; width: 0; height: 0; pointer-events: none;">
    <defs>
      <filter id="liquid-glass-refract" x="-50%" y="-50%" width="200%" height="200%" color-interpolation-filters="sRGB">
        <!-- Subtle noise for organic feel -->
        <feTurbulence type="fractalNoise" baseFrequency="0.01 0.01" numOctaves="2" seed="5" result="noise" />
        <feGaussianBlur in="noise" stdDeviation="1" result="softNoise" />
        <!-- Gentle displacement for refraction -->
        <feDisplacementMap in="SourceGraphic" in2="softNoise" scale="8" xChannelSelector="R" yChannelSelector="G" result="displaced" />
        <!-- Blend back for subtlety -->
        <feBlend in="displaced" in2="SourceGraphic" mode="normal" />
      </filter>
    </defs>
  </svg>

  <!-- Desktop Header - Liquid Glass -->
  <header
    class="fixed top-0 left-0 right-0 z-30 transition-all duration-500"
    :class="[
      isMenuOpen ? 'opacity-0 pointer-events-none' : 'opacity-100'
    ]"
  >
    <!-- Desktop Navigation -->
    <nav class="hidden lg:block">
      <div class="container relative h-20">

        <!-- Center: Floating Glass Nav Pill (after scroll) -->
        <div
          class="absolute left-1/2 -translate-x-1/2 transition-all duration-500"
          :class="scrolledPastHero ? 'top-4 opacity-100 translate-y-0' : 'top-0 opacity-0 -translate-y-4 pointer-events-none'"
        >
          <div class="glass-nav-pill flex items-center gap-1 px-2 py-2">
            <!-- Logo in pill -->
            <NuxtLink to="/" class="px-3 py-1 flex items-center">
              <img
                src="/images/logo-dark.svg"
                alt="Core Gym Club"
                class="h-7 w-auto"
              />
            </NuxtLink>

            <!-- Divider after logo -->
            <div class="w-px h-5 bg-black/10 mx-1"></div>

            <NuxtLink
              v-for="link in navLinks"
              :key="link.name"
              :to="link.href"
              class="nav-link px-4 py-2 rounded-full text-sm font-medium text-on-surface/80 hover:text-on-surface hover:bg-black/5 transition-all duration-200"
              :class="{ 'bg-black/5 text-on-surface': route.path === link.href }"
            >
              {{ link.name }}
            </NuxtLink>

            <!-- Divider -->
            <div class="w-px h-5 bg-black/10 mx-1"></div>

            <!-- Logga in -->
            <a
              href="https://member.coregym.club"
              target="_blank"
              rel="noopener"
              class="px-4 py-2 rounded-full text-sm font-medium text-on-surface/70 hover:text-on-surface hover:bg-black/5 transition-all duration-200"
            >
              Logga in
            </a>

            <!-- Bli medlem in pill -->
            <NuxtLink
              v-if="showActions"
              to="/bli-medlem"
              class="px-4 py-2 rounded-full text-sm font-semibold bg-brand text-white hover:bg-brand-dark transition-all duration-200"
            >
              Bli medlem
            </NuxtLink>
          </div>
        </div>

        <!-- Top of page: Centered header (before scroll) -->
        <div
          class="absolute inset-x-0 top-6 flex items-center justify-center transition-all duration-500"
          :class="scrolledPastHero ? 'opacity-0 pointer-events-none -translate-y-4' : 'opacity-100 translate-y-0'"
        >
          <!-- Centered logo -->
          <NuxtLink to="/">
            <img
              src="/images/logo.svg"
              alt="Core Gym Club"
              class="h-12 w-auto"
            />
          </NuxtLink>

          <!-- Right side actions (absolute positioned) -->
          <div class="absolute right-6 flex items-center gap-3">
            <a
              href="https://member.coregym.club"
              target="_blank"
              rel="noopener"
              class="px-4 py-2 rounded-full text-sm font-medium text-white/70 hover:text-white transition-colors"
            >
              Logga in
            </a>
            <NuxtLink
              v-if="showActions"
              to="/bli-medlem"
              class="glass-btn-light px-5 py-2.5 rounded-full text-sm font-semibold text-white transition-all duration-300 hover:scale-105"
            >
              Bli medlem
            </NuxtLink>
          </div>
        </div>

      </div>
    </nav>

    <!-- Mobile Header (unchanged - handled by MobileLogoMenu) -->
    <nav class="lg:hidden">
      <div class="container flex items-center justify-center relative header-safe-area">
        <!-- Mobile Logo (Shown only when FAB is hidden) -->
        <div
          class="transition-all duration-300"
          :class="[
            scrolledPastHero ? 'opacity-0 pointer-events-none' : 'opacity-100',
            isMembershipPage ? 'membership-logo' : ''
          ]"
        >
          <NuxtLink to="/" class="block">
            <img
              src="/images/logo.svg"
              alt="Core Gym Club"
              class="w-auto transition-transform duration-300"
              :class="isMembershipPage ? 'h-24' : 'h-14'"
            />
          </NuxtLink>
        </div>
      </div>
    </nav>
  </header>
</template>

<style scoped>
/* Glass Nav Pill - Enhanced Liquid Glass */
.glass-nav-pill {
  position: relative;
  background: linear-gradient(
    165deg,
    rgba(255, 255, 255, 0.75) 0%,
    rgba(255, 255, 255, 0.45) 40%,
    rgba(255, 255, 255, 0.55) 70%,
    rgba(255, 255, 255, 0.65) 100%
  );
  backdrop-filter: blur(40px) saturate(200%) brightness(1.05);
  -webkit-backdrop-filter: blur(40px) saturate(200%) brightness(1.05);
  border: 1px solid;
  border-color: rgba(255, 255, 255, 0.6) rgba(255, 255, 255, 0.4) rgba(255, 255, 255, 0.3) rgba(255, 255, 255, 0.4);
  border-radius: 9999px;
  box-shadow:
    /* Outer glow */
    0 8px 32px rgba(0, 0, 0, 0.1),
    0 2px 8px rgba(0, 0, 0, 0.06),
    /* Top specular highlight */
    inset 0 1px 1px rgba(255, 255, 255, 0.9),
    /* Bottom subtle shadow */
    inset 0 -1px 2px rgba(0, 0, 0, 0.05),
    /* Inner glow for depth */
    inset 0 0 20px rgba(255, 255, 255, 0.3);
  overflow: hidden;
}

/* Specular highlight overlay */
.glass-nav-pill::before {
  content: '';
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

/* Chrome-only: SVG refraction filter */
@supports (backdrop-filter: url(#liquid-glass-refract)) {
  .glass-nav-pill {
    backdrop-filter: url(#liquid-glass-refract) blur(40px) saturate(200%) brightness(1.05);
  }
}

/* Glass button for dark/hero backgrounds */
.glass-btn-light {
  position: relative;
  background: linear-gradient(
    165deg,
    rgba(255, 255, 255, 0.3) 0%,
    rgba(255, 255, 255, 0.1) 40%,
    rgba(255, 255, 255, 0.15) 70%,
    rgba(255, 255, 255, 0.2) 100%
  );
  backdrop-filter: blur(24px) saturate(180%);
  -webkit-backdrop-filter: blur(24px) saturate(180%);
  border: 1px solid;
  border-color: rgba(255, 255, 255, 0.4) rgba(255, 255, 255, 0.25) rgba(255, 255, 255, 0.15) rgba(255, 255, 255, 0.25);
  box-shadow:
    0 4px 20px rgba(0, 0, 0, 0.15),
    0 1px 3px rgba(0, 0, 0, 0.1),
    inset 0 1px 1px rgba(255, 255, 255, 0.5),
    inset 0 -1px 1px rgba(0, 0, 0, 0.1);
  overflow: hidden;
}

.glass-btn-light::before {
  content: '';
  position: absolute;
  top: 0;
  left: 15%;
  right: 15%;
  height: 50%;
  background: linear-gradient(
    180deg,
    rgba(255, 255, 255, 0.35) 0%,
    transparent 100%
  );
  border-radius: 9999px;
  pointer-events: none;
}

.glass-btn-light:hover {
  background: linear-gradient(
    165deg,
    rgba(255, 255, 255, 0.4) 0%,
    rgba(255, 255, 255, 0.15) 40%,
    rgba(255, 255, 255, 0.2) 70%,
    rgba(255, 255, 255, 0.3) 100%
  );
  box-shadow:
    0 8px 32px rgba(0, 0, 0, 0.2),
    0 2px 4px rgba(0, 0, 0, 0.1),
    inset 0 1px 1px rgba(255, 255, 255, 0.6),
    inset 0 -1px 1px rgba(0, 0, 0, 0.08);
}

/* Mobile header safe area */
.header-safe-area {
  padding-top: max(1.5rem, calc(env(safe-area-inset-top) + 1rem));
  padding-bottom: 1rem;
}

/* Membership page logo positioning */
.membership-logo {
  position: fixed;
  top: 25%;
  left: 50%;
  transform: translateX(-50%);
}

/* Nav link active state */
.nav-link {
  position: relative;
}

/* Subtle hover effect */
.nav-link::after {
  content: '';
  position: absolute;
  bottom: 6px;
  left: 50%;
  width: 0;
  height: 2px;
  background: currentColor;
  border-radius: 1px;
  transform: translateX(-50%);
  transition: width 0.2s ease;
  opacity: 0.5;
}

.nav-link:hover::after {
  width: 20px;
}
</style>
