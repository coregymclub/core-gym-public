<script setup lang="ts">
useHead({
  title: 'Kontakt - Core Gym Club',
  meta: [{ name: 'description', content: 'Kontakta Core Gym Club. Ring, mejla eller besök oss.' }]
})

const form = ref({ name: '', email: '', message: '' })
const isSubmitting = ref(false)
const isSuccess = ref(false)

async function handleSubmit() {
  if (!form.value.name || !form.value.email || !form.value.message) return

  isSubmitting.value = true

  try {
    const response = await fetch('https://student-email.coregymclub.se/send', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        to: 'info@coregym.club',
        subject: `📩 Kontakt: ${form.value.name}`,
        html: `
          <h2>Meddelande från hemsidan</h2>
          <p><strong>Namn:</strong> ${form.value.name}</p>
          <p><strong>E-post:</strong> ${form.value.email}</p>
          <p><strong>Meddelande:</strong></p>
          <p>${form.value.message}</p>
        `,
        replyTo: form.value.email
      })
    })

    if (response.ok) {
      isSuccess.value = true
    }
  } catch (e) {
    // Silent fail
  } finally {
    isSubmitting.value = false
  }
}

const gyms = [
  { name: 'Vegastaden', address: 'Vega Allé 2', note: '2900 kvm' },
  { name: 'Tungelsta', address: 'Tungelstavägen 200', note: 'Sedan 2012' },
  { name: 'Västerhaninge', address: 'Centrumvägen 4', note: 'EGYM' },
]
</script>

<template>
  <div>
    <!-- Hero -->
    <section class="min-h-[50vh] flex items-center justify-center bg-on-surface text-white px-6">
      <div class="text-center">
        <h1 class="text-hero text-white mb-4">Kontakt</h1>
        <p class="text-lead text-white/60">Vi finns här för dig</p>
      </div>
    </section>

    <!-- Quick contact -->
    <section class="section bg-surface">
      <div class="container">
        <div class="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-xl mx-auto">
          <a href="tel:+4685040100" class="card spring-hover text-center">
            <span class="text-label text-on-surface-dim mb-2 block">Ring</span>
            <span class="text-title">08-509 245 49</span>
          </a>
          <a href="mailto:info@coregymclub.se" class="card spring-hover text-center">
            <span class="text-label text-on-surface-dim mb-2 block">Mejla</span>
            <span class="text-title">info@coregymclub.se</span>
          </a>
        </div>
      </div>
    </section>

    <!-- Form -->
    <section class="section bg-surface-dim">
      <div class="container">
        <h2 class="text-section mb-4">Skicka meddelande</h2>
        <p class="text-lead mb-12">Vi svarar inom 24 timmar</p>

        <div class="max-w-md mx-auto">
          <div v-if="!isSuccess">
            <form @submit.prevent="handleSubmit" class="space-y-4">
              <input
                v-model="form.name"
                type="text"
                placeholder="Namn *"
                required
                class="w-full px-4 py-3 bg-surface border border-outline rounded-xl focus:outline-none focus:border-brand"
              />
              <input
                v-model="form.email"
                type="email"
                placeholder="E-post *"
                required
                class="w-full px-4 py-3 bg-surface border border-outline rounded-xl focus:outline-none focus:border-brand"
              />
              <textarea
                v-model="form.message"
                placeholder="Meddelande *"
                required
                rows="4"
                class="w-full px-4 py-3 bg-surface border border-outline rounded-xl focus:outline-none focus:border-brand resize-none"
              />
              <button
                type="submit"
                :disabled="isSubmitting"
                class="btn btn-primary w-full justify-center"
              >
                {{ isSubmitting ? 'Skickar...' : 'Skicka' }}
              </button>
            </form>
          </div>

          <div v-else class="card text-center">
            <div class="w-16 h-16 bg-green-500/10 rounded-full flex items-center justify-center mx-auto mb-4">
              <svg class="w-8 h-8 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7" />
              </svg>
            </div>
            <p class="text-title mb-2">Tack!</p>
            <p class="text-body text-on-surface-dim">Vi återkommer så snart vi kan.</p>
          </div>
        </div>
      </div>
    </section>

    <!-- Locations -->
    <section class="section bg-surface">
      <div class="container">
        <h2 class="text-section mb-4">Besök oss</h2>
        <p class="text-lead mb-12">Öppet 04–00, varje dag</p>

        <div class="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-2xl mx-auto">
          <NuxtLink
            v-for="gym in gyms"
            :key="gym.name"
            :to="`/anlaggningar/${gym.name.toLowerCase().replace('ä', 'a')}`"
            class="card spring-hover text-center"
          >
            <h3 class="text-title mb-2">{{ gym.name }}</h3>
            <p class="text-label text-on-surface-dim">{{ gym.address }}</p>
          </NuxtLink>
        </div>
      </div>
    </section>

    <!-- CTA -->
    <section class="section bg-brand relative grain">
      <div class="container text-center text-white">
        <h2 class="text-section text-white mb-4">Välkommen</h2>
        <p class="text-lead text-white/80 mb-10">Vi ses på gymmet</p>
        <NuxtLink to="/priser" class="btn bg-white text-brand hover:bg-surface-dim">
          Se medlemskap
        </NuxtLink>
      </div>
    </section>
  </div>
</template>
