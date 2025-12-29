<script setup lang="ts">
import ReviewsSection from '~/components/ReviewsSection.vue'

useHead({
  title: 'Core Gym Club - Kom som du är',
  meta: [
    { name: 'description', content: 'Fyra gym i Haninge. Öppet alla dagar. Inga pekpinnar, bara träning som passar dig.' }
  ]
})

const gyms = [
  {
    name: 'Tungelsta',
    tag: 'Originalet',
    href: '/tungelsta',
    image: '/images/gyms/tungelsta.webp',
    description: 'Där allt började. Varmt, personligt och familjärt.'
  },
  {
    name: 'Västerhaninge',
    tag: 'Klassiskt',
    href: '/vasterhaninge',
    image: '/images/gyms/vasterhaninge.webp',
    description: 'Mitt i centrum. Effektiv träning nära vardagen.'
  },
  {
    name: 'Vegastaden',
    tag: 'Störst',
    href: '/vegastaden',
    image: '/images/gyms/vegastaden-roof.webp',
    description: '2 900 kvm möjligheter. Padel, yoga och takterrass.'
  },
  {
    name: 'EGYM',
    tag: 'Framtidens träning',
    href: '/egym',
    image: '/images/egym-section.webp',
    description: 'Maskinerna ställer in sig efter dig. Träna hela kroppen på 15 min.'
  },
  {
    name: 'Ösmo',
    tag: 'Hösten 2026',
    href: '/osmo',
    image: '/images/osmo-per.webp',
    description: 'Vårt fjärde gym är på väg. Skriv upp dig för att bli först att veta mer.',
    comingSoon: true
  },
]

const features = [
  'Alla dagar 03:55–00:05',
  'Inga bindningstider',
  '3 gym (snart 4!)',
  'Ingen startavgift',
]
</script>

<template>
  <div class="grain relative">
    <!-- Hero -->
    <section class="min-h-[100vh] flex flex-col justify-end items-center px-6 pb-12 md:pb-20 relative overflow-hidden bg-surface-bright">
      <!-- Background Image -->
      <div class="absolute inset-0 z-0">
        <img
          src="/images/denise-hero.webp"
          alt="Core Gym Club"
          class="w-full h-full object-cover object-top opacity-90 scale-105 animate-[scale-in_1.5s_ease-out_forwards]"
        />
        <div class="absolute inset-0 bg-gradient-to-t from-black/80 via-black/30 to-transparent" />
      </div>

      <div class="relative z-10 max-w-6xl mx-auto text-center">
        <h1 class="font-display font-bold text-5xl md:text-8xl lg:text-[7rem] leading-[0.9] text-white mb-6 md:mb-8 animate-slide-up uppercase tracking-tighter" style="animation-delay: 0.1s">
          Kom som du är
        </h1>
        <p class="text-2xl md:text-3xl text-white/90 mb-8 md:mb-10 max-w-2xl mx-auto font-medium animate-slide-up leading-tight tracking-tight" style="animation-delay: 0.2s">
          Fyra gym i Haninge. Inga pekpinnar. <br class="hidden md:inline" />
          Bara träning som passar dig.
        </p>
        <div class="animate-slide-up" style="animation-delay: 0.3s">
          <NuxtLink to="/priser" class="btn btn-primary text-lg md:text-xl px-12 md:px-16 py-4 md:py-5 h-auto rounded-full shadow-lg hover:shadow-xl hover:-translate-y-1 transition-all">
            Bli medlem
          </NuxtLink>
        </div>
      </div>
    </section>

    <!-- USP Grid -->
    <section class="py-10 md:py-16 bg-surface">
      <div class="container">
        <div class="flex flex-wrap justify-center gap-3 md:gap-5 lg:gap-6">
          <div v-for="feature in features" :key="feature" class="px-5 py-3 md:px-8 md:py-5 lg:px-10 lg:py-6 bg-transparent rounded-full border-2 md:border-3 border-brand">
            <span class="font-display font-bold text-base md:text-2xl lg:text-3xl text-brand">{{ feature }}</span>
          </div>
        </div>
      </div>
    </section>

    <!-- Introduction -->
    <section class="section bg-on-surface relative overflow-hidden">
      <!-- Collage Background -->
      <div class="absolute inset-0 z-0 opacity-20">
        <img src="/images/hero-red.webp" alt="Gemenskap" class="w-full h-full object-cover grayscale" />
      </div>
      <div class="absolute inset-0 bg-gradient-to-b from-on-surface via-on-surface/90 to-on-surface z-0" />

      <div class="container text-center max-w-5xl relative z-10">
        <h2 class="font-display font-bold text-5xl md:text-6xl mb-10 text-white uppercase tracking-tight">Styrka börjar här</h2>
        <p class="text-2xl md:text-3xl text-white/80 leading-relaxed tracking-tight font-medium max-w-4xl mx-auto">
          Vi startade 2012 i Tungelsta. Idag driver vi fyra gym i Haninge — men känslan är densamma. 
          Här ska alla känna sig hemma, oavsett om du aldrig satt foten på ett gym eller tränat i 20 år.
        </p>
      </div>
    </section>

    <!-- Gyms -->
    <section class="section bg-surface-container overflow-hidden rounded-t-[4rem]">
      <div class="container">
        <div class="text-center mb-24 max-w-4xl mx-auto">
          <h2 class="font-display font-bold text-5xl md:text-6xl text-on-surface uppercase tracking-tight">Våra gym</h2>
        </div>

        <div class="grid grid-cols-1 md:grid-cols-2 gap-3 md:gap-4">
          <NuxtLink
            v-for="(gym, index) in gyms"
            :key="gym.name"
            :to="gym.href"
            class="group flex flex-col bg-white rounded-2xl overflow-hidden transition-all duration-300 hover:shadow-lg"
            style="box-shadow: 0px 1px 2px 0px rgb(0 0 0 / 30%), 0px 1px 3px 1px rgb(0 0 0 / 15%);"
          >
            <!-- Media - full width, rounded corners -->
            <div class="relative aspect-video overflow-hidden rounded-b-lg">
              <img
                :src="gym.image"
                :alt="gym.name"
                class="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
              />
              <!-- Dynamic dark overlay -->
              <div class="absolute inset-0 bg-gradient-to-t from-black/60 via-black/20 to-transparent"></div>
              <div class="absolute inset-0 bg-gradient-to-br from-transparent via-transparent to-black/30"></div>
              <!-- Number - large, dynamic placement -->
              <div class="absolute -top-4 -right-4 font-display font-bold text-[8rem] md:text-[10rem] text-white/20 leading-none select-none" style="-webkit-text-stroke: 1px rgba(255,255,255,0.3);">
                0{{ index + 1 }}
              </div>
              <!-- Tag badge - top left -->
              <div class="absolute top-3 left-3">
                <span :class="[
                  'px-3 py-1 rounded-full text-xs font-medium',
                  gym.comingSoon
                    ? 'bg-brand text-white'
                    : 'bg-white/90 backdrop-blur-sm text-on-surface'
                ]">{{ gym.tag }}</span>
              </div>
              <!-- Oversized name overlay -->
              <div class="absolute inset-0 flex items-end p-4">
                <h3 class="font-display font-bold text-6xl md:text-7xl lg:text-8xl text-white uppercase tracking-tighter leading-[0.85] drop-shadow-lg" style="margin-bottom: -0.15em;">
                  {{ gym.name }}
                </h3>
              </div>
            </div>

            <!-- Content area -->
            <div class="flex flex-col flex-1 p-5">
              <p class="text-xl md:text-2xl text-on-surface-dim leading-snug group-hover:text-brand transition-colors duration-300 flex items-center gap-2">
                {{ gym.description }}
                <svg class="w-5 h-5 opacity-0 -translate-x-2 group-hover:opacity-100 group-hover:translate-x-0 transition-all duration-300 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7" />
                </svg>
              </p>
            </div>
          </NuxtLink>
        </div>
      </div>
    </section>

    <!-- Services / Group Training -->
    <section class="py-16 md:py-32 bg-surface overflow-hidden">
      <div class="container">
        <div class="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-24 items-center">
          <!-- Image - hidden on mobile, shown on desktop -->
          <div class="hidden lg:block order-2 lg:order-1 relative">
            <div class="aspect-[4/5] rounded-[3rem] overflow-hidden shadow-2xl rotate-2 hover:rotate-0 transition-transform duration-700 border border-outline relative z-10 bg-surface-dim">
              <img src="/images/classes/strength.webp" alt="Gruppträning" class="w-full h-full object-cover" />
            </div>
            <div class="absolute -top-12 -left-12 w-64 h-64 bg-brand rounded-full mix-blend-multiply opacity-10 blur-3xl animate-pulse" />
          </div>

          <div class="order-1 lg:order-2">
            <h2 class="font-display font-bold text-4xl md:text-6xl mb-6 md:mb-10 text-on-surface uppercase tracking-tight">Träna tillsammans</h2>
            <p class="text-xl md:text-2xl text-on-surface-dim mb-8 md:mb-16 leading-relaxed font-medium">
              Från lugn yoga till svettiga HIIT-pass. Välj det som får dig att må bra.
            </p>

            <!-- Compact list on mobile -->
            <div class="flex flex-wrap gap-3 mb-8 md:hidden">
              <span class="px-4 py-2 bg-surface-container rounded-full text-sm font-medium text-on-surface">50+ klasser/vecka</span>
              <span class="px-4 py-2 bg-surface-container rounded-full text-sm font-medium text-on-surface">Seniorpass</span>
              <span class="px-4 py-2 bg-surface-container rounded-full text-sm font-medium text-on-surface">Mammaträning</span>
              <span class="px-4 py-2 bg-surface-container rounded-full text-sm font-medium text-on-surface">Yoga</span>
            </div>

            <!-- Full list on desktop -->
            <ul class="hidden md:block space-y-12 mb-16">
              <li class="flex items-start gap-8 group">
                <div class="w-16 h-16 rounded-full bg-surface-container flex items-center justify-center flex-shrink-0 group-hover:scale-110 transition-transform duration-300">
                  <div class="w-4 h-4 rounded-full bg-on-surface" />
                </div>
                <div>
                  <h4 class="font-display font-bold text-2xl mb-2 text-on-surface">Över 50 klasser i veckan</h4>
                  <p class="text-xl text-on-surface-dim leading-relaxed">Varierad träning för alla nivåer.</p>
                </div>
              </li>
              <li class="flex items-start gap-8 group">
                <div class="w-16 h-16 rounded-full bg-surface-container flex items-center justify-center flex-shrink-0 group-hover:scale-110 transition-transform duration-300">
                  <div class="w-4 h-4 rounded-full bg-on-surface" />
                </div>
                <div>
                  <h4 class="font-display font-bold text-2xl mb-2 text-on-surface">Seniorpass med fika</h4>
                  <p class="text-xl text-on-surface-dim leading-relaxed">Gemenskap är lika viktigt som träning.</p>
                </div>
              </li>
              <li class="flex items-start gap-8 group">
                <div class="w-16 h-16 rounded-full bg-surface-container flex items-center justify-center flex-shrink-0 group-hover:scale-110 transition-transform duration-300">
                  <div class="w-4 h-4 rounded-full bg-on-surface" />
                </div>
                <div>
                  <h4 class="font-display font-bold text-2xl mb-2 text-on-surface">Mammaträning</h4>
                  <p class="text-xl text-on-surface-dim leading-relaxed">Ta med bebis och träna tryggt.</p>
                </div>
              </li>
            </ul>
            <NuxtLink to="/schema" class="btn btn-primary px-8 py-4 md:px-12 md:py-6 h-auto text-lg md:text-xl rounded-full shadow-lg hover:shadow-xl hover:-translate-y-1 transition-all">
              Se schemat
            </NuxtLink>
          </div>
        </div>
      </div>
    </section>

    <!-- Founder Bio -->
    <section class="py-12 md:py-32 bg-surface-container">
      <div class="container px-4 md:px-8">
        <div class="bg-surface rounded-2xl md:rounded-[3rem] p-6 md:p-16 lg:p-24 shadow-elevated border border-white/50 flex flex-col lg:flex-row gap-6 md:gap-12 lg:gap-20 items-center">
          <div class="w-32 h-32 md:w-64 md:h-64 lg:w-80 lg:h-80 flex-shrink-0 rounded-full overflow-hidden border-4 md:border-8 border-surface shadow-2xl grayscale contrast-125 relative">
            <img
              src="/images/founder-per.webp"
              alt="Per Karlsson"
              class="w-full h-full object-cover scale-110"
            />
          </div>
          <div class="text-center lg:text-left flex-1">
            <h3 class="font-display font-bold text-2xl md:text-4xl lg:text-5xl mb-4 md:mb-8 leading-tight text-on-surface uppercase tracking-tight">"Jag tröttnade på att kämpa i motvind"</h3>
            <p class="text-base md:text-xl lg:text-2xl text-on-surface-dim mb-6 md:mb-12 leading-relaxed max-w-3xl font-medium">
              Per Karlsson, grundare. Idrottslärare i 25 år som ville skapa något eget.
              Core Gym Club startade 2012 med en enkel idé: träning ska vara okomplicerat och tillgängligt för alla.
            </p>
            <div>
              <p class="text-lg md:text-xl font-bold text-brand mb-1 md:mb-2 uppercase tracking-wide">Per Karlsson</p>
              <p class="text-xs md:text-sm uppercase tracking-widest text-on-surface-dim font-bold">Grundare & Ägare</p>
            </div>
          </div>
        </div>
      </div>
    </section>

    <!-- Reviews -->
    <ReviewsSection title="Vad säger våra medlemmar?" :limit="3" />

    <!-- CTA -->
    <section class="py-48 bg-brand relative overflow-hidden">
      <!-- Decorational circles -->
      <div class="absolute top-0 left-0 w-[1000px] h-[1000px] bg-white/10 rounded-full -translate-x-1/3 -translate-y-1/3 blur-3xl" />
      <div class="absolute bottom-0 right-0 w-[800px] h-[800px] bg-black/20 rounded-full translate-x-1/3 translate-y-1/3 blur-3xl" />
      
      <div class="container text-center text-white relative z-10 max-w-5xl mx-auto">
        <h2 class="font-display font-bold text-6xl md:text-8xl mb-12 uppercase tracking-tighter">Redo att komma igång?</h2>
        <p class="text-2xl md:text-3xl text-white/90 mb-20 leading-relaxed font-medium max-w-3xl mx-auto">
          Inga bindningstider. Provträning ingår inte — men vi lovar att ta hand om dig när du väl är här.
        </p>
        <div class="flex flex-col sm:flex-row justify-center gap-8">
          <NuxtLink to="/priser" class="btn bg-white text-brand hover:bg-surface-dim border-none px-14 py-7 h-auto text-2xl shadow-2xl hover:shadow-[0_20px_50px_rgba(0,0,0,0.3)] hover:-translate-y-1 transition-all rounded-full">
            Se våra medlemskap
          </NuxtLink>
          <NuxtLink to="/kontakt" class="btn border-2 border-white/30 hover:bg-white/10 text-white bg-transparent px-14 py-7 h-auto text-2xl backdrop-blur-sm rounded-full">
            Kontakta oss
          </NuxtLink>
        </div>
      </div>
    </section>
  </div>
</template>