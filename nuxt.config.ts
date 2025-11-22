// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  compatibilityDate: '2025-07-15',
  devtools: { enabled: true },

  // Site configuration
  // NOTE: Update og:url when deploying to production (coregymclub.se)
  app: {
    head: {
      title: 'Core Gym Club - Ditt Lokala Träningscenter',
      meta: [
        { charset: 'utf-8' },
        { name: 'viewport', content: 'width=device-width, initial-scale=1' },
        { name: 'description', content: 'Core Gym Club - Träningsanläggningar i Vegastaden, Tungelsta och Västerhaninge. Gym, gruppträning, personlig träning och mer.' },
        { property: 'og:title', content: 'Core Gym Club - Ditt Lokala Träningscenter' },
        { property: 'og:description', content: 'Core Gym Club - Träningsanläggningar i Vegastaden, Tungelsta och Västerhaninge.' },
        { property: 'og:type', content: 'website' },
        // Using staging domain for now - update to https://coregymclub.se for production
        { name: 'robots', content: 'noindex, nofollow' }, // Prevent indexing on staging
      ],
      link: [
        { rel: 'icon', type: 'image/x-icon', href: '/favicon.ico' },
      ]
    }
  },

  // Cloudflare Pages preset
  nitro: {
    preset: 'cloudflare-pages'
  }
})
