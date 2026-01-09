<script setup lang="ts">
useHead({
  title: 'WeightTrainer - Viktminskning på 12 veckor - Core Gym Club',
  meta: [
    { name: 'description', content: 'WeightTrainer - gå ner i vikt snabbt och säkert på 12 veckor. Personlig träning, kostprogram och coachning på Core Gym Club Vegastaden och Tungelsta.' }
  ]
})

useThemeColor('#1c1b1d')

const features = [
  {
    title: 'Resultat på 90 dagar',
    desc: 'Ett beprövat program som ger dig synliga resultat på bara 12 veckor.',
    icon: 'M13 10V3L4 14h7v7l9-11h-7z'
  },
  {
    title: '24 PT-tillfällen',
    desc: 'Två pass per vecka med din personliga coach under hela programmet.',
    icon: 'M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z'
  },
  {
    title: 'Coaching i 90 dagar',
    desc: 'Löpande stöd och motivation från din specialutbildade WeightTrainer-coach.',
    icon: 'M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z'
  },
  {
    title: 'Individuell kostplan',
    desc: 'Skräddarsydd kostplan med recept och unika livsmedelsprodukter.',
    icon: 'M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253'
  }
]

const form = ref({
  name: '',
  phone: '',
  email: '',
  message: ''
})

const isSubmitting = ref(false)
const isSuccess = ref(false)
const error = ref<string | null>(null)

async function handleSubmit() {
  if (!form.value.name || !form.value.email || !form.value.phone) {
    error.value = 'Fyll i alla obligatoriska fält'
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
        subject: `WeightTrainer intresseanmälan: ${form.value.name}`,
        html: `
          <h2>Ny intresseanmälan för WeightTrainer</h2>
          <p><strong>Namn:</strong> ${form.value.name}</p>
          <p><strong>Telefon:</strong> ${form.value.phone}</p>
          <p><strong>E-post:</strong> ${form.value.email}</p>
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
    <section class="min-h-[85vh] flex items-center justify-center bg-on-surface text-white px-6 relative overflow-hidden">
      <div class="absolute inset-0 z-0">
        <img
          src="/images/weight-trainer-hero.avif"
          alt="WeightTrainer på Core Gym Club"
          class="w-full h-full object-cover opacity-60"
        />
        <div class="absolute inset-0 bg-gradient-to-t from-on-surface via-on-surface/40 to-transparent" />
      </div>

      <div class="container relative z-10 text-center pt-20">
        <span class="inline-block px-5 py-2 rounded-full bg-brand/20 border border-brand/30 text-brand mb-8 text-sm font-bold tracking-widest uppercase">
          12 veckors program
        </span>
        <h1 class="font-display font-bold text-5xl md:text-7xl lg:text-8xl leading-[0.9] text-white mb-6 uppercase tracking-tight md:tracking-tighter mx-auto">
          WeightTrainer
        </h1>
        <p class="text-xl md:text-2xl lg:text-3xl text-white/80 max-w-3xl mx-auto mb-6 leading-relaxed font-medium">
          Gå ner i vikt och kom i riktigt bra form på bara 12 veckor!
        </p>
        <p class="text-lg text-white/60 max-w-2xl mx-auto mb-12">
          I januari startar vi en ny grupp av vårt populära viktminskningskoncept. Förra gruppen fylldes fort — säkra din plats nu!
        </p>
        <a href="#ansok" class="btn bg-brand hover:bg-brand/90 text-white border-none px-12 py-6 h-auto text-xl rounded-full shadow-lg shadow-brand/20">
          Anmäl dig här
        </a>
      </div>
    </section>

    <!-- En metod som fungerar -->
    <section class="section bg-surface">
      <div class="container">
        <div class="max-w-4xl mx-auto text-center">
          <h2 class="font-display font-bold text-3xl md:text-5xl mb-8 text-on-surface uppercase tracking-tight">
            En metod som fungerar
          </h2>
          <p class="text-xl md:text-2xl text-on-surface-dim leading-relaxed max-w-3xl mx-auto">
            WeightTrainer är inte en bantningskur — det är ett livsstilsprogram som tar ett helhetsgrepp på träning, kost och vanor. Varje år går tusentals personer genom programmet och upplever en fantastisk förändring.
          </p>
        </div>
      </div>
    </section>

    <!-- About -->
    <section class="section bg-surface-dim">
      <div class="container">
        <div class="max-w-4xl mx-auto">
          <div class="text-center mb-8">
            <h2 class="font-display font-bold text-3xl md:text-4xl mb-6 text-on-surface uppercase tracking-tight">
              Personlig coachning hela vägen
            </h2>
          </div>
          <div class="text-lg text-on-surface-dim leading-relaxed space-y-6 max-w-3xl mx-auto text-center">
            <p>
              Under hela programmet följer en av våra specialutbildade coacher dig. Coachens viktigaste uppgift är att se till att du trivs, håller motivationen uppe och når dina mål.
            </p>
            <p class="font-medium text-on-surface text-xl">
              Följ programmet och vi garanterar resultat.
            </p>
          </div>
        </div>
      </div>
    </section>

    <!-- Features -->
    <section class="section bg-surface">
      <div class="container">
        <h2 class="font-display font-bold text-3xl md:text-4xl mb-4 text-on-surface uppercase tracking-tight text-center">
          Detta ingår
        </h2>
        <p class="text-xl text-on-surface-dim text-center mb-16 max-w-2xl mx-auto">
          Allt du behöver för att lyckas
        </p>

        <div class="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-5xl mx-auto">
          <div
            v-for="feature in features"
            :key="feature.title"
            class="bg-surface-dim rounded-3xl p-8 md:p-10 border border-outline/10 hover:border-brand/30 transition-colors"
          >
            <div class="w-14 h-14 rounded-2xl bg-brand/15 border border-brand/25 flex items-center justify-center mb-6 shadow-lg shadow-brand/10">
              <svg class="w-7 h-7 text-brand" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" :d="feature.icon" />
              </svg>
            </div>
            <h3 class="font-display font-bold text-2xl text-on-surface mb-4 uppercase tracking-tight">
              {{ feature.title }}
            </h3>
            <p class="text-lg text-on-surface-dim leading-relaxed">
              {{ feature.desc }}
            </p>
          </div>
        </div>
      </div>
    </section>

    <!-- Coaches -->
    <section class="section bg-on-surface text-white">
      <div class="container">
        <div class="text-center mb-16">
          <h2 class="font-display font-bold text-3xl md:text-5xl mb-4 uppercase tracking-tight">
            Våra coacher
          </h2>
          <p class="text-xl text-white/60">
            Specialutbildade Weight Trainers som guidar dig till ditt mål
          </p>
        </div>

        <div class="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-3xl mx-auto">
          <!-- Maria -->
          <div class="bg-gray-100 rounded-3xl p-6 md:p-8 text-center">
            <div class="aspect-[3/4] -mt-2 mb-4">
              <img src="/images/maria-weight-trainer-latest.png" alt="Maria" class="w-full h-full object-contain object-bottom" />
            </div>
            <h3 class="font-display font-bold text-xl md:text-2xl mb-1 uppercase tracking-tight text-on-surface">Maria</h3>
            <p class="text-on-surface-dim text-sm md:text-base">WeightTrainer Coach</p>
          </div>

          <!-- Denise -->
          <div class="bg-gray-100 rounded-3xl p-6 md:p-8 text-center">
            <div class="aspect-[3/4] -mt-2 mb-4">
              <img src="/images/denise-weight-trainer-latest.png" alt="Denise" class="w-full h-full object-contain object-bottom" />
            </div>
            <h3 class="font-display font-bold text-xl md:text-2xl mb-1 uppercase tracking-tight text-on-surface">Denise</h3>
            <p class="text-on-surface-dim text-sm md:text-base">WeightTrainer Coach</p>
          </div>
        </div>
      </div>
    </section>

    <!-- Locations -->
    <section class="py-16 bg-surface">
      <div class="container">
        <div class="max-w-4xl mx-auto text-center">
          <h3 class="font-display font-bold text-2xl mb-8 text-on-surface uppercase tracking-tight">Platser</h3>
          <div class="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div class="p-6 rounded-2xl bg-surface-dim">
              <h4 class="font-bold text-lg mb-2">Core Gym Club Vegastaden</h4>
              <p class="text-on-surface-dim">Vega Allé 2, 136 57 Vega</p>
            </div>
            <div class="p-6 rounded-2xl bg-surface-dim">
              <h4 class="font-bold text-lg mb-2">Core Gym Club Tungelsta</h4>
              <p class="text-on-surface-dim">Tungelstavägen 200, 137 56 Tungelsta</p>
            </div>
          </div>
        </div>
      </div>
    </section>

    <!-- Application Form -->
    <section id="ansok" class="section bg-brand text-white relative overflow-hidden">
      <div class="absolute top-0 left-0 w-[600px] h-[600px] bg-white/10 rounded-full -translate-x-1/2 -translate-y-1/2 blur-3xl" />
      <div class="absolute bottom-0 right-0 w-[400px] h-[400px] bg-black/20 rounded-full translate-x-1/2 translate-y-1/2 blur-3xl" />

      <div class="container relative z-10">
        <div class="max-w-2xl mx-auto text-center mb-12">
          <h2 class="font-display font-bold text-4xl md:text-5xl mb-6 uppercase tracking-tight">
            Anmäl ditt intresse
          </h2>
          <p class="text-xl text-white/80 font-medium">
            Intresserad? Fyll i dina uppgifter så kontaktar vi dig med mer information. Du förbinder dig inte till något genom att anmäla ditt intresse.
          </p>
        </div>

        <!-- Success state -->
        <div v-if="isSuccess" class="max-w-xl mx-auto p-12 bg-white rounded-[2rem] shadow-2xl text-center">
          <div class="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
            <svg class="w-10 h-10 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7" />
            </svg>
          </div>
          <h3 class="font-display font-bold text-2xl text-on-surface mb-4 uppercase tracking-tight">Tack för din anmälan!</h3>
          <p class="text-lg text-on-surface-dim">Vi hör av oss inom kort med mer information om WeightTrainer.</p>
        </div>

        <!-- Form -->
        <form
          v-else
          @submit.prevent="handleSubmit"
          class="max-w-xl mx-auto bg-white rounded-[2rem] p-8 md:p-12 shadow-2xl"
        >
          <div class="space-y-6">
            <div>
              <label for="name" class="block text-sm font-bold text-on-surface-dim uppercase tracking-wider mb-2">Namn *</label>
              <input
                v-model="form.name"
                type="text"
                id="name"
                required
                class="w-full px-5 py-4 rounded-xl border-2 border-outline/30 focus:border-brand focus:outline-none text-on-surface text-lg transition-colors"
                placeholder="Ditt namn"
              />
            </div>

            <div>
              <label for="phone" class="block text-sm font-bold text-on-surface-dim uppercase tracking-wider mb-2">Telefon *</label>
              <input
                v-model="form.phone"
                type="tel"
                id="phone"
                required
                class="w-full px-5 py-4 rounded-xl border-2 border-outline/30 focus:border-brand focus:outline-none text-on-surface text-lg transition-colors"
                placeholder="07X-XXX XX XX"
              />
            </div>

            <div>
              <label for="email" class="block text-sm font-bold text-on-surface-dim uppercase tracking-wider mb-2">E-post *</label>
              <input
                v-model="form.email"
                type="email"
                id="email"
                required
                class="w-full px-5 py-4 rounded-xl border-2 border-outline/30 focus:border-brand focus:outline-none text-on-surface text-lg transition-colors"
                placeholder="din@email.se"
              />
            </div>

            <div>
              <label for="message" class="block text-sm font-bold text-on-surface-dim uppercase tracking-wider mb-2">Beskriv kort varför du vill ha en av platserna</label>
              <textarea
                v-model="form.message"
                id="message"
                rows="4"
                class="w-full px-5 py-4 rounded-xl border-2 border-outline/30 focus:border-brand focus:outline-none text-on-surface text-lg transition-colors resize-none"
                placeholder="Berätta lite om dig själv och dina mål..."
              ></textarea>
            </div>

            <div v-if="error" class="text-red-600 text-sm font-medium bg-red-50 px-4 py-3 rounded-xl">
              {{ error }}
            </div>

            <button
              type="submit"
              :disabled="isSubmitting"
              class="w-full btn bg-brand hover:bg-brand/90 text-white border-none px-8 py-5 h-auto text-xl rounded-xl shadow-lg inline-flex items-center justify-center gap-3 transition-all disabled:opacity-50"
            >
              {{ isSubmitting ? 'Skickar...' : 'Skicka' }}
              <svg v-if="!isSubmitting" class="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 8l4 4m0 0l-4 4m4-4H3" />
              </svg>
            </button>
          </div>
        </form>

        <p class="text-center mt-10 text-white/60">
          Frågor? Kontakta oss på <a href="mailto:info@coregym.club" class="underline hover:text-white">info@coregym.club</a>
          eller <a href="tel:0850924549" class="underline hover:text-white">08-509 245 49</a>
        </p>
      </div>
    </section>
  </div>
</template>
