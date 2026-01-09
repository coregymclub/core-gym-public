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
        // iOS Safari theme color (can be overridden per-page with key: 'theme-color')
        { key: 'theme-color', name: 'theme-color', content: '#1a1a1a' },
        { name: 'mobile-web-app-capable', content: 'yes' },
        { property: 'og:title', content: 'Core Gym Club - Kom som du är' },
        { property: 'og:description', content: 'Fyra gym i Haninge. Öppet alla dagar. Inga pekpinnar, bara träning som passar dig.' },
        { property: 'og:type', content: 'website' },
        { property: 'og:url', content: 'https://coregym.club' },
        { property: 'og:image', content: 'https://coregym.club/og-image.jpg?v=2' },
        { property: 'og:image:width', content: '1200' },
        { property: 'og:image:height', content: '630' },
        { name: 'twitter:card', content: 'summary_large_image' },
        { name: 'twitter:image', content: 'https://coregym.club/og-image.jpg?v=2' },
        // Allow indexing on production
        { name: 'robots', content: 'index, follow' },
      ],
      link: [
        { rel: 'icon', type: 'image/svg+xml', href: '/favicon.svg?v=3' },
        { rel: 'icon', type: 'image/x-icon', href: '/favicon.ico?v=3' },
        { rel: 'apple-touch-icon', sizes: '180x180', href: '/apple-touch-icon.png?v=3' },
        { rel: 'mask-icon', href: '/safari-pinned-tab.svg', color: '#ed1a37' },
      ]
    }
  },

  // SSR for SEO and bot/crawler support
  ssr: true,
  nitro: {
    preset: 'cloudflare-pages'
  },

  // Redirects
  routeRules: {
    '/anlaggningar': { redirect: '/' },
    '/anlaggningar/**': { redirect: '/' }
  }
})
