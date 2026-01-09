<script setup lang="ts">
/**
 * Sambo Verification Modal
 * New flow: Redirect to BankID first, then verify/proceed after login
 */

interface Props {
  productId: number
  productName: string
  productPrice: number
  checkoutBaseUrl: string
}

const props = defineProps<Props>()

const emit = defineEmits<{
  close: []
}>()

const isRedirecting = ref(false)
const selectedOption = ref<'verify' | 'together' | null>(null)

// Build checkout URL
function getCheckoutUrl(discount?: string, quantity?: number): string {
  let url = `${props.checkoutBaseUrl}?product=${props.productId}`
  if (discount) url += `&discount=${discount}`
  if (quantity && quantity > 1) url += `&quantity=${quantity}`
  return url
}

// Start flow - check existing session first
const startFlow = (flow: 'verify' | 'together') => {
  isRedirecting.value = true
  selectedOption.value = flow

  // Save flow state to sessionStorage
  if (flow === 'verify') {
    sessionStorage.setItem('authFlow', JSON.stringify({
      flow: 'sambo-verify',
      product: props.productName,
      productId: props.productId,
      price: props.productPrice,
      checkoutBase: props.checkoutBaseUrl
    }))
  } else {
    sessionStorage.setItem('authFlow', JSON.stringify({
      flow: 'sambo-together',
      redirect: getCheckoutUrl('SAMBO', 2)
    }))
  }

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
                  Samborabatt
                </h2>
              </div>

              <!-- Options -->
              <div class="px-6 pb-8 space-y-3">
                <!-- Loading state -->
                <div v-if="isRedirecting" class="py-8 text-center">
                  <svg class="animate-spin h-8 w-8 mx-auto mb-4 text-on-surface" fill="none" viewBox="0 0 24 24">
                    <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4" />
                    <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                  </svg>
                  <p class="text-on-surface font-medium">Skickar till BankID...</p>
                </div>

                <template v-else>
                  <!-- Option 1: Sambo is already member -->
                  <button
                    @click="startFlow('verify')"
                    class="w-full p-5 rounded-2xl border-2 border-outline text-left transition-all hover:border-on-surface hover:bg-surface-container"
                  >
                    <div class="flex items-center gap-4">
                      <div class="w-11 h-11 rounded-full bg-pink-100 flex items-center justify-center text-pink-600 flex-shrink-0">
                        <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7" />
                        </svg>
                      </div>
                      <div>
                        <p class="font-bold text-on-surface">Min sambo är redan medlem</p>
                        <p class="text-sm text-on-surface-dim">Logga in och verifiera</p>
                      </div>
                    </div>
                  </button>

                  <!-- Option 2: Sign up together -->
                  <button
                    @click="startFlow('together')"
                    class="w-full p-5 rounded-2xl border-2 border-outline text-left transition-all hover:border-on-surface hover:bg-surface-container"
                  >
                    <div class="flex items-center gap-4">
                      <div class="w-11 h-11 rounded-full bg-pink-100 flex items-center justify-center text-pink-600 flex-shrink-0">
                        <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" />
                        </svg>
                      </div>
                      <div>
                        <p class="font-bold text-on-surface">Vi tecknar tillsammans</p>
                        <p class="text-sm text-on-surface-dim">Två medlemskap, en betalare</p>
                      </div>
                    </div>
                  </button>

                  <!-- Note -->
                  <p class="text-xs text-on-surface-dim text-center pt-2">
                    Du loggar in med BankID för att fortsätta.
                  </p>
                </template>
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
