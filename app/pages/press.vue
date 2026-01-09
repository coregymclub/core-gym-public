<script setup lang="ts">
definePageMeta({
  layout: false
})

useHead({
  title: 'Press & Material - Core Gym Club',
  meta: [{ name: 'robots', content: 'noindex, nofollow' }]
})

const PASSWORD = 'coregym2026'

const enteredPassword = ref('')
const isUnlocked = ref(false)
const error = ref('')

onMounted(() => {
  const saved = localStorage.getItem('coregym_press_unlocked')
  if (saved === 'true') {
    isUnlocked.value = true
  }
})

function checkPassword() {
  if (enteredPassword.value === PASSWORD) {
    isUnlocked.value = true
    localStorage.setItem('coregym_press_unlocked', 'true')
    error.value = ''
  } else {
    error.value = 'Fel lösenord'
  }
}

function logout() {
  isUnlocked.value = false
  localStorage.removeItem('coregym_press_unlocked')
  enteredPassword.value = ''
}

const materials = [
  {
    category: 'Logotyper',
    items: [
      { name: 'Core Gym Club (vit)', file: '/images/logo.svg', desc: 'För mörka bakgrunder' },
      { name: 'Core Gym Club (mörk)', file: '/images/logo-dark.svg', desc: 'För ljusa bakgrunder' },
    ]
  }
]
</script>

<template>
  <div class="min-h-screen bg-[#fafafa]">
    <!-- Login Screen -->
    <div v-if="!isUnlocked" class="min-h-screen flex items-center justify-center p-6">
      <div class="w-full max-w-sm">
        <div class="text-center mb-10">
          <h1 class="text-2xl font-semibold text-black mb-2">Core Gym Club</h1>
          <p class="text-neutral-500 text-sm">Press & Material</p>
        </div>

        <form @submit.prevent="checkPassword" class="space-y-4">
          <div>
            <input
              v-model="enteredPassword"
              type="password"
              placeholder="Ange lösenord"
              class="w-full px-4 py-3 bg-white border border-neutral-200 rounded-xl text-black placeholder-neutral-400 focus:outline-none focus:ring-2 focus:ring-black/10 focus:border-neutral-300"
              autocomplete="off"
            />
          </div>

          <p v-if="error" class="text-red-500 text-sm text-center">{{ error }}</p>

          <button
            type="submit"
            class="w-full py-3 bg-black text-white font-medium rounded-xl hover:bg-neutral-800 transition-all"
          >
            Öppna
          </button>
        </form>

        <p class="text-center text-neutral-400 text-sm mt-6">
          Kontakta oss för lösenord
        </p>
      </div>
    </div>

    <!-- Material Screen -->
    <div v-else class="min-h-screen">
      <header class="sticky top-0 z-10 backdrop-blur-xl bg-[#fafafa]/80 border-b border-neutral-200">
        <div class="max-w-4xl mx-auto px-6 py-4 flex items-center justify-between">
          <div>
            <h1 class="font-semibold text-black">Core Gym Club</h1>
            <p class="text-sm text-neutral-500">Press & Material</p>
          </div>
          <button
            @click="logout"
            class="px-4 py-2 text-sm text-neutral-500 hover:text-black transition-colors"
          >
            Logga ut
          </button>
        </div>
      </header>

      <main class="max-w-4xl mx-auto px-6 py-8">
        <div v-for="section in materials" :key="section.category" class="mb-12">
          <h2 class="text-sm font-medium text-neutral-500 uppercase tracking-wider mb-4">
            {{ section.category }}
          </h2>

          <div class="grid gap-4 sm:grid-cols-2">
            <div
              v-for="item in section.items"
              :key="item.file"
              class="group bg-white border border-neutral-200 rounded-2xl p-4 hover:border-neutral-300 hover:shadow-sm transition-all"
            >
              <div class="aspect-square bg-neutral-100 rounded-xl mb-4 overflow-hidden flex items-center justify-center">
                <img
                  :src="item.file"
                  :alt="item.name"
                  class="w-3/4 h-3/4 object-contain"
                  :class="item.file.includes('logo.svg') ? 'invert' : ''"
                />
              </div>

              <h3 class="font-medium text-black mb-1">{{ item.name }}</h3>
              <p class="text-sm text-neutral-500 mb-4">{{ item.desc }}</p>

              <a
                :href="item.file"
                :download="item.file.split('/').pop()"
                class="inline-flex items-center gap-2 px-4 py-2 bg-black text-white rounded-lg hover:bg-neutral-800 transition-colors text-sm font-medium"
              >
                <svg class="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
                  <path stroke-linecap="round" stroke-linejoin="round" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
                </svg>
                Ladda ner
              </a>
            </div>
          </div>
        </div>

        <div class="mt-12 p-6 bg-white border border-neutral-200 rounded-2xl">
          <h3 class="font-medium text-black mb-2">Behöver du något mer?</h3>
          <p class="text-neutral-500 text-sm mb-4">
            Kontakta oss om du behöver fler bilder, andra format eller har frågor.
          </p>
          <a
            href="mailto:info@coregymclub.se"
            class="inline-flex items-center gap-2 text-black hover:text-neutral-600 transition-colors text-sm font-medium"
          >
            <svg class="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
              <path stroke-linecap="round" stroke-linejoin="round" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
            </svg>
            info@coregymclub.se
          </a>
        </div>
      </main>
    </div>
  </div>
</template>
