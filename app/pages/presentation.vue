<script setup lang="ts">
definePageMeta({ layout: false })

useHead({
  title: 'Pers Tal - Core Gym',
  meta: [{ name: 'robots', content: 'noindex' }]
})

const CORRECT_PASSWORD = 'coregym2026'

const isAuthed = ref(false)
const passwordInput = ref('')
const passwordError = ref(false)
const mode = ref<'edit' | 'present' | 'tips'>('edit')
const currentSlideIndex = ref(0)

const defaultSections = [
  {
    title: "ÖPPNING",
    content: `Hej allihopa. Per Karlsson, Core Gym.

Jag tänkte berätta lite om vår resa. Från en idé i Tungelsta till... ja, snart fem gym i Haninge.

Men vi börjar från början.`
  },
  {
    title: "BAKGRUNDEN",
    content: `Jag var idrottslärare i 25 år.

25 år i gymnastiksalen. Och vet ni vad jag lärde mig under de åren?

Att alla kan röra på sig. Alla. Oavsett hur man ser ut, hur gammal man är, hur man mår. Kroppen är gjord för rörelse.

Men — och det här är viktigt — inte alla mår bra av att bli bedömda. Inte alla mår bra av pekpinnar och prestationskrav.

[PAUS]

Så 2012 tänkte jag: tänk om man kunde ta det bästa från skolan — gemenskapen, att alla får vara med — men släppa det jobbiga. Betygen. Jämförelserna. Pressen.

Det blev Core Gym.`
  },
  {
    title: "BORN AND BASED",
    content: `Vi har ett motto: Born and based i Haninge.

Vi föddes i Haninge och vi verkar i Haninge. Vi trivs bra här — det är en fantastisk kommun att jobba i.

2012 började vi i Tungelsta. Litet gym, stort hjärta.
2016 kom Västerhaninge. Mitt i centrum.
2022 öppnade vi Vegastaden. 2900 kvm. Takterrass, padel, utegym. One of a kind — riktigt fint gym.

Och nu... nu kommer Ösmo. Femte gymmet. 2026.

[PAUS]

Fyra gym idag. Snart fem. Men fortfarande samma känsla som när vi började.`
  },
  {
    title: "VÅR STÖRSTA KONKURRENT",
    content: `Ni undrar kanske vilka våra konkurrenter är.

SATS? Fitness24Seven? Nordic Wellness?

[SKAKA PÅ HUVUDET]

Nej.

Vår största konkurrent är soffan.

[PAUS — LÅT DET LANDA]

Soffan är mjuk och skön. Netflix är bra. "Jag börjar på måndag" — den har vi alla sagt.

Men vi jobbar för att fler ska komma upp ur soffan och hitta till gymmet. Inte för att bli starkast. Utan för att må bättre. Sova bättre. Orka mer.

Det är hela grejen.`
  },
  {
    title: "SÅ HUR GÖR VI DÅ?",
    content: `Vi säger "kom som du är" — och vi menar det faktiskt.

Har du inte tränat på fem år? Välkommen.
Tränar du varje dag? Välkommen.
Är du nervös? Det var vi alla en gång.

Vi har inga krångliga avtal. Vill du sluta? Två månaders uppsägning. Klart.

Och vi har öppet nästan dygnet runt. Fyra på morgonen till midnatt, varje dag.

Ett hej kostar inget. Det är gratis att vara trevlig.`
  },
  {
    title: "DET SOM GÖR OSS ANNORLUNDA",
    content: `Ett medlemskap — alla gym. Träna i Tungelsta på morgonen, Vega på kvällen.

Vi har precis lanserat EGYM i Västerhaninge. Maskiner som ställer in sig efter dig, kommer ihåg hur du tränar. Funkar riktigt bra.

På Vega har vi 1500 kvm takterrass. Utegym, löparbana, padelbana.

Och vet ni vad? Väg 73 går precis bredvid — men när man står där uppe märker man det inte. Det är grönt runt omkring.

[PAUS]

Men framför allt: vi är fortfarande familjeägda. Jag bor här, mina barn växte upp här.

Vi är grannar. Det förpliktigar.`
  },
  {
    title: "AVSLUTNING",
    content: `Vi kommer aldrig bli störst.

Det är inte målet heller. Målet är att vara bäst för er som bor här. Haninges gym. Era gym.

Där man kommer som man är, tränar i sin egen takt, och alltid får ett hej när man kliver in.

[PAUS]

Om ni undrar något — kom förbi. Vi finns i Tungelsta, Västerhaninge, Vegastaden.

Och snart i Ösmo.

Tack.`
  }
]

const sections = ref<{ title: string; content: string }[]>([])

onMounted(() => {
  // Check session auth
  if (sessionStorage.getItem('presentation-auth') === 'true') {
    isAuthed.value = true
  }
  // Load sections
  const saved = localStorage.getItem('presentation-sections')
  sections.value = saved ? JSON.parse(saved) : defaultSections
})

function checkPassword() {
  if (passwordInput.value === CORRECT_PASSWORD) {
    isAuthed.value = true
    sessionStorage.setItem('presentation-auth', 'true')
    passwordError.value = false
  } else {
    passwordError.value = true
  }
}

function saveSections() {
  localStorage.setItem('presentation-sections', JSON.stringify(sections.value))
}

function updateTitle(index: number, value: string) {
  sections.value[index].title = value
  saveSections()
}

function updateContent(index: number, value: string) {
  sections.value[index].content = value
  saveSections()
}

function addSection() {
  sections.value.push({ title: 'NY SEKTION', content: 'Skriv här...' })
  saveSections()
}

function deleteSection(index: number) {
  if (sections.value.length <= 1) return
  if (confirm('Ta bort detta avsnitt?')) {
    sections.value.splice(index, 1)
    saveSections()
  }
}

function nextSlide() {
  if (currentSlideIndex.value < sections.value.length - 1) {
    currentSlideIndex.value++
  }
}

function prevSlide() {
  if (currentSlideIndex.value > 0) {
    currentSlideIndex.value--
  }
}

function formatContent(content: string) {
  return content
    .replace(/\[([^\]]+)\]/g, '<span class="pause">[$1]</span>')
    .replace(/\n/g, '<br>')
}

function setMode(newMode: 'edit' | 'present' | 'tips') {
  mode.value = newMode
  if (newMode === 'present') {
    currentSlideIndex.value = 0
  }
}

// Keyboard navigation
onMounted(() => {
  window.addEventListener('keydown', (e) => {
    if (mode.value !== 'present') return
    if (e.key === 'ArrowRight' || e.key === ' ') {
      e.preventDefault()
      nextSlide()
    }
    if (e.key === 'ArrowLeft') {
      e.preventDefault()
      prevSlide()
    }
  })
})

const currentSection = computed(() => sections.value[currentSlideIndex.value])
</script>

<template>
  <div class="presentation-app">
    <!-- Password Screen -->
    <div v-if="!isAuthed" class="password-screen">
      <div class="password-box">
        <h1>Pers Tal</h1>
        <p>Näringslivsfrukosten Haninge</p>
        <input
          v-model="passwordInput"
          type="password"
          placeholder="Lösenord"
          @keypress.enter="checkPassword"
          autofocus
        >
        <button @click="checkPassword">Öppna</button>
        <div v-if="passwordError" class="password-error">Fel lösenord</div>
      </div>
    </div>

    <!-- Main App -->
    <div v-else class="app-content">
      <header class="header">
        <h1>Pers Tal</h1>
        <div class="header-actions">
          <button :class="['btn', { active: mode === 'edit' }]" @click="setMode('edit')">Redigera</button>
          <button :class="['btn', { active: mode === 'present' }]" @click="setMode('present')">Presentation</button>
          <button :class="['btn', { active: mode === 'tips' }]" @click="setMode('tips')">Tips</button>
        </div>
      </header>

      <!-- Edit Mode -->
      <div v-if="mode === 'edit'" class="edit-mode">
        <div v-for="(section, i) in sections" :key="i" class="edit-section">
          <div class="edit-section-header">
            <input :value="section.title" @change="updateTitle(i, ($event.target as HTMLInputElement).value)" />
            <button class="delete-btn" @click="deleteSection(i)" title="Ta bort">&times;</button>
          </div>
          <textarea
            :value="section.content"
            @input="updateContent(i, ($event.target as HTMLTextAreaElement).value)"
          />
        </div>
        <button class="add-section-btn" @click="addSection">+ Lägg till avsnitt</button>
      </div>

      <!-- Present Mode -->
      <div v-if="mode === 'present'" class="present-mode">
        <div class="slide">
          <div class="slide-title">{{ currentSection?.title }}</div>
          <div class="slide-content" v-html="formatContent(currentSection?.content || '')" />
        </div>
        <div class="slide-nav">
          <button :disabled="currentSlideIndex === 0" @click="prevSlide">&larr; Föregående</button>
          <span class="slide-progress">{{ currentSlideIndex + 1 }} / {{ sections.length }}</span>
          <button :disabled="currentSlideIndex === sections.length - 1" @click="nextSlide">Nästa &rarr;</button>
        </div>
      </div>

      <!-- Tips Mode -->
      <div v-if="mode === 'tips'" class="tips-mode">
        <h2>Tips för framförandet</h2>
        <ul>
          <li><strong>"Vår största konkurrent är soffan"</strong> — pausa innan och efter. Det är din punchline.</li>
          <li><strong>"Ett hej kostar inget"</strong> — bra avslut på ett stycke. Använd den.</li>
          <li><strong>Takterrassen</strong> — folk älskar den. Visa bilder om du kan.</li>
          <li>Prata som du gör vanligt — det här är inte ett manus att läsa av. Det är en guide.</li>
          <li>Ha kul. Du har gjort det här förut. Du är bra på det.</li>
        </ul>
      </div>
    </div>
  </div>
</template>

<style scoped>
.presentation-app {
  --bg: #0a0a0a;
  --surface: #1a1a1a;
  --text: #f5f5f5;
  --dim: #888;
  --accent: #dc2626;
  --border: #333;

  min-height: 100vh;
  background: var(--bg);
  color: var(--text);
  font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif;
}

/* Password Screen */
.password-screen {
  min-height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 2rem;
}

.password-box {
  background: var(--surface);
  padding: 3rem;
  border-radius: 1rem;
  text-align: center;
  max-width: 320px;
  width: 100%;
}

.password-box h1 {
  font-size: 1.5rem;
  margin-bottom: 0.5rem;
}

.password-box p {
  color: var(--dim);
  margin-bottom: 2rem;
  font-size: 0.9rem;
}

.password-box input {
  width: 100%;
  padding: 1rem;
  border: 1px solid var(--border);
  border-radius: 0.5rem;
  background: var(--bg);
  color: var(--text);
  font-size: 1rem;
  margin-bottom: 1rem;
  text-align: center;
}

.password-box button {
  width: 100%;
  padding: 1rem;
  background: var(--accent);
  color: white;
  border: none;
  border-radius: 0.5rem;
  font-size: 1rem;
  font-weight: 600;
  cursor: pointer;
}

.password-error {
  color: var(--accent);
  margin-top: 1rem;
  font-size: 0.9rem;
}

/* Header */
.header {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  background: var(--surface);
  border-bottom: 1px solid var(--border);
  padding: 1rem;
  display: flex;
  align-items: center;
  justify-content: space-between;
  z-index: 100;
}

.header h1 {
  font-size: 1rem;
  font-weight: 600;
}

.header-actions {
  display: flex;
  gap: 0.5rem;
}

.btn {
  padding: 0.5rem 1rem;
  border: 1px solid var(--border);
  border-radius: 0.5rem;
  background: transparent;
  color: var(--text);
  font-size: 0.85rem;
  cursor: pointer;
  transition: all 0.2s;
}

.btn:hover { background: var(--border); }
.btn.active { background: var(--accent); border-color: var(--accent); }

/* Edit Mode */
.edit-mode {
  padding: 5rem 1rem 2rem;
  max-width: 800px;
  margin: 0 auto;
}

.edit-section {
  background: var(--surface);
  border-radius: 0.75rem;
  margin-bottom: 1rem;
  overflow: hidden;
}

.edit-section-header {
  background: var(--border);
  padding: 0.75rem 1rem;
  font-weight: 600;
  font-size: 0.9rem;
  display: flex;
  align-items: center;
  justify-content: space-between;
}

.edit-section-header input {
  background: transparent;
  border: none;
  color: var(--text);
  font-weight: 600;
  font-size: 0.9rem;
  flex: 1;
}

.edit-section textarea {
  width: 100%;
  padding: 1rem;
  background: transparent;
  border: none;
  color: var(--text);
  font-size: 1rem;
  line-height: 1.8;
  resize: vertical;
  min-height: 150px;
}

.edit-section textarea:focus { outline: none; }

.add-section-btn {
  width: 100%;
  padding: 1rem;
  background: var(--surface);
  border: 2px dashed var(--border);
  border-radius: 0.75rem;
  color: var(--dim);
  font-size: 0.9rem;
  cursor: pointer;
  margin-top: 1rem;
}

.add-section-btn:hover { border-color: var(--dim); color: var(--text); }

.delete-btn {
  background: transparent;
  border: none;
  color: var(--dim);
  cursor: pointer;
  padding: 0.25rem;
  font-size: 1.5rem;
  line-height: 1;
}

.delete-btn:hover { color: var(--accent); }

/* Present Mode */
.present-mode {
  min-height: 100vh;
  padding-top: 4rem;
  display: flex;
  flex-direction: column;
}

.slide {
  flex: 1;
  display: flex;
  flex-direction: column;
  justify-content: center;
  padding: 2rem;
  max-width: 900px;
  margin: 0 auto;
  width: 100%;
}

.slide-title {
  font-size: 1.2rem;
  color: var(--accent);
  text-transform: uppercase;
  letter-spacing: 0.1em;
  margin-bottom: 2rem;
  font-weight: 700;
}

.slide-content {
  font-size: 1.8rem;
  font-weight: 400;
  line-height: 1.6;
}

.slide-content :deep(.pause) {
  display: block;
  color: var(--accent);
  font-size: 1rem;
  margin: 1.5rem 0;
  font-weight: 600;
}

/* Navigation */
.slide-nav {
  position: fixed;
  bottom: 0;
  left: 0;
  right: 0;
  background: var(--surface);
  border-top: 1px solid var(--border);
  padding: 1rem;
  display: flex;
  align-items: center;
  justify-content: space-between;
}

.slide-nav button {
  padding: 1rem 2rem;
  background: var(--border);
  border: none;
  border-radius: 0.5rem;
  color: var(--text);
  font-size: 1rem;
  cursor: pointer;
}

.slide-nav button:disabled { opacity: 0.3; cursor: not-allowed; }

.slide-progress {
  font-size: 0.9rem;
  color: var(--dim);
}

/* Tips Mode */
.tips-mode {
  padding: 5rem 1rem 2rem;
  max-width: 600px;
  margin: 0 auto;
}

.tips-mode h2 {
  font-size: 1.2rem;
  margin-bottom: 1.5rem;
  color: var(--accent);
}

.tips-mode ul {
  list-style: none;
  padding: 0;
}

.tips-mode li {
  padding: 1rem;
  background: var(--surface);
  border-radius: 0.5rem;
  margin-bottom: 0.5rem;
  font-size: 1.1rem;
  line-height: 1.5;
}

@media (max-width: 600px) {
  .slide-content { font-size: 1.4rem; }
  .header h1 { font-size: 0.85rem; }
  .btn { padding: 0.4rem 0.75rem; font-size: 0.8rem; }
}
</style>
