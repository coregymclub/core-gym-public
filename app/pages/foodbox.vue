<script setup lang="ts">
useHead({
  title: 'Foodbox - Core Gym Club',
  meta: [
    { name: 'description', content: 'Foodbox på Core Gym Club. Nyttiga färdigrätter anpassade för dig som tränar. Ät gott, spara tid och nå dina mål.' }
  ]
})

useThemeColor('#16a34a') // Green

const features = [
  {
    title: 'Näringsberäknat',
    desc: 'Perfekt balans av protein, kolhydrater och fett.',
    icon: 'chart'
  },
  {
    title: 'Naturliga råvaror',
    desc: 'Inga konstigheter. Bara riktig mat.',
    icon: 'leaf'
  },
  {
    title: 'Spara tid',
    desc: 'Värm och ät på några minuter. Perfekt efter passet.',
    icon: 'clock'
  }
]

const meals = [
  'Kycklingfilé med rött råris',
  'Laxburgare med rotfrukter',
  'Chili con Carne',
  'Thaikyckling med grönsaker',
  'Vegetarisk Lasagne',
  '...och många fler'
]
</script>

<template>
  <div>
    <!-- Hero -->
    <section class="min-h-[70vh] flex items-center justify-center bg-green-900 text-white px-6 relative overflow-hidden">
      <div class="absolute inset-0 z-0">
        <div class="absolute inset-0 bg-gradient-to-br from-green-900 via-emerald-900 to-green-800" />
        <!-- Decor -->
        <div class="absolute top-0 right-0 w-full h-full opacity-10 bg-[url('https://www.transparenttextures.com/patterns/food.png')]"></div>
      </div>

      <div class="text-center relative z-10 max-w-4xl mx-auto pt-32 pb-40">
        <span class="inline-block px-6 py-2 rounded-full bg-green-500/20 text-green-200 mb-8 text-sm font-bold tracking-widest uppercase border border-green-500/30">
          Smart mat
        </span>
        <h1 class="font-display font-bold text-5xl md:text-7xl lg:text-[7rem] leading-[0.9] text-white mb-8 uppercase tracking-tighter">
          Foodbox
        </h1>
        <p class="text-xl md:text-2xl lg:text-3xl text-white/80 mb-12 max-w-2xl mx-auto leading-tight font-medium">
          Mat för dig som tränar. <br class="hidden md:inline" />
          Färdiglagat, nyttigt och gott.
        </p>
        <a href="#utbud" class="btn bg-white text-green-800 hover:bg-green-50 border-none px-12 py-6 h-auto text-xl rounded-full shadow-lg">
          Se utbud
        </a>
      </div>
    </section>

    <!-- Info -->
    <section class="section bg-surface relative z-10 -mt-16 rounded-t-[3rem] pt-24">
      <div class="container">
        <div class="max-w-4xl mx-auto text-center mb-20">
          <h2 class="font-display font-bold text-4xl md:text-5xl mb-6 text-on-surface uppercase tracking-tight">
            Resultat börjar i köket
          </h2>
          <p class="text-2xl text-on-surface-dim font-medium leading-relaxed">
            Att laga näringsriktig mat tar tid. Med Foodbox får du färdiga rätter som är specifikt framtagna för att hjälpa dig nå dina träningsmål — oavsett om du vill gå ner i vikt eller bygga muskler.
          </p>
        </div>

        <div class="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-5xl mx-auto">
          <div
            v-for="feature in features"
            :key="feature.title"
            class="p-8 rounded-3xl bg-green-50/50 border border-green-100 text-center hover:-translate-y-2 transition-transform duration-300"
          >
            <div class="w-16 h-16 mx-auto mb-6 rounded-2xl bg-green-100 text-green-600 flex items-center justify-center">
              <svg v-if="feature.icon === 'chart'" class="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" /></svg>
              <svg v-else-if="feature.icon === 'leaf'" class="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 3v4M3 5h4M6 17v4m-2-2h4m5-16l2.286 6.857L21 12l-5.714 2.143L13 21l-2.286-6.857L5 12l5.714-2.143L13 3z" /></svg>
              <svg v-else class="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
            </div>
            <h3 class="font-display font-bold text-xl text-green-900 mb-3">{{ feature.title }}</h3>
            <p class="text-lg text-green-800/70">{{ feature.desc }}</p>
          </div>
        </div>
      </div>
    </section>

    <!-- Menu -->
    <section id="utbud" class="section bg-surface-dim">
      <div class="container">
        <div class="max-w-3xl mx-auto text-center">
          <h2 class="font-display font-bold text-3xl md:text-4xl mb-12 text-on-surface uppercase tracking-tight">
            Några favoriter
          </h2>
          
          <div class="bg-white rounded-3xl p-8 shadow-sm inline-block w-full max-w-2xl">
            <ul class="space-y-4 text-left">
              <li v-for="meal in meals" :key="meal" class="flex items-center gap-4 py-3 border-b border-surface-dim last:border-0">
                <span class="w-2 h-2 rounded-full bg-green-500 flex-shrink-0" />
                <span class="text-xl text-on-surface font-medium">{{ meal }}</span>
              </li>
            </ul>
          </div>
        </div>
      </div>
    </section>

    <!-- CTA -->
    <section class="py-32 bg-green-900 text-white text-center px-6 relative overflow-hidden">
      <div class="absolute inset-0 opacity-20 bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-green-500 via-transparent to-transparent"></div>
      
      <div class="container max-w-4xl mx-auto relative z-10">
        <h2 class="font-display font-bold text-4xl md:text-6xl mb-8 uppercase tracking-tighter">
          Fyll frysen
        </h2>
        <p class="text-2xl text-white/80 mb-12 font-medium">
          Köp dina lådor direkt i receptionen på alla våra gym. <br>
          Ju fler du köper, desto bättre pris.
        </p>
        <div class="inline-flex flex-col gap-2">
          <span class="text-sm font-bold tracking-widest uppercase text-green-300 mb-2">Prisexempel</span>
          <div class="bg-white/10 backdrop-blur-md rounded-2xl p-6 border border-white/20">
            <span class="block text-3xl font-bold mb-1">639 kr</span>
            <span class="text-white/70">för 10 lådor</span>
          </div>
        </div>
      </div>
    </section>
  </div>
</template>
