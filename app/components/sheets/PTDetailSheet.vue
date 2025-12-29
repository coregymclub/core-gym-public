<script setup lang="ts">
import type { Trainer } from '~/composables/useSheets'

const { ptDetailSheet, closePTDetailSheet, openPTSheet } = useSheets()

const trainer = computed(() => ptDetailSheet.value.trainer)

const handleContact = () => {
  if (trainer.value) {
    const trainerToPass = { ...trainer.value }
    closePTDetailSheet()
    setTimeout(() => {
      openPTSheet(trainerToPass)
    }, 200)
  }
}

const handleClose = () => {
  closePTDetailSheet()
}

const handleKeydown = (e: KeyboardEvent) => {
  if (e.key === 'Escape') {
    handleClose()
  }
}

watch(() => ptDetailSheet.value.isOpen, (isOpen) => {
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
      <Transition name="fullscreen">
        <div
          v-if="ptDetailSheet.isOpen && trainer"
          class="fixed inset-0 z-[250] bg-surface flex flex-col"
        >
          <!-- Header -->
          <div class="flex-shrink-0 flex items-center justify-between px-4 py-4 border-b border-outline">
            <h1 class="text-headline">{{ trainer.name }}</h1>
            <button
              type="button"
              class="w-10 h-10 flex items-center justify-center rounded-full hover:bg-surface-dim transition-colors"
              @click="handleClose"
            >
              <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>

          <!-- Scrollable content -->
          <div class="flex-1 overflow-y-auto">
            <div class="max-w-xl mx-auto px-4 py-6 space-y-6">
              <!-- Profile image -->
              <div class="flex justify-center">
                <div class="w-40 h-40 rounded-2xl bg-surface-dim overflow-hidden">
                  <img
                    v-if="trainer.imageUrl"
                    :src="trainer.imageUrl"
                    :alt="trainer.name"
                    class="w-full h-full object-cover"
                  />
                  <div v-else class="w-full h-full flex items-center justify-center text-on-surface-dim">
                    <svg class="w-20 h-20" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                    </svg>
                  </div>
                </div>
              </div>

              <!-- Quote -->
              <blockquote class="text-center text-body text-on-surface-dim italic px-4">
                "{{ trainer.quote }}"
              </blockquote>

              <!-- Specialties -->
              <div v-if="trainer.specialties?.length" class="flex flex-wrap gap-2 justify-center">
                <span
                  v-for="specialty in trainer.specialties"
                  :key="specialty"
                  class="text-label px-4 py-2 bg-on-surface text-white rounded-lg font-medium"
                >
                  {{ specialty }}
                </span>
              </div>

              <!-- Bio -->
              <div v-if="trainer.bio" class="card bg-surface-dim">
                <p class="text-body text-on-surface-dim">{{ trainer.bio }}</p>
              </div>

              <!-- Action image -->
              <div v-if="trainer.actionImageUrl" class="rounded-2xl overflow-hidden">
                <img
                  :src="trainer.actionImageUrl"
                  :alt="`${trainer.name} tränar`"
                  class="w-full h-64 object-cover"
                />
              </div>

              <!-- Contact info -->
              <div class="card bg-surface-dim">
                <h3 class="text-label text-on-surface-dim mb-4">Kontakt</h3>
                <div class="space-y-3">
                  <a
                    :href="`mailto:${trainer.email}`"
                    class="flex items-center gap-4 text-body hover:text-brand transition-colors"
                  >
                    <div class="w-10 h-10 bg-surface rounded-xl flex items-center justify-center shadow-elevated">
                      <svg class="w-5 h-5 text-on-surface-dim" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                      </svg>
                    </div>
                    <span>{{ trainer.email }}</span>
                  </a>

                  <a
                    :href="`tel:${trainer.phone.replace(/\s/g, '')}`"
                    class="flex items-center gap-4 text-body hover:text-brand transition-colors"
                  >
                    <div class="w-10 h-10 bg-surface rounded-xl flex items-center justify-center shadow-elevated">
                      <svg class="w-5 h-5 text-on-surface-dim" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                      </svg>
                    </div>
                    <span>{{ trainer.phone }}</span>
                  </a>

                  <a
                    v-if="trainer.instagram"
                    :href="`https://instagram.com/${trainer.instagram.replace('@', '')}`"
                    target="_blank"
                    class="flex items-center gap-4 text-body hover:text-brand transition-colors"
                  >
                    <div class="w-10 h-10 bg-surface rounded-xl flex items-center justify-center shadow-elevated">
                      <svg class="w-5 h-5 text-on-surface-dim" fill="currentColor" viewBox="0 0 24 24">
                        <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z"/>
                      </svg>
                    </div>
                    <span>{{ trainer.instagram }}</span>
                  </a>
                </div>
              </div>

              <!-- Reviews -->
              <div v-if="trainer.reviews?.length">
                <h3 class="text-label text-on-surface-dim mb-4">Recensioner</h3>
                <div class="space-y-3">
                  <div
                    v-for="(review, index) in trainer.reviews"
                    :key="index"
                    class="card"
                  >
                    <div class="flex gap-0.5 mb-3">
                      <svg v-for="i in 5" :key="i" class="w-4 h-4 text-yellow-400" fill="currentColor" viewBox="0 0 20 20">
                        <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                      </svg>
                    </div>
                    <p class="text-body text-on-surface-dim italic mb-3">"{{ review.text }}"</p>
                    <p class="text-label font-medium">— {{ review.author }}</p>
                  </div>
                </div>
              </div>

              <!-- Spacer for fixed button -->
              <div class="h-20" />
            </div>
          </div>

          <!-- Fixed contact button -->
          <div class="flex-shrink-0 px-4 py-4 bg-surface border-t border-outline safe-area-bottom">
            <button
              type="button"
              class="btn-primary w-full py-4"
              @click="handleContact"
            >
              Kontakta {{ trainer.name.split(' ')[0] }}
            </button>
          </div>
        </div>
      </Transition>
    </Teleport>
  </ClientOnly>
</template>

<style scoped>
.safe-area-bottom {
  padding-bottom: max(1rem, env(safe-area-inset-bottom));
}

.fullscreen-enter-active {
  transition: opacity 0.3s ease, transform 0.3s ease;
}

.fullscreen-leave-active {
  transition: opacity 0.2s ease, transform 0.2s ease;
}

.fullscreen-enter-from,
.fullscreen-leave-to {
  opacity: 0;
  transform: translateY(20px);
}
</style>
