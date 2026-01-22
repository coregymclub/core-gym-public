<script setup lang="ts">
// Redirect /login to /logga-in
definePageMeta({
  layout: false,
  middleware: () => {
    return navigateTo('/logga-in', { redirectCode: 301 })
  }
})
</script>

<template>
  <div />
</template>
