<script setup lang="ts">
useHead({
  title: 'Kontakt - Core Gym Club',
  meta: [{ name: 'description', content: 'Kontakta Core Gym Club. Ring, mejla eller besök oss.' }]
})

// Access global menu state to open chat directly
const isMenuOpen = useState('isMenuOpen', () => false)
const shouldOpenToChat = useState('shouldOpenToChat', () => false)

function openChatInMenu() {
  shouldOpenToChat.value = true
  isMenuOpen.value = true
}

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
  { name: 'Vegastaden', address: 'Vega Allé 2', note: '2900 kvm', href: '/vegastaden' },
  { name: 'Tungelsta', address: 'Tungelstavägen 200', note: 'Sedan 2012', href: '/tungelsta' },
  { name: 'Västerhaninge', address: 'Centrumvägen 4', note: 'EGYM', href: '/vasterhaninge' },
  { name: 'Ösmo', address: 'Kommer 2026', note: 'Nyhet', href: '/osmo' },
]
</script>

<template>
  <div>
    <!-- Hero -->
    <section class="min-h-[50vh] flex items-center justify-center bg-on-surface text-white px-6">
      <div class="text-center">
        <h1 class="text-hero text-white mb-4">Kontakt</h1>
        <p class="text-lead text-white/60">Frågor? Tankar? Vi finns här.</p>
      </div>
    </section>

    <!-- Quick contact -->
    <section class="section bg-surface">
      <div class="container">
        <div class="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-3xl mx-auto">
          <!-- Chat button - opens menu to chat -->
          <button 
            @click="openChatInMenu"
            class="card spring-hover text-center group"
          >
            <span class="text-label text-on-surface-dim mb-2 block">Snabbast svar</span>
            <span class="text-title flex items-center justify-center gap-2 group-hover:text-brand transition-colors">
              <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
              </svg>
              Chatta med oss
            </span>
          </button>
          
          <a href="tel:+4685040100" class="card spring-hover text-center">
            <span class="text-label text-on-surface-dim mb-2 block">Ring oss</span>
            <span class="text-title">08-509 245 49</span>
          </a>
          <a href="mailto:info@coregymclub.se" class="card spring-hover text-center">
            <span class="text-label text-on-surface-dim mb-2 block">Mejla oss</span>
            <span class="text-title">info@coregymclub.se</span>
          </a>
        </div>
      </div>
    </section>

    <!-- Contact form -->
    <section class="section bg-surface-dim">
      <div class="container">
        <h2 class="text-section mb-4">Skicka ett meddelande</h2>
        <p class="text-lead mb-8">Vi svarar oftast inom 24 timmar.</p>

        <div class="max-w-lg mx-auto">
          <div v-if="!isSuccess" class="card card-lg">
            <form @submit.prevent="handleSubmit" class="space-y-5">
              <div>
                <label for="contact-name" class="block text-sm font-medium text-on-surface-dim mb-2">Namn *</label>
                <input
                  v-model="form.name"
                  type="text"
                  id="contact-name"
                  placeholder="Ditt namn"
                  required
                  class="input-outlined"
                />
              </div>

              <div>
                <label for="contact-email" class="block text-sm font-medium text-on-surface-dim mb-2">E-post *</label>
                <input
                  v-model="form.email"
                  type="email"
                  id="contact-email"
                  placeholder="din@email.se"
                  required
                  class="input-outlined"
                />
              </div>

              <div>
                <label for="contact-message" class="block text-sm font-medium text-on-surface-dim mb-2">Meddelande</label>
                <textarea
                  v-model="form.message"
                  id="contact-message"
                  placeholder="Vad funderar du på?"
                  required
                  rows="4"
                  class="input-outlined resize-none"
                />
              </div>

              <button
                type="submit"
                :disabled="isSubmitting"
                class="btn btn-primary w-full justify-center"
              >
                {{ isSubmitting ? 'Skickar...' : 'Skicka meddelande' }}
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
            <p class="text-body text-on-surface-dim">Vi hörs snart.</p>
          </div>
        </div>
      </div>
    </section>

    <!-- Locations -->
    <section class="section bg-surface">
      <div class="container">
        <h2 class="text-section mb-10">Besök oss</h2>

        <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 max-w-5xl mx-auto">
          <NuxtLink
            v-for="gym in gyms"
            :key="gym.name"
            :to="gym.href"
            class="card spring-hover text-center group"
          >
            <h3 class="text-title mb-2 group-hover:text-brand transition-colors">{{ gym.name }}</h3>
            <p class="text-label text-on-surface-dim">{{ gym.address }}</p>
            <span class="inline-block mt-3 px-3 py-1 rounded-full bg-surface-container text-xs font-bold text-on-surface-dim">
              {{ gym.note }}
            </span>
          </NuxtLink>
        </div>
      </div>
    </section>

    <!-- CTA -->
    <section class="section bg-brand relative grain">
      <div class="container text-center text-white">
        <h2 class="text-section text-white mb-4">Välkommen in</h2>
        <p class="text-lead text-white/80 mb-10">Vi ses på gymmet.</p>
        <NuxtLink to="/bli-medlem" class="btn btn-light btn-lg">
          Bli medlem
        </NuxtLink>
      </div>
    </section>
  </div>
</template>
