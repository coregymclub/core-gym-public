<script setup lang="ts">
useHead({
  title: 'Våra gym - Core Gym Club',
  meta: [{ name: 'description', content: 'Fyra gym i Haninge. Generösa öppettider och ett medlemskap som gäller överallt.' }]
})

const gyms = [
  { 
    name: 'Vegastaden', 
    slug: 'vegastaden', 
    tag: 'Störst', 
    size: '2900 kvm',
    image: '/images/gyms/vegastaden-roof.webp',
    description: 'Vårt flaggskepp. Tre våningar med takterrass, padelbanor och massor av yta.'
  },
  { 
    name: 'Tungelsta', 
    slug: 'tungelsta', 
    tag: 'Originalet', 
    size: 'Sedan 2012',
    image: '/images/gyms/tungelsta.webp',
    description: 'Där allt började. Familjärt, varmt och personligt i en unik lokal.'
  },
  { 
    name: 'Västerhaninge', 
    slug: 'vasterhaninge', 
    tag: 'Klassiskt', 
    size: 'Mitt i centrum',
    image: '/images/gyms/vasterhaninge.webp',
    description: 'Effektiv träning mitt i vardagen. Nära pendeltåg och centrum.'
  },
  { 
    name: 'Ösmo', 
    slug: 'osmo', 
    tag: 'Nyhet', 
    size: 'Kommer 2026',
    image: '/images/bw-grid.jpg',
    description: 'Vårt nyaste tillskott. Samma hjärta, ny adress. Öppnar 2026.'
  },
]
</script>

<template>
  <div>
    <!-- Hero -->
    <section class="min-h-[70vh] flex items-center justify-center bg-brand text-white px-6 pt-32 pb-40 relative overflow-hidden">
      <!-- Background Image -->
      <div class="absolute inset-0 z-0">
        <img src="/images/hero-desktop.webp" alt="Våra gym" class="w-full h-full object-cover opacity-50 mix-blend-multiply" />
        <div class="absolute inset-0 bg-gradient-to-b from-brand-dark/80 to-brand/80 mix-blend-multiply" />
      </div>

      <div class="relative z-10 text-center max-w-5xl mx-auto">
        <!-- Stack Icon -->
        <div class="flex justify-center mb-8">
          <svg width="48" height="48" viewBox="0 0 48 48" fill="none" xmlns="http://www.w3.org/2000/svg" class="text-white opacity-80">
            <path d="M24 2L4 12L24 22L44 12L24 2Z" stroke="currentColor" stroke-width="3" stroke-linecap="round" stroke-linejoin="round"/>
            <path d="M4 22L24 32L44 22" stroke="currentColor" stroke-width="3" stroke-linecap="round" stroke-linejoin="round"/>
            <path d="M4 32L24 42L44 32" stroke="currentColor" stroke-width="3" stroke-linecap="round" stroke-linejoin="round"/>
          </svg>
        </div>

        <h1 class="font-display font-bold text-5xl md:text-7xl lg:text-8xl leading-[0.9] text-white mb-8 uppercase tracking-tighter">
          Våra anläggningar
        </h1>
        <p class="text-xl md:text-2xl text-white/90 max-w-3xl mx-auto leading-relaxed font-medium">
          Fyra gym i Haninge. Öppet 03:55–00:05 varje dag. Ett kort gäller överallt.
        </p>
      </div>
    </section>

    <!-- Gyms -->
    <section class="bg-surface relative z-10 -mt-24 rounded-t-4xl pt-24 pb-32">
      <div class="container">
        <div class="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-16">
          <NuxtLink
            v-for="gym in gyms"
            :key="gym.slug"
            :to="`/${gym.slug}`"
            class="group flex flex-col h-full"
          >
            <!-- Image Container - Strict Aspect Ratio -->
            <div class="aspect-[4/3] relative overflow-hidden rounded-2xl shadow-lg mb-8 bg-surface-dim">
              <img 
                :src="gym.image" 
                :alt="gym.name" 
                class="w-full h-full object-cover transition-transform duration-700 ease-out group-hover:scale-105" 
              />
              <div class="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
              
              <!-- Tag inside image -->
              <div class="absolute top-6 left-6">
                <span class="bg-white text-on-surface px-5 py-2 rounded-full text-sm font-bold tracking-widest uppercase shadow-md">
                  {{ gym.tag }}
                </span>
              </div>
            </div>
            
            <!-- Content -->
            <div class="flex flex-col flex-1 px-2">
              <div class="flex justify-between items-baseline mb-4">
                <h2 class="font-display font-bold text-4xl md:text-5xl uppercase tracking-tight text-on-surface group-hover:text-brand transition-colors">
                  {{ gym.name }}
                </h2>
              </div>
              
              <p class="text-xl text-on-surface-dim mb-8 flex-1 leading-relaxed">
                {{ gym.description }}
              </p>
              
              <div class="flex items-center justify-between pt-6 border-t border-outline/50">
                <span class="text-sm font-bold tracking-widest uppercase text-on-surface-dim">{{ gym.size }}</span>
                <span class="text-brand font-bold text-sm tracking-widest uppercase flex items-center group-hover:translate-x-2 transition-transform">
                  Utforska
                  <svg class="w-5 h-5 ml-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 8l4 4m0 0l-4 4m4-4H3" />
                  </svg>
                </span>
              </div>
            </div>
          </NuxtLink>
        </div>
      </div>
    </section>

    <!-- Map - All Gyms -->
    <section class="section bg-surface-container">
      <div class="container">
        <div class="text-center mb-12">
          <h2 class="font-display font-bold text-4xl md:text-5xl mb-4 text-on-surface uppercase tracking-tight">
            Hitta oss
          </h2>
          <p class="text-xl text-on-surface-dim">Klicka på en pin för mer information</p>
        </div>
        <div class="h-[500px] rounded-[2rem] overflow-hidden shadow-elevated max-w-5xl mx-auto">
          <ClientOnly>
            <AppleMap />
          </ClientOnly>
        </div>
      </div>
    </section>

    <!-- CTA -->
    <section class="py-32 bg-surface-dim">
      <div class="container text-center max-w-4xl">
        <h2 class="font-display font-bold text-5xl md:text-6xl mb-8 uppercase tracking-tighter">Träna på dina villkor</h2>
        <p class="text-2xl text-on-surface-dim mb-12 leading-relaxed font-medium">
          Inga bindningstider. Inga startavgifter. <br class="hidden md:inline" />
          Bara ren träningsglädje.
        </p>
        <NuxtLink to="/priser" class="btn btn-primary px-12 py-6 h-auto text-xl rounded-full shadow-xl hover:shadow-2xl hover:-translate-y-1 transition-all">
          Se medlemskap
        </NuxtLink>
      </div>
    </section>
  </div>
</template>