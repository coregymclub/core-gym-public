// PT/Trainers API - Core Gym Club
// This data is the single source of truth for all trainer information

export interface TrainerReview {
  text: string
  author: string
}

export interface Trainer {
  id: string
  name: string
  shortName: string
  email: string
  phone: string
  quote: string
  bio: string
  imageKey: string
  imageUrl: string
  actionImageUrl?: string
  instagram?: string
  specialties: string[]
  reviews: TrainerReview[]
}

// Zoezi image URL builder
const getImageUrl = (key: string) =>
  `https://coregymclub.zoezi.se/image/get?id=${key}&width=400&height=400`

const trainers: Trainer[] = [
  {
    id: 'filip',
    name: 'Filip Enhörning',
    shortName: 'PT Filip',
    email: 'filip@coregymclub.se',
    phone: '070-123 45 67',
    quote: 'Jag hjälper dig att utveckla hållbara träningsrutiner. Jag vill att du ska känna dig trygg, stark och självgående efter vår tid tillsammans.',
    bio: 'Filip är en erfaren personlig tränare med passion för att hjälpa människor nå sina mål. Med sin bakgrund inom idrottsfysiologi och flerårig erfarenhet skapar han personliga träningsprogram som fungerar långsiktigt.',
    imageKey: '6e335ae4-4129-471e-b98a-926b2864ff3f',
    imageUrl: getImageUrl('6e335ae4-4129-471e-b98a-926b2864ff3f'),
    instagram: '@filipenhorning',
    specialties: ['Styrketräning', 'Funktionell träning', 'Kostrådgivning', 'Rehabilitering'],
    reviews: [
      { text: 'Filip har verkligen förändrat min syn på träning. Hans kunskap och positiva energi gör varje pass till något jag ser fram emot!', author: 'Emma K.' },
      { text: 'Tack vare Filip har jag äntligen hittat en hållbar träningsrutin som passar mitt liv. Rekommenderar starkt!', author: 'Johan S.' },
    ],
  },
  {
    id: 'denise',
    name: 'Denise Kimström',
    shortName: 'PT Denise',
    email: 'denise@coregymclub.se',
    phone: '070-234 56 78',
    quote: 'Jag brinner för att motivera och inspirera dig hela vägen. Tillsammans skapar vi en rolig och utmanande träningsupplevelse. Med glädje och energi ger jag dig verktygen för att nå framgång både i och utanför gymmet.',
    bio: 'Denise kombinerar sitt brinnande engagemang med gedigen kunskap för att skapa en träningsupplevelse som är både rolig och effektiv. Hon tror på att glädje och framgång går hand i hand.',
    imageKey: '2c0876db-893d-4cdb-8c22-8d97461e005e',
    imageUrl: getImageUrl('2c0876db-893d-4cdb-8c22-8d97461e005e'),
    instagram: '@denisekimstrom',
    specialties: ['HIIT', 'TRX-träning', 'Gruppträning', 'Motivation & Coaching'],
    reviews: [
      { text: 'Denise energi är smittande! Hon får mig att pusha mig själv hårdare än jag trodde var möjligt.', author: 'Sara M.' },
    ],
  },
  {
    id: 'michan',
    name: 'Michaela Beutler Fristål',
    shortName: 'PT Michan',
    email: 'michan@coregymclub.se',
    phone: '070-345 67 89',
    quote: 'För mig finns det inget som heter "jag kan inte". Tillsammans utforskar vi din potential och ser till att träningen blir en både rolig och utmanande resa. Jag finns här för att fira dina framsteg och stötta dig när det blir tufft.',
    bio: 'Michan är övertygad om att alla kan nå sina mål med rätt support och inställning. Hon hjälper dig att bryta igenom mentala barriärer och upptäcka din fulla potential.',
    imageKey: '3109997f-cdb8-4446-ab26-54c7933ce27a',
    imageUrl: getImageUrl('3109997f-cdb8-4446-ab26-54c7933ce27a'),
    instagram: '@michanfristal',
    specialties: ['Mental träning', 'Löpträning', 'Uthållighetsträning', 'Målsättning'],
    reviews: [
      { text: 'Michan har hjälpt mig att tro på mig själv igen. Hon ser potentialen i en även när man själv inte gör det.', author: 'Andreas L.' },
    ],
  },
  {
    id: 'joel',
    name: 'Joel Thorén',
    shortName: 'PT Joel',
    email: 'joel@coregymclub.se',
    phone: '070-456 78 90',
    quote: 'Min bakgrund som elitidrottare ger mig en djup förståelse för hur träning ska vara anpassad och effektiv. Jag hjälper dig nå dina mål med personligt anpassade program som fokuserar på både teknik och resultat.',
    bio: 'Med sin bakgrund som elitidrottare förstår Joel vad som krävs för att nå toppen. Han tar med sig sina erfarenheter och skapar träningsprogram som levererar resultat.',
    imageKey: 'a0a45ca4-15e5-430c-8cda-701b59ae73fd',
    imageUrl: getImageUrl('a0a45ca4-15e5-430c-8cda-701b59ae73fd'),
    instagram: '@joelthoren',
    specialties: ['Prestandaoptimering', 'Olympiska lyft', 'Idrottsspecifik träning', 'Periodisering'],
    reviews: [
      { text: 'Joels tekniska kunskap är oslagbar. Han har fått mig att förstå varför varje övning är viktig.', author: 'Martin H.' },
      { text: 'Bästa investeringen jag gjort! Joel är proffsig, motiverande och får en att känna sig trygg.', author: 'Sara L.' },
      { text: 'Med Joels hjälp har jag nått mål jag inte trodde var möjliga. Hans kunskap om olympiska lyft är exceptionell.', author: 'Erik N.' },
    ],
  },
]

export default defineEventHandler((event) => {
  const query = getQuery(event)

  // Get single trainer by id
  if (query.id) {
    const trainer = trainers.find(t => t.id === query.id)
    if (!trainer) {
      throw createError({
        statusCode: 404,
        statusMessage: 'Trainer not found',
      })
    }
    return trainer
  }

  return trainers
})
