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
          class="fixed inset-0 z-[250] bg-on-surface flex flex-col"
        >
          <!-- Close button -->
          <button
            type="button"
            class="absolute top-4 right-4 z-10 w-12 h-12 flex items-center justify-center rounded-full bg-white/10 backdrop-blur-sm hover:bg-white/20 transition-colors text-white"
            @click="handleClose"
          >
            <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>

          <!-- Scrollable content -->
          <div class="flex-1 overflow-y-auto">
            <!-- Hero section with image -->
            <div class="relative pt-16 pb-32 bg-gradient-to-b from-on-surface to-on-surface/90">
              <div class="flex flex-col items-center px-6">
                <!-- Profile image -->
                <div class="w-40 h-40 rounded-full overflow-hidden shadow-2xl mb-6">
                  <img
                    v-if="trainer.imageUrl"
                    :src="trainer.imageUrl"
                    :alt="trainer.name"
                    class="w-full h-full object-cover"
                  />
                  <div v-else class="w-full h-full flex items-center justify-center bg-surface-dim text-on-surface-dim">
                    <span class="text-4xl font-bold">{{ trainer.name.charAt(0) }}</span>
                  </div>
                </div>

                <!-- Name -->
                <h1 class="font-display font-bold text-3xl md:text-4xl text-white text-center uppercase tracking-tight mb-4">
                  {{ trainer.name }}
                </h1>

                <!-- Quote -->
                <blockquote class="text-center text-lg text-white/70 max-w-md leading-relaxed">
                  "{{ trainer.quote }}"
                </blockquote>
              </div>
            </div>

            <!-- Content cards -->
            <div class="relative -mt-20 px-4 pb-32">
              <div class="max-w-lg mx-auto space-y-6">
                <!-- Bio card -->
                <div v-if="trainer.bio" class="bg-surface rounded-[2rem] p-8 shadow-elevated">
                  <h3 class="font-display font-bold text-xl text-on-surface mb-4 uppercase tracking-tight">Om {{ trainer.name.split(' ')[0] }}</h3>
                  <p class="text-body text-on-surface-dim leading-relaxed">{{ trainer.bio }}</p>
                </div>

                <!-- Action image -->
                <div v-if="trainer.actionImageUrl" class="rounded-[2rem] overflow-hidden shadow-elevated">
                  <img
                    :src="trainer.actionImageUrl"
                    :alt="`${trainer.name} tränar`"
                    class="w-full h-64 object-cover"
                  />
                </div>

                <!-- Contact card -->
                <div class="bg-surface rounded-[2rem] p-8 shadow-elevated">
                  <h3 class="font-display font-bold text-xl text-on-surface mb-6 uppercase tracking-tight">Kontakt</h3>
                  <div class="space-y-4">
                    <a
                      :href="`mailto:${trainer.email}`"
                      class="flex items-center gap-4 p-4 rounded-2xl bg-surface-dim hover:bg-surface-container transition-colors group"
                    >
                      <div class="w-12 h-12 bg-brand/10 rounded-full flex items-center justify-center">
                        <svg class="w-5 h-5 text-brand" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                        </svg>
                      </div>
                      <div>
                        <div class="text-xs font-bold uppercase tracking-wide text-on-surface-dim mb-1">E-post</div>
                        <div class="text-body font-medium text-on-surface group-hover:text-brand transition-colors">{{ trainer.email }}</div>
                      </div>
                    </a>

                    <a
                      :href="`tel:${trainer.phone.replace(/\s/g, '')}`"
                      class="flex items-center gap-4 p-4 rounded-2xl bg-surface-dim hover:bg-surface-container transition-colors group"
                    >
                      <div class="w-12 h-12 bg-brand/10 rounded-full flex items-center justify-center">
                        <svg class="w-5 h-5 text-brand" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                        </svg>
                      </div>
                      <div>
                        <div class="text-xs font-bold uppercase tracking-wide text-on-surface-dim mb-1">Telefon</div>
                        <div class="text-body font-medium text-on-surface group-hover:text-brand transition-colors">{{ trainer.phone }}</div>
                      </div>
                    </a>

                    <a
                      v-if="trainer.instagram"
                      :href="`https://instagram.com/${trainer.instagram.replace('@', '')}`"
                      target="_blank"
                      class="flex items-center gap-4 p-4 rounded-2xl bg-surface-dim hover:bg-surface-container transition-colors group"
                    >
                      <div class="w-12 h-12 bg-brand/10 rounded-full flex items-center justify-center">
                        <svg class="w-5 h-5 text-brand" fill="currentColor" viewBox="0 0 24 24">
                          <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z"/>
                        </svg>
                      </div>
                      <div>
                        <div class="text-xs font-bold uppercase tracking-wide text-on-surface-dim mb-1">Instagram</div>
                        <div class="text-body font-medium text-on-surface group-hover:text-brand transition-colors">{{ trainer.instagram }}</div>
                      </div>
                    </a>
                  </div>
                </div>

                <!-- Reviews -->
                <div v-if="trainer.reviews?.length" class="bg-surface rounded-[2rem] p-8 shadow-elevated">
                  <h3 class="font-display font-bold text-xl text-on-surface mb-6 uppercase tracking-tight">Recensioner</h3>
                  <div class="space-y-4">
                    <div
                      v-for="(review, index) in trainer.reviews"
                      :key="index"
                      class="p-5 rounded-2xl bg-surface-dim"
                    >
                      <div class="flex gap-0.5 mb-3">
                        <svg v-for="i in 5" :key="i" class="w-4 h-4 text-amber-400" fill="currentColor" viewBox="0 0 20 20">
                          <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                        </svg>
                      </div>
                      <p class="text-body text-on-surface-dim leading-relaxed mb-3">"{{ review.text }}"</p>
                      <p class="text-sm font-bold text-on-surface">{{ review.author }}</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <!-- Fixed contact button -->
          <div class="flex-shrink-0 px-4 py-4 safe-area-bottom">
            <div class="max-w-lg mx-auto flex justify-center">
              <button
                type="button"
                class="btn bg-brand hover:bg-brand/90 text-white border-none px-12 py-4 text-base font-bold rounded-full shadow-elevated"
                @click="handleContact"
              >
                Kontakta {{ trainer.name.split(' ')[0] }}
              </button>
            </div>
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
  transition: opacity 0.4s cubic-bezier(0.16, 1, 0.3, 1),
              transform 0.4s cubic-bezier(0.16, 1, 0.3, 1);
}

.fullscreen-leave-active {
  transition: opacity 0.25s ease-out,
              transform 0.25s ease-out;
}

.fullscreen-enter-from {
  opacity: 0;
  transform: translateY(100%);
}

.fullscreen-leave-to {
  opacity: 0;
  transform: translateY(40px) scale(0.98);
}
</style>
