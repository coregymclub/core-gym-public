<script setup lang="ts">
useHead({
  title: 'Dans för barn och unga - Core Gym Club',
  meta: [
    { name: 'description', content: 'Dans för barn och unga i Tungelsta. Zey Dance Club i samarbete med Core Gym Club. Barndans, showdans, balett, hiphop och breakdance för 5-16 år.' },
    { property: 'og:title', content: 'Dans för barn och unga - Core Gym Club' },
    { property: 'og:description', content: 'Dans för barn och unga i Tungelsta. Zey Dance Club i samarbete med Core Gym Club. Barndans, showdans, balett, hiphop och breakdance för 5-16 år.' },
    { property: 'og:image', content: 'https://coregym.club/images/og-barndans.jpg' },
    { property: 'og:image:width', content: '1200' },
    { property: 'og:image:height', content: '630' },
    { property: 'og:type', content: 'website' }
  ]
})

useThemeColor('#ec4899')

// Fetch updates
interface Update {
  id: string
  title: string
  content: string
  published_at: string
}

const updates = ref<Update[]>([])
const NEWS_API = 'https://coregym-news-api.gustav-brydner.workers.dev'

onMounted(async () => {
  try {
    const res = await fetch(`${NEWS_API}/news?limit=50`)
    const data = await res.json()
    updates.value = data.news.filter((n: any) => n.categories?.includes('barndans')).slice(0, 3)
  } catch (e) {
    console.error('Failed to fetch updates', e)
  }
})

function formatDate(dateStr: string) {
  return new Date(dateStr).toLocaleDateString('sv-SE', { day: 'numeric', month: 'short' })
}

const benefits = [
  { title: 'Tillhörighet', desc: 'Känn gemenskap i gruppen' },
  { title: 'Trygghet', desc: 'Anpassat för varje ålder' },
  { title: 'Glädje', desc: 'Ha kul med nya danskompisar' },
  { title: 'Utveckling', desc: 'Lär dig nya färdigheter' },
]

// Bottom sheet state
const showRorelseSheet = ref(false)

// Rörelseglädje form
const rorelseForm = ref({
  childName: '',
  childAge: '',
  parentName: '',
  phone: '',
  email: ''
})
const rorelseSubmitting = ref(false)
const rorelseSuccess = ref(false)
const rorelseError = ref<string | null>(null)

async function handleRorelseSubmit() {
  if (!rorelseForm.value.childName || !rorelseForm.value.childAge || !rorelseForm.value.parentName || !rorelseForm.value.phone || !rorelseForm.value.email) {
    rorelseError.value = 'Fyll i alla fält'
    return
  }

  rorelseSubmitting.value = true
  rorelseError.value = null

  try {
    // Skicka email
    const response = await fetch('https://student-email.coregymclub.se/send', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        to: 'info@coregym.club',
        subject: `Rörelseglädje 3-4 år anmälan: ${rorelseForm.value.childName}`,
        html: `
          <h2>Ny anmälan till Rörelseglädje 3-4 år</h2>
          <p><strong>Barnets namn:</strong> ${rorelseForm.value.childName}</p>
          <p><strong>Barnets ålder:</strong> ${rorelseForm.value.childAge}</p>
          <p><strong>Vårdnadshavare:</strong> ${rorelseForm.value.parentName}</p>
          <p><strong>Telefon:</strong> ${rorelseForm.value.phone}</p>
          <p><strong>E-post:</strong> ${rorelseForm.value.email}</p>
        `,
        replyTo: rorelseForm.value.email
      })
    })

    if (response.ok) {
      rorelseSuccess.value = true

      // Posta till Barndans-rummet i teamchatten
      try {
        await fetch('https://teamchat.coregym.club/api/terminal/post', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json', 'X-API-Key': 'cgc-notify-2025' },
          body: JSON.stringify({
            room: 'barndans',
            message: `📩 **Ny anmalan - Rorelseglaedje 3-4 ar**\n\n👶 **Barn:** ${rorelseForm.value.childName} (${rorelseForm.value.childAge})\n👤 **Vardnadshavare:** ${rorelseForm.value.parentName}\n📞 ${rorelseForm.value.phone}\n📧 ${rorelseForm.value.email}`
          })
        })
      } catch (chatErr) {
        // Logga fel men låt inte det påverka användarupplevelsen
        console.error('Kunde inte posta till teamchat:', chatErr)
      }
    } else {
      throw new Error('Kunde inte skicka')
    }
  } catch (e) {
    rorelseError.value = 'Något gick fel. Försök igen!'
  } finally {
    rorelseSubmitting.value = false
  }
}
</script>

<template>
  <div>
    <!-- Hero -->
    <section class="min-h-[70vh] flex items-center justify-center text-white px-6 relative overflow-hidden">
      <!-- Background image -->
      <div class="absolute inset-0 z-0">
        <img
          src="/images/barndans-hero.avif"
          alt="Dans för barn"
          class="w-full h-full object-cover"
        />
        <div class="absolute inset-0 bg-gradient-to-t from-pink-600/90 via-purple-500/70 to-indigo-500/60" />
      </div>

      <div class="text-center relative z-10 max-w-4xl mx-auto pt-32 pb-40">
        <span class="inline-block px-4 py-2 bg-pink-200/20 text-pink-100 rounded-full text-sm font-bold tracking-widest uppercase mb-6 border border-pink-200/30">
          Tungelsta
        </span>
        <h1 class="text-hero text-white mb-6">Dans för barn och unga</h1>
        <p class="text-body-lg text-white/90 mb-10 max-w-2xl mx-auto font-medium">
          Professionella danskurser för 3-16 år. Barndans, showdans, balett, hiphop och breakdance.
        </p>
        <a href="#zey" class="btn bg-white text-purple-600 hover:bg-pink-50 shadow-lg hover:shadow-xl border-none">
          Se kurser
        </a>
      </div>
    </section>

    <!-- Zey Dance Club - Intro -->
    <section id="zey" class="section bg-surface relative z-10 -mt-16 rounded-t-[3rem] pt-24">
      <div class="container">
        <div class="max-w-2xl mx-auto">
          <!-- Zey Dance Club Card -->
          <a
            href="https://zeydance.coregym.club"
            class="block bg-gradient-to-br from-fuchsia-600 to-violet-600 rounded-3xl p-8 md:p-10 text-white shadow-xl hover:shadow-2xl hover:scale-[1.02] transition-all duration-300 group"
          >
            <span class="inline-block px-3 py-1 bg-white/20 rounded-full text-xs font-semibold tracking-wider uppercase mb-4">
              5-16 år
            </span>
            <h2 class="font-display font-bold text-3xl md:text-4xl mb-4 uppercase tracking-tight">
              Zey Dance Club
            </h2>
            <p class="text-white/80 text-lg leading-relaxed mb-6">
              Professionella danskurser i samarbete med Core Gym Club. En mix av showdans, balett, hiphop och breakdance.
            </p>
            <div class="flex items-center gap-2 text-white font-semibold">
              <span>Läs mer och anmäl</span>
              <svg class="w-5 h-5 transition-transform group-hover:translate-x-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 8l4 4m0 0l-4 4m4-4H3" />
              </svg>
            </div>
          </a>
        </div>
      </div>
    </section>

    <!-- Updates (only show if there are any) -->
    <section v-if="updates.length > 0" class="py-12 bg-gradient-to-b from-pink-50/50 to-surface">
      <div class="container">
        <div class="max-w-4xl mx-auto">
          <h2 class="text-xs font-semibold uppercase tracking-[0.2em] text-pink-600 mb-6 text-center">Aktuellt</h2>
          <div class="space-y-3">
            <div
              v-for="update in updates"
              :key="update.id"
              class="bg-white rounded-2xl p-5 shadow-sm border border-pink-100/50"
            >
              <div class="flex items-start gap-4">
                <div class="w-10 h-10 rounded-full bg-gradient-to-br from-pink-100 to-purple-100 flex items-center justify-center flex-shrink-0">
                  <svg class="w-5 h-5 text-pink-600" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
                    <path stroke-linecap="round" stroke-linejoin="round" d="M11 5.882V19.24a1.76 1.76 0 01-3.417.592l-2.147-6.15M18 13a3 3 0 100-6M5.436 13.683A4.001 4.001 0 017 6h1.832c4.1 0 7.625-1.234 9.168-3v14c-1.543-1.766-5.067-3-9.168-3H7a3.988 3.988 0 01-1.564-.317z" />
                  </svg>
                </div>
                <div class="flex-1">
                  <h3 class="font-semibold text-on-surface">{{ update.title }}</h3>
                  <p v-if="update.content" class="text-on-surface-dim text-sm mt-1 leading-relaxed line-clamp-2" v-html="update.content.replace(/<[^>]*>/g, ' ').substring(0, 150) + '...'" />
                  <p class="text-xs text-on-surface-dim/50 mt-2">{{ formatDate(update.published_at) }}</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>

    <!-- Divider -->
    <div class="h-px bg-gradient-to-r from-transparent via-pink-500/50 to-transparent" />

    <!-- Rörelseglädje 3-4 år -->
    <section class="section bg-surface">
      <div class="container">
        <div class="max-w-4xl mx-auto">
          <div class="text-center mb-12">
            <span class="inline-block px-4 py-2 rounded-full bg-pink-100 text-pink-600 mb-6 text-sm font-bold tracking-widest uppercase">
              Core Gym Club
            </span>
            <h2 class="font-display font-bold text-4xl md:text-5xl mb-6 text-on-surface uppercase tracking-tight">Rörelseglädje 3-4 år</h2>
            <p class="text-xl text-on-surface-dim max-w-2xl mx-auto leading-relaxed">
              Vår egen barndans för de allra yngsta fortsätter som vanligt på Core Gym Club Tungelsta. Lek, musik och rörelse i en trygg miljö.
            </p>
          </div>

          <!-- Schedule card -->
          <div class="max-w-md mx-auto mb-12">
            <div class="card text-center border-t-4 border-t-pink-400">
              <span class="font-display font-bold text-5xl md:text-6xl block mb-4 text-pink-400">
                3-4 år
              </span>
              <h3 class="text-title text-xl mb-2">Söndagar 16:00-16:45</h3>
              <p class="text-body text-on-surface-dim mb-4">Lek och rörelse med musik</p>
              <div class="pt-4 border-t border-outline/20 text-sm text-on-surface-dim">
                <span class="font-medium">Instruktör:</span> Ylva
              </div>
            </div>
          </div>

          <!-- Info grid -->
          <div class="grid grid-cols-2 md:grid-cols-4 gap-4 max-w-2xl mx-auto mb-12">
            <div class="text-center p-4">
              <span class="text-label text-on-surface-dim block mb-1">Start</span>
              <span class="font-bold">1 februari</span>
            </div>
            <div class="text-center p-4">
              <span class="text-label text-on-surface-dim block mb-1">Pris</span>
              <span class="font-bold">1 400 kr</span>
            </div>
            <div class="text-center p-4">
              <span class="text-label text-on-surface-dim block mb-1">Plats</span>
              <span class="font-bold">Tungelsta</span>
            </div>
            <div class="text-center p-4">
              <span class="text-label text-on-surface-dim block mb-1">Kurslängd</span>
              <span class="font-bold">8 tillfällen</span>
            </div>
          </div>

          <div class="text-center">
            <button @click="showRorelseSheet = true" class="btn btn-primary">
              Anmäl intresse
            </button>
          </div>
        </div>
      </div>
    </section>

    <!-- Benefits -->
    <section class="section bg-surface-dim">
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
        <p class="text-lead text-white/80 mb-10">Dans för alla barn i Tungelsta</p>
        <div class="flex flex-col sm:flex-row gap-4 justify-center">
          <a href="https://zeydance.coregym.club" class="btn bg-white text-purple-600 hover:bg-pink-50 shadow-xl border-none">
            Zey Dance Club (5-16 år)
          </a>
          <button @click="showRorelseSheet = true" class="btn bg-white/10 text-white hover:bg-white/20 border border-white/30">
            Rörelseglädje (3-4 år)
          </button>
        </div>
      </div>
    </section>

    <!-- Rörelseglädje Bottom Sheet -->
    <SheetsBottomSheet :open="showRorelseSheet" title="Anmälan Rörelseglädje" subtitle="3-4 år — Fyll i uppgifterna nedan." @close="showRorelseSheet = false">
      <!-- Success state -->
      <div v-if="rorelseSuccess" class="text-center py-8">
        <div class="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
          <svg class="w-8 h-8 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7" />
          </svg>
        </div>
        <h3 class="font-bold text-xl text-on-surface mb-2">Tack för din anmälan!</h3>
        <p class="text-on-surface-dim">Vi hör av oss inom kort.</p>
      </div>

      <!-- Form -->
      <form v-else @submit.prevent="handleRorelseSubmit" class="space-y-4 pb-4">
        <div>
          <label class="block text-sm font-medium text-on-surface-dim mb-1">Barnets namn</label>
          <input v-model="rorelseForm.childName" type="text" required class="w-full px-4 py-3 rounded-xl border border-outline/30 focus:border-pink-500 focus:outline-none text-on-surface" placeholder="Barnets förnamn och efternamn" />
        </div>
        <div>
          <label class="block text-sm font-medium text-on-surface-dim mb-1">Barnets ålder</label>
          <input v-model="rorelseForm.childAge" type="text" required class="w-full px-4 py-3 rounded-xl border border-outline/30 focus:border-pink-500 focus:outline-none text-on-surface" placeholder="T.ex. 3 år" />
        </div>
        <div>
          <label class="block text-sm font-medium text-on-surface-dim mb-1">Vårdnadshavares namn</label>
          <input v-model="rorelseForm.parentName" type="text" required class="w-full px-4 py-3 rounded-xl border border-outline/30 focus:border-pink-500 focus:outline-none text-on-surface" placeholder="Ditt namn" />
        </div>
        <div>
          <label class="block text-sm font-medium text-on-surface-dim mb-1">Telefon</label>
          <input v-model="rorelseForm.phone" type="tel" required class="w-full px-4 py-3 rounded-xl border border-outline/30 focus:border-pink-500 focus:outline-none text-on-surface" placeholder="07X-XXX XX XX" />
        </div>
        <div>
          <label class="block text-sm font-medium text-on-surface-dim mb-1">E-post</label>
          <input v-model="rorelseForm.email" type="email" required class="w-full px-4 py-3 rounded-xl border border-outline/30 focus:border-pink-500 focus:outline-none text-on-surface" placeholder="din@email.se" />
        </div>

        <div v-if="rorelseError" class="text-red-600 text-sm bg-red-50 px-4 py-3 rounded-xl">{{ rorelseError }}</div>

        <button type="submit" :disabled="rorelseSubmitting" class="w-full btn bg-pink-500 hover:bg-pink-400 text-white border-none py-4 text-lg disabled:opacity-50">
          {{ rorelseSubmitting ? 'Skickar...' : 'Skicka anmälan' }}
        </button>
      </form>
    </SheetsBottomSheet>
  </div>
</template>
