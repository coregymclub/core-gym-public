<script setup lang="ts">
// Hide header/footer on this page
definePageMeta({
  layout: false
})

useHead({
  title: 'SOON - Core Gym Club',
  meta: [
    { name: 'description', content: 'Nya medlemsportalen kommer alldeles strax.' },
    { name: 'theme-color', content: '#1c1b1d' }
  ]
})

// Secret tap counter to access login
const tapCount = ref(0)
const showLoginAccess = ref(false)
let tapTimer: ReturnType<typeof setTimeout> | null = null

function handleLogoTap() {
  tapCount.value++

  if (tapTimer) clearTimeout(tapTimer)
  tapTimer = setTimeout(() => {
    tapCount.value = 0
  }, 2000)

  if (tapCount.value >= 5) {
    showLoginAccess.value = true
    tapCount.value = 0
  }
}

function goToMemberApp() {
  window.location.href = 'https://member.coregym.club'
}

// Email notification signup
const email = ref('')
const submitted = ref(false)
const submitting = ref(false)

async function handleNotify() {
  if (!email.value || !email.value.includes('@')) return

  submitting.value = true
  try {
    await fetch('https://teamchat.coregym.club/api/chat/reception', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        message: `📱 **Vill bli notifierad om nya appen**\n${email.value}`,
        author: 'Hemsidan'
      })
    })
    submitted.value = true
  } catch (e) {
    submitted.value = true
  } finally {
    submitting.value = false
  }
}
</script>

<template>
  <div class="h-dvh bg-[#1c1b1d] text-[#f7f1f6] flex flex-col items-center justify-between px-6 py-12 overflow-hidden relative">

    <!-- Background glow -->
    <div class="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] bg-brand/20 rounded-full blur-[150px] pointer-events-none animate-pulse" />

    <!-- Top: Small text -->
    <p class="text-sm tracking-[0.25em] uppercase text-[#f7f1f6]/40 font-medium relative z-10">
      Core Gym Club
    </p>

    <!-- Center: SOON -->
    <div class="text-center relative z-10">
      <h1 class="font-display font-black text-[5rem] sm:text-[7rem] md:text-[9rem] uppercase tracking-tight leading-none text-brand animate-glow">
        SOON
      </h1>
      <p class="text-lg sm:text-xl text-[#e5e1e3]/70 mt-4 font-medium">
        Nya medlemsportalen.<br class="sm:hidden" /> Alldeles strax.
      </p>

      <!-- Email signup -->
      <div v-if="!submitted" class="mt-8 max-w-sm mx-auto">
        <form @submit.prevent="handleNotify" class="flex gap-2">
          <input
            v-model="email"
            type="email"
            placeholder="din@mejl.se"
            class="flex-1 px-4 py-3 bg-white/10 rounded-xl border border-white/10 text-white placeholder:text-white/40 focus:outline-none focus:border-brand transition-all text-sm"
          />
          <button
            type="submit"
            :disabled="submitting"
            class="px-5 py-3 bg-brand hover:bg-brand-dark text-white font-bold rounded-xl transition-all disabled:opacity-50 text-sm whitespace-nowrap"
          >
            {{ submitting ? '...' : 'Notifiera mig' }}
          </button>
        </form>
        <p class="text-xs text-white/30 mt-3">Vi meddelar dig direkt när allt är uppe.</p>
      </div>

      <!-- Success -->
      <div v-else class="mt-8 text-green-400 font-medium">
        ✓ Tack! Vi hör av oss.
      </div>
    </div>

    <!-- Bottom: Logo (tap 5x for login) + links -->
    <div class="flex flex-col items-center gap-5 relative z-10">
      <div class="flex gap-4 text-sm">
        <a href="tel:0850924549" class="text-[#f7f1f6]/40 hover:text-[#f7f1f6] transition-colors">
          Ring oss
        </a>
        <span class="text-[#f7f1f6]/20">|</span>
        <NuxtLink to="/" class="text-[#f7f1f6]/40 hover:text-[#f7f1f6] transition-colors">
          Tillbaka
        </NuxtLink>
      </div>

      <!-- Logo - tap 5 times to reveal login -->
      <button
        @click="handleLogoTap"
        class="transition-transform active:scale-95"
        :class="{ 'animate-wiggle': tapCount >= 3 }"
      >
        <img src="/images/logo.svg" alt="Core Gym Club" class="h-16 opacity-50" />
      </button>

      <!-- Hidden login access (shows after 5 taps) -->
      <Transition
        enter-active-class="transition duration-300 ease-out"
        enter-from-class="opacity-0 translate-y-4"
        enter-to-class="opacity-100 translate-y-0"
        leave-active-class="transition duration-200 ease-in"
        leave-from-class="opacity-100"
        leave-to-class="opacity-0"
      >
        <button
          v-if="showLoginAccess"
          @click="goToMemberApp"
          class="px-6 py-3 bg-white/10 hover:bg-white/20 rounded-full text-sm font-medium transition-all"
        >
          Logga in redan nu →
        </button>
      </Transition>
    </div>

  </div>
</template>

<style scoped>
@keyframes glow {
  0%, 100% {
    text-shadow: 0 0 40px rgba(217, 54, 54, 0.4), 0 0 80px rgba(217, 54, 54, 0.2);
  }
  50% {
    text-shadow: 0 0 60px rgba(217, 54, 54, 0.6), 0 0 120px rgba(217, 54, 54, 0.3);
  }
}

.animate-glow {
  animation: glow 3s ease-in-out infinite;
}

@keyframes wiggle {
  0%, 100% { transform: rotate(0deg); }
  25% { transform: rotate(-3deg); }
  75% { transform: rotate(3deg); }
}

.animate-wiggle {
  animation: wiggle 0.3s ease-in-out;
}
</style>
