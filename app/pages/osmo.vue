<script setup lang="ts">
useHead({
  title: 'Ösmo - Kommer 2026 - Core Gym Club',
  meta: [{ name: 'description', content: 'Core Gym Ösmo öppnar 2026 i Priskrossarens gamla lokaler. 700 kvm träning. Anmäl ditt intresse!' }]
})

const form = ref({ name: '', email: '', phone: '', message: '' })
const isSubmitting = ref(false)
const isSuccess = ref(false)
const error = ref<string | null>(null)

async function handleSubmit() {
  if (!form.value.name || !form.value.email) {
    error.value = 'Fyll i namn och e-post'
    return
  }

  isSubmitting.value = true
  error.value = null

  try {
    const response = await fetch('https://student-email.coregymclub.se/send', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        to: 'info@coregym.club',
        subject: `🔔 Ösmo intresseanmälan: ${form.value.name}`,
        html: `
          <h2>Ny intresseanmälan för Core Gym Ösmo</h2>
          <p><strong>Namn:</strong> ${form.value.name}</p>
          <p><strong>E-post:</strong> ${form.value.email}</p>
          ${form.value.phone ? `<p><strong>Telefon:</strong> ${form.value.phone}</p>` : ''}
          ${form.value.message ? `<p><strong>Meddelande:</strong><br>${form.value.message.replace(/\n/g, '<br>')}</p>` : ''}
        `,
        replyTo: form.value.email
      })
    })

    if (response.ok) {
      isSuccess.value = true
    } else {
      throw new Error('Kunde inte skicka')
    }
  } catch (e) {
    error.value = 'Något gick fel. Försök igen!'
  } finally {
    isSubmitting.value = false
  }
}
</script>

<template>
  <div>
    <!-- Hero -->
    <section class="min-h-screen flex items-center justify-center bg-on-surface text-white px-6 relative overflow-hidden">
      <!-- Background Abstract -->
      <div class="absolute inset-0 z-0">
        <div class="absolute top-0 right-0 w-[800px] h-[800px] bg-brand/10 rounded-full translate-x-1/2 -translate-y-1/2 blur-3xl" />
        <div class="absolute bottom-0 left-0 w-[600px] h-[600px] bg-brand/5 rounded-full -translate-x-1/2 translate-y-1/2 blur-3xl" />
        <div class="absolute inset-0 bg-gradient-to-t from-on-surface via-transparent to-transparent" />
      </div>

      <div class="text-center relative z-10 max-w-xl mx-auto mt-20">
        <span class="inline-block px-4 py-2 rounded-full border border-white/20 bg-white/10 backdrop-blur mb-8 text-sm font-bold tracking-widest uppercase animate-fade">
          Kommer hösten 2026
        </span>
        <h1 class="text-display-lg text-white mb-8 animate-slide-up">Ösmo</h1>
        <p class="text-headline text-white/90 mb-12 animate-slide-up" style="animation-delay: 0.1s">
          Vårt fjärde gym. 700 kvm träningsglädje. <br class="hidden md:inline" />
          Anmäl intresse så håller vi dig uppdaterad.
        </p>

        <!-- Form -->
        <div v-if="!isSuccess" class="bg-surface/5 backdrop-blur-sm border border-white/10 p-8 rounded-3xl animate-slide-up" style="animation-delay: 0.2s">
          <form @submit.prevent="handleSubmit" class="space-y-4">
            <div class="grid grid-cols-2 gap-4">
              <input
                v-model="form.name"
                type="text"
                placeholder="Namn *"
                required
                class="w-full px-6 py-4 bg-white/5 border border-white/10 rounded-2xl text-white placeholder-white/40 focus:outline-none focus:border-brand focus:bg-white/10 transition-all"
              />
              <input
                v-model="form.phone"
                type="tel"
                placeholder="Telefon"
                class="w-full px-6 py-4 bg-white/5 border border-white/10 rounded-2xl text-white placeholder-white/40 focus:outline-none focus:border-brand focus:bg-white/10 transition-all"
              />
            </div>
            <input
              v-model="form.email"
              type="email"
              placeholder="E-post *"
              required
              class="w-full px-6 py-4 bg-white/5 border border-white/10 rounded-2xl text-white placeholder-white/40 focus:outline-none focus:border-brand focus:bg-white/10 transition-all"
            />
            
            <textarea
              v-model="form.message"
              rows="3"
              placeholder="Något särskilt du önskar dig? Eller bara ett hejarop?"
              class="w-full px-6 py-4 bg-white/5 border border-white/10 rounded-2xl text-white placeholder-white/40 focus:outline-none focus:border-brand focus:bg-white/10 transition-all resize-none"
            ></textarea>

            <div v-if="error" class="text-red-400 text-sm font-medium">{{ error }}</div>

            <button
              type="submit"
              :disabled="isSubmitting"
              class="btn btn-primary w-full py-4 text-lg"
            >
              {{ isSubmitting ? 'Skickar...' : 'Anmäl intresse' }}
            </button>
          </form>
        </div>

        <!-- Success -->
        <div v-else class="p-12 bg-green-500/10 border border-green-500/20 rounded-3xl backdrop-blur-md animate-scale-in">
          <div class="w-20 h-20 bg-green-500/20 rounded-full flex items-center justify-center mx-auto mb-6">
            <svg class="w-10 h-10 text-green-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7" />
            </svg>
          </div>
          <h3 class="text-title text-white mb-4">Tack för ditt intresse!</h3>
          <p class="text-body-lg text-white/70">Vi hör av oss så fort vi har nyheter om öppningen.</p>
        </div>
      </div>
    </section>

    <!-- Per's Quote -->
    <section class="section bg-surface-container overflow-hidden" key="per-quote">
      <div class="container">
        <div class="bg-surface rounded-[3rem] p-10 md:p-16 shadow-elevated border border-white/50 flex flex-col md:flex-row gap-12 items-center max-w-5xl mx-auto">
          <div class="w-64 h-64 flex-shrink-0 rounded-full overflow-hidden border-4 border-surface shadow-xl grayscale contrast-125 relative">
            <img 
              src="/images/founder-per.webp" 
              alt="Per Karlsson" 
              class="w-full h-full object-cover scale-110"
            />
          </div>
          <div class="text-center md:text-left">
            <h3 class="font-display font-bold text-3xl md:text-4xl mb-6 leading-tight text-on-surface uppercase tracking-tight">"Vi tror på Ösmo"</h3>
            <p class="text-xl text-on-surface-dim mb-8 leading-relaxed font-medium">
              "Det har länge funnits en efterfrågan på ett riktigt bra gym här. När vi fick chansen att ta över de gamla lokalerna för Priskrossaren kändes det helt rätt. Vi vill skapa en mötesplats där du känner dig hemma från första stund."
            </p>
            <div>
              <p class="text-lg font-bold text-brand mb-1 uppercase tracking-wide">Per Karlsson</p>
              <p class="text-xs uppercase tracking-widest text-on-surface-dim font-bold">Grundare Core Gym Club</p>
            </div>
          </div>
        </div>
      </div>
    </section>

    <!-- Info -->
    <section class="section bg-surface">
      <div class="container">
        <h2 class="text-display text-center mb-16">Vad vi vet</h2>
        <div class="grid grid-cols-2 md:grid-cols-4 gap-8 max-w-4xl mx-auto">
          <div class="bg-surface-bright p-8 rounded-3xl border border-outline text-center">
            <h3 class="text-title mb-2 text-brand">Läge</h3>
            <p class="text-body-lg text-on-surface-dim">Gamla Priskrossaren</p>
          </div>
          <div class="bg-surface-bright p-8 rounded-3xl border border-outline text-center">
            <h3 class="text-title mb-2 text-brand">Storlek</h3>
            <p class="text-body-lg text-on-surface-dim">700 kvm</p>
          </div>
          <div class="bg-surface-bright p-8 rounded-3xl border border-outline text-center">
            <h3 class="text-title mb-2 text-brand">Öppnar</h3>
            <p class="text-body-lg text-on-surface-dim">Hösten 2026</p>
          </div>
          <div class="bg-surface-bright p-8 rounded-3xl border border-outline text-center">
            <h3 class="text-title mb-2 text-brand">Utrustning</h3>
            <p class="text-body-lg text-on-surface-dim">Toppklass</p>
          </div>
        </div>
      </div>
    </section>

    <!-- Map -->
    <section class="section bg-surface-container">
      <div class="container">
        <div class="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          <div>
            <h2 class="font-display font-bold text-4xl md:text-5xl mb-6 text-on-surface uppercase tracking-tight">
              Var öppnar vi?
            </h2>
            <div class="space-y-2 text-xl text-on-surface-dim">
              <p class="font-bold text-on-surface text-2xl">Core Gym Club Ösmo</p>
              <p>Öppnar hösten 2026</p>
            </div>
          </div>
          <div class="h-[400px] rounded-[2rem] overflow-hidden shadow-elevated">
            <ClientOnly>
              <AppleMap
                :single-gym="{ name: 'Ösmo', address: 'Öppnar hösten 2026', lat: 59.0347, lng: 17.9542, href: '/osmo', comingSoon: true }"
              />
            </ClientOnly>
          </div>
        </div>
      </div>
    </section>

    <!-- Other gyms -->
    <section class="section bg-surface-dim border-t border-outline">
      <div class="container">
        <h2 class="text-display text-center mb-4">Träna redan idag</h2>
        <p class="text-lead text-center mb-16">Vi finns på tre platser redan nu</p>

        <div class="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-4xl mx-auto">
          <NuxtLink to="/tungelsta" class="card group text-center hover:border-brand/50">
            <h3 class="text-title group-hover:text-brand transition-colors">Tungelsta</h3>
            <p class="text-body text-on-surface-dim mt-2">Vårt första gym</p>
          </NuxtLink>
          <NuxtLink to="/vasterhaninge" class="card group text-center hover:border-brand/50">
            <h3 class="text-title group-hover:text-brand transition-colors">Västerhaninge</h3>
            <p class="text-body text-on-surface-dim mt-2">Centralt vid stationen</p>
          </NuxtLink>
          <NuxtLink to="/vegastaden" class="card group text-center hover:border-brand/50">
            <h3 class="text-title group-hover:text-brand transition-colors">Vegastaden</h3>
            <p class="text-body text-on-surface-dim mt-2">Flaggskeppet</p>
          </NuxtLink>
        </div>
      </div>
    </section>
  </div>
</template>
