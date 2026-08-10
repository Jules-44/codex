// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  compatibilityDate: '2025-05-15',
  devtools: { enabled: true },

  // Static site generation
  nitro: {
    preset: 'static'
  },

  // App head config
  app: {
    head: {
      title: 'Chronicle of War',
      titleTemplate: '%s | Chronicle of War',
      meta: [
        { charset: 'utf-8' },
        { name: 'viewport', content: 'width=device-width, initial-scale=1' },
        {
          name: 'description',
          content:
            'A comprehensive historical record of every armed conflict since 1950 — wars, civil conflicts, insurgencies, and genocides from every nation on Earth.'
        },
        { property: 'og:title', content: 'Chronicle of War' },
        {
          property: 'og:description',
          content: 'A comprehensive historical record of every armed conflict since 1950.'
        },
        { property: 'og:type', content: 'website' },
        { name: 'theme-color', content: '#0d0d0d' }
      ],
      link: [
        { rel: 'icon', type: 'image/svg+xml', href: '/favicon.svg' },
        { rel: 'preconnect', href: 'https://fonts.googleapis.com' },
        { rel: 'preconnect', href: 'https://fonts.gstatic.com', crossorigin: '' },
        {
          rel: 'stylesheet',
          href: 'https://fonts.googleapis.com/css2?family=Cinzel+Decorative:wght@400;700;900&family=Cinzel:wght@400;600;700&family=Inter:wght@300;400;500;600;700&display=swap'
        }
      ]
    }
  },

  // CSS
  css: ['~/assets/css/tokens.css', '~/assets/css/global.css']
})
