<script setup lang="ts">
definePageMeta({
  layout: 'zeydance'
})

useHead({
  title: 'Zey Dance Club - Dans för barn och unga i Tungelsta',
  meta: [{ name: 'description', content: 'Zey Dance Club - professionella danskurser för barn 5-16 år i Tungelsta. Barndans, showdans, balett, hiphop och breakdance.' }]
})

useThemeColor('#ec4899')

const zeyGroups = [
  { name: 'Danzemix Kidz', age: '5-7 år', day: 'Måndagar', time: '17:10-17:55', length: '45 min', price: '1 800 kr/termin' },
  { name: 'Danzemix Beat', age: '8-10 år', day: 'Torsdagar', time: '17:10-18:00', length: '50 min', price: '1 800 kr/termin' },
  { name: 'Danzemix Flow', age: '11-13 år', day: 'Torsdagar', time: '18:05-19:00', length: '55 min', price: '1 900 kr/termin' },
  { name: 'Danzemix Vibe', age: '14-16 år', day: 'Måndagar', time: '18:00-19:00', length: '60 min', price: '1 900 kr/termin' },
]

const benefits = [
  {
    title: 'Tillhörighet',
    desc: 'Bli en del av en dansfamilj där alla stöttar och hejar på varandra',
    icon: 'users'
  },
  {
    title: 'Trygghet',
    desc: 'Tryggt lärande med erfarna ledare som ser varje barn',
    icon: 'shield'
  },
  {
    title: 'Glädje',
    desc: 'Rörelseglädje, skratt och nya kompisar i varje lektion',
    icon: 'sparkles'
  },
  {
    title: 'Utveckling',
    desc: 'Bygg självförtroende, koordination och kreativitet',
    icon: 'trending'
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
    <section class="min-h-[80vh] flex items-center justify-center text-white px-6 relative overflow-hidden">
      <!-- Background image -->
      <div class="absolute inset-0 z-0">
        <img
          src="/images/barndans-hero.avif"
          alt="Zey Dance Club"
          class="w-full h-full object-cover"
        />
        <div class="absolute inset-0 bg-gradient-to-t from-pink-600/90 via-purple-500/70 to-indigo-500/60" />
      </div>

      <div class="text-center relative z-10 max-w-4xl mx-auto pt-32 pb-40">
        <span class="inline-block px-4 py-2 bg-pink-200/20 text-pink-100 rounded-full text-sm font-bold tracking-widest uppercase mb-6 border border-pink-200/30">
          Tungelsta
        </span>
        <h1 class="font-display font-bold text-5xl md:text-7xl lg:text-8xl text-white mb-6 uppercase tracking-tight">Zey Dance Club</h1>
        <p class="text-xl md:text-2xl text-white/90 mb-10 max-w-2xl mx-auto font-medium">
          Professionella danskurser för barn 5-16 år. Barndans, showdans, balett, hiphop och breakdance.
        </p>
        <a href="#kurser" class="btn bg-white text-purple-600 hover:bg-pink-50 shadow-lg hover:shadow-xl border-none">
          Se kurser
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
          <div class="bg-surface-dim rounded-3xl border border-outline/20 overflow-hidden mb-12">
            <div class="overflow-x-auto">
              <table class="w-full text-left">
                <thead>
                  <tr class="border-b border-outline/20 bg-pink-50/50">
                    <th class="px-6 py-4 text-sm font-bold uppercase tracking-wider text-on-surface-dim">Grupp</th>
                    <th class="px-6 py-4 text-sm font-bold uppercase tracking-wider text-on-surface-dim">Ålder</th>
                    <th class="px-6 py-4 text-sm font-bold uppercase tracking-wider text-on-surface-dim">Dag & tid</th>
                    <th class="px-6 py-4 text-sm font-bold uppercase tracking-wider text-on-surface-dim">Pris</th>
                  </tr>
                </thead>
                <tbody class="divide-y divide-outline/10">
                  <tr v-for="group in zeyGroups" :key="group.name" class="hover:bg-pink-50/30 transition-colors">
                    <td class="px-6 py-4">
                      <span class="font-bold text-on-surface">{{ group.name }}</span>
                    </td>
                    <td class="px-6 py-4 text-on-surface-dim">{{ group.age }}</td>
                    <td class="px-6 py-4 text-on-surface-dim">
                      <span class="block">{{ group.day }}</span>
                      <span class="text-on-surface-dim/70 text-sm">{{ group.time }} ({{ group.length }})</span>
                    </td>
                    <td class="px-6 py-4 text-on-surface-dim">{{ group.price }}</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>

          <p class="text-center text-on-surface-dim mb-12">
            12 veckor per termin. Individuell coachning, repetitioner och avslutande uppvisning ingår.
          </p>

          <!-- Practical info -->
          <div class="grid md:grid-cols-2 gap-6">
            <div class="bg-surface-dim rounded-2xl border border-outline/20 p-6">
              <h3 class="font-bold text-lg text-on-surface mb-4">Praktisk info</h3>
              <div class="space-y-3 text-on-surface-dim">
                <div class="flex justify-between">
                  <span>Plats</span>
                  <span class="text-on-surface font-medium">Tungelstavägen 200</span>
                </div>
                <div class="flex justify-between">
                  <span>Start</span>
                  <span class="text-on-surface font-medium">Måndag 9 februari</span>
                </div>
                <div class="flex justify-between">
                  <span>Prova på</span>
                  <span class="text-on-surface font-medium">99 kr</span>
                </div>
              </div>
              <p class="text-sm text-on-surface-dim/70 mt-4">Uppehåll sportlov v.9 och påsklov v.15</p>
            </div>

            <div class="bg-pink-500 rounded-2xl p-6 flex flex-col text-white">
              <h3 class="font-bold text-lg mb-4">Anmälan</h3>
              <p class="text-white/80 mb-6">Anmäl ditt barn till Zey Dance Club. Vi kontaktar dig med bekräftelse.</p>
              <button
                @click="showZeySheet = true"
                class="btn bg-white text-pink-600 hover:bg-pink-50 border-none mt-auto"
              >
                Anmäl nu
              </button>
            </div>
          </div>
        </div>
      </div>
    </section>

    <!-- Benefits -->
    <section class="section bg-surface-dim">
      <div class="container">
        <h2 class="text-section mb-12">Varför dans?</h2>
        <div class="grid grid-cols-2 md:grid-cols-4 gap-6 max-w-5xl mx-auto">
          <div v-for="benefit in benefits" :key="benefit.title" class="card text-center hover:-translate-y-1 transition-transform p-6">
            <!-- Icons -->
            <div class="w-12 h-12 mx-auto mb-4 rounded-full bg-pink-100 flex items-center justify-center">
              <!-- Users icon -->
              <svg v-if="benefit.icon === 'users'" class="w-6 h-6 text-pink-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
              </svg>
              <!-- Shield icon -->
              <svg v-else-if="benefit.icon === 'shield'" class="w-6 h-6 text-pink-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
              </svg>
              <!-- Sparkles icon -->
              <svg v-else-if="benefit.icon === 'sparkles'" class="w-6 h-6 text-pink-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M5 3v4M3 5h4M6 17v4m-2-2h4m5-16l2.286 6.857L21 12l-5.714 2.143L13 21l-2.286-6.857L5 12l5.714-2.143L13 3z" />
              </svg>
              <!-- Trending icon -->
              <svg v-else-if="benefit.icon === 'trending'" class="w-6 h-6 text-pink-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
              </svg>
            </div>
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
            <h3 class="text-title mb-2 text-lg">Kan jag prova först?</h3>
            <p class="text-body text-on-surface-dim">Ja! Prova på-pris är 99 kr. Kontakta oss för att boka en provlektion.</p>
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
        <p class="text-lead text-white/80 mb-10">Anmäl ditt barn idag</p>
        <button @click="showZeySheet = true" class="btn bg-white text-purple-600 hover:bg-pink-50 shadow-xl border-none">
          Anmäl till Zey Dance Club
        </button>
      </div>
    </section>

    <!-- Contact -->
    <section class="py-12 bg-surface">
      <div class="container">
        <div class="max-w-2xl mx-auto text-center">
          <p class="text-on-surface-dim mb-4">Frågor? Kontakta oss på</p>
          <a href="mailto:zeydanceclub@hotmail.com" class="text-xl font-bold text-pink-500 hover:text-pink-400 transition-colors">
            zeydanceclub@hotmail.com
          </a>
        </div>
      </div>
    </section>

    <!-- Bottom Sheet -->
    <SheetsBottomSheet :open="showZeySheet" title="Anmälan Zey Dance Club" subtitle="Fyll i uppgifterna nedan så kontaktar vi dig." @close="showZeySheet = false">
      <!-- Success state -->
      <div v-if="zeySuccess" class="text-center py-8">
        <div class="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
          <svg class="w-8 h-8 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7" />
          </svg>
        </div>
        <h3 class="font-bold text-xl text-on-surface mb-2">Tack för din anmälan!</h3>
        <p class="text-on-surface-dim">Vi hör av oss inom kort.</p>
      </div>

      <!-- Form -->
      <form v-else @submit.prevent="handleZeySubmit" class="space-y-4 pb-4">
        <div>
          <label class="block text-sm font-medium text-on-surface-dim mb-1">Barnets namn</label>
          <input v-model="zeyForm.childName" type="text" required class="w-full px-4 py-3 rounded-xl border border-outline/30 focus:border-pink-500 focus:outline-none text-on-surface" placeholder="Barnets förnamn och efternamn" />
        </div>
        <div>
          <label class="block text-sm font-medium text-on-surface-dim mb-1">Barnets ålder</label>
          <input v-model="zeyForm.childAge" type="text" required class="w-full px-4 py-3 rounded-xl border border-outline/30 focus:border-pink-500 focus:outline-none text-on-surface" placeholder="T.ex. 7 år" />
        </div>
        <div>
          <label class="block text-sm font-medium text-on-surface-dim mb-1">Önskad grupp</label>
          <select v-model="zeyForm.group" required class="w-full px-4 py-3 rounded-xl border border-outline/30 focus:border-pink-500 focus:outline-none text-on-surface bg-surface">
            <option value="" disabled>Välj grupp</option>
            <option v-for="group in zeyGroups" :key="group.name" :value="group.name">{{ group.name }} ({{ group.age }})</option>
          </select>
        </div>
        <div>
          <label class="block text-sm font-medium text-on-surface-dim mb-1">Vårdnadshavares namn</label>
          <input v-model="zeyForm.parentName" type="text" required class="w-full px-4 py-3 rounded-xl border border-outline/30 focus:border-pink-500 focus:outline-none text-on-surface" placeholder="Ditt namn" />
        </div>
        <div>
          <label class="block text-sm font-medium text-on-surface-dim mb-1">Telefon</label>
          <input v-model="zeyForm.phone" type="tel" required class="w-full px-4 py-3 rounded-xl border border-outline/30 focus:border-pink-500 focus:outline-none text-on-surface" placeholder="07X-XXX XX XX" />
        </div>
        <div>
          <label class="block text-sm font-medium text-on-surface-dim mb-1">E-post</label>
          <input v-model="zeyForm.email" type="email" required class="w-full px-4 py-3 rounded-xl border border-outline/30 focus:border-pink-500 focus:outline-none text-on-surface" placeholder="din@email.se" />
        </div>

        <div v-if="zeyError" class="text-red-600 text-sm bg-red-50 px-4 py-3 rounded-xl">{{ zeyError }}</div>

        <button type="submit" :disabled="zeySubmitting" class="w-full btn bg-pink-500 hover:bg-pink-400 text-white border-none py-4 text-lg disabled:opacity-50">
          {{ zeySubmitting ? 'Skickar...' : 'Skicka anmälan' }}
        </button>
      </form>
    </SheetsBottomSheet>
  </div>
</template>
