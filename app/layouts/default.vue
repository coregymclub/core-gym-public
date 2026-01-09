<script setup lang="ts">
</script>

<template>
  <div class="min-h-screen flex flex-col bg-surface overflow-x-hidden w-full max-w-full">
    <LayoutHeader />
    <main class="flex-1 w-full">
      <slot />
    </main>
    <LayoutFooter />
    <LayoutMobileLogoMenu />
    <SheetsGlobalSheets />
  </div>
</template>
