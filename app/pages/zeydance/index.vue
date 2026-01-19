<script setup lang="ts">
definePageMeta({
  layout: 'zeydance'
})

useHead({
  title: 'Zey Dance Club - Dans för barn och unga i Tungelsta',
  meta: [
    { name: 'description', content: 'Zey Dance Club - professionella danskurser för barn 5-16 år i Tungelsta. Barndans, showdans, balett, hiphop och breakdance.' },
    { property: 'og:title', content: 'Zey Dance Club - Dans för barn och unga i Tungelsta' },
    { property: 'og:description', content: 'Zey Dance Club - professionella danskurser för barn 5-16 år i Tungelsta. Barndans, showdans, balett, hiphop och breakdance.' },
    { property: 'og:image', content: 'https://coregym.club/images/og-barndans.jpg' },
    { property: 'og:image:width', content: '1200' },
    { property: 'og:image:height', content: '630' },
    { property: 'og:type', content: 'website' }
  ]
})

useThemeColor('#ffffff')

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
    updates.value = data.news.filter((n: any) => n.categories?.includes('zeydance')).slice(0, 3)
  } catch (e) {
    console.error('Failed to fetch updates', e)
  }
})

function formatDate(dateStr: string) {
  return new Date(dateStr).toLocaleDateString('sv-SE', { day: 'numeric', month: 'short' })
}

const zeyGroups = [
  { name: 'Danzemix Kidz', age: '5-7 år', day: 'Måndagar', time: '17:10-17:55', length: '45 min', price: '1 800 kr/termin' },
  { name: 'Danzemix Beat', age: '8-10 år', day: 'Torsdagar', time: '17:10-18:00', length: '50 min', price: '1 800 kr/termin' },
  { name: 'Danzemix Flow', age: '11-13 år', day: 'Torsdagar', time: '18:05-19:00', length: '55 min', price: '1 900 kr/termin' },
  { name: 'Danzemix Vibe', age: '14-16 år', day: 'Måndagar', time: '18:00-19:00', length: '60 min', price: '1 900 kr/termin' },
]

const benefits = [
  {
    title: 'Dansglädje',
    desc: 'Känn glädjen i att röra dig till musik',
    icon: 'sparkles'
  },
  {
    title: 'Taktkänsla',
    desc: 'Lär dig känna rytmen och musiken',
    icon: 'music'
  },
  {
    title: 'Självförtroende',
    desc: 'Väx som person och våga ta plats',
    icon: 'trending'
  },
  {
    title: 'Attityd & energi',
    desc: 'Hitta din egen stil och uttryck',
    icon: 'bolt'
  },
]

// Bottom sheet state
const showZeySheet = ref(false)

// Form
const zeyForm = ref({
  childName: '',
  childAge: '',
  parentName: '',
  phone: '',
  email: '',
  group: ''
})
const zeySubmitting = ref(false)
const zeySuccess = ref(false)
const zeyError = ref<string | null>(null)

// Contact form
const contactForm = ref({
  name: '',
  email: '',
  message: ''
})
const contactSubmitting = ref(false)
const contactSuccess = ref(false)
const contactError = ref<string | null>(null)

async function handleContactSubmit() {
  if (!contactForm.value.name || !contactForm.value.email || !contactForm.value.message) {
    contactError.value = 'Fyll i alla fält'
    return
  }

  contactSubmitting.value = true
  contactError.value = null

  try {
    const response = await fetch('https://student-email.coregymclub.se/send', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        to: 'zeydanceclub@hotmail.com',
        cc: 'lisa@coregymclub.se',
        subject: `Fråga till Zey Dance Club från ${contactForm.value.name}`,
        html: `
          <h2>Ny fråga till Zey Dance Club</h2>
          <p><strong>Namn:</strong> ${contactForm.value.name}</p>
          <p><strong>E-post:</strong> ${contactForm.value.email}</p>
          <p><strong>Meddelande:</strong></p>
          <p>${contactForm.value.message.replace(/\n/g, '<br>')}</p>
        `,
        replyTo: contactForm.value.email
      })
    })

    if (response.ok) {
      contactSuccess.value = true

      // Posta till Barndans-rummet i teamchatten
      try {
        await fetch('https://teamchat.coregym.club/api/terminal/post', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json', 'X-API-Key': 'cgc-notify-2025' },
          body: JSON.stringify({
            room: 'barndans',
            message: `❓ **Fraga - ZeyDance**\n\n👤 **Fran:** ${contactForm.value.name}\n📧 ${contactForm.value.email}\n\n💬 ${contactForm.value.message.substring(0, 200)}${contactForm.value.message.length > 200 ? '...' : ''}`
          })
        })
      } catch (chatErr) {
        console.error('Kunde inte posta till teamchat:', chatErr)
      }

      contactForm.value = { name: '', email: '', message: '' }
    } else {
      throw new Error('Kunde inte skicka')
    }
  } catch (e) {
    contactError.value = 'Något gick fel. Försök igen!'
  } finally {
    contactSubmitting.value = false
  }
}

async function handleZeySubmit() {
  if (!zeyForm.value.childName || !zeyForm.value.childAge || !zeyForm.value.parentName || !zeyForm.value.phone || !zeyForm.value.email || !zeyForm.value.group) {
    zeyError.value = 'Fyll i alla fält'
    return
  }

  zeySubmitting.value = true
  zeyError.value = null

  try {
    const response = await fetch('https://student-email.coregymclub.se/send', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        to: 'zeydanceclub@hotmail.com',
        cc: 'lisa@coregymclub.se',
        subject: `Zey Dance Club anmälan: ${zeyForm.value.childName}`,
        html: `
          <h2>Ny anmälan till Zey Dance Club</h2>
          <p><strong>Barnets namn:</strong> ${zeyForm.value.childName}</p>
          <p><strong>Barnets ålder:</strong> ${zeyForm.value.childAge}</p>
          <p><strong>Önskad grupp:</strong> ${zeyForm.value.group}</p>
          <p><strong>Vårdnadshavare:</strong> ${zeyForm.value.parentName}</p>
          <p><strong>Telefon:</strong> ${zeyForm.value.phone}</p>
          <p><strong>E-post:</strong> ${zeyForm.value.email}</p>
        `,
        replyTo: zeyForm.value.email
      })
    })

    if (response.ok) {
      zeySuccess.value = true

      // Posta till Barndans-rummet i teamchatten
      try {
        await fetch('https://teamchat.coregym.club/api/terminal/post', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json', 'X-API-Key': 'cgc-notify-2025' },
          body: JSON.stringify({
            room: 'barndans',
            message: `📩 **Ny anmalan - ZeyDance**\n\n💃 **Dansare:** ${zeyForm.value.childName} (${zeyForm.value.childAge})\n🎯 **Grupp:** ${zeyForm.value.group}\n👤 **Vardnadshavare:** ${zeyForm.value.parentName}\n📞 ${zeyForm.value.phone}\n📧 ${zeyForm.value.email}`
          })
        })
      } catch (chatErr) {
        console.error('Kunde inte posta till teamchat:', chatErr)
      }
    } else {
      throw new Error('Kunde inte skicka')
    }
  } catch (e) {
    zeyError.value = 'Något gick fel. Försök igen!'
  } finally {
    zeySubmitting.value = false
  }
}
</script>

<template>
  <div>
    <!-- Hero -->
    <section class="min-h-[85vh] flex items-center justify-center text-white px-6 relative overflow-hidden">
      <!-- Background image -->
      <div class="absolute inset-0 z-0">
        <img
          src="/images/zeydance-hero.avif?v=2"
          alt="Zey Dance Club"
          class="w-full h-full object-cover object-[center_65%] opacity-80 [mask-image:linear-gradient(to_top,black_60%,transparent_100%)]"
        />
        <div class="absolute inset-0 bg-gradient-to-t from-fuchsia-700/95 via-violet-600/90 to-indigo-600/80" />
      </div>

      <div class="text-center relative z-10 max-w-4xl mx-auto pt-32 pb-44">
        <span class="inline-block px-5 py-2.5 bg-white/10 text-white/90 rounded-full text-xs font-semibold tracking-[0.2em] uppercase mb-8 backdrop-blur-sm border border-white/20">
          Tungelsta
        </span>
        <h1 class="font-display font-black text-5xl md:text-7xl lg:text-8xl text-white mb-8 uppercase tracking-tight drop-shadow-lg">Zey Dance Club</h1>
        <p class="text-lg md:text-xl text-white/85 mb-12 max-w-xl mx-auto leading-relaxed">
          Danskurser för barn och unga 5–16 år. En mix av showdans, balett, hiphop och breakdance.
        </p>
        <a href="#kurser" class="inline-flex items-center gap-2 px-8 py-4 bg-white text-fuchsia-700 font-bold rounded-full shadow-lg hover:shadow-xl hover:scale-105 transition-all duration-300 border-none">
          Se kurser
          <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7"/></svg>
        </a>
      </div>
    </section>

    <!-- Main content -->
    <section id="kurser" class="section bg-surface relative z-10 -mt-16 rounded-t-[3rem] pt-24">
      <div class="container">
        <div class="max-w-4xl mx-auto">
          <div class="text-center mb-12">
            <p class="text-xl md:text-2xl text-on-surface-dim max-w-2xl mx-auto leading-relaxed">
              En mix av barndans, showdans, balett, hiphop och breakdance — varför välja en stil när du kan få det bästa av flera?
            </p>
          </div>

          <!-- Groups table -->
          <div class="bg-white rounded-2xl border border-outline/10 overflow-hidden mb-12 shadow-sm">
            <div class="overflow-x-auto">
              <table class="w-full text-left">
                <thead>
                  <tr class="border-b border-outline/10 bg-gradient-to-r from-fuchsia-50/80 to-violet-50/80">
                    <th class="px-3 md:px-5 py-3 text-xs font-bold uppercase tracking-wider text-fuchsia-700/80">Grupp</th>
                    <th class="px-2 md:px-5 py-3 text-xs font-bold uppercase tracking-wider text-fuchsia-700/80">Ålder</th>
                    <th class="px-2 md:px-5 py-3 text-xs font-bold uppercase tracking-wider text-fuchsia-700/80">Tid</th>
                    <th class="px-2 md:px-5 py-3 text-xs font-bold uppercase tracking-wider text-fuchsia-700/80 text-right">Pris</th>
                  </tr>
                </thead>
                <tbody class="divide-y divide-outline/5">
                  <tr v-for="group in zeyGroups" :key="group.name" class="hover:bg-fuchsia-50/40 transition-colors">
                    <td class="px-3 md:px-5 py-4">
                      <span class="font-semibold text-on-surface text-sm md:text-base">{{ group.name }}</span>
                    </td>
                    <td class="px-2 md:px-5 py-4">
                      <span class="inline-flex px-2 py-0.5 bg-fuchsia-100/60 text-fuchsia-700 text-xs md:text-sm font-medium rounded-full whitespace-nowrap">{{ group.age }}</span>
                    </td>
                    <td class="px-2 md:px-5 py-4 text-on-surface-dim">
                      <span class="block font-medium text-on-surface text-sm">{{ group.day }}</span>
                      <span class="text-on-surface-dim/70 text-xs whitespace-nowrap">{{ group.time }}</span>
                    </td>
                    <td class="px-2 md:px-5 py-4 font-medium text-on-surface text-sm text-right whitespace-nowrap">{{ group.price }}</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>

          <p class="text-center text-on-surface-dim mb-12 text-sm">
            12 veckor per termin · Individuell coachning · Repetitioner · Avslutande uppvisning
          </p>

          <!-- Practical info -->
          <div class="grid md:grid-cols-2 gap-6">
            <div class="bg-white rounded-2xl border border-outline/10 p-6 shadow-sm">
              <h3 class="font-semibold text-lg text-on-surface mb-5 flex items-center gap-2">
                <svg class="w-5 h-5 text-fuchsia-500" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"/></svg>
                Praktisk info
              </h3>
              <div class="space-y-4 text-on-surface-dim">
                <div class="flex justify-between items-center py-2 border-b border-outline/10">
                  <span class="text-sm">Plats</span>
                  <span class="text-on-surface font-medium text-sm">Rosvägen 2, Tungelsta</span>
                </div>
                <div class="flex justify-between items-center py-2 border-b border-outline/10">
                  <span class="text-sm">Terminsstart</span>
                  <span class="text-on-surface font-medium text-sm">Februari 2026</span>
                </div>
                <div class="flex justify-between items-center py-2">
                  <span class="text-sm">Prova på</span>
                  <span class="inline-flex px-3 py-1 bg-fuchsia-100 text-fuchsia-700 font-semibold text-sm rounded-full">99 kr</span>
                </div>
              </div>
              <p class="text-xs text-on-surface-dim/60 mt-5 pt-4 border-t border-outline/10">Uppehåll sportlov (v.9) och påsklov (v.15)</p>
            </div>

            <div class="bg-gradient-to-br from-fuchsia-600 to-violet-600 rounded-2xl p-6 flex flex-col text-white shadow-lg">
              <h3 class="font-semibold text-lg mb-3">Redo att börja dansa?</h3>
              <p class="text-white/80 mb-6 text-sm leading-relaxed">Anmäl dig till Zey Dance Club så kontaktar vi dig med bekräftelse och mer info.</p>
              <button
                @click="showZeySheet = true"
                class="mt-auto inline-flex items-center justify-center gap-2 px-6 py-3.5 bg-white text-fuchsia-700 font-semibold rounded-xl hover:bg-fuchsia-50 transition-colors border-none shadow-sm"
              >
                Anmäl nu
                <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 8l4 4m0 0l-4 4m4-4H3"/></svg>
              </button>
            </div>
          </div>
        </div>
      </div>
    </section>

    <!-- Om instruktören -->
    <section class="py-20 bg-gradient-to-br from-fuchsia-50/50 via-violet-50/30 to-surface">
      <div class="container">
        <div class="max-w-3xl mx-auto text-center">
          <span class="inline-block text-xs font-semibold uppercase tracking-[0.2em] text-fuchsia-600 mb-4">Din instruktör</span>
          <h2 class="text-2xl md:text-3xl font-bold text-on-surface mb-10">Möt Zeynep</h2>
          <div class="mb-10">
            <img
              src="/images/zeynep-dance.avif"
              alt="Zeynep dansar"
              class="w-56 h-72 md:w-64 md:h-80 rounded-2xl mx-auto object-cover object-top shadow-xl ring-4 ring-white"
            />
          </div>
          <div class="bg-white rounded-3xl p-8 md:p-10 shadow-sm border border-outline/10">
            <p class="text-lg md:text-xl text-on-surface leading-relaxed mb-6">
              Med 20 års erfarenhet inom dans har jag alltid fått frågan: vad dansar du för dansstilar? Mitt svar har alltid varit — <span class="text-fuchsia-600 font-medium">min egen dansstil</span>.
            </p>
            <p class="text-on-surface-dim leading-relaxed mb-6">
              Jag har varit danslärare i över 10 år och brinner för att se unga utvecklas och uppleva äkta dansglädje, taktkänsla, självförtroende, attityd och energi.
            </p>
            <p class="text-on-surface-dim leading-relaxed mb-8">
              Jag erbjuder mixgrupper — ett allt-i-ett-paket med blandade dansstilar som showdans, balett, hiphop/street och breakdance. För såväl killar som tjejer! Varför begränsa sig till en dansstil när man kan få uppleva det bästa av flera världar.
            </p>
            <div class="pt-6 border-t border-outline/10">
              <p class="text-xl md:text-2xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-fuchsia-600 to-violet-600 italic">
                "Feel the beat, own the floor!"
              </p>
              <p class="text-on-surface-dim mt-3 text-sm">— Zeynep, grundare av Zey Dance Club</p>
            </div>
          </div>
        </div>
      </div>
    </section>

    <!-- Updates (only show if there are any) -->
    <section v-if="updates.length > 0" class="py-12 bg-gradient-to-b from-fuchsia-50/50 to-surface">
      <div class="container">
        <div class="max-w-4xl mx-auto">
          <h2 class="text-xs font-semibold uppercase tracking-[0.2em] text-fuchsia-600 mb-6 text-center">Aktuellt</h2>
          <div class="space-y-3">
            <div
              v-for="update in updates"
              :key="update.id"
              class="bg-white rounded-2xl p-5 shadow-sm border border-fuchsia-100/50"
            >
              <div class="flex items-start gap-4">
                <div class="w-10 h-10 rounded-full bg-gradient-to-br from-fuchsia-100 to-violet-100 flex items-center justify-center flex-shrink-0">
                  <svg class="w-5 h-5 text-fuchsia-600" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
                    <path stroke-linecap="round" stroke-linejoin="round" d="M11 5.882V19.24a1.76 1.76 0 01-3.417.592l-2.147-6.15M18 13a3 3 0 100-6M5.436 13.683A4.001 4.001 0 017 6h1.832c4.1 0 7.625-1.234 9.168-3v14c-1.543-1.766-5.067-3-9.168-3H7a3.988 3.988 0 01-1.564-.317z" />
                  </svg>
                </div>
                <div class="flex-1">
                  <h3 class="font-semibold text-on-surface">{{ update.title }}</h3>
                  <p v-if="update.content" class="text-on-surface-dim text-sm mt-1 leading-relaxed">{{ update.content }}</p>
                  <p class="text-xs text-on-surface-dim/50 mt-2">{{ formatDate(update.published_at) }}</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>

    <!-- Benefits -->
    <section class="section bg-surface">
      <div class="container">
        <span class="block text-xs font-semibold uppercase tracking-[0.2em] text-fuchsia-600 mb-4 text-center">Vad du får</span>
        <h2 class="text-2xl md:text-3xl font-bold text-center text-on-surface mb-12">Det här är Zey Dance Club</h2>
        <div class="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-6 max-w-4xl mx-auto">
          <div v-for="benefit in benefits" :key="benefit.title" class="bg-white rounded-2xl text-center p-6 shadow-sm border border-outline/10 hover:shadow-md hover:-translate-y-0.5 transition-all duration-300">
            <!-- Icons -->
            <div class="w-14 h-14 mx-auto mb-4 rounded-2xl bg-gradient-to-br from-fuchsia-100 to-violet-100 flex items-center justify-center">
              <!-- Sparkles icon -->
              <svg v-if="benefit.icon === 'sparkles'" class="w-7 h-7 text-fuchsia-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M5 3v4M3 5h4M6 17v4m-2-2h4m5-16l2.286 6.857L21 12l-5.714 2.143L13 21l-2.286-6.857L5 12l5.714-2.143L13 3z" />
              </svg>
              <!-- Music icon -->
              <svg v-else-if="benefit.icon === 'music'" class="w-7 h-7 text-fuchsia-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M9 19V6l12-3v13M9 19c0 1.105-1.343 2-3 2s-3-.895-3-2 1.343-2 3-2 3 .895 3 2zm12-3c0 1.105-1.343 2-3 2s-3-.895-3-2 1.343-2 3-2 3 .895 3 2zM9 10l12-3" />
              </svg>
              <!-- Trending icon -->
              <svg v-else-if="benefit.icon === 'trending'" class="w-7 h-7 text-fuchsia-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
              </svg>
              <!-- Bolt icon -->
              <svg v-else-if="benefit.icon === 'bolt'" class="w-7 h-7 text-fuchsia-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M13 10V3L4 14h7v7l9-11h-7z" />
              </svg>
            </div>
            <h3 class="font-semibold text-on-surface mb-1">{{ benefit.title }}</h3>
            <p class="text-sm text-on-surface-dim leading-relaxed">{{ benefit.desc }}</p>
          </div>
        </div>
      </div>
    </section>

    <!-- FAQ -->
    <section class="section bg-surface-dim">
      <div class="container">
        <span class="block text-xs font-semibold uppercase tracking-[0.2em] text-fuchsia-600 mb-4 text-center">FAQ</span>
        <h2 class="text-2xl md:text-3xl font-bold text-center text-on-surface mb-12">Vanliga frågor</h2>
        <div class="max-w-2xl mx-auto space-y-3">
          <div class="bg-white rounded-2xl p-6 shadow-sm border border-outline/10">
            <h3 class="font-semibold text-on-surface mb-2">Behöver man ha dansat förut?</h3>
            <p class="text-on-surface-dim text-sm leading-relaxed">Nej, inga förkunskaper krävs! Vi börjar från grunden och anpassar undervisningen efter varje grupps nivå.</p>
          </div>
          <div class="bg-white rounded-2xl p-6 shadow-sm border border-outline/10">
            <h3 class="font-semibold text-on-surface mb-2">Vad ska man ha på sig?</h3>
            <p class="text-on-surface-dim text-sm leading-relaxed">Bekväma kläder som är lätta att röra sig i. Barfota eller strumpor fungerar bra på dansgolvet.</p>
          </div>
          <div class="bg-white rounded-2xl p-6 shadow-sm border border-outline/10">
            <h3 class="font-semibold text-on-surface mb-2">Kan man prova på?</h3>
            <p class="text-on-surface-dim text-sm leading-relaxed">Ja! En provlektion kostar 99 kr. Kontakta oss så bokar vi in dig på ett pass.</p>
          </div>
          <div class="bg-white rounded-2xl p-6 shadow-sm border border-outline/10">
            <h3 class="font-semibold text-on-surface mb-2">Är det för både killar och tjejer?</h3>
            <p class="text-on-surface-dim text-sm leading-relaxed">Absolut! Alla är välkomna oavsett kön. Dans är för alla som vill röra sig till musik.</p>
          </div>
          <div class="bg-white rounded-2xl p-6 shadow-sm border border-outline/10">
            <h3 class="font-semibold text-on-surface mb-2">Hur fungerar betalningen?</h3>
            <p class="text-on-surface-dim text-sm leading-relaxed">Terminsavgiften betalas i förskott via faktura. Du får fakturan efter att anmälan är bekräftad.</p>
          </div>
          <div class="bg-white rounded-2xl p-6 shadow-sm border border-outline/10">
            <h3 class="font-semibold text-on-surface mb-2">Vad händer om man missar ett pass?</h3>
            <p class="text-on-surface-dim text-sm leading-relaxed">Det går bra att missa enstaka pass — man kan alltid hänga med nästa gång. Vid längre frånvaro, kontakta oss.</p>
          </div>
          <div class="bg-white rounded-2xl p-6 shadow-sm border border-outline/10">
            <h3 class="font-semibold text-on-surface mb-2">Finns det uppvisning?</h3>
            <p class="text-on-surface-dim text-sm leading-relaxed">Ja! Varje termin avslutas med en uppvisning där alla får visa upp vad de lärt sig. Ett minne för livet!</p>
          </div>
        </div>
      </div>
    </section>

    <!-- Bildgrid -->
    <section class="py-16 bg-surface">
      <div class="container">
        <div class="max-w-3xl mx-auto">
          <img
            src="/images/zeynep-grid.avif"
            alt="Dans med Zeynep"
            class="w-full rounded-3xl shadow-xl"
          />
        </div>
      </div>
    </section>

    <!-- Location: Studio image + Map -->
    <section class="section bg-surface">
      <div class="container">
        <div class="max-w-4xl mx-auto">
          <span class="block text-xs font-semibold uppercase tracking-[0.2em] text-fuchsia-600 mb-4 text-center">Var vi finns</span>
          <h2 class="text-2xl md:text-3xl font-bold text-center text-on-surface mb-4">Hitta hit</h2>
          <p class="text-center text-on-surface-dim mb-10">Rosvägen 2, 137 56 Tungelsta</p>
          <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div class="aspect-[4/3] rounded-2xl overflow-hidden shadow-md">
              <img
                src="/images/annexet-barndans.avif"
                alt="Danslokalen på Rosvägen 2 i Tungelsta"
                class="w-full h-full object-cover"
              />
            </div>
            <div class="aspect-[4/3] rounded-2xl overflow-hidden shadow-md">
              <ClientOnly>
                <AppleMap
                  :single-gym="{ name: 'Zey Dance Club', address: 'Rosvägen 2, 137 56 Tungelsta', lat: 59.1028066, lng: 18.0428664, href: '/zeydance' }"
                />
              </ClientOnly>
            </div>
          </div>
        </div>
      </div>
    </section>

    <!-- CTA -->
    <section class="py-20 bg-gradient-to-br from-fuchsia-600 via-violet-600 to-indigo-600 relative overflow-hidden">
      <div class="absolute inset-0 z-0">
        <div class="absolute top-0 right-0 w-96 h-96 bg-white/5 rounded-full translate-x-1/2 -translate-y-1/2 blur-3xl" />
        <div class="absolute bottom-0 left-0 w-64 h-64 bg-fuchsia-400/10 rounded-full -translate-x-1/2 translate-y-1/2 blur-3xl" />
      </div>
      <div class="container text-center text-white relative z-10">
        <h2 class="text-3xl md:text-4xl font-bold text-white mb-4">Redo att börja dansa?</h2>
        <p class="text-lg text-white/80 mb-10 max-w-md mx-auto">Anmäl dig idag och bli en del av Zey Dance Club</p>
        <button @click="showZeySheet = true" class="inline-flex items-center gap-2 px-8 py-4 bg-white text-fuchsia-700 font-bold rounded-full shadow-xl hover:shadow-2xl hover:scale-105 transition-all duration-300 border-none">
          Anmäl nu
          <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 8l4 4m0 0l-4 4m4-4H3"/></svg>
        </button>
      </div>
    </section>

    <!-- Contact Form -->
    <section class="py-20 bg-surface-dim">
      <div class="container">
        <div class="max-w-lg mx-auto">
          <span class="block text-xs font-semibold uppercase tracking-[0.2em] text-fuchsia-600 mb-4 text-center">Kontakt</span>
          <h2 class="text-2xl md:text-3xl font-bold text-center text-on-surface mb-3">Har du frågor?</h2>
          <p class="text-center text-on-surface-dim mb-10">Skriv till oss så svarar vi så snart vi kan</p>

          <!-- Success state -->
          <div v-if="contactSuccess" class="text-center py-10 bg-white rounded-3xl border border-green-100 shadow-sm">
            <div class="w-14 h-14 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <svg class="w-7 h-7 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7" />
              </svg>
            </div>
            <h3 class="font-semibold text-lg text-on-surface mb-2">Tack för ditt meddelande!</h3>
            <p class="text-on-surface-dim text-sm">Vi återkommer till dig så snart vi kan.</p>
            <button @click="contactSuccess = false" class="mt-6 text-fuchsia-600 font-medium hover:text-fuchsia-500 text-sm">Skicka ett till meddelande</button>
          </div>

          <!-- Form -->
          <form v-else @submit.prevent="handleContactSubmit" class="bg-white rounded-3xl p-6 md:p-8 shadow-sm border border-outline/10 space-y-5">
            <div class="grid md:grid-cols-2 gap-4">
              <div>
                <label class="block text-sm font-medium text-on-surface mb-2">Ditt namn</label>
                <input v-model="contactForm.name" type="text" required class="w-full px-4 py-3 rounded-xl border border-outline/20 focus:border-fuchsia-500 focus:ring-2 focus:ring-fuchsia-500/20 focus:outline-none text-on-surface bg-surface transition-all" placeholder="Förnamn" />
              </div>
              <div>
                <label class="block text-sm font-medium text-on-surface mb-2">E-post</label>
                <input v-model="contactForm.email" type="email" required class="w-full px-4 py-3 rounded-xl border border-outline/20 focus:border-fuchsia-500 focus:ring-2 focus:ring-fuchsia-500/20 focus:outline-none text-on-surface bg-surface transition-all" placeholder="din@email.se" />
              </div>
            </div>
            <div>
              <label class="block text-sm font-medium text-on-surface mb-2">Meddelande</label>
              <textarea v-model="contactForm.message" required rows="4" class="w-full px-4 py-3 rounded-xl border border-outline/20 focus:border-fuchsia-500 focus:ring-2 focus:ring-fuchsia-500/20 focus:outline-none text-on-surface bg-surface resize-none transition-all" placeholder="Skriv din fråga här..." />
            </div>

            <div v-if="contactError" class="text-red-600 text-sm bg-red-50 px-4 py-3 rounded-xl">{{ contactError }}</div>

            <button type="submit" :disabled="contactSubmitting" class="w-full inline-flex items-center justify-center gap-2 px-6 py-4 bg-gradient-to-r from-fuchsia-600 to-violet-600 hover:from-fuchsia-500 hover:to-violet-500 text-white font-semibold rounded-xl shadow-md hover:shadow-lg transition-all disabled:opacity-50 border-none">
              {{ contactSubmitting ? 'Skickar...' : 'Skicka meddelande' }}
              <svg v-if="!contactSubmitting" class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 8l4 4m0 0l-4 4m4-4H3"/></svg>
            </button>
          </form>

          <p class="text-center text-on-surface-dim/60 text-sm mt-8">
            Eller mejla direkt till <a href="mailto:zeydanceclub@hotmail.com" class="text-fuchsia-600 hover:text-fuchsia-500 font-medium">zeydanceclub@hotmail.com</a>
          </p>
        </div>
      </div>
    </section>

    <!-- Bottom Sheet -->
    <SheetsBottomSheet :open="showZeySheet" title="Anmälan" subtitle="Fyll i uppgifterna nedan så kontaktar vi dig med bekräftelse." @close="showZeySheet = false">
      <!-- Success state -->
      <div v-if="zeySuccess" class="text-center py-10">
        <div class="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
          <svg class="w-8 h-8 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7" />
          </svg>
        </div>
        <h3 class="font-semibold text-xl text-on-surface mb-2">Tack för din anmälan!</h3>
        <p class="text-on-surface-dim">Vi hör av oss inom kort med mer info.</p>
      </div>

      <!-- Form -->
      <form v-else @submit.prevent="handleZeySubmit" class="space-y-4 pb-4">
        <div>
          <label class="block text-sm font-medium text-on-surface mb-1.5">Dansarens namn</label>
          <input v-model="zeyForm.childName" type="text" required class="w-full px-4 py-3 rounded-xl border border-outline/20 focus:border-fuchsia-500 focus:ring-2 focus:ring-fuchsia-500/20 focus:outline-none text-on-surface transition-all" placeholder="Förnamn och efternamn" />
        </div>
        <div>
          <label class="block text-sm font-medium text-on-surface mb-1.5">Ålder</label>
          <input v-model="zeyForm.childAge" type="text" required class="w-full px-4 py-3 rounded-xl border border-outline/20 focus:border-fuchsia-500 focus:ring-2 focus:ring-fuchsia-500/20 focus:outline-none text-on-surface transition-all" placeholder="T.ex. 12 år" />
        </div>
        <div>
          <label class="block text-sm font-medium text-on-surface mb-1.5">Önskad grupp</label>
          <select v-model="zeyForm.group" required class="w-full px-4 py-3 rounded-xl border border-outline/20 focus:border-fuchsia-500 focus:ring-2 focus:ring-fuchsia-500/20 focus:outline-none text-on-surface bg-surface transition-all">
            <option value="" disabled>Välj grupp</option>
            <option v-for="group in zeyGroups" :key="group.name" :value="group.name">{{ group.name }} ({{ group.age }})</option>
          </select>
        </div>
        <div>
          <label class="block text-sm font-medium text-on-surface mb-1.5">Vårdnadshavare</label>
          <input v-model="zeyForm.parentName" type="text" required class="w-full px-4 py-3 rounded-xl border border-outline/20 focus:border-fuchsia-500 focus:ring-2 focus:ring-fuchsia-500/20 focus:outline-none text-on-surface transition-all" placeholder="Namn på vårdnadshavare" />
        </div>
        <div class="grid grid-cols-2 gap-3">
          <div>
            <label class="block text-sm font-medium text-on-surface mb-1.5">Telefon</label>
            <input v-model="zeyForm.phone" type="tel" required class="w-full px-4 py-3 rounded-xl border border-outline/20 focus:border-fuchsia-500 focus:ring-2 focus:ring-fuchsia-500/20 focus:outline-none text-on-surface transition-all" placeholder="07X-XXX XX XX" />
          </div>
          <div>
            <label class="block text-sm font-medium text-on-surface mb-1.5">E-post</label>
            <input v-model="zeyForm.email" type="email" required class="w-full px-4 py-3 rounded-xl border border-outline/20 focus:border-fuchsia-500 focus:ring-2 focus:ring-fuchsia-500/20 focus:outline-none text-on-surface transition-all" placeholder="din@email.se" />
          </div>
        </div>

        <div v-if="zeyError" class="text-red-600 text-sm bg-red-50 px-4 py-3 rounded-xl">{{ zeyError }}</div>

        <button type="submit" :disabled="zeySubmitting" class="w-full inline-flex items-center justify-center gap-2 px-6 py-4 bg-gradient-to-r from-fuchsia-600 to-violet-600 hover:from-fuchsia-500 hover:to-violet-500 text-white font-semibold rounded-xl shadow-md transition-all disabled:opacity-50 border-none mt-2">
          {{ zeySubmitting ? 'Skickar...' : 'Skicka anmälan' }}
          <svg v-if="!zeySubmitting" class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 8l4 4m0 0l-4 4m4-4H3"/></svg>
        </button>
      </form>
    </SheetsBottomSheet>
  </div>
</template>
