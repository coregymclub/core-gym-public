// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  compatibilityDate: '2025-07-15',
  devtools: { enabled: true },

  // Vue config - recognize web components
  vue: {
    compilerOptions: {
      isCustomElement: (tag) => tag === 'popular-times'
    }
  },

  // Tailwind CSS
  modules: ['@nuxtjs/tailwindcss'],

  // Global CSS
  css: ['~/assets/css/main.css'],

  // Site configuration
  app: {
    head: {
      title: 'Core Gym Club - Kom som du är',
      meta: [
        { charset: 'utf-8' },
        { name: 'viewport', content: 'width=device-width, initial-scale=1, viewport-fit=cover' },
        { name: 'description', content: 'Fyra gym i Haninge. Öppet alla dagar. Inga pekpinnar, bara träning som passar dig.' },
        // iOS Safari theme color - dark for all modes
        { name: 'theme-color', content: '#1a1a1a', media: '(prefers-color-scheme: light)' },
        { name: 'theme-color', content: '#1a1a1a', media: '(prefers-color-scheme: dark)' },
        { name: 'mobile-web-app-capable', content: 'yes' },
        { name: 'apple-mobile-web-app-status-bar-style', content: 'default' },
        { property: 'og:title', content: 'Core Gym Club - Kom som du är' },
        { property: 'og:description', content: 'Fyra gym i Haninge. Öppet alla dagar. Inga pekpinnar, bara träning som passar dig.' },
        { property: 'og:type', content: 'website' },
        { property: 'og:url', content: 'https://coregymclub.se' },
        // Allow indexing on production
        { name: 'robots', content: 'index, follow' },
      ],
      link: [
        { rel: 'icon', type: 'image/x-icon', href: '/favicon.ico' },
      ]
    }
  },

  // SSR for SEO and bot/crawler support
  ssr: true,
  nitro: {
    preset: 'cloudflare-pages'
  }
})
