<script setup lang="ts">
useHead({
  title: 'Dans för barn och unga - Core Gym Club',
  meta: [{ name: 'description', content: 'Dans för barn och unga i Tungelsta. Zey Dance Club i samarbete med Core Gym Club. Barndans, showdans, balett, hiphop och breakdance för 5-16 år.' }]
})

useThemeColor('#ec4899')

const zeyGroups = [
  { name: 'Danzemix Kidz', age: '5-7 år', day: 'Måndagar', time: '17:10-17:55', length: '45 min', price: '1 800 kr/termin' },
  { name: 'Danzemix Beat', age: '8-10 år', day: 'Torsdagar', time: '17:10-18:00', length: '50 min', price: '1 800 kr/termin' },
  { name: 'Danzemix Flow', age: '11-13 år', day: 'Torsdagar', time: '18:05-19:00', length: '55 min', price: '1 900 kr/termin' },
  { name: 'Danzemix Vibe', age: '14-16 år', day: 'Måndagar', time: '18:00-19:00', length: '60 min', price: '1 900 kr/termin' },
]

const benefits = [
  { title: 'Tillhörighet', desc: 'Känn gemenskap i gruppen' },
  { title: 'Trygghet', desc: 'Anpassat för varje ålder' },
  { title: 'Glädje', desc: 'Ha kul med nya danskompisar' },
  { title: 'Utveckling', desc: 'Lär dig nya färdigheter' },
]

// Bottom sheet states
const showZeySheet = ref(false)
const showRorelseSheet = ref(false)

// Zey Dance Club form
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

    <!-- Zey Dance Club -->
    <section id="zey" class="section bg-surface relative z-10 -mt-16 rounded-t-[3rem] pt-24">
      <div class="container">
        <div class="max-w-4xl mx-auto">
          <div class="text-center mb-12">
            <span class="inline-block px-4 py-2 rounded-full bg-pink-100 text-pink-600 mb-6 text-sm font-bold tracking-widest uppercase">
              I samarbete med Core Gym Club
            </span>
            <h2 class="font-display font-bold text-4xl md:text-5xl lg:text-6xl mb-6 uppercase tracking-tight text-on-surface">Zey Dance Club</h2>
            <p class="text-xl md:text-2xl text-on-surface-dim max-w-2xl mx-auto leading-relaxed">
              Professionella danskurser för 5-16 år. En mix av barndans, showdans, balett, hiphop och breakdance — varför välja en stil när du kan få det bästa av flera?
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
                  <span class="text-on-surface font-medium">Rosvägen 2, Tungelsta</span>
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
                Anmäl till Zey Dance Club
              </button>
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
                <span class="font-medium">Instruktör:</span> Lisa
              </div>
            </div>
          </div>

          <!-- Info grid -->
          <div class="grid grid-cols-2 md:grid-cols-4 gap-4 max-w-2xl mx-auto mb-12">
            <div class="text-center p-4">
              <span class="text-label text-on-surface-dim block mb-1">Start</span>
              <span class="font-bold">Våren 2026</span>
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
          <button @click="showZeySheet = true" class="btn bg-white text-purple-600 hover:bg-pink-50 shadow-xl border-none">
            Anmäl till Zey Dance Club
          </button>
          <button @click="showRorelseSheet = true" class="btn bg-white/10 text-white hover:bg-white/20 border border-white/30">
            Rörelseglädje 3-4 år
          </button>
        </div>
      </div>
    </section>

    <!-- Zey Dance Club Bottom Sheet -->
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
