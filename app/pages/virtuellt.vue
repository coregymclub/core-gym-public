<script setup lang="ts">
useHead({
  title: 'Virtuella Klasser - Core Gym Club',
  meta: [
    { name: 'description', content: 'Träna när det passar dig med våra virtuella klasser. Les Mills-pass på storbildsskärm - samma intensitet, fler tider.' }
  ]
})

useThemeColor('#1a1a1a')
</script>

<template>
  <div>
    <!-- Hero Section -->
    <section class="min-h-[60vh] flex items-center justify-center bg-[#0c0c0e] text-white px-6 relative overflow-hidden">
      <!-- Subtle gradient -->
      <div class="absolute inset-0 bg-gradient-to-b from-[#0c0c0e] via-[#141416] to-[#0c0c0e]" />

      <div class="text-center relative z-10 max-w-4xl mx-auto pt-32 pb-40">
        <span class="inline-block px-6 py-2 rounded-full bg-white/5 text-white/60 mb-8 text-sm font-bold tracking-widest uppercase border border-white/10">
          Träna på dina villkor
        </span>
        <h1 class="font-display font-bold text-5xl md:text-7xl lg:text-[6rem] leading-[0.9] text-white mb-8 uppercase tracking-tighter">
          Virtuella Klasser
        </h1>
        <p class="text-xl md:text-2xl text-white/60 max-w-2xl mx-auto font-medium leading-relaxed">
          Les Mills-pass på storbildsskärm. Samma intensitet och energi - fler tider att välja på.
        </p>
      </div>
    </section>

    <!-- What is Virtual -->
    <section class="section bg-surface relative z-10 -mt-16 rounded-t-[3rem] pt-24">
      <div class="container max-w-5xl">
        <div class="grid md:grid-cols-2 gap-12 items-center">
          <div>
            <h2 class="font-display font-bold text-3xl md:text-4xl mb-6 uppercase tracking-tight">Vad är virtuellt?</h2>
            <p class="text-lg text-on-surface-dim mb-6 leading-relaxed">
              Virtuella klasser är förinspelade gruppträningspass från Les Mills som spelas på storbildsskärm i vår cykelstudio.
            </p>
            <p class="text-lg text-on-surface-dim mb-6 leading-relaxed">
              Du får samma världsklasstränare, samma musik och samma intensitet - men med flexibiliteten att välja bland fler tider.
            </p>
            <div class="flex flex-wrap gap-3">
              <span class="px-4 py-2 bg-surface-container rounded-full text-sm font-medium">BODYPUMP</span>
              <span class="px-4 py-2 bg-surface-container rounded-full text-sm font-medium">BODYCOMBAT</span>
              <span class="px-4 py-2 bg-surface-container rounded-full text-sm font-medium">BODYBALANCE</span>
              <span class="px-4 py-2 bg-surface-container rounded-full text-sm font-medium">THE TRIP</span>
              <span class="px-4 py-2 bg-surface-container rounded-full text-sm font-medium">CORE</span>
            </div>
          </div>
          <div class="aspect-video bg-on-surface rounded-3xl overflow-hidden relative">
            <div class="absolute inset-0 flex items-center justify-center">
              <div class="text-center text-white/60">
                <svg class="w-16 h-16 mx-auto mb-4" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M8 5v14l11-7z"/>
                </svg>
                <p class="font-bold uppercase tracking-wide">Vegastaden</p>
                <p class="text-sm">Cykelstudio</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>

    <!-- Schedule -->
    <section class="section bg-surface-dim">
      <div class="container">
        <h2 class="text-section mb-4">Veckans Schema</h2>
        <p class="text-lead mb-12">Alla virtuella pass körs i cykelstudion på Vegastaden.</p>

        <VirtualSchedule />
      </div>
    </section>

    <!-- How it works -->
    <section class="section bg-surface">
      <div class="container max-w-4xl">
        <h2 class="text-section mb-16">Så funkar det</h2>

        <div class="grid md:grid-cols-3 gap-12">
          <div>
            <span class="font-display font-bold text-5xl text-brand/20 mb-4 block">01</span>
            <h3 class="font-display font-bold text-xl mb-3 uppercase tracking-tight">Kolla schemat</h3>
            <p class="text-on-surface-dim leading-relaxed">Se vilka pass som går och välj en tid som passar dig.</p>
          </div>
          <div>
            <span class="font-display font-bold text-5xl text-brand/20 mb-4 block">02</span>
            <h3 class="font-display font-bold text-xl mb-3 uppercase tracking-tight">Kom till studion</h3>
            <p class="text-on-surface-dim leading-relaxed">Gå till cykelstudion på Vegastaden några minuter innan start.</p>
          </div>
          <div>
            <span class="font-display font-bold text-5xl text-brand/20 mb-4 block">03</span>
            <h3 class="font-display font-bold text-xl mb-3 uppercase tracking-tight">Kör hårt!</h3>
            <p class="text-on-surface-dim leading-relaxed">Passet startar automatiskt. Följ instruktörerna och ge allt!</p>
          </div>
        </div>
      </div>
    </section>

    <!-- CTA -->
    <section class="py-24 md:py-32 bg-[#0c0c0e] text-white">
      <div class="container text-center max-w-3xl">
        <h2 class="font-display font-bold text-4xl md:text-5xl mb-6 uppercase tracking-tight">
          Inte medlem än?
        </h2>
        <p class="text-xl text-white/60 mb-10">
          Alla medlemskap inkluderar virtuella klasser. Börja träna idag!
        </p>
        <NuxtLink to="/bli-medlem" class="inline-block px-10 py-4 bg-white text-[#0c0c0e] font-bold rounded-full hover:bg-white/90 transition-colors">
          Se medlemskap
        </NuxtLink>
      </div>
    </section>
  </div>
</template>
