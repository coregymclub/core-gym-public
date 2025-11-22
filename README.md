# 🏋️ Core Gym Club - Public Website

**Version:** 1.0.0
**Framework:** Nuxt 3 + TypeScript + Tailwind CSS
**Purpose:** Marknadsföringssida för Core Gym Club
**URL:** coregymclub.se

---

## 🚀 QUICK START

```bash
# Install dependencies
npm install

# Start dev server
npm run dev
# → http://localhost:3000

# Build for production
npm run build

# Preview production build
npm run preview
```

---

## 📋 **NY UTVECKLARE? START HÄR!**

### **🔥 LÄSA DETTA FÖRST:**
→ **[NEXT_AGENT_PUBLIC_SITE_GUIDE.md](../core-gym/NEXT_AGENT_PUBLIC_SITE_GUIDE.md)**

Detta dokument innehåller:
- ✅ Komplett projektöversikt
- ✅ Design system (colors, typography, spacing)
- ✅ Zoezi API integration guide
- ✅ Alla pages mappade med innehåll
- ✅ Implementation plan (Dag 1-2)
- ✅ Code examples (Hero, Gym cards, etc.)
- ✅ Content sources (business info)

**Startup guide location:**
```
/Users/gustav/Projects/core-gym/NEXT_AGENT_PUBLIC_SITE_GUIDE.md
```

---

## 🏗️ PROJECT STRUCTURE

```
core-gym-public/
├── app.vue                 ← Root component
├── nuxt.config.ts          ← Nuxt config
├── package.json            ← Dependencies
│
├── pages/                  ← Routes (auto-generated)
│   ├── index.vue           ← Landing page
│   ├── anlaggningar/
│   │   ├── index.vue       ← Gym overview
│   │   ├── vegastaden.vue
│   │   ├── tungelsta.vue
│   │   └── vasterhaninge.vue
│   ├── personlig-traning.vue
│   ├── om-oss.vue
│   ├── vart-utbud.vue
│   ├── priser.vue
│   └── kontakt.vue
│
├── components/             ← Vue components
│   ├── layout/
│   ├── home/
│   ├── gym/
│   └── shared/
│
├── composables/            ← Reusable logic
│   └── useZoeziApi.ts      ← Zoezi API client
│
├── server/                 ← Server-side code
│   └── api/
│       ├── test-zoezi.ts   ← ✅ Zoezi API test (working!)
│       ├── staff.ts
│       ├── workouts.ts
│       └── schedule.ts
│
└── public/                 ← Static assets
    └── images/
```

---

## 🎨 DESIGN VISION

**Google Expressive Design** (moderna, luftiga, stora typo)
\+ **Apple Coolness** (minimalism, white space, premium känsla)
\= **Core Gym 2026** (clean, inspirerande, actionable)

### **Color Palette:**
```css
--core-red: #f11313        /* Primary CTA */
--core-dark: #1a1a1a       /* Text, headers */
--core-gray: #666666       /* Body text */
--core-light-gray: #f5f5f5 /* Backgrounds */
--core-white: #ffffff      /* Sections, cards */
```

### **Typography:**
```css
font-family: 'Inter', -apple-system, sans-serif
--h1: 64px / 72px (bold)
--h2: 48px / 56px (bold)
--h3: 36px / 44px (semibold)
--body: 16px / 28px (regular)
```

---

## 🔗 ZOEZI API

### **✅ VERIFIED: Works without Zoezi's api.js!**

**Test endpoint (already working):**
```bash
curl http://localhost:3000/api/test-zoezi
```

**Public endpoints used:**
```typescript
// Staff/PTs
GET https://coregymclub.zoezi.se/api/public/staff/get/full

// Gruppträning/Schedule
GET https://coregymclub.zoezi.se/api/public/workout/get/all?fromDate=YYYY-MM-DD&toDate=YYYY-MM-DD

// Sites/Anläggningar
GET https://coregymclub.zoezi.se/api/public/site/all
```

**No authentication needed for public endpoints!**

---

## 📄 PAGES TO BUILD

1. **Landing (`/`)** - Hero, USPs, gym grid, workouts preview
2. **Anläggningar (`/anlaggningar`)** - 3 gyms overview + detail pages
3. **Personlig Träning (`/personlig-traning`)** - PTs from Zoezi API
4. **Om Oss (`/om-oss`)** - Historia, vision, värderingar
5. **Vårt Utbud (`/vart-utbud`)** - Gruppträning, yoga, senior
6. **Priser (`/priser`)** - Pricing cards
7. **Kontakt (`/kontakt`)** - Contact form + info

---

## 🎯 IMPLEMENTATION PLAN

### **Day 1: Foundation (6-8h)**
- [ ] Setup Tailwind CSS
- [ ] Design system (colors, typography)
- [ ] Layout components (Header, Footer, MobileMenu)
- [ ] Zoezi API composable
- [ ] Landing page Part 1 (Hero, USPs)

### **Day 2: Content Pages (6-8h)**
- [ ] Landing page Part 2 (Gym grid, workouts)
- [ ] Anläggningar pages (overview + 3 detail)
- [ ] Om Oss, Priser, Kontakt pages

**Result:** MVP live! 🎉

---

## 📚 CONTENT SOURCE

**All business info:**
```
/Users/gustav/Projects/core-gym/docs/references/CORE_GYM_BUSINESS_CONTEXT.md
```

**Contains:**
- Historia, vision, mission
- Alla 3 gymmen (features, öppettider, adresser)
- Priser (ordinarie, student, senior, ungdom)
- Tjänster (gruppträning, PT, yoga, etc.)
- Kontaktinfo
- Site IDs (1=Vegastaden, 2=Tungelsta, 3=Västerhaninge)

---

## 🚨 IMPORTANT NOTES

### **1. Separate from main PWA repo:**
```
/Users/gustav/Projects/core-gym/        ← Main PWA (Member, Staff, Checkin)
/Users/gustav/Projects/core-gym-public/ ← Public site (THIS PROJECT)
```

### **2. Tech Stack:**
- **Nuxt 3** (not Nuxt 2!)
- **Vue 3** (Composition API)
- **TypeScript**
- **Tailwind CSS** (to be added)

### **3. Deploy Target:**
- **Vercel** (recommended for Nuxt 3)
- **Cloudflare Pages** (alternative)
- **Domain:** coregymclub.se

---

## ✅ ACCEPTANCE CRITERIA

**MVP is done when:**
- [ ] All 7 pages created
- [ ] Navigation works (header + mobile menu)
- [ ] Zoezi API integration working
- [ ] Responsive design (mobile + desktop)
- [ ] SEO meta tags on all pages
- [ ] Tailwind CSS design system implemented
- [ ] Clean 2026 design (Google Expressive + Apple cool)

---

## 🔧 NEXT STEPS

1. **Read the startup guide:**
   ```bash
   cat /Users/gustav/Projects/core-gym/NEXT_AGENT_PUBLIC_SITE_GUIDE.md
   ```

2. **Start development:**
   ```bash
   cd /Users/gustav/Projects/core-gym-public
   npm run dev
   code .
   ```

3. **First tasks:**
   - Install & setup Tailwind CSS
   - Create Header + Footer components
   - Build Hero section on landing page

---

## 📞 QUESTIONS?

**Check:**
1. NEXT_AGENT_PUBLIC_SITE_GUIDE.md - Complete guide
2. CORE_GYM_BUSINESS_CONTEXT.md - All content
3. server/api/test-zoezi.ts - API examples
4. Nuxt docs: https://nuxt.com/docs

---

**🚀 LET'S BUILD THE FUTURE OF CORE GYM! 💪**

**Last updated:** 2025-11-22
**Status:** ✅ Ready for development
