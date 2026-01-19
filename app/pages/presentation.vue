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
const mode = ref<'edit' | 'present' | 'slides' | 'slideshow'>('edit')
const chatOpen = ref(false)
const currentSlideIndex = ref(0)
const currentImageIndex = ref(0)

// Slide types: 'title', 'text', 'image', 'video'
type SlideType = 'title' | 'text' | 'image' | 'video'

interface Slide {
  type: SlideType
  title: string
  subtitle?: string
  text?: string
  url?: string
  caption?: string
  logo?: string
  qr?: string
}

// Default slides following the speech structure
const defaultSlides: Slide[] = [
  {
    type: 'title',
    title: '',
    subtitle: 'Per Karlsson',
    logo: 'https://coregym.club/images/logo-dark.svg',
    qr: 'https://coregym.club/images/qr-coregym.svg'
  },
  {
    type: 'text',
    title: 'Vår resa',
    text: 'Från en idé i Tungelsta till fem gym i Haninge'
  },
  {
    type: 'text',
    title: '25 år som idrottslärare',
    text: 'Alla kan röra på sig. Alla.'
  },
  {
    type: 'image',
    title: 'Tungelsta 2012',
    caption: 'Där det började',
    url: ''
  },
  {
    type: 'text',
    title: 'Born and Based',
    text: 'i Haninge'
  },
  {
    type: 'image',
    title: 'Västerhaninge 2016',
    caption: 'Mitt i centrum',
    url: ''
  },
  {
    type: 'image',
    title: 'Vegastaden 2022',
    caption: '2900 kvm • Takterrass • Padel',
    url: ''
  },
  {
    type: 'text',
    title: 'Ösmo 2026',
    text: 'Femte gymmet'
  },
  {
    type: 'text',
    title: 'Vår största konkurrent?',
    text: 'Soffan.'
  },
  {
    type: 'text',
    title: 'Kom som du är',
    text: 'Ett hej kostar inget'
  },
  {
    type: 'video',
    title: 'Core Gym i action',
    caption: 'Highlights från Instagram',
    url: ''
  },
  {
    type: 'text',
    title: 'Haninges gym',
    text: 'Era gym'
  },
  {
    type: 'title',
    title: 'Tack!',
    subtitle: 'coregym.club',
    qr: 'https://coregym.club/images/qr-coregym.svg'
  }
]

const slides = ref<Slide[]>([])

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

function setMode(newMode: 'edit' | 'present' | 'slides' | 'slideshow') {
  mode.value = newMode
  if (newMode === 'present') {
    currentSlideIndex.value = 0
  }
  if (newMode === 'slideshow') {
    currentImageIndex.value = 0
  }
}

function toggleChat() {
  chatOpen.value = !chatOpen.value
}

// Slide management
function saveSlides() {
  localStorage.setItem('presentation-slides', JSON.stringify(slides.value))
}

function addSlide(type: SlideType = 'text') {
  const newSlide: Slide = { type, title: 'Ny slide' }
  if (type === 'text') newSlide.text = 'Text här...'
  if (type === 'title') newSlide.subtitle = 'Underrubrik'
  if (type === 'image' || type === 'video') newSlide.url = ''
  slides.value.push(newSlide)
  saveSlides()
}

function deleteSlide(index: number) {
  if (confirm('Ta bort denna slide?')) {
    slides.value.splice(index, 1)
    saveSlides()
  }
}

function updateSlide(index: number, field: keyof Slide, value: string) {
  (slides.value[index] as any)[field] = value
  saveSlides()
}

function changeSlideType(index: number, newType: SlideType) {
  slides.value[index].type = newType
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
          <button :class="['btn', 'btn-chat', { active: chatOpen }]" @click="toggleChat">Chatt</button>
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

      <!-- Chat Panel -->
      <div v-if="chatOpen" class="chat-panel">
        <div class="chat-header">
          <span>Chatt med Claude</span>
          <button @click="toggleChat" class="chat-close">&times;</button>
        </div>
        <iframe
          src="https://teamchat.coregym.club/room/presentation?embed=1&name=Per&staff=1"
          class="chat-iframe"
        ></iframe>
      </div>

      <!-- Slides Editor Mode -->
      <div v-if="mode === 'slides'" class="slides-mode">
        <div class="slides-header">
          <h2>Slides</h2>
          <button class="start-slideshow-btn" @click="setMode('slideshow')" :disabled="slides.length === 0">
            Starta presentation
          </button>
        </div>
        <p class="slides-info">Skapa slides som visas under talet. Blanda text, bilder och video.</p>

        <div class="slides-list">
          <div v-for="(slide, i) in slides" :key="i" class="slide-item" :class="'slide-type-' + slide.type">
            <div class="slide-number">{{ i + 1 }}</div>

            <div class="slide-preview-box">
              <!-- Title slide preview -->
              <div v-if="slide.type === 'title'" class="preview-title">
                <img v-if="slide.logo" :src="slide.logo" class="preview-logo" />
                <span v-if="slide.title" class="preview-main">{{ slide.title }}</span>
                <span class="preview-sub">{{ slide.subtitle || '' }}</span>
              </div>
              <!-- Text slide preview -->
              <div v-else-if="slide.type === 'text'" class="preview-text">
                <span class="preview-heading">{{ slide.title || 'Rubrik' }}</span>
                <span class="preview-body">{{ slide.text || '' }}</span>
              </div>
              <!-- Image slide preview -->
              <div v-else-if="slide.type === 'image'" class="preview-image">
                <img v-if="slide.url" :src="slide.url" :alt="slide.title" />
                <div v-else class="no-media">Bild</div>
              </div>
              <!-- Video slide preview -->
              <div v-else-if="slide.type === 'video'" class="preview-video">
                <div class="video-icon">▶</div>
                <span>Video</span>
              </div>
            </div>

            <div class="slide-fields">
              <div class="slide-type-selector">
                <button :class="{ active: slide.type === 'title' }" @click="changeSlideType(i, 'title')">Titel</button>
                <button :class="{ active: slide.type === 'text' }" @click="changeSlideType(i, 'text')">Text</button>
                <button :class="{ active: slide.type === 'image' }" @click="changeSlideType(i, 'image')">Bild</button>
                <button :class="{ active: slide.type === 'video' }" @click="changeSlideType(i, 'video')">Video</button>
              </div>

              <input
                :value="slide.title"
                @input="updateSlide(i, 'title', ($event.target as HTMLInputElement).value)"
                :placeholder="slide.type === 'title' ? 'Huvudrubrik' : 'Rubrik'"
                class="slide-title-input"
              />

              <input
                v-if="slide.type === 'title'"
                :value="slide.subtitle || ''"
                @input="updateSlide(i, 'subtitle', ($event.target as HTMLInputElement).value)"
                placeholder="Underrubrik (t.ex. Per Karlsson)"
                class="slide-subtitle-input"
              />

              <input
                v-if="slide.type === 'title'"
                :value="slide.logo || ''"
                @input="updateSlide(i, 'logo', ($event.target as HTMLInputElement).value)"
                placeholder="Logo-URL (valfritt)"
                class="slide-url-input"
              />

              <input
                v-if="slide.type === 'title'"
                :value="slide.qr || ''"
                @input="updateSlide(i, 'qr', ($event.target as HTMLInputElement).value)"
                placeholder="QR-kod URL (valfritt)"
                class="slide-url-input"
              />

              <input
                v-if="slide.type === 'text'"
                :value="slide.text || ''"
                @input="updateSlide(i, 'text', ($event.target as HTMLInputElement).value)"
                placeholder="Stor text (t.ex. Born and Based i Haninge)"
                class="slide-text-input"
              />

              <input
                v-if="slide.type === 'image'"
                :value="slide.url || ''"
                @input="updateSlide(i, 'url', ($event.target as HTMLInputElement).value)"
                placeholder="Bild-URL (https://...)"
                class="slide-url-input"
              />

              <input
                v-if="slide.type === 'video'"
                :value="slide.url || ''"
                @input="updateSlide(i, 'url', ($event.target as HTMLInputElement).value)"
                placeholder="Video-URL (MP4, YouTube, Vimeo...)"
                class="slide-url-input"
              />

              <input
                v-if="slide.type === 'image' || slide.type === 'video'"
                :value="slide.caption || ''"
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

        <div class="add-slide-buttons">
          <button class="add-slide-btn" @click="addSlide('title')">+ Titel</button>
          <button class="add-slide-btn" @click="addSlide('text')">+ Text</button>
          <button class="add-slide-btn" @click="addSlide('image')">+ Bild</button>
          <button class="add-slide-btn" @click="addSlide('video')">+ Video</button>
        </div>
      </div>

      <!-- Slideshow Mode (fullscreen) -->
      <div v-if="mode === 'slideshow'" class="slideshow-mode">
        <div class="slideshow-content" v-if="currentSlide">
          <!-- Title Slide -->
          <div v-if="currentSlide.type === 'title'" class="show-title">
            <div class="show-title-content">
              <img v-if="currentSlide.logo" :src="currentSlide.logo" alt="Logo" class="show-title-logo" />
              <div v-if="currentSlide.title" class="show-title-main">{{ currentSlide.title }}</div>
              <div v-if="currentSlide.subtitle" class="show-title-sub">{{ currentSlide.subtitle }}</div>
            </div>
            <div v-if="currentSlide.qr" class="show-title-qr">
              <img :src="currentSlide.qr" alt="QR kod" class="qr-code" />
              <span class="qr-label">coregym.club</span>
            </div>
          </div>

          <!-- Text Slide -->
          <div v-else-if="currentSlide.type === 'text'" class="show-text">
            <div class="show-text-heading">{{ currentSlide.title }}</div>
            <div class="show-text-body">{{ currentSlide.text }}</div>
          </div>

          <!-- Image Slide -->
          <div v-else-if="currentSlide.type === 'image'" class="show-image">
            <img v-if="currentSlide.url" :src="currentSlide.url" :alt="currentSlide.title" />
            <div v-else class="show-placeholder">
              <div class="placeholder-title">{{ currentSlide.title }}</div>
              <div class="placeholder-hint">Ingen bild tillagd</div>
            </div>
            <div v-if="currentSlide.title || currentSlide.caption" class="show-image-overlay">
              <div class="show-image-title">{{ currentSlide.title }}</div>
              <div v-if="currentSlide.caption" class="show-image-caption">{{ currentSlide.caption }}</div>
            </div>
          </div>

          <!-- Video Slide -->
          <div v-else-if="currentSlide.type === 'video'" class="show-video">
            <video v-if="currentSlide.url && !currentSlide.url.includes('youtube') && !currentSlide.url.includes('vimeo')"
                   :src="currentSlide.url"
                   controls
                   autoplay
                   class="video-player">
            </video>
            <iframe v-else-if="currentSlide.url && currentSlide.url.includes('youtube')"
                    :src="currentSlide.url.replace('watch?v=', 'embed/').replace('youtu.be/', 'youtube.com/embed/')"
                    frameborder="0"
                    allow="autoplay; encrypted-media"
                    allowfullscreen
                    class="video-iframe">
            </iframe>
            <div v-else class="show-placeholder">
              <div class="placeholder-icon">▶</div>
              <div class="placeholder-title">{{ currentSlide.title }}</div>
              <div class="placeholder-hint">Ingen video tillagd</div>
            </div>
            <div v-if="currentSlide.caption" class="show-video-caption">{{ currentSlide.caption }}</div>
          </div>
        </div>
        <div class="slideshow-nav">
          <button @click="setMode('slides')" class="exit-btn">Avsluta</button>
          <div class="slideshow-controls">
            <button :disabled="currentImageIndex === 0" @click="prevImage">←</button>
            <span class="slideshow-progress">{{ currentImageIndex + 1 }} / {{ slides.length }}</span>
            <button :disabled="currentImageIndex === slides.length - 1" @click="nextImage">→</button>
          </div>
          <div class="slideshow-hint">Piltangenter for att navigera • ESC for att avsluta</div>
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

/* Chat Panel */
.btn-chat {
  background: #8b5cf6 !important;
  border-color: #8b5cf6 !important;
}

.btn-chat.active {
  background: #7c3aed !important;
  border-color: #7c3aed !important;
}

.chat-panel {
  position: fixed;
  top: 0;
  right: 0;
  width: 400px;
  height: 100vh;
  background: var(--surface);
  border-left: 1px solid var(--border);
  z-index: 200;
  display: flex;
  flex-direction: column;
  box-shadow: -4px 0 20px rgba(0,0,0,0.3);
}

.chat-header {
  padding: 1rem;
  background: var(--bg);
  border-bottom: 1px solid var(--border);
  display: flex;
  justify-content: space-between;
  align-items: center;
  font-weight: 600;
}

.chat-close {
  background: transparent;
  border: none;
  color: var(--dim);
  font-size: 1.5rem;
  cursor: pointer;
  padding: 0;
  line-height: 1;
}

.chat-close:hover {
  color: var(--text);
}

.chat-iframe {
  flex: 1;
  width: 100%;
  border: none;
  background: var(--bg);
}

/* Slides Editor Mode */
.slides-mode {
  padding: 5rem 1rem 2rem;
  max-width: 900px;
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
  gap: 0.75rem;
}

.slide-item {
  background: var(--surface);
  border-radius: 0.75rem;
  padding: 1rem;
  display: flex;
  gap: 1rem;
  align-items: flex-start;
  border-left: 3px solid var(--border);
}

.slide-type-title { border-left-color: #f59e0b; }
.slide-type-text { border-left-color: #3b82f6; }
.slide-type-image { border-left-color: #10b981; }
.slide-type-video { border-left-color: #8b5cf6; }

.slide-number {
  width: 28px;
  height: 28px;
  background: var(--border);
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 0.8rem;
  font-weight: 600;
  color: var(--dim);
  flex-shrink: 0;
}

.slide-preview-box {
  width: 140px;
  height: 80px;
  border-radius: 0.5rem;
  overflow: hidden;
  flex-shrink: 0;
  background: var(--bg);
  display: flex;
  align-items: center;
  justify-content: center;
}

.preview-title, .preview-text {
  text-align: center;
  padding: 0.5rem;
  width: 100%;
}

.preview-logo {
  max-width: 80px;
  max-height: 25px;
  display: block;
  margin: 0 auto 0.2rem;
}

.preview-main {
  display: block;
  font-size: 0.7rem;
  font-weight: 700;
  color: var(--text);
}

.preview-sub {
  display: block;
  font-size: 0.55rem;
  color: var(--dim);
  margin-top: 0.2rem;
}

.preview-heading {
  display: block;
  font-size: 0.55rem;
  color: var(--accent);
  text-transform: uppercase;
}

.preview-body {
  display: block;
  font-size: 0.65rem;
  font-weight: 600;
  color: var(--text);
  margin-top: 0.2rem;
}

.preview-image {
  width: 100%;
  height: 100%;
}

.preview-image img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.preview-video {
  text-align: center;
  color: var(--dim);
}

.video-icon {
  font-size: 1.5rem;
  color: #8b5cf6;
}

.no-media {
  color: var(--dim);
  font-size: 0.75rem;
}

.slide-fields {
  flex: 1;
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
}

.slide-type-selector {
  display: flex;
  gap: 0.25rem;
  margin-bottom: 0.25rem;
}

.slide-type-selector button {
  padding: 0.25rem 0.5rem;
  font-size: 0.7rem;
  background: transparent;
  border: 1px solid var(--border);
  border-radius: 0.25rem;
  color: var(--dim);
  cursor: pointer;
}

.slide-type-selector button.active {
  background: var(--border);
  color: var(--text);
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

.slide-text-input {
  font-size: 1rem !important;
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
  width: 28px;
  height: 28px;
  border: 1px solid var(--border);
  border-radius: 0.375rem;
  background: transparent;
  color: var(--dim);
  cursor: pointer;
  font-size: 0.9rem;
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

.add-slide-buttons {
  display: flex;
  gap: 0.5rem;
  margin-top: 1rem;
}

.add-slide-btn {
  flex: 1;
  padding: 0.75rem;
  background: var(--surface);
  border: 2px dashed var(--border);
  border-radius: 0.5rem;
  color: var(--dim);
  font-size: 0.85rem;
  cursor: pointer;
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
  background: #f5f5f5;
  z-index: 1000;
  display: flex;
  flex-direction: column;
}

.slideshow-content {
  flex: 1;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 2rem;
  padding-bottom: 5rem;
}

/* Title Slide */
.show-title {
  text-align: center;
}

.show-title-logo {
  max-width: 500px;
  max-height: 200px;
  margin-bottom: 2rem;
}

.show-title-main {
  font-size: 5rem;
  font-weight: 800;
  color: #1c1b1d;
  letter-spacing: -0.02em;
  line-height: 1.1;
}

.show-title-sub {
  font-size: 2rem;
  color: #666;
  margin-top: 1rem;
  font-weight: 400;
}

.show-title-content {
  text-align: center;
}

.show-title-qr {
  position: absolute;
  bottom: 6rem;
  right: 3rem;
  text-align: center;
}

.qr-code {
  width: 120px;
  height: 120px;
}

.qr-label {
  display: block;
  margin-top: 0.5rem;
  font-size: 0.9rem;
  color: #666;
}

/* Text Slide */
.show-text {
  text-align: center;
  max-width: 900px;
}

.show-text-heading {
  font-size: 1.5rem;
  color: var(--accent);
  text-transform: uppercase;
  letter-spacing: 0.1em;
  margin-bottom: 1.5rem;
  font-weight: 600;
}

.show-text-body {
  font-size: 4rem;
  font-weight: 700;
  color: #1c1b1d;
  line-height: 1.2;
}

/* Image Slide */
.show-image {
  width: 100%;
  height: 100%;
  position: relative;
  display: flex;
  align-items: center;
  justify-content: center;
}

.show-image img {
  max-width: 100%;
  max-height: 100%;
  object-fit: contain;
  border-radius: 0.5rem;
}

.show-image-overlay {
  position: absolute;
  bottom: 0;
  left: 0;
  right: 0;
  background: linear-gradient(transparent, rgba(0,0,0,0.9));
  padding: 4rem 2rem 2rem;
  text-align: center;
}

.show-image-title {
  font-size: 2.5rem;
  font-weight: 700;
  color: white;
}

.show-image-caption {
  font-size: 1.3rem;
  color: rgba(255,255,255,0.7);
  margin-top: 0.5rem;
}

/* Video Slide */
.show-video {
  width: 100%;
  height: 100%;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
}

.video-player, .video-iframe {
  max-width: 100%;
  max-height: calc(100% - 3rem);
  width: 100%;
  height: 100%;
  border-radius: 0.5rem;
}

.show-video-caption {
  margin-top: 1rem;
  font-size: 1.2rem;
  color: var(--dim);
}

/* Placeholder */
.show-placeholder {
  text-align: center;
  color: #999;
}

.placeholder-icon {
  font-size: 4rem;
  margin-bottom: 1rem;
}

.placeholder-title {
  font-size: 2rem;
  color: #1c1b1d;
  margin-bottom: 0.5rem;
}

.placeholder-hint {
  font-size: 1rem;
}

/* Navigation */
.slideshow-nav {
  position: fixed;
  bottom: 0;
  left: 0;
  right: 0;
  background: rgba(255,255,255,0.95);
  border-top: 1px solid #ddd;
  padding: 1rem;
  display: flex;
  align-items: center;
  justify-content: space-between;
}

.exit-btn {
  padding: 0.75rem 1.5rem;
  background: #fff;
  border: 1px solid #ddd;
  border-radius: 0.5rem;
  color: #1c1b1d;
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
  background: #fff;
  border: 1px solid #ddd;
  color: #1c1b1d;
  font-size: 1.5rem;
  cursor: pointer;
}

.slideshow-controls button:disabled {
  opacity: 0.3;
  cursor: not-allowed;
}

.slideshow-progress {
  font-size: 1rem;
  color: #666;
  min-width: 60px;
  text-align: center;
}

.slideshow-hint {
  font-size: 0.75rem;
  color: #999;
}

@media (max-width: 900px) {
  .chat-panel { width: 320px; }
}

@media (max-width: 600px) {
  .slide-content { font-size: 1.4rem; }
  .header h1 { font-size: 0.85rem; }
  .btn { padding: 0.4rem 0.75rem; font-size: 0.8rem; }
  .slide-item { flex-wrap: wrap; }
  .slide-preview-box { width: 100px; height: 60px; }
  .slide-actions { flex-direction: row; }
  .slideshow-hint { display: none; }
  .show-title-main { font-size: 3rem; }
  .show-title-sub { font-size: 1.3rem; }
  .show-text-body { font-size: 2.5rem; }
  .show-image-title { font-size: 1.5rem; }
  .add-slide-buttons { flex-wrap: wrap; }
  .chat-panel { width: 100%; }
  .add-slide-btn { flex: 1 1 45%; }
}
</style>
