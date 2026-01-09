<script setup lang="ts">
import ReviewsSection from '~/components/ReviewsSection.vue'

useHead({
  title: 'Core Gym Club - Kom som du är',
  meta: [
    { name: 'description', content: 'Fyra gym i Haninge. Öppet alla dagar. Träning utan trösklar, bara träning som passar dig.' }
  ]
})

const gyms = [
  {
    name: 'Tungelsta',
    tag: 'Originalet',
    href: '/tungelsta',
    image: '/images/gyms/tungelsta-gym-new.webp',
    description: 'Där allt började. Varmt, personligt och familjärt.',
    established: 2012
  },
  {
    name: 'Västerhaninge',
    tag: 'Klassiskt',
    href: '/vasterhaninge',
    image: '/images/gyms/vasterhaninge-gym-new-2.webp',
    description: 'Mitt i centrum. Effektiv träning nära vardagen.',
    established: 2016
  },
  {
    name: 'Vegastaden',
    tag: 'Störst',
    href: '/vegastaden',
    image: '/images/gyms/vegastaden-new.avif',
    description: '2 900 kvm möjligheter. Padel, yoga och takterrass.',
    established: 2022
  },
  {
    name: 'EGYM',
    tag: 'Framtidens träning',
    href: '/egym',
    image: '/images/egym-per.avif',
    description: 'Maskinerna ställer in sig efter dig. Träna hela kroppen på 15 min.',
    established: 2025
  },
  {
    name: 'Ösmo',
    tag: 'Hösten 2026',
    href: '/osmo',
    image: '/images/osmo-per.webp',
    description: 'Vårt fjärde gym är på väg.',
    comingSoon: true,
    established: 2026
  },
]

// Group training carousel
const carouselImages = [
  { src: '/images/yoga-class-group.webp', alt: 'Yoga' },
  { src: '/images/bodypump.webp', alt: 'Bodypump' },
  { src: '/images/mikaela-lauren-box.webp', alt: 'Boxning' },
  { src: '/images/classes/cycling.jpg', alt: 'Cykel' },
  { src: '/images/denise-biking.webp', alt: 'Spinning' },
  { src: '/images/yoga-class.webp', alt: 'Yoga' },
]

const carouselRef = ref<HTMLElement | null>(null)
const isScrolling = ref(false)
const infiniteImages = computed(() => [...carouselImages, ...carouselImages, ...carouselImages])

const getItemWidth = () => {
  if (typeof window === 'undefined') return 105
  return window.innerWidth >= 768 ? 180 : 105
}

const onCarouselScroll = () => {
  if (!carouselRef.value || isScrolling.value) return
  const container = carouselRef.value
  const itemWidth = getItemWidth()
  const singleSetWidth = carouselImages.length * itemWidth
  const scrollLeft = container.scrollLeft

  if (scrollLeft >= singleSetWidth * 2 - container.clientWidth / 2) {
    isScrolling.value = true
    container.scrollLeft = scrollLeft - singleSetWidth
    requestAnimationFrame(() => { isScrolling.value = false })
  } else if (scrollLeft <= singleSetWidth / 2) {
    isScrolling.value = true
    container.scrollLeft = scrollLeft + singleSetWidth
    requestAnimationFrame(() => { isScrolling.value = false })
  }
}

const scrollToCenter = () => {
  if (!carouselRef.value) return
  const container = carouselRef.value
  const itemWidth = getItemWidth()
  const centerPosition = carouselImages.length * itemWidth + (carouselImages.length / 2) * itemWidth
  container.scrollTo({ left: centerPosition, behavior: 'instant' })
}

onMounted(() => {
  setTimeout(scrollToCenter, 100)
})



useThemeColor('#1a1a1a')
</script>

<template>
  <div>
    <!-- ==================== MOBILE HERO (up to lg) ==================== -->
    <div class="lg:hidden relative overflow-hidden">
      <!-- Background Image (covers both hero and USP sections) -->
      <div class="absolute inset-0 z-0">
        <img
          src="/images/pt/denise-hero.avif"
          alt="Core Gym Club"
          class="w-full h-full object-cover object-top"
        />
        <div class="absolute inset-0 bg-gradient-to-b from-black/20 via-black/40 to-black/80" />
      </div>

      <!-- Hero -->
      <section class="min-h-[100svh] flex flex-col justify-end items-center px-6 pb-12 relative">
        <div class="relative z-10 max-w-6xl mx-auto text-center">
          <h1 class="font-display font-bold text-5xl md:text-7xl leading-[0.9] text-white mb-6 animate-slide-up uppercase tracking-tighter" style="animation-delay: 0.1s">
            Kom som du är
          </h1>
          <p class="text-2xl md:text-3xl text-white/90 mb-8 max-w-2xl mx-auto font-medium animate-slide-up leading-tight tracking-tight" style="animation-delay: 0.2s">
            Fyra gym i Haninge. Inga pekpinnar.<br />
            Bara träning som passar dig.
          </p>
          <div class="flex flex-col items-center gap-3 animate-slide-up w-full max-w-[280px] mx-auto" style="animation-delay: 0.3s">
            <NuxtLink to="/bli-medlem" class="btn btn-primary btn-lg w-full">
              Bli medlem
            </NuxtLink>
            <NuxtLink to="/logga-in" class="btn btn-ghost-light btn-lg w-full">
              Logga in
            </NuxtLink>
          </div>
        </div>
      </section>

      <!-- USP + Introduction (Mobile) -->
      <section class="py-16 relative">
        <div class="container relative z-10">
          <!-- USP Grid -->
          <div class="grid grid-cols-2 gap-8 max-w-md mx-auto mb-16">
            <div class="text-center">
              <div class="w-14 h-14 mx-auto mb-5">
                <img src="/png-icons/open-hours.png" alt="" class="w-full h-full object-contain brightness-0 invert" />
              </div>
              <p class="font-display font-bold text-lg text-white">Öppet alla dagar</p>
              <p class="font-display font-bold text-lg text-white/60">03:55–00:05</p>
            </div>
            <div class="text-center">
              <div class="w-14 h-14 mx-auto mb-5">
                <img src="/png-icons/ingen-bindningstid.png" alt="" class="w-full h-full object-contain brightness-0 invert" />
              </div>
              <p class="font-display font-bold text-lg text-white">Ingen bindning</p>
            </div>
            <div class="text-center">
              <div class="w-14 h-14 mx-auto mb-5">
                <img src="/png-icons/location.png" alt="" class="w-full h-full object-contain brightness-0 invert" />
              </div>
              <p class="font-display font-bold text-lg text-white">4 gym i Haninge</p>
              <p class="font-display font-bold text-lg text-white/60">(snart 5!)</p>
            </div>
            <div class="text-center">
              <div class="w-14 h-14 mx-auto mb-5">
                <img src="/png-icons/no-starting-fee.png" alt="" class="w-full h-full object-contain brightness-0 invert" />
              </div>
              <p class="font-display font-bold text-lg text-white">Ingen startavgift</p>
              <p class="font-display font-bold text-lg text-white/60">(börja direkt)</p>
            </div>
          </div>

          <!-- Divider -->
          <div class="w-16 h-1 bg-white/30 mx-auto mb-16 rounded-full" />

          <!-- Introduction text -->
          <div class="text-center max-w-xl mx-auto">
            <h2 class="font-display font-bold text-4xl mb-8 text-white uppercase tracking-tight">Styrka börjar här</h2>
            <p class="text-xl text-white/70 leading-relaxed font-medium">
              Vi startade 2012 i Tungelsta. Idag driver vi fyra gym i Haninge — men känslan är densamma.
              Här ska alla känna sig hemma, oavsett om du aldrig satt foten på ett gym eller tränat i 20 år.
            </p>
          </div>
        </div>
      </section>
    </div>

    <!-- ==================== DESKTOP HERO (lg and up) - VIDEO CENTERED ==================== -->
    <div class="hidden lg:block">
      <section class="min-h-screen relative overflow-hidden">
        <!-- Background Video -->
        <div class="absolute inset-0 z-0">
          <video
            autoplay
            muted
            loop
            playsinline
            class="w-full h-full object-cover"
          >
            <source src="/videos/hero_video_compressed.mp4" type="video/mp4" />
          </video>
          <div class="absolute inset-0 bg-gradient-to-b from-black/30 via-black/40 to-black/70" />
        </div>

        <!-- Centered Content -->
        <div class="relative z-10 min-h-screen flex flex-col justify-center items-center px-8 py-20">
          <div class="max-w-4xl mx-auto text-center">
            <!-- Logo -->
            <div class="mb-10 animate-slide-up" style="animation-delay: 0.05s">
              <img src="/images/logo.svg" alt="Core Gym Club" class="h-16 xl:h-20 mx-auto" />
            </div>

            <h1 class="font-display font-bold text-7xl xl:text-8xl 2xl:text-9xl leading-[0.85] text-white mb-8 animate-slide-up uppercase tracking-tighter" style="animation-delay: 0.1s">
              Kom som du är
            </h1>

            <p class="text-2xl xl:text-3xl text-white/80 mb-12 font-medium animate-slide-up leading-relaxed max-w-2xl mx-auto" style="animation-delay: 0.2s">
              Inga pekpinnar. Bara träning som passar dig.
            </p>

            <!-- CTAs -->
            <div class="flex flex-row gap-4 justify-center animate-slide-up mb-20" style="animation-delay: 0.3s">
              <NuxtLink to="/bli-medlem" class="btn btn-primary btn-lg px-10">
                Bli medlem
              </NuxtLink>
              <NuxtLink to="/logga-in" class="btn btn-ghost-light btn-lg px-10">
                Logga in
              </NuxtLink>
            </div>

            <!-- USP Row -->
            <div class="grid grid-cols-4 gap-8 pt-10 border-t border-white/20 animate-slide-up max-w-4xl mx-auto" style="animation-delay: 0.4s">
              <div class="text-center">
                <div class="w-12 h-12 mx-auto mb-3">
                  <img src="/png-icons/open-hours.png" alt="" class="w-full h-full object-contain brightness-0 invert" />
                </div>
                <p class="font-display font-bold text-base text-white">Öppet alla dagar</p>
                <p class="text-sm text-white/50">03:55–00:05</p>
              </div>
              <div class="text-center">
                <div class="w-12 h-12 mx-auto mb-3">
                  <img src="/png-icons/ingen-bindningstid.png" alt="" class="w-full h-full object-contain brightness-0 invert" />
                </div>
                <p class="font-display font-bold text-base text-white">Ingen bindning</p>
                <p class="text-sm text-white/50">Avsluta när du vill</p>
              </div>
              <div class="text-center">
                <div class="w-12 h-12 mx-auto mb-3">
                  <img src="/png-icons/location.png" alt="" class="w-full h-full object-contain brightness-0 invert" />
                </div>
                <p class="font-display font-bold text-base text-white">4 gym i Haninge</p>
                <p class="text-sm text-white/50">(snart 5!)</p>
              </div>
              <div class="text-center">
                <div class="w-12 h-12 mx-auto mb-3">
                  <img src="/png-icons/no-starting-fee.png" alt="" class="w-full h-full object-contain brightness-0 invert" />
                </div>
                <p class="font-display font-bold text-base text-white">Ingen startavgift</p>
                <p class="text-sm text-white/50">Börja direkt</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      <!-- Introduction section (Desktop) -->
      <section class="py-20 xl:py-24 bg-on-surface">
        <div class="container">
          <div class="text-center max-w-4xl mx-auto">
            <h2 class="font-display font-bold text-4xl xl:text-5xl 2xl:text-6xl mb-6 xl:mb-8 text-white uppercase tracking-tight">Styrka börjar här</h2>
            <p class="text-lg xl:text-xl 2xl:text-2xl text-white/60 leading-relaxed font-medium">
              Vi startade 2012 i Tungelsta. Idag driver vi fyra gym i Haninge — men känslan är densamma.
              Här ska alla känna sig hemma, oavsett om du aldrig satt foten på ett gym eller tränat i 20 år.
            </p>
          </div>
        </div>
      </section>
    </div>

    <!-- Gyms -->
    <section class="py-24 md:py-32 bg-[#f5f5f7]">
      <div class="container">
        <div class="max-w-5xl mx-auto">
          <h2 class="font-display font-bold text-4xl md:text-5xl text-[#1d1d1f] mb-10 md:mb-12 text-center">Våra gym</h2>

          <div class="grid grid-cols-1 md:grid-cols-2 gap-5">
            <NuxtLink
              v-for="(gym, index) in gyms"
              :key="gym.name"
              :to="gym.href"
              class="group block rounded-2xl overflow-hidden shadow-sm hover:shadow-lg transition-shadow duration-300"
            >
              <!-- Image section - 2:1 aspect ratio -->
              <div class="aspect-[2/1] overflow-hidden relative">
                <img
                  :src="gym.image"
                  :alt="gym.name"
                  class="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                />
                <!-- Corner gradient for number visibility -->
                <div class="absolute inset-0 bg-gradient-to-tl from-black/30 via-transparent to-transparent" />
                <!-- Tag chip - liquid glass -->
                <span class="absolute bottom-3 left-3 px-4 py-2 bg-white/20 backdrop-blur-xl rounded-full text-sm font-medium text-white border border-white/30 shadow-lg">
                  {{ gym.tag }}
                </span>
                <!-- Number + Established year -->
                <div class="absolute bottom-3 right-4 text-right">
                  <span class="block font-display font-bold text-6xl md:text-7xl text-white/40 leading-none">
                    {{ String(index + 1).padStart(2, '0') }}
                  </span>
                  <span class="block font-display font-medium text-xs md:text-sm text-white/50 tracking-widest mt-1">
                    EST. {{ gym.established }}
                  </span>
                </div>
              </div>
              <!-- Text section - light background -->
              <div class="bg-white p-6 md:p-8 text-center">
                <h3 class="font-display font-bold text-xl md:text-2xl text-[#1d1d1f] mb-2">{{ gym.name }}</h3>
                <p class="text-[#6e6e73] text-base md:text-lg leading-relaxed">{{ gym.description }}</p>
              </div>
            </NuxtLink>
          </div>
        </div>
      </div>
    </section>

    <!-- News -->
    <NewsSection title="Senaste nytt" :limit="4" />

    <!-- Group Training -->
    <section class="pt-16 md:pt-20 pb-24 md:pb-32 bg-on-surface text-white">
      <div class="container max-w-4xl mx-auto text-center">
        <div class="mb-12">
          <StickySectionChip label="Gruppträning" dark />
        </div>
        <h2 class="font-display font-bold text-4xl md:text-6xl mb-5 uppercase tracking-tight">
          Bättre tillsammans
        </h2>
        <p class="text-xl md:text-2xl text-white/70 mb-10 leading-relaxed max-w-2xl mx-auto">
          Från lugn yoga till svettiga pass. Välj det som får dig att må bra.
        </p>
      </div>

      <!-- Carousel -->
      <div class="group-carousel-container mb-12">
        <div ref="carouselRef" class="group-carousel-track" @scroll="onCarouselScroll">
          <div
            v-for="(image, index) in infiniteImages"
            :key="index"
            class="group-carousel-item"
          >
            <img :src="image.src" :alt="image.alt" />
          </div>
        </div>
      </div>

      <div class="container text-center">
        <NuxtLink to="/schema" class="btn btn-light btn-lg">
          Se schemat
        </NuxtLink>
      </div>
    </section>

    <!-- Personal Training -->
    <section class="pt-16 md:pt-20 pb-24 md:pb-32 bg-surface">
      <div class="container">
        <div class="max-w-5xl mx-auto">
          <!-- Centered text intro -->
          <div class="text-center mb-10 md:mb-12">
            <div class="mb-12">
              <StickySectionChip label="Personlig träning" />
            </div>
            <h2 class="font-display font-bold text-4xl md:text-6xl mb-5 text-on-surface uppercase tracking-tight">
              En knuff i rätt riktning
            </h2>
            <p class="text-xl md:text-2xl text-on-surface-dim leading-relaxed max-w-2xl mx-auto">
              Våra PT:s hjälper dig hitta din väg — oavsett om målet är styrka, kondition eller att bara komma igång.
            </p>
          </div>

          <!-- Image -->
          <div class="aspect-[16/9] rounded-3xl overflow-hidden mb-12">
            <img src="/images/filip-pt-landscape.webp" alt="Filip tränar en klient på Core Gym" class="w-full h-full object-cover" />
          </div>

          <!-- Centered features -->
          <div class="flex flex-wrap justify-center gap-4 md:gap-6 mb-10">
            <span class="px-5 py-3 rounded-full border border-on-surface/20 text-on-surface font-medium">
              Individuellt upplägg
            </span>
            <span class="px-5 py-3 rounded-full border border-on-surface/20 text-on-surface font-medium">
              Kostråd och träningsprogram
            </span>
            <span class="px-5 py-3 rounded-full border border-on-surface/20 text-on-surface font-medium">
              Certifierade tränare
            </span>
          </div>

          <div class="text-center">
            <NuxtLink to="/pt" class="btn btn-dark btn-lg">
              Utforska PT
            </NuxtLink>
          </div>
        </div>
      </div>
    </section>

    <!-- Yoga Section -->
    <section class="pt-16 md:pt-20 pb-24 md:pb-32 bg-[#f4f7f5]">
      <div class="container">
        <div class="max-w-5xl mx-auto">
          <!-- Centered text intro -->
          <div class="text-center mb-10 md:mb-12">
            <div class="mb-12">
              <StickySectionChip label="Yoga" color="green" />
            </div>
            <h2 class="font-display font-bold text-4xl md:text-6xl text-[#1d1d1f] uppercase tracking-tight mb-5">
              Hitta din inre balans
            </h2>
            <p class="text-xl md:text-2xl text-[#6e6e73] leading-relaxed max-w-2xl mx-auto">
              Andas ut vardagen. Våra yogaklasser passar alla nivåer — från nybörjare till erfarna. Bygg styrka, förbättra rörlighet och hitta lugnet.
            </p>
          </div>

          <!-- Image -->
          <div class="aspect-[16/9] rounded-3xl overflow-hidden mb-12">
            <img
              src="/images/yoga-class.webp"
              alt="Yoga på Core Gym"
              class="w-full h-full object-cover"
            />
          </div>

          <!-- Location tags + CTA -->
          <div class="text-center">
            <div class="flex flex-wrap justify-center gap-3 mb-8">
              <span class="px-4 py-2 rounded-full border border-[#1d1d1f]/15 text-[#1d1d1f] font-medium">Vegastaden</span>
              <span class="px-4 py-2 rounded-full border border-[#1d1d1f]/15 text-[#1d1d1f] font-medium">Tungelsta</span>
            </div>
            <NuxtLink to="/yoga" class="btn btn-dark btn-lg">
              Yoga
            </NuxtLink>
          </div>
        </div>
      </div>
    </section>

    <!-- Mammaträning Section -->
    <section class="pt-16 md:pt-20 pb-24 md:pb-32 bg-[#fdf6f7]">
      <div class="container">
        <div class="max-w-5xl mx-auto">
          <!-- Centered text intro -->
          <div class="text-center mb-10 md:mb-12">
            <div class="mb-12">
              <StickySectionChip label="Mammaträning" color="rose" />
            </div>
            <h2 class="font-display font-bold text-4xl md:text-6xl text-[#1d1d1f] uppercase tracking-tight mb-5">
              Träna med bebis
            </h2>
            <p class="text-xl md:text-2xl text-[#6e6e73] leading-relaxed max-w-2xl mx-auto">
              Kom igång efter förlossningen tillsammans med andra mammor. Anpassade pass där bebis är välkommen — och en chans att träffa andra i samma situation.
            </p>
          </div>

          <!-- Image -->
          <div class="aspect-[16/9] rounded-3xl overflow-hidden mb-12">
            <img
              src="/images/mamma-training.webp"
              alt="Mammaträning på Core Gym"
              class="w-full h-full object-cover"
            />
          </div>

          <!-- Location tags + CTA -->
          <div class="text-center">
            <div class="flex flex-wrap justify-center gap-3 mb-8">
              <span class="px-4 py-2 rounded-full border border-[#1d1d1f]/15 text-[#1d1d1f] font-medium">Vegastaden</span>
              <span class="px-4 py-2 rounded-full border border-[#1d1d1f]/15 text-[#1d1d1f] font-medium">Tungelsta</span>
            </div>
            <NuxtLink to="/mammatraning" class="btn btn-dark btn-lg">
              Mammaträning
            </NuxtLink>
          </div>
        </div>
      </div>
    </section>

    <!-- Founder -->
    <section class="py-24 md:py-32 bg-surface">
      <div class="container">
        <div class="max-w-3xl mx-auto text-center">
          <div class="w-32 h-32 md:w-40 md:h-40 mx-auto rounded-full overflow-hidden grayscale mb-8">
            <img
              src="/images/founder-per.webp"
              alt="Per Karlsson"
              class="w-full h-full object-cover scale-110"
            />
          </div>
          <blockquote class="font-display font-bold text-3xl md:text-4xl mb-6 text-on-surface leading-tight">
            "Efter 25 år som idrottslärare visste jag vad som saknades. Ett gym där man får vara sig själv."
          </blockquote>
          <p class="text-lg text-on-surface-dim mb-4 max-w-xl mx-auto">
            Per Karlsson, grundare. En Haninge-profil som bytte gympasalen mot gymmet för att skapa en plats utan krångel och prestige.
          </p>
          <p class="text-sm font-bold text-on-surface uppercase tracking-wide">Per Karlsson, Grundare</p>
        </div>
      </div>
    </section>

    <!-- Reviews -->
    <ReviewsSection />

    <!-- CTA -->
    <section class="py-16 md:py-24 lg:py-32 bg-surface">
      <div class="container">
        <div class="relative overflow-hidden rounded-3xl lg:rounded-[2.5rem] bg-brand">
          <!-- Background image with red duotone effect (desktop) -->
          <div class="hidden lg:block absolute inset-0">
            <img
              src="/images/cta-bg.webp"
              alt=""
              class="absolute inset-0 w-full h-full object-cover grayscale"
            />
            <!-- Red overlay for duotone effect -->
            <div class="absolute inset-0 bg-brand/95 mix-blend-multiply" />
            <!-- Dark overlay for text readability -->
            <div class="absolute inset-0 bg-black/10" />
          </div>
          
          <!-- Decorative blurs (mobile only) -->
          <div class="lg:hidden absolute top-0 left-0 w-[800px] h-[800px] bg-white/10 rounded-full -translate-x-1/2 -translate-y-1/2 blur-3xl" />
          <div class="lg:hidden absolute bottom-0 right-0 w-[600px] h-[600px] bg-black/20 rounded-full translate-x-1/2 translate-y-1/2 blur-3xl" />

          <div class="py-24 md:py-32 lg:py-40 px-6 md:px-12 text-center text-white relative z-10 max-w-4xl mx-auto">
            <h2 class="font-display font-bold text-4xl md:text-6xl mb-8 uppercase tracking-tight">Redo att börja?</h2>
            <p class="text-xl md:text-2xl text-white/80 mb-12 leading-relaxed">
              Frihet att välja. Enkelt att börja.
            </p>
            <div class="flex flex-col sm:flex-row justify-center gap-4">
              <NuxtLink to="/bli-medlem" class="btn btn-light btn-xl">
                Se medlemskap
              </NuxtLink>
              <NuxtLink to="/kontakt" class="btn btn-ghost-light btn-xl">
                Kontakta oss
              </NuxtLink>
            </div>
          </div>
        </div>
      </div>
    </section>
  </div>
</template>

<style scoped>
.group-carousel-container {
  --item-size: 140px;
  --item-gap: -30px;
  width: 100%;
  perspective: 800px;
}

@media (min-width: 768px) {
  .group-carousel-container {
    --item-size: 200px;
    --item-gap: -50px;
    perspective: 1200px;
  }
}

.group-carousel-track {
  display: flex;
  gap: 0;
  overflow-x: auto;
  scroll-snap-type: x mandatory;
  scrollbar-width: none;
  -ms-overflow-style: none;
  padding: 2rem calc(50% - var(--item-size) / 2);
  scroll-behavior: auto;
  transform-style: preserve-3d;
}

.group-carousel-track::-webkit-scrollbar {
  display: none;
}

.group-carousel-item {
  flex-shrink: 0;
  width: var(--item-size);
  height: var(--item-size);
  margin-right: var(--item-gap);
  scroll-snap-align: center;
  border-radius: 1rem;
  overflow: hidden;
  box-shadow: 0 8px 32px -8px rgba(0, 0, 0, 0.6);
  position: relative;
  will-change: transform, opacity;
  transform-style: preserve-3d;
  animation: carousel-item-scroll linear;
  animation-timeline: view(inline);
}

.group-carousel-item img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

@keyframes carousel-item-scroll {
  0% {
    transform: translateZ(-100px) rotateY(25deg);
    opacity: 0.4;
  }
  45% {
    transform: translateZ(0) rotateY(0deg);
    opacity: 1;
  }
  55% {
    transform: translateZ(0) rotateY(0deg);
    opacity: 1;
  }
  100% {
    transform: translateZ(-100px) rotateY(-25deg);
    opacity: 0.4;
  }
}
</style>
