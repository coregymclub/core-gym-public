<script setup lang="ts">
interface Props {
  open: boolean
  title?: string
  subtitle?: string
}

const props = defineProps<Props>()

const emit = defineEmits<{
  close: []
}>()

// Check if we're on mobile (client-side only)
const isMobile = ref(false)

onMounted(() => {
  const checkMobile = () => {
    isMobile.value = window.innerWidth < 1024
  }
  checkMobile()
  window.addEventListener('resize', checkMobile)
  onUnmounted(() => window.removeEventListener('resize', checkMobile))
})

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

// Lock body scroll when open
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
</script>

<template>
  <ClientOnly>
    <Teleport to="body">
      <Transition name="backdrop">
        <div
          v-if="open"
          class="fixed inset-0 flex bg-black/80 backdrop-blur-md"
          :class="isMobile ? 'z-[60] items-end' : 'z-50 items-center justify-center p-4'"
          @click="handleBackdropClick"
        >
          <!-- Mobile: Bottom Sheet / Desktop: Modal -->
          <Transition :name="isMobile ? 'sheet' : 'modal'" appear>
            <div
              v-if="open"
              class="relative shadow-2xl flex flex-col dark-modal"
              :class="isMobile
                ? 'w-full rounded-t-3xl max-h-[85vh] pb-safe'
                : 'w-full max-w-lg rounded-3xl max-h-[90vh] overflow-hidden'"
            >
              <!-- Drag handle (mobile only) -->
              <div v-if="isMobile" class="flex justify-center pt-3 pb-1 flex-shrink-0">
                <div class="w-12 h-1.5 bg-white/20 rounded-full" />
              </div>

              <!-- Header -->
              <div class="p-6 pb-4 flex-shrink-0">
                <div class="flex items-start justify-between gap-4">
                  <div>
                    <slot name="header">
                      <h2 v-if="title" class="font-display font-bold text-2xl uppercase tracking-tight text-white">
                        {{ title }}
                      </h2>
                      <p v-if="subtitle" class="text-white/70 mt-2">
                        {{ subtitle }}
                      </p>
                    </slot>
                  </div>
                  <button
                    @click="emit('close')"
                    class="w-10 h-10 rounded-full bg-white/10 flex items-center justify-center hover:bg-white/20 transition-colors flex-shrink-0"
                  >
                    <svg class="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
                    </svg>
                  </button>
                </div>
              </div>

              <!-- Content (scrollable) -->
              <div class="flex-1 overflow-y-auto min-h-0">
                <slot />
              </div>

              <!-- Footer (optional) -->
              <div v-if="$slots.footer" class="flex-shrink-0 border-t border-white/10">
                <slot name="footer" />
              </div>

              <!-- Safe area padding for iOS -->
              <div v-if="isMobile" class="h-safe-area-bottom flex-shrink-0" />
            </div>
          </Transition>
        </div>
      </Transition>
    </Teleport>
  </ClientOnly>
</template>

<style scoped>
/* Dark modal styling */
.dark-modal {
  background: linear-gradient(165deg, #1c1b1d 0%, #141314 100%);
  color: #f7f1f6;
}

/* Override child element colors for dark theme */
.dark-modal :deep(label) {
  color: #f7f1f6 !important;
}

.dark-modal :deep(.text-on-surface) {
  color: #f7f1f6 !important;
}

.dark-modal :deep(.text-on-surface-dim) {
  color: #e5e1e3 !important;
}

.dark-modal :deep(input),
.dark-modal :deep(textarea),
.dark-modal :deep(select) {
  background: rgba(255, 255, 255, 0.08) !important;
  border-color: rgba(255, 255, 255, 0.15) !important;
  color: #f7f1f6 !important;
}

.dark-modal :deep(input::placeholder),
.dark-modal :deep(textarea::placeholder) {
  color: rgba(255, 255, 255, 0.4) !important;
}

.dark-modal :deep(input:focus),
.dark-modal :deep(textarea:focus),
.dark-modal :deep(select:focus) {
  border-color: rgba(255, 255, 255, 0.4) !important;
  box-shadow: 0 0 0 1px rgba(255, 255, 255, 0.2) !important;
}

.dark-modal :deep(.bg-surface-container) {
  background: rgba(255, 255, 255, 0.08) !important;
}

.dark-modal :deep(.bg-surface-dim) {
  background: rgba(255, 255, 255, 0.12) !important;
}

.dark-modal :deep(.border-outline) {
  border-color: rgba(255, 255, 255, 0.15) !important;
}

/* Option buttons in dark mode */
.dark-modal :deep(button.border-2) {
  border-color: rgba(255, 255, 255, 0.15) !important;
  background: transparent !important;
}

.dark-modal :deep(button.border-2:hover) {
  border-color: rgba(255, 255, 255, 0.4) !important;
  background: rgba(255, 255, 255, 0.05) !important;
}

.dark-modal :deep(button.border-on-surface) {
  border-color: rgba(255, 255, 255, 0.5) !important;
  background: rgba(255, 255, 255, 0.08) !important;
}

/* Icon circles */
.dark-modal :deep(.bg-brand\/10) {
  background: rgba(217, 54, 54, 0.2) !important;
}

/* Primary buttons */
.dark-modal :deep(.bg-on-surface) {
  background: #f7f1f6 !important;
  color: #1c1b1d !important;
}

.dark-modal :deep(.bg-on-surface:hover) {
  background: #ffffff !important;
}

/* Error/warning states */
.dark-modal :deep(.bg-brand\/10.border) {
  background: rgba(217, 54, 54, 0.15) !important;
  border-color: rgba(217, 54, 54, 0.3) !important;
}

.dark-modal :deep(.bg-amber-100) {
  background: rgba(245, 158, 11, 0.2) !important;
}

.dark-modal :deep(.text-amber-600) {
  color: #fbbf24 !important;
}

/* File upload area */
.dark-modal :deep(.border-dashed) {
  border-color: rgba(255, 255, 255, 0.2) !important;
}

.dark-modal :deep(.border-dashed:hover) {
  border-color: rgba(255, 255, 255, 0.4) !important;
}

.pb-safe {
  padding-bottom: env(safe-area-inset-bottom, 0px);
}

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

/* Bottom sheet slide animation (mobile) */
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

/* Modal scale animation (desktop) */
.modal-enter-active {
  transition: all 0.3s cubic-bezier(0.16, 1, 0.3, 1);
}

.modal-leave-active {
  transition: all 0.2s ease-out;
}

.modal-enter-from {
  opacity: 0;
  transform: scale(0.95);
}

.modal-leave-to {
  opacity: 0;
  transform: scale(0.95);
}
</style>
