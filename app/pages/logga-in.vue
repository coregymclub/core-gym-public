<script setup lang="ts">
// Hide header/footer on this page
definePageMeta({
  layout: false
})

useHead({
  title: 'Medlemsportalen kommer snart - Core Gym Club',
  meta: [
    { name: 'description', content: 'Vår nya medlemsportal är på väg.' },
    { name: 'theme-color', content: '#1c1b1d' }
  ]
})
</script>

<template>
  <div class="h-dvh bg-[#1c1b1d] text-[#f7f1f6] flex flex-col items-center justify-between px-6 py-12 overflow-hidden">

    <!-- Top: Small text -->
    <p class="text-sm tracking-[0.25em] uppercase text-[#f7f1f6]/40 font-medium">
      Core Gym Club
    </p>

    <!-- Center: Main content -->
    <div class="text-center max-w-sm">
      <h1 class="font-display font-bold text-3xl md:text-4xl uppercase tracking-tight mb-4 leading-tight">
        Medlemsportalen<br />kommer snart
      </h1>
      <p class="text-base text-[#e5e1e3]/60 mb-8">
        Kontakta oss om du behöver hjälp.
      </p>
      <div class="flex flex-col sm:flex-row gap-3 justify-center">
        <a
          href="tel:0850924549"
          class="px-6 py-3 bg-white/10 hover:bg-white/15 rounded-full font-medium transition-all text-sm"
        >
          08-509 245 49
        </a>
        <a
          href="mailto:info@coregym.club"
          class="px-6 py-3 bg-white/10 hover:bg-white/15 rounded-full font-medium transition-all text-sm"
        >
          info@coregym.club
        </a>
      </div>
    </div>

    <!-- Bottom: Logo + back link -->
    <div class="flex flex-col items-center gap-6">
      <NuxtLink to="/" class="text-[#f7f1f6]/40 hover:text-[#f7f1f6]/70 text-sm transition-colors">
        Tillbaka
      </NuxtLink>
      <img src="/images/logo.svg" alt="Core Gym Club" class="h-14 opacity-60" />
    </div>

  </div>
</template>
