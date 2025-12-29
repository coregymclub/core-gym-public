<script setup lang="ts">
// This component renders all global sheets
// Include this once in your app layout
// Wrapped in ClientOnly to prevent SSR data fetching
</script>

<template>
  <ClientOnly>
    <SheetsPTDetailSheet />
    <SheetsPTContactSheet />
    <!-- Add more global sheets here as needed -->
  </ClientOnly>
</template>
