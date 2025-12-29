<script setup lang="ts">
</script>

<template>
  <div class="min-h-screen flex flex-col bg-surface">
    <LayoutHeader />
    <main class="flex-1">
      <slot />
    </main>
    <LayoutFooter />
    <LayoutMobileLogoMenu />
    <SheetsGlobalSheets />
  </div>
</template>
