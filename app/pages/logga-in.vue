<script setup lang="ts">
// Redirect to member app - the real login lives there
definePageMeta({
  middleware: () => {
    if (import.meta.client) {
      window.location.href = 'https://member.coregym.club'
    }
  }
})

// Server-side redirect for SEO crawlers
useHead({
  meta: [
    { httpEquiv: 'refresh', content: '0; url=https://member.coregym.club' }
  ]
})
</script>

<template>
  <div class="min-h-screen flex flex-col items-center justify-center bg-[#1c1b1d] text-center px-6 pt-safe pb-safe">
    <div class="w-14 h-14 border-4 border-white/20 border-t-white rounded-full animate-spin mb-8" />
    <h1 class="font-display font-bold text-2xl md:text-3xl text-[#f7f1f6] mb-3 uppercase tracking-tight">Loggar in...</h1>
    <p class="text-lg text-[#e5e1e3]">Skickar dig till medlemsportalen</p>
  </div>
</template>
