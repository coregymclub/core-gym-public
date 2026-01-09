<template>
  <div class="min-h-screen bg-surface">
    <!-- Minimal header with centered logo -->
    <header class="fixed top-0 left-0 right-0 z-50 bg-gradient-to-b from-black/50 to-transparent">
      <div class="container mx-auto px-6 py-4 flex items-center justify-center">
        <a href="#">
          <img
            src="/images/zey-dance-club.svg"
            alt="Zey Dance Club"
            class="h-10 md:h-12 invert"
          />
        </a>
      </div>
    </header>

    <!-- Page content -->
    <main>
      <slot />
    </main>

    <!-- Map section -->
    <section class="bg-surface">
      <div class="h-64 md:h-80">
        <AppleMap
          :single-gym="{
            name: 'Zey Dance Club',
            address: 'Tungelstavägen 200, Tungelsta',
            lat: 59.105746,
            lng: 18.038984,
            href: '#'
          }"
        />
      </div>
    </section>

    <!-- Footer with Core Gym info -->
    <footer class="bg-surface-dim py-12 border-t border-outline/10">
      <div class="container mx-auto px-6">
        <div class="max-w-2xl mx-auto text-center">
          <!-- Zey logo -->
          <img
            src="/images/zey-dance-club.svg"
            alt="Zey Dance Club"
            class="h-12 mx-auto mb-6 opacity-70"
          />

          <p class="text-on-surface-dim text-sm mb-6">
            Zey Dance Club håller till hos Core Gym Club i Tungelsta.<br>
            Professionella danskurser för barn 5-16 år.
          </p>

          <div class="border-t border-outline/10 pt-6 mt-6">
            <p class="text-on-surface-dim/70 text-sm mb-2">I samarbete med</p>
            <a
              href="https://coregym.club"
              class="inline-flex items-center gap-2 text-pink-500 hover:text-pink-400 font-bold transition-colors"
            >
              Core Gym Club
              <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
              </svg>
            </a>
            <p class="text-on-surface-dim/50 text-xs mt-4">
              Tungelstavägen 200, Tungelsta
            </p>
          </div>
        </div>
      </div>
    </footer>
  </div>
</template>
