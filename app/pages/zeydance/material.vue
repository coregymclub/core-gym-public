<script setup lang="ts">
definePageMeta({
  layout: false
})

useHead({
  title: 'Material - Zey Dance Club',
  meta: [{ name: 'robots', content: 'noindex, nofollow' }]
})

const PASSWORD = 'zeydance2026'

const enteredPassword = ref('')
const isUnlocked = ref(false)
const error = ref('')

// Check localStorage on mount
onMounted(() => {
  const saved = localStorage.getItem('zeydance_material_unlocked')
  if (saved === 'true') {
    isUnlocked.value = true
  }
})

function checkPassword() {
  if (enteredPassword.value === PASSWORD) {
    isUnlocked.value = true
    localStorage.setItem('zeydance_material_unlocked', 'true')
    error.value = ''
  } else {
    error.value = 'Fel lösenord'
  }
}

function logout() {
  isUnlocked.value = false
  localStorage.removeItem('zeydance_material_unlocked')
  enteredPassword.value = ''
}

// Material files
const materials = [
  {
    category: 'QR-koder',
    items: [
      { name: 'QR-kod Modern (gradient)', file: '/zeydance-material/qr-modern.png', desc: 'Lila-cyan gradient på mörk bakgrund' },
      { name: 'QR-kod Transparent', file: '/zeydance-material/qr-transparent.png', desc: 'Transparent bakgrund, passar överallt' },
      { name: 'QR-kod Enkel', file: '/zeydance-material/qr-simple.png', desc: 'Klassisk svart/vit' },
    ]
  },
  {
    category: 'Logotyper',
    items: [
      { name: 'Zey Dance Club (PNG)', file: '/zeydance-material/zey-dance-club-logo.png', desc: 'Hög upplösning, transparent bakgrund' },
      { name: 'Core Gym Club (vit)', file: '/images/logo.svg', desc: 'Vit logotyp för mörka bakgrunder' },
      { name: 'Core Gym Club (mörk)', file: '/images/logo-dark.svg', desc: 'Mörk logotyp för ljusa bakgrunder' },
      { name: 'Zey Dance Club (SVG)', file: '/images/zey-dance-club.svg', desc: 'Vektorformat, skalbar' },
    ]
  },
  {
    category: 'Bilder',
    items: [
      { name: 'Pingstkyrkan Yoga', file: '/zeydance-material/pingstkyrkan-yoga.jpg', desc: 'Yogaklass i pingstkyrkan, Tungelsta' },
    ]
  }
]
</script>

<template>
  <div class="min-h-screen bg-gradient-to-b from-[#1a1625] to-[#0f0d12]">
    <!-- Login Screen -->
    <div v-if="!isUnlocked" class="min-h-screen flex items-center justify-center p-6">
      <div class="w-full max-w-sm">
        <!-- Collab Title -->
        <div class="text-center mb-10">
          <div class="flex items-center justify-center gap-3 mb-4">
            <span class="text-xl font-semibold text-white">Core Gym Club</span>
            <span class="text-xl font-light text-fuchsia-400/70">x</span>
            <span class="text-xl font-semibold text-white">Zey Dance Club</span>
          </div>
          <p class="text-white/40 text-sm">Material & Nedladdningar</p>
        </div>

        <form @submit.prevent="checkPassword" class="space-y-4">
          <div>
            <input
              v-model="enteredPassword"
              type="password"
              placeholder="Ange lösenord"
              class="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white placeholder-white/30 focus:outline-none focus:ring-2 focus:ring-fuchsia-500/50 focus:border-fuchsia-500/50"
              autocomplete="off"
            />
          </div>

          <p v-if="error" class="text-red-400 text-sm text-center">{{ error }}</p>

          <button
            type="submit"
            class="w-full py-3 bg-fuchsia-500 text-white font-medium rounded-xl hover:bg-fuchsia-600 transition-all"
          >
            Öppna
          </button>
        </form>

        <p class="text-center text-white/30 text-sm mt-6">
          Kontakta Gustav för lösenord
        </p>
      </div>
    </div>

    <!-- Material Screen -->
    <div v-else class="min-h-screen">
      <!-- Header -->
      <header class="sticky top-0 z-10 backdrop-blur-xl bg-[#1a1625]/80 border-b border-white/5">
        <div class="max-w-4xl mx-auto px-6 py-4 flex items-center justify-between">
          <div class="flex items-center gap-2">
            <span class="font-medium text-white">Core Gym Club</span>
            <span class="text-fuchsia-400/70">x</span>
            <span class="font-medium text-white">Zey Dance Club</span>
          </div>
          <button
            @click="logout"
            class="px-4 py-2 text-sm text-white/50 hover:text-white transition-colors"
          >
            Logga ut
          </button>
        </div>
      </header>

      <!-- Content -->
      <main class="max-w-4xl mx-auto px-6 py-8">
        <div v-for="section in materials" :key="section.category" class="mb-12">
          <h2 class="text-sm font-medium text-white/50 uppercase tracking-wider mb-4">
            {{ section.category }}
          </h2>

          <div class="grid gap-4 sm:grid-cols-2">
            <div
              v-for="item in section.items"
              :key="item.file"
              class="group bg-white/5 border border-white/5 rounded-2xl p-4 hover:bg-white/10 hover:border-white/10 transition-all"
            >
              <!-- Preview -->
              <div class="aspect-square bg-white/5 rounded-xl mb-4 overflow-hidden flex items-center justify-center">
                <img
                  :src="item.file"
                  :alt="item.name"
                  class="w-3/4 h-3/4 object-contain"
                />
              </div>

              <!-- Info -->
              <h3 class="font-medium text-white mb-1">{{ item.name }}</h3>
              <p class="text-sm text-white/40 mb-4">{{ item.desc }}</p>

              <!-- Download -->
              <a
                :href="item.file"
                :download="item.file.split('/').pop()"
                class="inline-flex items-center gap-2 px-4 py-2 bg-fuchsia-500/20 text-fuchsia-300 rounded-lg hover:bg-fuchsia-500/30 transition-colors text-sm font-medium"
              >
                <svg class="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
                  <path stroke-linecap="round" stroke-linejoin="round" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
                </svg>
                Ladda ner
              </a>
            </div>
          </div>
        </div>

        <!-- Info -->
        <div class="mt-12 p-6 bg-white/5 border border-white/5 rounded-2xl">
          <h3 class="font-medium text-white mb-2">Behöver du något mer?</h3>
          <p class="text-white/50 text-sm mb-4">
            Om du behöver fler bilder, logotyper eller annat material - hör av dig så lägger vi upp det här.
          </p>
          <a
            href="mailto:gustav@coregymclub.se"
            class="inline-flex items-center gap-2 text-fuchsia-300 hover:text-fuchsia-200 transition-colors text-sm font-medium mb-4"
          >
            <svg class="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
              <path stroke-linecap="round" stroke-linejoin="round" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
            </svg>
            gustav@coregymclub.se
          </a>
          <p class="text-white/30 text-sm">
            Alla QR-koder pekar till: <span class="text-fuchsia-300">zeydance.coregym.club</span>
          </p>
        </div>
      </main>
    </div>
  </div>
</template>
