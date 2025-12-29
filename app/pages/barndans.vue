<script setup lang="ts">
useHead({
  title: 'Barndans - Core Gym Club',
  meta: [{ name: 'description', content: 'Core Barndans - Rörelseglädje för barn 3-8 år! Dansa in i en magisk värld.' }]
})

useThemeColor('#ec4899')

const ageGroups = [
  { age: '3-5 år', time: 'Söndagar 16:00-16:45', desc: 'Lek och rörelse med musik' },
  { age: '6-8 år', time: 'Söndagar 17:00-17:45', desc: 'Lite tuffare dans och steg' },
]

const benefits = [
  { title: 'Tillhörighet', desc: 'Känn gemenskap i gruppen' },
  { title: 'Trygghet', desc: 'Anpassat för varje ålder' },
  { title: 'Glädje', desc: 'Ha kul med nya danskompisar' },
  { title: 'Utveckling', desc: 'Lär dig nya färdigheter' },
]

const info = [
  { label: 'Start', value: 'Våren 2026' },
  { label: 'Pris', value: '1 400 kr' },
  { label: 'Plats', value: 'Tungelsta' },
  { label: 'Kurslängd', value: '8 tillfällen' },
]
</script>

<template>
  <div>
    <!-- Hero -->
    <section class="min-h-[70vh] flex items-center justify-center bg-gradient-to-br from-pink-500 via-purple-500 to-indigo-500 text-white px-6 relative overflow-hidden">
      <!-- Decorative elements -->
      <div class="absolute inset-0 overflow-hidden pointer-events-none">
        <div class="absolute top-20 left-10 w-32 h-32 bg-yellow-300/20 rounded-full blur-2xl" />
        <div class="absolute bottom-20 right-10 w-48 h-48 bg-pink-300/20 rounded-full blur-3xl" />
        <div class="absolute top-1/2 left-1/4 w-24 h-24 bg-blue-300/20 rounded-full blur-xl" />
      </div>

      <div class="text-center relative z-10 max-w-4xl mx-auto">
        <span class="inline-block px-4 py-2 bg-pink-200/20 text-pink-100 rounded-full text-sm font-bold tracking-widest uppercase mb-6 border border-pink-200/30">
          Nytt 2026
        </span>
        <h1 class="text-hero text-white mb-6">Core Barndans</h1>
        <p class="text-lead text-white/80 mb-4">Rörelseglädje för barn 3-8 år</p>
        <p class="text-body-lg text-white/90 mb-10 max-w-2xl mx-auto font-medium">
          Dansa in i en magisk värld fylld av musik, lek och glädje
        </p>
        <a href="#anmalan" class="btn bg-white text-purple-600 hover:bg-pink-50 shadow-lg hover:shadow-xl border-none">
          Intresseanmälan
        </a>
      </div>
    </section>

    <!-- Quick info -->
    <section class="bg-surface border-b border-outline">
      <div class="container py-8">
        <div class="flex flex-wrap justify-center gap-8 md:gap-16">
          <div v-for="item in info" :key="item.label" class="text-center">
            <span class="text-label text-on-surface-dim block mb-1">{{ item.label }}</span>
            <span class="text-title text-xl">{{ item.value }}</span>
          </div>
        </div>
      </div>
    </section>

    <!-- What is Barndans -->
    <section class="section bg-surface">
      <div class="container">
        <div class="max-w-3xl mx-auto text-center">
          <h2 class="text-section mb-6">Vad är Barndans?</h2>
          <p class="text-body-lg text-on-surface-dim mb-6 leading-relaxed">
            Core Barndans är vårt nya dansprogram för de allra yngsta. Genom lek, musik och rörelse får barnen utforska sin kropp och utveckla sin motorik i en trygg och rolig miljö.
          </p>
          <p class="text-body-lg text-on-surface-dim leading-relaxed">
            Varje pass är fyllt av fantasi och äventyr - från djungeldanser till rymdfärder. Ingen tidigare erfarenhet krävs, bara ett glatt humör!
          </p>
        </div>
      </div>
    </section>

    <!-- Age groups -->
    <section class="section bg-surface-dim">
      <div class="container">
        <h2 class="text-section mb-4">Åldersgrupper</h2>
        <p class="text-lead mb-12">Anpassade pass för varje ålder</p>

        <div class="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-3xl mx-auto">
          <div
            v-for="(group, index) in ageGroups"
            :key="group.age"
            class="card text-center hover:-translate-y-2 transition-transform duration-300"
            :class="index === 0 ? 'border-t-4 border-t-pink-400' : 'border-t-4 border-t-purple-400'"
          >
            <span
              class="font-display font-bold text-4xl md:text-5xl block mb-2"
              :class="index === 0 ? 'text-pink-400' : 'text-purple-400'"
            >
              {{ group.age }}
            </span>
            <h3 class="text-title mb-2">{{ group.time }}</h3>
            <p class="text-body text-on-surface-dim">{{ group.desc }}</p>
          </div>
        </div>
      </div>
    </section>

    <!-- Benefits -->
    <section class="section bg-surface">
      <div class="container">
        <h2 class="text-section mb-12">Varför dans för barn?</h2>
        <div class="grid grid-cols-2 md:grid-cols-4 gap-6 max-w-5xl mx-auto">
          <div v-for="benefit in benefits" :key="benefit.title" class="card text-center hover:-translate-y-1 transition-transform">
            <h3 class="text-title mb-2 text-lg">{{ benefit.title }}</h3>
            <p class="text-body text-sm text-on-surface-dim">{{ benefit.desc }}</p>
          </div>
        </div>
      </div>
    </section>

    <!-- Instructor -->
    <section class="section bg-purple-600 text-white relative grain">
      <div class="container text-center max-w-2xl mx-auto">
        <span class="text-label text-purple-200 mb-4 block uppercase tracking-widest">Instruktör</span>
        <h2 class="font-display font-bold text-4xl md:text-5xl mb-6 text-white uppercase tracking-tight">Ylva Magnusson</h2>
        <p class="text-xl md:text-2xl text-white/80">
          Erfaren danspedagog som leder barndansen på Core Gym Tungelsta.
        </p>
      </div>
    </section>

    <!-- Finale -->
    <section class="section bg-surface relative overflow-hidden">
      <div class="container relative z-10">
        <div class="max-w-3xl mx-auto text-center">
          <div class="inline-flex items-center justify-center w-16 h-16 rounded-full bg-pink-100 text-pink-500 mb-6">
            <svg class="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 3v4M3 5h4M6 17v4m-2-2h4m5-16l2.286 6.857L21 12l-5.714 2.143L13 21l-2.286-6.857L5 12l5.714-2.143L13 3z" /></svg>
          </div>
          <h2 class="text-section mb-6">Avslutning med stil</h2>
          <p class="text-body-lg text-on-surface-dim">
            I slutet av kursen får barnen visa upp vad de lärt sig i en dansuppvisning för nära och kära. Efteråt blir det gemensam fika och diplomutdelning.
          </p>
        </div>
      </div>
    </section>

    <!-- Sign up -->
    <section id="anmalan" class="section bg-surface-dim">
      <div class="container">
        <div class="max-w-xl mx-auto text-center">
          <h2 class="text-section mb-4 break-words">Intresseanmälan</h2>
          <p class="text-lead mb-8">Barndans startar våren 2026</p>
          <div class="card bg-surface p-8 md:p-12 relative overflow-hidden group">
             <!-- Decor -->
             <div class="absolute top-0 right-0 w-32 h-32 bg-pink-50 rounded-full translate-x-1/3 -translate-y-1/3 blur-2xl group-hover:bg-pink-100 transition-colors" />
             
             <div class="relative z-10">
               <p class="text-body-lg text-on-surface-dim mb-8 font-medium">
                Anmäl ditt intresse så hör vi av oss när det är dags att boka plats.
              </p>
              <NuxtLink to="/kontakt" class="btn btn-primary w-full justify-center">
                Kontakta oss
              </NuxtLink>
            </div>
          </div>
        </div>
      </div>
    </section>

    <!-- FAQ -->
    <section class="section bg-surface">
      <div class="container">
        <h2 class="text-section mb-12">Vanliga frågor</h2>
        <div class="max-w-3xl mx-auto space-y-4">
          <div class="card p-6">
            <h3 class="text-title mb-2 text-lg">Behöver mitt barn ha dansat förut?</h3>
            <p class="text-body text-on-surface-dim">Nej, inga förkunskaper krävs! Vi börjar från grunden och fokuserar på glädje och lek.</p>
          </div>
          <div class="card p-6">
            <h3 class="text-title mb-2 text-lg">Vad ska mitt barn ha på sig?</h3>
            <p class="text-body text-on-surface-dim">Bekväma kläder som är lätta att röra sig i. Barfota eller strumpor fungerar bra.</p>
          </div>
          <div class="card p-6">
            <h3 class="text-title mb-2 text-lg">Får jag som förälder vara med?</h3>
            <p class="text-body text-on-surface-dim">De yngsta (3-4 år) har oftast en förälder med sig de första gångerna. Sen brukar barnen klara sig själva!</p>
          </div>
          <div class="card p-6">
            <h3 class="text-title mb-2 text-lg">Hur lång tid innan start ska jag anmäla?</h3>
            <p class="text-body text-on-surface-dim">Anmäl ditt intresse så snart som möjligt så får du förtur när anmälan öppnar.</p>
          </div>
        </div>
      </div>
    </section>

    <!-- CTA -->
    <section class="section bg-gradient-to-r from-pink-500 to-purple-500 relative overflow-hidden">
      <div class="absolute inset-0 z-0">
         <div class="absolute top-0 right-0 w-64 h-64 bg-white/10 rounded-full translate-x-1/2 -translate-y-1/2 blur-3xl" />
      </div>
      <div class="container text-center text-white relative z-10">
        <h2 class="text-section text-white mb-4">Låt dansen börja!</h2>
        <p class="text-lead text-white/80 mb-10">Anmäl intresse för Core Barndans</p>
        <NuxtLink to="/kontakt" class="btn bg-white text-purple-600 hover:bg-pink-50 shadow-xl border-none">
          Kontakta oss
        </NuxtLink>
      </div>
    </section>
  </div>
</template>
