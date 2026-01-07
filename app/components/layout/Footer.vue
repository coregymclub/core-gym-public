<script setup lang="ts">
const route = useRoute()

// Hide CTA on pages where user is already converting
const hideCta = computed(() => {
  const hiddenPaths = ['/bli-medlem', '/checkout']
  return hiddenPaths.some(path => route.path.startsWith(path))
})

const exploreLinks = [
  { name: 'Våra Gym', href: '/anlaggningar' },
  { name: 'Gruppträning', href: '/schema' },
  { name: 'Personlig Träning', href: '/pt' },
  { name: 'Om oss', href: '/om-oss' },
  { name: 'Jobba hos oss', href: '/kontakt' },
]
</script>

<template>
  <footer class="relative mt-auto pt-16 md:pt-24 bg-surface-dim overflow-hidden">

    <!-- Footer Content Card -->
    <div class="bg-[#2a2a2c] text-white rounded-t-[2.5rem] md:rounded-t-[3rem] p-8 md:p-12 lg:p-16 relative overflow-hidden">
        <!-- Decor -->
        <div class="absolute top-0 right-0 w-96 h-96 bg-brand/10 rounded-full blur-[120px] -translate-y-1/2 translate-x-1/3"></div>

        <div class="container relative z-10">
          <div class="grid grid-cols-1 md:grid-cols-12 gap-12 md:gap-8 text-center md:text-left">

            <!-- Column 1: Brand & Social (Wider) -->
            <div class="md:col-span-5 flex flex-col items-center md:items-start justify-between h-full">
              <div>
                <img src="/images/logo-dark.svg" alt="Core Gym Club" class="h-10 md:h-12 w-auto mb-6 md:mb-8 invert mx-auto md:mx-0" />
                <p class="text-white/50 text-lg md:text-xl mb-8 leading-relaxed max-w-xs mx-auto md:mx-0">
                  Fyra gym i Haninge. En gemenskap.
                  Öppet 04–00 alla dagar.
                </p>
              </div>

              <div class="flex items-center justify-center md:justify-start gap-4">
                <a href="https://instagram.com/coregymclub" target="_blank" class="w-12 h-12 rounded-full bg-white/10 flex items-center justify-center hover:bg-white text-white hover:text-black transition-all">
                  <span class="sr-only">Instagram</span>
                  <svg class="w-6 h-6" fill="currentColor" viewBox="0 0 24 24"><path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z"/></svg>
                </a>
                <a href="https://facebook.com/coregymclub" target="_blank" class="w-12 h-12 rounded-full bg-white/10 flex items-center justify-center hover:bg-white text-white hover:text-black transition-all">
                  <span class="sr-only">Facebook</span>
                  <svg class="w-6 h-6" fill="currentColor" viewBox="0 0 24 24"><path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/></svg>
                </a>
              </div>
            </div>

            <!-- Column 2: Utforska -->
            <div class="md:col-span-4">
              <h4 class="text-white/40 font-bold uppercase tracking-widest text-sm mb-6">Utforska</h4>
              <ul class="space-y-4">
                <li v-for="link in exploreLinks" :key="link.name">
                  <NuxtLink :to="link.href" class="text-xl md:text-lg text-white/70 hover:text-white transition-colors font-medium">
                    {{ link.name }}
                  </NuxtLink>
                </li>
              </ul>
            </div>

            <!-- Column 3: Kontakt -->
            <div class="md:col-span-3">
              <h4 class="text-white/40 font-bold uppercase tracking-widest text-sm mb-6">Kontakt</h4>
              <ul class="space-y-4 text-white/70">
                <li><a href="mailto:info@coregym.club" class="text-xl md:text-lg hover:text-white transition-colors font-medium">info@coregym.club</a></li>
                <li><a href="tel:0850924549" class="text-xl md:text-lg hover:text-white transition-colors font-medium">08-509 245 49</a></li>
              </ul>
            </div>

          </div>

          <!-- CTA Buttons -->
          <div v-if="!hideCta" class="flex flex-col sm:flex-row justify-center items-center gap-4 mt-12 md:mt-16 pt-10 border-t border-white/10">
            <NuxtLink
              to="/bli-medlem"
              class="btn bg-white hover:bg-white/90 text-[#2a2a2c] border-none px-8 py-4 h-auto text-lg font-bold rounded-full w-full sm:w-auto"
            >
              Bli medlem nu
            </NuxtLink>
            <NuxtLink
              to="/schema"
              class="btn bg-white/10 hover:bg-white/20 text-white border-none px-8 py-4 h-auto text-lg font-bold rounded-full w-full sm:w-auto"
            >
              Se schema
            </NuxtLink>
          </div>

          <!-- Vi ses i gymmet + Bottom Line -->
          <div class="mt-12 md:mt-16 pt-8 border-t border-white/10">
            <p class="font-display font-bold text-3xl md:text-4xl lg:text-5xl text-white/20 uppercase tracking-tighter text-center mb-8">
              Vi ses i gymmet.
            </p>
            <div class="flex flex-col md:flex-row justify-between items-center gap-4 text-sm text-white/40">
              <p>&copy; {{ new Date().getFullYear() }} Core Gym Club AB</p>
              <div class="flex gap-6">
                <NuxtLink to="/integritetspolicy" class="hover:text-white transition-colors">Integritetspolicy</NuxtLink>
                <NuxtLink to="/villkor" class="hover:text-white transition-colors">Köpvillkor</NuxtLink>
              </div>
            </div>
          </div>
        </div>
      </div>
  </footer>
</template>

<style scoped>
.pb-safe-offset {
  padding-bottom: max(2rem, env(safe-area-inset-bottom));
}
</style>