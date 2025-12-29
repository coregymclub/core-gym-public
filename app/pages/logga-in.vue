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
  <div class="min-h-screen flex flex-col items-center justify-center bg-surface text-center px-6">
    <div class="w-12 h-12 border-4 border-brand border-t-transparent rounded-full animate-spin mb-6" />
    <h1 class="text-title mb-2">Loggar in...</h1>
    <p class="text-body text-on-surface-dim">Skickar dig till medlemsportalen</p>
  </div>
</template>
