<script setup lang="ts">
// Hide header/footer on this page
definePageMeta({
  layout: false
})

useHead({
  title: 'SOON - Core Gym Club',
  meta: [
    { name: 'description', content: 'Nya medlemsportalen kommer alldeles strax.' },
    { name: 'theme-color', content: '#1c1b1d' }
  ]
})
</script>

<template>
  <div class="h-dvh bg-[#1c1b1d] text-[#f7f1f6] flex flex-col items-center justify-between px-6 py-12 overflow-hidden relative">

    <!-- Background glow -->
    <div class="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] bg-brand/20 rounded-full blur-[150px] pointer-events-none animate-pulse" />

    <!-- Top: Small text -->
    <p class="text-sm tracking-[0.25em] uppercase text-[#f7f1f6]/40 font-medium relative z-10">
      Core Gym Club
    </p>

    <!-- Center: SOON -->
    <div class="text-center relative z-10">
      <h1 class="font-display font-black text-[6rem] sm:text-[8rem] md:text-[10rem] lg:text-[12rem] uppercase tracking-tight leading-none text-brand animate-glow">
        SOON
      </h1>
      <p class="text-lg sm:text-xl text-[#e5e1e3]/70 mt-4 font-medium">
        Nya medlemsportalen.<br class="sm:hidden" /> Alldeles strax.
      </p>
    </div>

    <!-- Bottom: Logo + contact -->
    <div class="flex flex-col items-center gap-6 relative z-10">
      <div class="flex gap-4 text-sm">
        <a href="tel:0850924549" class="text-[#f7f1f6]/40 hover:text-[#f7f1f6] transition-colors">
          Ring oss
        </a>
        <span class="text-[#f7f1f6]/20">|</span>
        <NuxtLink to="/" class="text-[#f7f1f6]/40 hover:text-[#f7f1f6] transition-colors">
          Tillbaka
        </NuxtLink>
      </div>
      <img src="/images/logo.svg" alt="Core Gym Club" class="h-16 opacity-50" />
    </div>

  </div>
</template>

<style scoped>
@keyframes glow {
  0%, 100% {
    text-shadow: 0 0 40px rgba(217, 54, 54, 0.4), 0 0 80px rgba(217, 54, 54, 0.2);
  }
  50% {
    text-shadow: 0 0 60px rgba(217, 54, 54, 0.6), 0 0 120px rgba(217, 54, 54, 0.3);
  }
}

.animate-glow {
  animation: glow 3s ease-in-out infinite;
}
</style>
