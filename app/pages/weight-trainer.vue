<script setup lang="ts">
useHead({
  title: 'Weight Trainer - Core Gym Club',
  meta: [
    { name: 'description', content: 'Bli Weight Trainer coach på Core Gym Club Vegastaden. Hjälp människor nå sina mål genom personlig träning och kostråd.' }
  ]
})

const benefits = [
  'Jobba med ett beprövat program som hjälpt tusentals människor',
  'Fast kundkrets genom vårt WeightTrainer-program',
  'Professionellt stöd och utbildning',
  'Arbeta i en av Haninges modernaste anläggningar'
]

const responsibilities = [
  'Genomföra två personliga träningspass per vecka per klient',
  'Skapa individanpassade träningsprogram',
  'Ge kostråd med recept och produktrekommendationer',
  'Följa upp och coacha klienter löpande',
  'Dokumentera framsteg genom invägningar'
]
</script>

<template>
  <div>
    <!-- Hero -->
    <section class="min-h-[70vh] flex items-center justify-center bg-on-surface text-white px-6 relative overflow-hidden">
      <div class="absolute inset-0 z-0">
        <img
          src="/images/gyms/vegastaden.webp"
          alt="Core Gym Club Vegastaden"
          class="w-full h-full object-cover opacity-40"
        />
        <div class="absolute inset-0 bg-gradient-to-t from-on-surface via-on-surface/80 to-on-surface/60" />
      </div>

      <!-- Badge -->
      <div class="absolute top-28 left-6 lg:left-16 z-20">
        <span class="inline-block px-6 py-2 rounded-full bg-brand text-white text-sm font-bold tracking-widest uppercase shadow-lg">
          Vi söker
        </span>
      </div>

      <div class="container relative z-10 text-center pt-20">
        <h1 class="font-display font-bold text-5xl md:text-7xl lg:text-8xl leading-[0.9] text-white mb-8 uppercase tracking-tighter">
          Weight Trainer
        </h1>
        <p class="text-xl md:text-2xl text-white/80 max-w-2xl mx-auto mb-10 leading-relaxed font-medium">
          Coach i vårt 12-veckors viktminskningsprogram på Vegastaden
        </p>
        <a href="#ansok" class="btn bg-brand hover:bg-brand/90 text-white border-none px-12 py-6 h-auto text-xl rounded-full shadow-lg inline-flex items-center gap-3">
          Ansök nu
          <svg class="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 14l-7 7m0 0l-7-7m7 7V3" />
          </svg>
        </a>
      </div>
    </section>

    <!-- Om WeightTrainer -->
    <section class="section bg-surface">
      <div class="container">
        <div class="max-w-4xl mx-auto text-center mb-20">
          <h2 class="font-display font-bold text-4xl md:text-5xl mb-8 text-on-surface uppercase tracking-tight">
            En metod som fungerar
          </h2>
          <div class="space-y-6 text-xl md:text-2xl text-on-surface-dim leading-relaxed font-medium">
            <p>
              WeightTrainer är ett unikt viktminskningsprogram som under de senaste 15 åren utvecklats av experter inom träning, psykologi och nutrition. Det som skiljer WeightTrainer från många andra program är att det är utformat för att ge dig både snabba resultat och att du samtidigt ska behålla din nya vikt hela livet ut.
            </p>
            <p>
              Hemligheten är en vetenskapligt grundad metod som kombinerar kul träning och nyttig kost med att aktivt arbeta med att skapa nya positiva vanor. Under hela programmet följer en specialutbildad coach dig vars enda uppgift är att se till att du trivs och når dina mål.
            </p>
            <p>
              Träningen anpassas alltid efter dina förutsättningar och du behöver inte ha några förkunskaper. Vi lovar att det blir mycket pepp, skratt och energi! Följ programmet och vi kan garantera att du kommer få superfina resultat.
            </p>
          </div>
        </div>

        <div class="grid grid-cols-1 lg:grid-cols-2 gap-16 max-w-6xl mx-auto">
          <!-- Responsibilities -->
          <div class="bg-surface-container rounded-[2rem] p-10 lg:p-12">
            <h3 class="font-display font-bold text-2xl md:text-3xl mb-8 text-on-surface uppercase tracking-tight">
              Dina uppgifter
            </h3>
            <ul class="space-y-5">
              <li v-for="item in responsibilities" :key="item" class="flex items-start gap-4">
                <div class="w-6 h-6 rounded-full bg-on-surface flex items-center justify-center flex-shrink-0 mt-1">
                  <svg class="w-3 h-3 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="3" d="M5 13l4 4L19 7" />
                  </svg>
                </div>
                <span class="text-lg text-on-surface-dim">{{ item }}</span>
              </li>
            </ul>
          </div>

          <!-- Benefits -->
          <div class="bg-surface-container rounded-[2rem] p-10 lg:p-12">
            <h3 class="font-display font-bold text-2xl md:text-3xl mb-8 text-on-surface uppercase tracking-tight">
              Vi erbjuder
            </h3>
            <ul class="space-y-5">
              <li v-for="item in benefits" :key="item" class="flex items-start gap-4">
                <div class="w-6 h-6 rounded-full bg-on-surface flex items-center justify-center flex-shrink-0 mt-1">
                  <svg class="w-3 h-3 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="3" d="M5 13l4 4L19 7" />
                  </svg>
                </div>
                <span class="text-lg text-on-surface-dim">{{ item }}</span>
              </li>
            </ul>
          </div>
        </div>
      </div>
    </section>

    <!-- Location -->
    <section class="py-20 bg-surface-dim">
      <div class="container">
        <div class="max-w-4xl mx-auto text-center">
          <h3 class="font-display font-bold text-3xl mb-4 text-on-surface uppercase tracking-tight">Plats</h3>
          <p class="text-xl text-on-surface-dim font-medium">
            Core Gym Club Vegastaden<br />
            Vega Allé, 136 57 Vega
          </p>
        </div>
      </div>
    </section>

    <!-- Application Form -->
    <section id="ansok" class="section bg-brand text-white relative overflow-hidden">
      <div class="absolute top-0 left-0 w-[600px] h-[600px] bg-white/10 rounded-full -translate-x-1/2 -translate-y-1/2 blur-3xl" />
      <div class="absolute bottom-0 right-0 w-[400px] h-[400px] bg-black/20 rounded-full translate-x-1/2 translate-y-1/2 blur-3xl" />

      <div class="container relative z-10">
        <div class="max-w-2xl mx-auto text-center mb-16">
          <h2 class="font-display font-bold text-4xl md:text-5xl mb-6 uppercase tracking-tight">
            Skicka din ansökan
          </h2>
          <p class="text-xl text-white/80 font-medium">
            Fyll i formuläret så hör vi av oss
          </p>
        </div>

        <form
          class="max-w-xl mx-auto bg-white rounded-[2rem] p-10 lg:p-12 shadow-2xl"
          action="https://formsubmit.co/info@coregym.club"
          method="POST"
        >
          <input type="hidden" name="_subject" value="Ansökan: Weight Trainer" />
          <input type="hidden" name="_captcha" value="false" />
          <input type="hidden" name="_next" value="https://coregym.club/weight-trainer?tack=true" />

          <div class="space-y-6">
            <div>
              <label for="name" class="block text-sm font-bold text-on-surface-dim uppercase tracking-wider mb-2">Namn</label>
              <input
                type="text"
                id="name"
                name="name"
                required
                class="w-full px-5 py-4 rounded-xl border-2 border-outline/30 focus:border-brand focus:outline-none text-on-surface text-lg transition-colors"
                placeholder="Ditt namn"
              />
            </div>

            <div>
              <label for="email" class="block text-sm font-bold text-on-surface-dim uppercase tracking-wider mb-2">E-post</label>
              <input
                type="email"
                id="email"
                name="email"
                required
                class="w-full px-5 py-4 rounded-xl border-2 border-outline/30 focus:border-brand focus:outline-none text-on-surface text-lg transition-colors"
                placeholder="din@email.se"
              />
            </div>

            <div>
              <label for="phone" class="block text-sm font-bold text-on-surface-dim uppercase tracking-wider mb-2">Telefon</label>
              <input
                type="tel"
                id="phone"
                name="phone"
                required
                class="w-full px-5 py-4 rounded-xl border-2 border-outline/30 focus:border-brand focus:outline-none text-on-surface text-lg transition-colors"
                placeholder="07X-XXX XX XX"
              />
            </div>

            <div>
              <label for="message" class="block text-sm font-bold text-on-surface-dim uppercase tracking-wider mb-2">Varför vill du jobba som Weight Trainer?</label>
              <textarea
                id="message"
                name="message"
                rows="4"
                required
                class="w-full px-5 py-4 rounded-xl border-2 border-outline/30 focus:border-brand focus:outline-none text-on-surface text-lg transition-colors resize-none"
                placeholder="Berätta lite om dig själv och varför du är intresserad..."
              ></textarea>
            </div>

            <button
              type="submit"
              class="w-full btn bg-brand hover:bg-brand/90 text-white border-none px-8 py-5 h-auto text-xl rounded-xl shadow-lg inline-flex items-center justify-center gap-3 transition-all"
            >
              Skicka ansökan
              <svg class="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
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
