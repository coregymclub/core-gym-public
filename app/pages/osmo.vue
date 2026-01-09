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
    <!-- Hero - fullscreen med form -->
    <section class="min-h-screen flex flex-col justify-center px-6 relative overflow-hidden">
      <!-- Background Image -->
      <div class="absolute inset-0 z-0">
        <img
          src="/images/cta-bg.webp"
          alt=""
          class="w-full h-full object-cover"
        />
        <div class="absolute inset-0 bg-gradient-to-b from-black/60 via-black/40 to-black/70" />
      </div>

      <div class="relative z-10 max-w-lg mx-auto w-full pt-32 pb-16">
        <!-- Header -->
        <div class="text-center mb-8">
          <h1 class="font-display font-bold text-5xl md:text-6xl text-white mb-4 animate-slide-up uppercase tracking-tighter">Ösmo</h1>
          <p class="text-lg text-white/80 animate-slide-up" style="animation-delay: 0.1s">
            Vårt fjärde gym öppnar hösten 2026
          </p>
        </div>

        <!-- Form -->
        <div v-if="!isSuccess" class="animate-slide-up" style="animation-delay: 0.15s">
          <!-- Heading -->
          <h2 class="text-2xl font-bold text-white text-center mb-2">Gör en intresseanmälan</h2>
          <!-- Compelling message -->
          <div class="text-center mb-6">
            <p class="text-white/70 text-sm">
              Bli först med ett exklusivt erbjudande vid öppning
            </p>
          </div>

          <form @submit.prevent="handleSubmit" class="space-y-3">
            <input
              v-model="form.name"
              type="text"
              placeholder="Namn"
              required
              class="w-full px-5 py-4 bg-white/10 backdrop-blur-sm border border-white/20 rounded-2xl text-white placeholder-white/50 focus:outline-none focus:border-white/50 focus:bg-white/15 transition-all"
            />
            <input
              v-model="form.email"
              type="email"
              placeholder="E-post"
              required
              class="w-full px-5 py-4 bg-white/10 backdrop-blur-sm border border-white/20 rounded-2xl text-white placeholder-white/50 focus:outline-none focus:border-white/50 focus:bg-white/15 transition-all"
            />
            <input
              v-model="form.phone"
              type="tel"
              placeholder="Telefon (valfritt)"
              class="w-full px-5 py-4 bg-white/10 backdrop-blur-sm border border-white/20 rounded-2xl text-white placeholder-white/50 focus:outline-none focus:border-white/50 focus:bg-white/15 transition-all"
            />
            <textarea
              v-model="form.message"
              rows="2"
              placeholder="Vad vill du se på gymmet? Tips välkomnas!"
              class="w-full px-5 py-4 bg-white/10 backdrop-blur-sm border border-white/20 rounded-2xl text-white placeholder-white/50 focus:outline-none focus:border-white/50 focus:bg-white/15 transition-all resize-none"
            ></textarea>

            <div v-if="error" class="text-red-400 text-sm font-medium text-center">{{ error }}</div>

            <button
              type="submit"
              :disabled="isSubmitting"
              class="w-full py-4 bg-brand hover:bg-brand/90 text-white font-bold rounded-full text-lg transition-all active:scale-98"
            >
              {{ isSubmitting ? 'Skickar...' : 'Anmäl intresse' }}
            </button>
          </form>
        </div>

        <!-- Success -->
        <div v-else class="p-10 bg-white/10 backdrop-blur-md border border-white/20 rounded-3xl animate-scale-in text-center">
          <div class="w-16 h-16 bg-green-500/20 rounded-full flex items-center justify-center mx-auto mb-5">
            <svg class="w-8 h-8 text-green-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7" />
            </svg>
          </div>
          <h3 class="text-2xl font-bold text-white mb-3">Tack!</h3>
          <p class="text-white/70">Du är nu med på listan. Vi hör av oss med ditt exklusiva erbjudande.</p>
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

    <!-- Vad vi vet -->
    <section class="py-16 bg-surface">
      <div class="container max-w-3xl">
        <h2 class="font-display font-bold text-3xl md:text-4xl text-center mb-12 uppercase tracking-tight">Vad vi vet</h2>

        <div class="space-y-4">
          <!-- Öppettider -->
          <div class="flex items-start gap-4 p-5 bg-surface-container rounded-2xl">
            <div class="w-10 h-10 rounded-full bg-brand/10 flex items-center justify-center flex-shrink-0">
              <svg class="w-5 h-5 text-brand" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
                <path stroke-linecap="round" stroke-linejoin="round" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <div>
              <h3 class="font-bold text-on-surface mb-1">Öppet 03:55–00:05</h3>
              <p class="text-sm text-on-surface-dim">Samma öppettider som våra andra gym. Ja, tiderna är lite udda – men du glömmer dem aldrig.</p>
            </div>
          </div>

          <!-- Ingen bindning -->
          <div class="flex items-start gap-4 p-5 bg-surface-container rounded-2xl">
            <div class="w-10 h-10 rounded-full bg-brand/10 flex items-center justify-center flex-shrink-0">
              <svg class="w-5 h-5 text-brand" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
                <path stroke-linecap="round" stroke-linejoin="round" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <div>
              <h3 class="font-bold text-on-surface mb-1">Ingen bindningstid</h3>
              <p class="text-sm text-on-surface-dim">Du tränar så länge du vill. Uppsägning med två månaders varsel, som alltid.</p>
            </div>
          </div>

          <!-- Storlek & läge -->
          <div class="flex items-start gap-4 p-5 bg-surface-container rounded-2xl">
            <div class="w-10 h-10 rounded-full bg-brand/10 flex items-center justify-center flex-shrink-0">
              <svg class="w-5 h-5 text-brand" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
                <path stroke-linecap="round" stroke-linejoin="round" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                <path stroke-linecap="round" stroke-linejoin="round" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
              </svg>
            </div>
            <div>
              <h3 class="font-bold text-on-surface mb-1">700 kvm i gamla Priskrossaren</h3>
              <p class="text-sm text-on-surface-dim">Perfekt läge mitt i Ösmo. Gott om plats för både fria vikter och maskiner.</p>
            </div>
          </div>

          <!-- Utrustning -->
          <div class="flex items-start gap-4 p-5 bg-surface-container rounded-2xl">
            <div class="w-10 h-10 rounded-full bg-brand/10 flex items-center justify-center flex-shrink-0">
              <svg class="w-5 h-5 text-brand" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
                <path stroke-linecap="round" stroke-linejoin="round" d="M13 10V3L4 14h7v7l9-11h-7z" />
              </svg>
            </div>
            <div>
              <h3 class="font-bold text-on-surface mb-1">Utrustning i toppklass</h3>
              <p class="text-sm text-on-surface-dim">Vi vet inte exakt vad än – men det blir bra. Har du önskemål? Skriv i formuläret ovan!</p>
            </div>
          </div>

          <!-- Filosofi -->
          <div class="flex items-start gap-4 p-5 bg-surface-container rounded-2xl">
            <div class="w-10 h-10 rounded-full bg-brand/10 flex items-center justify-center flex-shrink-0">
              <svg class="w-5 h-5 text-brand" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
                <path stroke-linecap="round" stroke-linejoin="round" d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
              </svg>
            </div>
            <div>
              <h3 class="font-bold text-on-surface mb-1">Inget strul, bara riktigt bra träning</h3>
              <p class="text-sm text-on-surface-dim">Samma filosofi som på våra andra gym. Fokus på det som faktiskt spelar roll.</p>
            </div>
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
        <h2 class="font-display font-bold text-4xl md:text-5xl text-center mb-4 uppercase tracking-tight">Träna redan idag</h2>
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
