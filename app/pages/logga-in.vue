<script setup lang="ts">
useHead({
  title: 'Medlemsportalen kommer snart - Core Gym Club',
  meta: [{ name: 'description', content: 'Vår nya medlemsportal är på väg. Lämna din mejl så meddelar vi dig när den är redo.' }]
})

const email = ref('')
const submitted = ref(false)
const submitting = ref(false)
const error = ref<string | null>(null)

async function handleSubmit() {
  if (!email.value || !email.value.includes('@')) {
    error.value = 'Ange en giltig e-postadress'
    return
  }

  submitting.value = true
  error.value = null

  try {
    // Send notification to team
    await fetch('https://teamchat.coregym.club/api/chat/reception', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        message: `📱 **Vill bli notifierad om medlemsportalen**\n${email.value}`,
        author: 'Hemsidan'
      })
    })
    submitted.value = true
  } catch (e) {
    error.value = 'Något gick fel. Kontakta oss direkt istället.'
  } finally {
    submitting.value = false
  }
}
</script>

<template>
  <div class="min-h-screen bg-[#1c1b1d] text-[#f7f1f6]">
    <!-- Hero Section -->
    <section class="min-h-screen flex flex-col items-center justify-center px-6 py-24 text-center relative overflow-hidden">
      <!-- Background decoration -->
      <div class="absolute top-1/4 left-1/2 -translate-x-1/2 w-[600px] h-[600px] bg-brand/10 rounded-full blur-[150px] pointer-events-none" />

      <div class="relative z-10 max-w-lg mx-auto">
        <!-- Logo -->
        <img src="/images/logo.svg" alt="Core Gym Club" class="h-16 md:h-20 mx-auto mb-12" />

        <!-- Badge -->
        <span class="inline-block px-4 py-1.5 rounded-full text-xs font-bold tracking-widest uppercase border border-white/15 text-white/60 bg-white/5 mb-8">
          Kommer snart
        </span>

        <!-- Heading -->
        <h1 class="font-display font-bold text-4xl md:text-5xl lg:text-6xl leading-[0.95] uppercase tracking-tight mb-6">
          Ny medlems&shy;portal på gång
        </h1>

        <!-- Description -->
        <p class="text-lg md:text-xl text-[#e5e1e3]/80 mb-10 leading-relaxed">
          Vi bygger en helt ny och bättre medlemsportal. Snart kan du enkelt hantera ditt medlemskap, boka pass och mer.
        </p>

        <!-- Email signup -->
        <div v-if="!submitted" class="mb-10">
          <form @submit.prevent="handleSubmit" class="flex flex-col sm:flex-row gap-3 max-w-md mx-auto">
            <input
              v-model="email"
              type="email"
              placeholder="din@mejl.se"
              class="flex-1 px-5 py-4 bg-white/10 rounded-xl border border-white/10 text-white placeholder:text-white/40 focus:outline-none focus:border-brand focus:bg-white/15 transition-all font-medium"
            />
            <button
              type="submit"
              :disabled="submitting"
              class="px-6 py-4 bg-brand hover:bg-brand-dark text-white font-bold rounded-xl transition-all disabled:opacity-50 whitespace-nowrap"
            >
              <span v-if="submitting">Skickar...</span>
              <span v-else>Meddela mig</span>
            </button>
          </form>
          <p v-if="error" class="text-red-400 text-sm mt-3">{{ error }}</p>
          <p class="text-sm text-white/40 mt-4">Vi skickar ett mejl när portalen är redo.</p>
        </div>

        <!-- Success message -->
        <div v-else class="mb-10 p-6 bg-green-500/10 border border-green-500/20 rounded-2xl">
          <div class="w-12 h-12 bg-green-500/20 rounded-full flex items-center justify-center mx-auto mb-4">
            <svg class="w-6 h-6 text-green-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7" />
            </svg>
          </div>
          <p class="text-green-300 font-medium">Tack! Vi hör av oss.</p>
        </div>

        <!-- Divider -->
        <div class="flex items-center gap-4 mb-10">
          <div class="flex-1 h-px bg-white/10" />
          <span class="text-sm text-white/40">eller</span>
          <div class="flex-1 h-px bg-white/10" />
        </div>

        <!-- Contact options -->
        <div class="space-y-4">
          <p class="text-white/60 mb-4">Behöver du hjälp med ditt medlemskap? Kontakta oss direkt:</p>

          <div class="flex flex-col sm:flex-row gap-3 justify-center">
            <a
              href="tel:0850924549"
              class="flex items-center justify-center gap-3 px-6 py-4 bg-white/10 hover:bg-white/15 rounded-xl font-medium transition-all"
            >
              <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
              </svg>
              08-509 245 49
            </a>
            <a
              href="mailto:info@coregym.club"
              class="flex items-center justify-center gap-3 px-6 py-4 bg-white/10 hover:bg-white/15 rounded-xl font-medium transition-all"
            >
              <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
              </svg>
              info@coregym.club
            </a>
          </div>
        </div>

        <!-- Back link -->
        <NuxtLink to="/" class="inline-flex items-center gap-2 mt-12 text-white/50 hover:text-white transition-colors">
          <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 19l-7-7 7-7" />
          </svg>
          Tillbaka till startsidan
        </NuxtLink>
      </div>
    </section>
  </div>
</template>
