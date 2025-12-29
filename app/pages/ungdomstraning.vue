<script setup lang="ts">
useHead({
  title: 'Ungdomsträning - Core Gym Club',
  meta: [
    { name: 'description', content: 'Ungdomsträning på Core Gym Tungelsta. Säker och rolig träning för ungdomar 13-18 år med erfarna tränare. Bygg styrka och självförtroende.' }
  ]
})

const benefits = [
  {
    title: 'Säker träning',
    description: 'Lär dig rätt teknik från början med våra erfarna tränare.',
    icon: 'shield',
  },
  {
    title: 'Social gemenskap',
    description: 'Träffa andra ungdomar med samma intresse för träning.',
    icon: 'users',
  },
  {
    title: 'Bygg självförtroende',
    description: 'Se framsteg och väx som person både fysiskt och mentalt.',
    icon: 'star',
  },
  {
    title: 'Rolig träning',
    description: 'Varierade pass som håller motivationen uppe.',
    icon: 'sparkles',
  },
]

const faqs = [
  {
    question: 'Vilken ålder gäller?',
    answer: 'Ungdomsträning är för dig som är 13-18 år. Du måste ha fyllt 13 år för att delta.',
  },
  {
    question: 'Behöver jag någon erfarenhet?',
    answer: 'Nej, vi börjar från grunden och anpassar träningen efter din nivå. Alla är välkomna oavsett tidigare erfarenhet.',
  },
  {
    question: 'Vad kostar det?',
    answer: 'Kontakta oss för aktuella priser på ungdomsmedlemskap. Vi erbjuder fördelaktiga priser för ungdomar.',
  },
  {
    question: 'Behöver mina föräldrar skriva på något?',
    answer: 'Ja, för medlemmar under 18 år behöver en vårdnadshavare godkänna medlemskapet.',
  },
  {
    question: 'Kan jag träna när som helst?',
    answer: 'Ja, med ett ungdomsmedlemskap kan du träna under våra öppettider. Vi rekommenderar dock att börja med de ledda passen.',
  },
]
</script>

<template>
  <div>
    <!-- Hero -->
    <section class="relative min-h-[60vh] flex items-center justify-center bg-gradient-to-br from-blue-900 via-indigo-900 to-violet-900 overflow-hidden text-white px-6">
      <!-- Geometric shapes -->
      <div class="absolute inset-0 overflow-hidden pointer-events-none">
        <div class="absolute top-20 left-10 w-20 h-20 border-2 border-blue-500/20 rotate-45" />
        <div class="absolute top-40 right-20 w-16 h-16 border-2 border-violet-500/20 rotate-12" />
        <div class="absolute bottom-20 left-1/4 w-24 h-24 border-2 border-indigo-500/20 -rotate-12" />
        <div class="absolute bottom-40 right-1/3 w-12 h-12 bg-blue-500/10 rotate-45" />
      </div>

      <div class="text-center relative z-10 max-w-4xl mx-auto">
        <span class="inline-block px-4 py-2 bg-blue-500/20 text-blue-200 rounded-full text-sm font-bold tracking-widest uppercase mb-6 border border-blue-500/30">
          13-18 år
        </span>

        <h1 class="text-hero text-white mb-8">
          Ungdoms<br />träning
        </h1>

        <p class="text-lead text-white/80 max-w-2xl mx-auto mb-12">
          Säker och rolig träning för ungdomar. Lär dig grunderna i styrketräning
          med vägledning av våra erfarna tränare.
        </p>

        <div class="flex flex-col sm:flex-row gap-4 justify-center">
          <a href="https://coregymclub.se/provtrana" class="btn bg-blue-500 text-white hover:bg-blue-400 border-none shadow-lg">
            Boka provträning
          </a>
          <NuxtLink to="/tungelsta" class="btn bg-transparent text-white border border-white/30 hover:bg-white/10">
            Om Tungelsta
          </NuxtLink>
        </div>
      </div>
    </section>

    <!-- Location badge -->
    <section class="bg-surface border-b border-outline">
      <div class="container py-6">
        <div class="flex items-center justify-center gap-3 text-body text-on-surface-dim">
          <svg class="w-5 h-5 text-brand" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
          </svg>
          <span>
            Ungdomsträning erbjuds på <NuxtLink to="/tungelsta" class="text-brand hover:underline font-bold">Core Gym Tungelsta</NuxtLink>
          </span>
        </div>
      </div>
    </section>

    <!-- Benefits -->
    <section class="section bg-surface-dim">
      <div class="container">
        <div class="text-center mb-16">
          <h2 class="text-section mb-4">Varför träna hos oss?</h2>
          <p class="text-lead">
            Vi skapar en trygg miljö där ungdomar kan utvecklas.
          </p>
        </div>

        <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          <div
            v-for="benefit in benefits"
            :key="benefit.title"
            class="card text-center hover:-translate-y-2 transition-transform duration-300"
          >
            <div class="w-14 h-14 mx-auto mb-6 rounded-2xl bg-blue-100 text-blue-600 flex items-center justify-center">
              <svg v-if="benefit.icon === 'shield'" class="w-7 h-7" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                 <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
              </svg>
              <svg v-else-if="benefit.icon === 'users'" class="w-7 h-7" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" />
              </svg>
              <svg v-else-if="benefit.icon === 'star'" class="w-7 h-7" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z" />
              </svg>
              <svg v-else class="w-7 h-7" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 3v4M3 5h4M6 17v4m-2-2h4m5-16l2.286 6.857L21 12l-5.714 2.143L13 21l-2.286-6.857L5 12l5.714-2.143L13 3z" />
              </svg>
            </div>
            <h3 class="text-title mb-3">{{ benefit.title }}</h3>
            <p class="text-body text-on-surface-dim">{{ benefit.description }}</p>
          </div>
        </div>
      </div>
    </section>

    <!-- What to expect -->
    <section class="section bg-surface">
      <div class="container">
        <div class="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
          <div class="order-2 lg:order-1">
            <div class="relative max-w-md mx-auto lg:max-w-none">
              <div class="absolute -inset-4 bg-gradient-to-br from-blue-200 to-indigo-200 rounded-[2.5rem] transform -rotate-2" />
              <div class="relative aspect-[4/3] rounded-[2rem] overflow-hidden bg-blue-100 shadow-elevated">
                <div class="absolute inset-0 flex items-center justify-center">
                  <span class="font-display text-[10rem] text-blue-200/50 font-bold">U</span>
                </div>
                 <!-- Placeholder for real image -->
                <img src="/images/lifting-eleiko-nike-dark.webp" class="absolute inset-0 w-full h-full object-cover opacity-80 mix-blend-overlay" />
              </div>
            </div>
          </div>

          <div class="order-1 lg:order-2">
            <h2 class="text-section text-left mb-8">Vad kan du förvänta dig?</h2>
            <div class="space-y-8">
              <div class="flex gap-6">
                <div class="w-12 h-12 rounded-full bg-blue-100 flex items-center justify-center flex-shrink-0">
                  <span class="font-display text-blue-600 text-xl font-bold">1</span>
                </div>
                <div>
                  <h4 class="text-title mb-2">Introduktion</h4>
                  <p class="text-body text-on-surface-dim">Vi börjar med en genomgång av gymmet och grundläggande säkerhet.</p>
                </div>
              </div>
              <div class="flex gap-6">
                <div class="w-12 h-12 rounded-full bg-blue-100 flex items-center justify-center flex-shrink-0">
                  <span class="font-display text-blue-600 text-xl font-bold">2</span>
                </div>
                <div>
                  <h4 class="text-title mb-2">Teknikträning</h4>
                  <p class="text-body text-on-surface-dim">Lär dig rätt teknik på grundövningar som knäböj, marklyft och bänkpress.</p>
                </div>
              </div>
              <div class="flex gap-6">
                <div class="w-12 h-12 rounded-full bg-blue-100 flex items-center justify-center flex-shrink-0">
                  <span class="font-display text-blue-600 text-xl font-bold">3</span>
                </div>
                <div>
                  <h4 class="text-title mb-2">Eget program</h4>
                  <p class="text-body text-on-surface-dim">Få ett personligt träningsprogram anpassat efter dina mål.</p>
                </div>
              </div>
              <div class="flex gap-6">
                <div class="w-12 h-12 rounded-full bg-blue-100 flex items-center justify-center flex-shrink-0">
                  <span class="font-display text-blue-600 text-xl font-bold">4</span>
                </div>
                <div>
                  <h4 class="text-title mb-2">Uppföljning</h4>
                  <p class="text-body text-on-surface-dim">Regelbunden uppföljning för att säkerställa att du utvecklas.</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>

    <!-- FAQ -->
    <section class="section bg-surface-dim">
      <div class="container">
        <h2 class="text-section mb-12">Vanliga frågor</h2>

        <div class="max-w-3xl mx-auto space-y-4">
          <details
            v-for="faq in faqs"
            :key="faq.question"
            class="group bg-surface rounded-2xl overflow-hidden shadow-sm"
          >
            <summary class="flex items-center justify-between p-6 cursor-pointer list-none">
              <span class="text-title text-base">{{ faq.question }}</span>
              <svg class="w-5 h-5 text-on-surface-dim transform group-open:rotate-180 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7" />
              </svg>
            </summary>
            <div class="px-6 pb-6 text-body text-on-surface-dim">
              {{ faq.answer }}
            </div>
          </details>
        </div>
      </div>
    </section>

    <!-- Parent info -->
    <section class="section bg-surface">
      <div class="container">
        <div class="max-w-3xl mx-auto text-center card bg-blue-50 border border-blue-100 p-8 md:p-12">
          <div class="w-16 h-16 bg-white rounded-full flex items-center justify-center mx-auto mb-6 shadow-sm text-blue-600">
            <svg class="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" /></svg>
          </div>
          <h2 class="text-title text-3xl mb-4">Till dig som är förälder</h2>
          <p class="text-body-lg text-on-surface-dim mb-8 max-w-2xl mx-auto">
            Vi förstår att du vill att ditt barn ska träna säkert. Därför har vi utbildade tränare
            som alltid finns tillgängliga, och vi lägger stor vikt vid att lära ut rätt teknik
            innan vikterna ökar. Kontakta oss gärna om du har frågor.
          </p>
          <div class="flex flex-col sm:flex-row justify-center gap-4">
            <NuxtLink to="/kontakt" class="btn-secondary bg-white hover:bg-blue-50">
              Kontakta oss
            </NuxtLink>
            <a href="tel:08-7452220" class="btn bg-transparent text-on-surface border border-outline hover:bg-white hover:border-blue-200">
              Ring 08-745 22 20
            </a>
          </div>
        </div>
      </div>
    </section>

    <!-- CTA -->
    <section class="section bg-gradient-to-br from-blue-600 to-indigo-600 text-white relative overflow-hidden">
       <!-- Decor -->
      <div class="absolute inset-0">
         <div class="absolute top-0 right-0 w-64 h-64 bg-white/10 rounded-full translate-x-1/2 -translate-y-1/2 blur-3xl" />
         <div class="absolute bottom-0 left-0 w-64 h-64 bg-white/10 rounded-full -translate-x-1/2 translate-y-1/2 blur-3xl" />
      </div>

      <div class="container text-center relative z-10">
        <h2 class="text-section text-white mb-6">Börja träna idag</h2>
        <p class="text-lead text-white/80 mb-10">
          Boka en kostnadsfri provträning och se om Core Gym passar dig.
        </p>
        <a href="https://coregymclub.se/provtrana" class="btn bg-white text-blue-700 hover:bg-blue-50 border-none shadow-xl hover:shadow-2xl">
          Boka gratis provträning
        </a>
      </div>
    </section>
  </div>
</template>
