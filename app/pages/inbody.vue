<script setup lang="ts">
useHead({
  title: 'InBody - Core Gym Club',
  meta: [
    { name: 'description', content: 'Få koll på din hälsa med en InBody-mätning på Core Gym Club. Mät muskelmassa, fettprocent och vätskebalans snabbt och enkelt.' }
  ]
})

useThemeColor('#0891b2') // Cyan

const benefits = [
  {
    title: 'Muskelmassa',
    desc: 'Se exakt hur mycket muskler du har och var de sitter.',
    icon: 'muscle'
  },
  {
    title: 'Fettprocent',
    desc: 'Få koll på fördelningen mellan visceralt och subkutant fett.',
    icon: 'chart'
  },
  {
    title: 'Vätskebalans',
    desc: 'Kolla att du dricker tillräckligt och inte binder vätska.',
    icon: 'water'
  },
  {
    title: 'Balans',
    desc: 'Se om du är lika stark i höger som vänster sida.',
    icon: 'balance'
  }
]

const steps = [
  {
    title: 'Boka tid',
    desc: 'Boka din mätning i receptionen eller via appen. Mätningen tar bara några minuter.'
  },
  {
    title: 'Mätningen',
    desc: 'Du står barfota på vågen och håller i handtagen. En svag ström (som inte känns) mäter motståndet i kroppen.'
  },
  {
    title: 'Resultat',
    desc: 'Du får en utskrift direkt och vi går igenom resultatet tillsammans så du förstår vad siffrorna betyder.'
  }
]
</script>

<template>
  <div>
    <!-- Hero -->
    <section class="min-h-[70vh] flex items-center justify-center bg-cyan-900 text-white px-6 relative overflow-hidden">
      <div class="absolute inset-0 z-0">
        <div class="absolute inset-0 bg-gradient-to-br from-cyan-900 via-sky-900 to-cyan-800" />
        <!-- Tech pattern -->
        <div class="absolute inset-0 opacity-10" style="background-image: radial-gradient(circle, #ffffff 1px, transparent 1px); background-size: 30px 30px;"></div>
      </div>

      <div class="text-center relative z-10 max-w-4xl mx-auto pt-32 pb-40">
        <span class="inline-block px-6 py-2 rounded-full bg-cyan-500/20 text-cyan-200 mb-8 text-sm font-bold tracking-widest uppercase border border-cyan-500/30">
          Kroppsanalys
        </span>
        <h1 class="font-display font-bold text-5xl md:text-7xl lg:text-8xl leading-[0.9] text-white mb-8 uppercase tracking-tighter">
          InBody
        </h1>
        <p class="text-xl md:text-2xl lg:text-3xl text-white/80 mb-12 max-w-2xl mx-auto leading-tight font-medium">
          Sluta gissa. Få svart på vitt. <br class="hidden md:inline" />
          Se vad din kropp består av.
        </p>
        <a href="#boka" class="btn bg-white text-cyan-800 hover:bg-cyan-50 border-none px-12 py-6 h-auto text-xl rounded-full shadow-lg">
          Boka mätning
        </a>
      </div>
    </section>

    <!-- Intro -->
    <section class="section bg-surface relative z-10 -mt-16 rounded-t-[3rem] pt-24">
      <div class="container">
        <div class="max-w-3xl mx-auto text-center mb-20">
          <h2 class="font-display font-bold text-4xl md:text-5xl mb-6 text-on-surface uppercase tracking-tight">
            Mer än bara vikt
          </h2>
          <p class="text-2xl text-on-surface-dim font-medium leading-relaxed">
            Vågen hemma berättar bara vad du väger. InBody berättar vad du består av.
            Det är det perfekta verktyget för att följa dina träningsresultat på riktigt.
          </p>
        </div>

        <!-- Grid -->
        <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          <div
            v-for="benefit in benefits"
            :key="benefit.title"
            class="p-8 rounded-3xl bg-cyan-50/50 border border-cyan-100 hover:bg-cyan-50 transition-colors text-center"
          >
            <div class="w-16 h-16 mx-auto mb-6 rounded-2xl bg-cyan-100 text-cyan-600 flex items-center justify-center">
              <!-- Icons -->
              <svg v-if="benefit.icon === 'muscle'" class="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 10V3L4 14h7v7l9-11h-7z" /></svg>
              <svg v-else-if="benefit.icon === 'chart'" class="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M11 3.055A9.001 9.001 0 1020.945 13H11V3.055z" /><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M20.488 9H15V3.512A9.025 9.025 0 0120.488 9z" /></svg>
              <svg v-else-if="benefit.icon === 'water'" class="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19.428 15.428a2 2 0 00-1.022-.547l-2.384-.477a6 6 0 00-3.86.517l-.318.158a6 6 0 01-3.86.517L6.05 15.21a2 2 0 00-1.806.547M8 4h8l-1 1v5.172a2 2 0 00.586 1.414l5 5c1.26 1.26.367 3.414-1.415 3.414H4.828c-1.782 0-2.674-2.154-1.414-3.414l5-5A2 2 0 009 10.172V5L8 4z" /></svg>
              <svg v-else class="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 6l3 1m0 0l-3 9a5.002 5.002 0 006.001 0M6 7l3 9M6 7l6-2m6 2l3-1m-3 1l-3 9a5.002 5.002 0 006.001 0M18 7l3 9m-3-9l-6-2m0-2v2m0 16V5m0 16H9m3 0h3" /></svg>
            </div>
            <h3 class="font-display font-bold text-xl text-cyan-900 mb-2">{{ benefit.title }}</h3>
            <p class="text-body text-cyan-800/70">{{ benefit.desc }}</p>
          </div>
        </div>
      </div>
    </section>

    <!-- How it works -->
    <section class="section bg-surface-dim">
      <div class="container">
        <div class="max-w-4xl mx-auto">
          <h2 class="text-center font-display font-bold text-4xl mb-16 text-on-surface uppercase tracking-tight">Så går det till</h2>
          
          <div class="space-y-12">
            <div v-for="(step, index) in steps" :key="index" class="flex gap-8 items-start group">
              <div class="w-16 h-16 rounded-full bg-white flex items-center justify-center flex-shrink-0 shadow-md group-hover:scale-110 transition-transform">
                <span class="font-display font-bold text-2xl text-cyan-600">{{ index + 1 }}</span>
              </div>
              <div class="pt-2">
                <h3 class="font-display font-bold text-2xl text-on-surface mb-3">{{ step.title }}</h3>
                <p class="text-xl text-on-surface-dim leading-relaxed">{{ step.desc }}</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>

    <!-- CTA -->
    <section id="boka" class="py-32 bg-gradient-to-br from-cyan-600 to-sky-600 text-white text-center px-6">
      <div class="container max-w-4xl mx-auto">
        <h2 class="font-display font-bold text-4xl md:text-5xl lg:text-6xl mb-10 uppercase tracking-tighter">
          Redo att mäta?
        </h2>
        <p class="text-2xl text-white/80 mb-12 max-w-2xl mx-auto leading-relaxed font-medium">
          En mätning kostar 250 kr (gratis för dig med PT-paket). <br>
          Prata med oss i receptionen.
        </p>
        <NuxtLink to="/kontakt" class="btn bg-white text-cyan-700 hover:bg-cyan-50 border-none px-14 py-7 h-auto text-2xl shadow-2xl rounded-full">
          Kontakta oss
        </NuxtLink>
      </div>
    </section>
  </div>
</template>
