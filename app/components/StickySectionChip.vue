<script setup lang="ts">
defineProps<{
  label: string
  dark?: boolean
  color?: 'default' | 'green' | 'rose' | 'blue'
}>()
</script>

<template>
  <div class="w-full flex justify-center">
    <span
      class="chip-badge inline-block px-5 py-2.5 rounded-full text-xs font-bold tracking-widest uppercase border backdrop-blur-sm"
      :class="[
        dark
          ? 'bg-white/5 border-white/10 text-white/60 chip-badge--dark'
          : color === 'green'
            ? 'bg-[#3d7a4a]/6 border-[#3d7a4a]/12 text-[#3d6b4a]/80 chip-badge--green'
            : color === 'rose'
              ? 'bg-[#a34d5a]/6 border-[#a34d5a]/12 text-[#8b4a55]/80 chip-badge--rose'
              : color === 'blue'
                ? 'bg-white/10 border-white/20 text-white/80 chip-badge--blue'
                : 'bg-on-surface/4 border-on-surface/8 text-on-surface-dim/70 chip-badge--default'
      ]"
    >
      {{ label }}
    </span>
  </div>
</template>

<style scoped>
.chip-badge {
  box-shadow:
    inset 0 1px 2px rgba(0, 0, 0, 0.06),
    inset 0 -1px 1px rgba(255, 255, 255, 0.1),
    0 1px 1px rgba(255, 255, 255, 0.4);
}

.chip-badge--dark {
  box-shadow:
    inset 0 1px 2px rgba(0, 0, 0, 0.2),
    inset 0 -1px 1px rgba(255, 255, 255, 0.05),
    0 1px 1px rgba(255, 255, 255, 0.03);
}

.chip-badge--green {
  box-shadow:
    inset 0 1px 3px rgba(61, 122, 74, 0.1),
    inset 0 -1px 1px rgba(255, 255, 255, 0.3),
    0 1px 1px rgba(255, 255, 255, 0.5);
}

.chip-badge--rose {
  box-shadow:
    inset 0 1px 3px rgba(163, 77, 90, 0.1),
    inset 0 -1px 1px rgba(255, 255, 255, 0.3),
    0 1px 1px rgba(255, 255, 255, 0.5);
}

.chip-badge--blue {
  box-shadow:
    inset 0 1px 2px rgba(0, 0, 0, 0.15),
    inset 0 -1px 1px rgba(255, 255, 255, 0.1),
    0 1px 1px rgba(255, 255, 255, 0.05);
}
</style>
