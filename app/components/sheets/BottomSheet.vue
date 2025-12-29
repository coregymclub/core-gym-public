<script setup lang="ts">
interface Props {
  open: boolean
  title?: string
  subtitle?: string
  maxWidth?: 'sm' | 'md' | 'lg' | 'xl' | 'full'
}

const props = withDefaults(defineProps<Props>(), {
  maxWidth: 'lg',
})

const emit = defineEmits<{
  close: []
}>()

// Handle escape key
const handleKeydown = (e: KeyboardEvent) => {
  if (e.key === 'Escape') {
    emit('close')
  }
}

// Handle backdrop click
const handleBackdropClick = (e: MouseEvent) => {
  if (e.target === e.currentTarget) {
    emit('close')
  }
}

// Lock body scroll when open (client-side only)
watch(() => props.open, (isOpen) => {
  if (import.meta.server) return

  if (isOpen) {
    document.body.style.overflow = 'hidden'
    document.addEventListener('keydown', handleKeydown)
  } else {
    document.body.style.overflow = ''
    document.removeEventListener('keydown', handleKeydown)
  }
}, { immediate: true })

onUnmounted(() => {
  if (import.meta.server) return
  document.body.style.overflow = ''
  document.removeEventListener('keydown', handleKeydown)
})

const maxWidthClass = computed(() => {
  const widths = {
    sm: 'max-w-sm',
    md: 'max-w-md',
    lg: 'max-w-lg',
    xl: 'max-w-xl',
    full: 'max-w-full',
  }
  return widths[props.maxWidth]
})
</script>

<template>
  <ClientOnly>
    <Teleport to="body">
      <Transition name="backdrop">
      <div
        v-if="open"
        class="fixed inset-0 z-[250] flex items-end justify-center bg-black/60 backdrop-blur-sm"
        @click="handleBackdropClick"
      >
        <Transition name="sheet" appear>
          <div
            v-if="open"
            class="relative w-full bg-white rounded-t-3xl shadow-2xl max-h-[90vh] flex flex-col"
            :class="maxWidthClass"
          >
            <!-- Drag handle -->
            <div class="flex justify-center pt-3 pb-2">
              <div class="w-10 h-1 bg-core-gray-300 rounded-full" />
            </div>

            <!-- Header -->
            <div v-if="title || $slots.header" class="px-6 pb-4 border-b border-core-gray-100">
              <slot name="header">
                <div class="flex items-start justify-between">
                  <div>
                    <h2 v-if="title" class="font-display text-xl sm:text-2xl">{{ title }}</h2>
                    <p v-if="subtitle" class="text-sm text-core-gray-500 mt-1">{{ subtitle }}</p>
                  </div>
                  <button
                    type="button"
                    class="p-2 -mr-2 text-core-gray-400 hover:text-core-gray-600 transition-colors"
                    @click="emit('close')"
                  >
                    <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
                    </svg>
                  </button>
                </div>
              </slot>
            </div>

            <!-- Close button if no header -->
            <button
              v-else
              type="button"
              class="absolute top-4 right-4 p-2 text-core-gray-400 hover:text-core-gray-600 transition-colors z-10"
              @click="emit('close')"
            >
              <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>

            <!-- Content -->
            <div class="flex-1 overflow-y-auto px-6 py-6">
              <slot />
            </div>

            <!-- Footer -->
            <div v-if="$slots.footer" class="px-6 py-4 border-t border-core-gray-100 bg-core-gray-50">
              <slot name="footer" />
            </div>

            <!-- Safe area padding for iOS -->
            <div class="h-safe-area-bottom bg-white" />
          </div>
        </Transition>
      </div>
    </Transition>
  </Teleport>
  </ClientOnly>
</template>

<style scoped>
.h-safe-area-bottom {
  height: env(safe-area-inset-bottom, 0px);
}

/* Backdrop animation */
.backdrop-enter-active,
.backdrop-leave-active {
  transition: opacity 0.3s ease;
}

.backdrop-enter-from,
.backdrop-leave-to {
  opacity: 0;
}

/* Sheet slide animation */
.sheet-enter-active {
  transition: transform 0.4s cubic-bezier(0.16, 1, 0.3, 1);
}

.sheet-leave-active {
  transition: transform 0.3s cubic-bezier(0.4, 0, 1, 1);
}

.sheet-enter-from,
.sheet-leave-to {
  transform: translateY(100%);
}
</style>
