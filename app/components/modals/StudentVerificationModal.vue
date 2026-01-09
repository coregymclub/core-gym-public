<script setup lang="ts">
/**
 * Student/Senior Verification Modal
 * New flow: Redirect to BankID first, then verify after login
 */

interface Props {
  productName: string
  productPrice: number
  checkoutUrl: string
  verificationType: 'student' | 'senior'
}

const props = defineProps<Props>()

const emit = defineEmits<{
  close: []
}>()

const isRedirecting = ref(false)

const titleLabel = computed(() =>
  props.verificationType === 'student' ? 'Studentrabatt' : 'Seniorrabatt'
)

const descriptionLabel = computed(() =>
  props.verificationType === 'student'
    ? 'För att få studentpris behöver du logga in med BankID och ladda upp ett studieintyg.'
    : 'För att få seniorpris behöver du logga in med BankID och verifiera din ålder.'
)

// Check if already logged in and redirect appropriately
const startFlow = () => {
  isRedirecting.value = true

  // Save flow state to sessionStorage
  sessionStorage.setItem('authFlow', JSON.stringify({
    flow: props.verificationType,
    product: props.productName,
    price: props.productPrice,
    checkout: props.checkoutUrl
  }))

  // Check if already have a session
  const storedSession = localStorage.getItem('zoeziSession')
  if (storedSession) {
    try {
      const { token, user } = JSON.parse(storedSession)
      // Already logged in - go directly to callback with existing session
      const params = new URLSearchParams({ zs: token })
      if (user?.firstname) params.set('fn', user.firstname)
      if (user?.lastname) params.set('ln', user.lastname)
      if (user?.id) params.set('uid', String(user.id))
      window.location.href = `/callback?${params.toString()}`
      return
    } catch (e) {
      // Invalid stored session, continue to BankID
      localStorage.removeItem('zoeziSession')
    }
  }

  // Need to login - redirect to BankID
  const callbackUrl = `${window.location.origin}/callback`
  window.location.href = `https://z.coregym.club/auth?callback=${encodeURIComponent(callbackUrl)}`
}

// Close on backdrop click
const handleBackdropClick = (e: MouseEvent) => {
  if (e.target === e.currentTarget && !isRedirecting.value) {
    emit('close')
  }
}

// Lock body scroll
onMounted(() => {
  document.body.style.overflow = 'hidden'
})

onUnmounted(() => {
  document.body.style.overflow = ''
})
</script>

<template>
  <ClientOnly>
    <Teleport to="body">
      <Transition name="backdrop">
        <div
          class="fixed inset-0 z-[60] flex items-end bg-black/50 backdrop-blur-sm"
          @click="handleBackdropClick"
        >
          <Transition name="sheet" appear>
            <div class="w-full bg-white rounded-t-3xl shadow-2xl max-h-[80vh] overflow-hidden">
              <!-- Drag handle -->
              <div class="flex justify-center pt-3 pb-2">
                <div class="w-10 h-1 bg-outline/40 rounded-full" />
              </div>

              <!-- Header -->
              <div class="px-6 pb-4 text-center">
                <h2 class="font-display font-bold text-xl uppercase tracking-tight text-on-surface">
                  {{ titleLabel }}
                </h2>
              </div>

              <!-- Content -->
              <div class="px-6 pb-8 space-y-4">
                <!-- Info -->
                <div class="bg-sky-50 rounded-xl p-4">
                  <p class="text-sm text-sky-800">
                    <strong>{{ productName }}: {{ productPrice }} kr/mån.</strong><br>
                    {{ descriptionLabel }}
                  </p>
                </div>

                <!-- BankID button -->
                <button
                  @click="startFlow"
                  :disabled="isRedirecting"
                  class="w-full bg-on-surface text-white py-4 rounded-full font-bold text-lg disabled:opacity-50 disabled:cursor-not-allowed transition-all flex items-center justify-center gap-3"
                >
                  <span v-if="isRedirecting" class="flex items-center gap-2">
                    <svg class="animate-spin h-5 w-5" fill="none" viewBox="0 0 24 24">
                      <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4" />
                      <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                    </svg>
                    Skickar till BankID...
                  </span>
                  <template v-else>
                    <!-- BankID icon -->
                    <svg class="w-6 h-6" viewBox="0 0 24 24" fill="currentColor">
                      <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-1 17.93c-3.95-.49-7-3.85-7-7.93 0-.62.08-1.21.21-1.79L9 15v1c0 1.1.9 2 2 2v1.93zm6.9-2.54c-.26-.81-1-1.39-1.9-1.39h-1v-3c0-.55-.45-1-1-1H8v-2h2c.55 0 1-.45 1-1V7h2c1.1 0 2-.9 2-2v-.41c2.93 1.19 5 4.06 5 7.41 0 2.08-.8 3.97-2.1 5.39z"/>
                    </svg>
                    Logga in med BankID
                  </template>
                </button>

                <!-- Cancel -->
                <button
                  v-if="!isRedirecting"
                  @click="emit('close')"
                  class="w-full py-3 text-on-surface-dim font-medium"
                >
                  Avbryt
                </button>
              </div>

              <!-- Safe area -->
              <div class="h-safe-area-bottom" />
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

.backdrop-enter-active,
.backdrop-leave-active {
  transition: opacity 0.3s ease;
}

.backdrop-enter-from,
.backdrop-leave-to {
  opacity: 0;
}

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
