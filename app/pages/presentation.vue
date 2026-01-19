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
const mode = ref<'edit' | 'present' | 'tips' | 'slides' | 'slideshow'>('edit')
const currentSlideIndex = ref(0)
const currentImageIndex = ref(0)

// Default slides with images from Core Gym's journey
const defaultSlides = [
  {
    url: 'https://images.ctfassets.net/yg0jporv2qfl/2wDfEJALHq2kWIuqYeymCk/7e35d8b6ecc8e5c5e07add889c9c8c3a/core-gym-tungelsta.jpg',
    title: 'Tungelsta 2012',
    caption: 'Har det borjade - vara forsta gym'
  },
  {
    url: 'https://images.ctfassets.net/yg0jporv2qfl/4jKqDr5WqcwiAKcSQs8yOw/a5c5e4d0a46c4c3c8c1e2e5e9e8e7e6e/core-gym-vasterhaninge.jpg',
    title: 'Vasterhaninge 2016',
    caption: 'Mitt i centrum'
  },
  {
    url: 'https://images.ctfassets.net/yg0jporv2qfl/vegastaden-hero/hero-image/core-gym-vegastaden.jpg',
    title: 'Vegastaden 2022',
    caption: '2900 kvm - One of a kind'
  }
]

const slides = ref<{ url: string; title: string; caption: string }[]>([])

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
  // Load slides
  const savedSlides = localStorage.getItem('presentation-slides')
  slides.value = savedSlides ? JSON.parse(savedSlides) : defaultSlides
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

function setMode(newMode: 'edit' | 'present' | 'tips' | 'slides' | 'slideshow') {
  mode.value = newMode
  if (newMode === 'present') {
    currentSlideIndex.value = 0
  }
  if (newMode === 'slideshow') {
    currentImageIndex.value = 0
  }
}

// Slide management
function saveSlides() {
  localStorage.setItem('presentation-slides', JSON.stringify(slides.value))
}

function addSlide() {
  slides.value.push({ url: '', title: 'Ny bild', caption: '' })
  saveSlides()
}

function deleteSlide(index: number) {
  if (confirm('Ta bort denna bild?')) {
    slides.value.splice(index, 1)
    saveSlides()
  }
}

function updateSlide(index: number, field: 'url' | 'title' | 'caption', value: string) {
  slides.value[index][field] = value
  saveSlides()
}

function moveSlide(index: number, direction: 'up' | 'down') {
  const newIndex = direction === 'up' ? index - 1 : index + 1
  if (newIndex < 0 || newIndex >= slides.value.length) return
  const temp = slides.value[index]
  slides.value[index] = slides.value[newIndex]
  slides.value[newIndex] = temp
  saveSlides()
}

function nextImage() {
  if (currentImageIndex.value < slides.value.length - 1) {
    currentImageIndex.value++
  }
}

function prevImage() {
  if (currentImageIndex.value > 0) {
    currentImageIndex.value--
  }
}

const currentSlide = computed(() => slides.value[currentImageIndex.value])

// Keyboard navigation
onMounted(() => {
  window.addEventListener('keydown', (e) => {
    if (mode.value === 'present') {
      if (e.key === 'ArrowRight' || e.key === ' ') {
        e.preventDefault()
        nextSlide()
      }
      if (e.key === 'ArrowLeft') {
        e.preventDefault()
        prevSlide()
      }
    }
    if (mode.value === 'slideshow') {
      if (e.key === 'ArrowRight' || e.key === ' ') {
        e.preventDefault()
        nextImage()
      }
      if (e.key === 'ArrowLeft') {
        e.preventDefault()
        prevImage()
      }
      if (e.key === 'Escape') {
        e.preventDefault()
        setMode('slides')
      }
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
          <button :class="['btn', { active: mode === 'edit' }]" @click="setMode('edit')">Manus</button>
          <button :class="['btn', { active: mode === 'present' }]" @click="setMode('present')">Tala</button>
          <button :class="['btn', { active: mode === 'slides' || mode === 'slideshow' }]" @click="setMode('slides')">Bildspel</button>
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

      <!-- Slides Editor Mode -->
      <div v-if="mode === 'slides'" class="slides-mode">
        <div class="slides-header">
          <h2>Bildspel</h2>
          <button class="start-slideshow-btn" @click="setMode('slideshow')" :disabled="slides.length === 0">
            Starta bildspel
          </button>
        </div>
        <p class="slides-info">Lagg till bilder som visas under presentationen. Anvand bild-URL:er fran er bildbank.</p>

        <div class="slides-list">
          <div v-for="(slide, i) in slides" :key="i" class="slide-item">
            <div class="slide-preview">
              <img v-if="slide.url" :src="slide.url" :alt="slide.title" @error="($event.target as HTMLImageElement).src = 'data:image/svg+xml,<svg xmlns=%22http://www.w3.org/2000/svg%22 viewBox=%220 0 100 100%22><rect fill=%22%23333%22 width=%22100%22 height=%22100%22/><text x=%2250%22 y=%2255%22 text-anchor=%22middle%22 fill=%22%23888%22 font-size=%2212%22>Ingen bild</text></svg>'" />
              <div v-else class="no-image">Ingen bild</div>
            </div>
            <div class="slide-fields">
              <input
                :value="slide.title"
                @input="updateSlide(i, 'title', ($event.target as HTMLInputElement).value)"
                placeholder="Titel (t.ex. Tungelsta 2012)"
                class="slide-title-input"
              />
              <input
                :value="slide.url"
                @input="updateSlide(i, 'url', ($event.target as HTMLInputElement).value)"
                placeholder="Bild-URL (https://...)"
                class="slide-url-input"
              />
              <input
                :value="slide.caption"
                @input="updateSlide(i, 'caption', ($event.target as HTMLInputElement).value)"
                placeholder="Bildtext (valfritt)"
                class="slide-caption-input"
              />
            </div>
            <div class="slide-actions">
              <button @click="moveSlide(i, 'up')" :disabled="i === 0" title="Flytta upp">↑</button>
              <button @click="moveSlide(i, 'down')" :disabled="i === slides.length - 1" title="Flytta ner">↓</button>
              <button @click="deleteSlide(i)" class="delete" title="Ta bort">×</button>
            </div>
          </div>
        </div>

        <button class="add-slide-btn" @click="addSlide">+ Lagg till bild</button>
      </div>

      <!-- Slideshow Mode (fullscreen) -->
      <div v-if="mode === 'slideshow'" class="slideshow-mode">
        <div class="slideshow-image" v-if="currentSlide">
          <img :src="currentSlide.url" :alt="currentSlide.title" />
          <div class="slideshow-overlay">
            <div class="slideshow-title">{{ currentSlide.title }}</div>
            <div v-if="currentSlide.caption" class="slideshow-caption">{{ currentSlide.caption }}</div>
          </div>
        </div>
        <div class="slideshow-nav">
          <button @click="setMode('slides')" class="exit-btn">Avsluta</button>
          <div class="slideshow-controls">
            <button :disabled="currentImageIndex === 0" @click="prevImage">←</button>
            <span class="slideshow-progress">{{ currentImageIndex + 1 }} / {{ slides.length }}</span>
            <button :disabled="currentImageIndex === slides.length - 1" @click="nextImage">→</button>
          </div>
          <div class="slideshow-hint">Piltangenter eller mellanslag for att navigera • ESC for att avsluta</div>
        </div>
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

/* Slides Editor Mode */
.slides-mode {
  padding: 5rem 1rem 2rem;
  max-width: 800px;
  margin: 0 auto;
}

.slides-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 0.5rem;
}

.slides-header h2 {
  font-size: 1.2rem;
  color: var(--accent);
}

.start-slideshow-btn {
  padding: 0.75rem 1.5rem;
  background: var(--accent);
  border: none;
  border-radius: 0.5rem;
  color: white;
  font-weight: 600;
  cursor: pointer;
}

.start-slideshow-btn:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}

.slides-info {
  color: var(--dim);
  font-size: 0.9rem;
  margin-bottom: 1.5rem;
}

.slides-list {
  display: flex;
  flex-direction: column;
  gap: 1rem;
}

.slide-item {
  background: var(--surface);
  border-radius: 0.75rem;
  padding: 1rem;
  display: flex;
  gap: 1rem;
  align-items: flex-start;
}

.slide-preview {
  width: 120px;
  height: 80px;
  border-radius: 0.5rem;
  overflow: hidden;
  flex-shrink: 0;
  background: var(--border);
}

.slide-preview img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.no-image {
  width: 100%;
  height: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
  color: var(--dim);
  font-size: 0.75rem;
}

.slide-fields {
  flex: 1;
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
}

.slide-fields input {
  width: 100%;
  padding: 0.5rem 0.75rem;
  background: var(--bg);
  border: 1px solid var(--border);
  border-radius: 0.375rem;
  color: var(--text);
  font-size: 0.9rem;
}

.slide-title-input {
  font-weight: 600;
}

.slide-url-input {
  font-family: monospace;
  font-size: 0.8rem !important;
}

.slide-caption-input {
  color: var(--dim);
}

.slide-actions {
  display: flex;
  flex-direction: column;
  gap: 0.25rem;
}

.slide-actions button {
  width: 32px;
  height: 32px;
  border: 1px solid var(--border);
  border-radius: 0.375rem;
  background: transparent;
  color: var(--dim);
  cursor: pointer;
  font-size: 1rem;
}

.slide-actions button:hover:not(:disabled) {
  background: var(--border);
  color: var(--text);
}

.slide-actions button:disabled {
  opacity: 0.3;
  cursor: not-allowed;
}

.slide-actions button.delete:hover {
  background: var(--accent);
  border-color: var(--accent);
  color: white;
}

.add-slide-btn {
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

.add-slide-btn:hover {
  border-color: var(--dim);
  color: var(--text);
}

/* Slideshow Mode */
.slideshow-mode {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: #000;
  z-index: 1000;
  display: flex;
  flex-direction: column;
}

.slideshow-image {
  flex: 1;
  display: flex;
  align-items: center;
  justify-content: center;
  position: relative;
  overflow: hidden;
}

.slideshow-image img {
  max-width: 100%;
  max-height: 100%;
  object-fit: contain;
}

.slideshow-overlay {
  position: absolute;
  bottom: 0;
  left: 0;
  right: 0;
  background: linear-gradient(transparent, rgba(0,0,0,0.8));
  padding: 3rem 2rem 6rem;
  text-align: center;
}

.slideshow-title {
  font-size: 2rem;
  font-weight: 700;
  color: white;
  text-shadow: 0 2px 4px rgba(0,0,0,0.5);
}

.slideshow-caption {
  font-size: 1.2rem;
  color: rgba(255,255,255,0.8);
  margin-top: 0.5rem;
}

.slideshow-nav {
  position: fixed;
  bottom: 0;
  left: 0;
  right: 0;
  background: rgba(0,0,0,0.9);
  padding: 1rem;
  display: flex;
  align-items: center;
  justify-content: space-between;
}

.exit-btn {
  padding: 0.75rem 1.5rem;
  background: var(--surface);
  border: 1px solid var(--border);
  border-radius: 0.5rem;
  color: var(--text);
  cursor: pointer;
}

.slideshow-controls {
  display: flex;
  align-items: center;
  gap: 1rem;
}

.slideshow-controls button {
  width: 50px;
  height: 50px;
  border-radius: 50%;
  background: var(--surface);
  border: 1px solid var(--border);
  color: var(--text);
  font-size: 1.5rem;
  cursor: pointer;
}

.slideshow-controls button:disabled {
  opacity: 0.3;
  cursor: not-allowed;
}

.slideshow-progress {
  font-size: 1rem;
  color: var(--dim);
  min-width: 60px;
  text-align: center;
}

.slideshow-hint {
  font-size: 0.75rem;
  color: var(--dim);
}

@media (max-width: 600px) {
  .slide-content { font-size: 1.4rem; }
  .header h1 { font-size: 0.85rem; }
  .btn { padding: 0.4rem 0.75rem; font-size: 0.8rem; }
  .slide-item { flex-direction: column; }
  .slide-preview { width: 100%; height: 150px; }
  .slide-actions { flex-direction: row; }
  .slideshow-title { font-size: 1.5rem; }
  .slideshow-hint { display: none; }
}
</style>
