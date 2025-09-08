// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  features: {
    inlineStyles: true
  },
  experimental: {
    payloadExtraction: true,
    renderJsonPayloads: true
  },
  vite: {
    build: {
      cssCodeSplit: false
    }
  },
  site: { url: 'https://chatbotcomparison.com' },
  runtimeConfig: {
    public: {
      siteUrl: 'https://chatbotcomparison.com',
    },
  },
  ssr: true,
  nitro: {
    preset: 'static',
    prerender: {
      crawlLinks: true,
      autoSubfolderIndex: true
    }
  },
  routeRules: {
    '/compare/**': { prerender: true }
  },
  compatibilityDate: '2024-11-01',
  devtools: { enabled: false },
  app: {
    head: {
      htmlAttrs: { lang: 'en' },
      title: 'Chatbot Comparison: Find the best AI chatbots',
      meta: [
        { name: 'robots', content: 'all' },
        { name: 'viewport', content: 'width=device-width, initial-scale=1.0' },
        { name: 'description', content: 'Independent feature comparison of popular AI chatbots. Quickly find the best chatbot for your use case.' },
        { property: 'og:title', content: 'Chatbot Comparison: Find the best AI chatbots' },
        { property: 'og:description', content: 'Independent feature comparison of popular AI chatbots. Quickly find the best chatbot for your use case.' },
        { property: 'og:image', content: 'https://chatbotcomparison.com/og-default.png' },
        { property: 'og:url', content: 'https://chatbotcomparison.com' },
        { property: 'og:type', content: 'website' },
        { name: 'twitter:card', content: 'summary_large_image' },
        { name: 'twitter:title', content: 'Chatbot Comparison: Find the best AI chatbots' },
        { name: 'twitter:description', content: 'Independent feature comparison of popular AI chatbots. Quickly find the best chatbot for your use case.' },
        { name: 'twitter:image', content: 'https://chatbotcomparison.com/og-default.png' }
      ],
      link: [
        { rel: 'icon', type: 'image/svg+xml', href: '/favicon.svg' },
        { rel: 'alternate', href: 'https://chatbotcomparison.com', hreflang: 'en' },
        { rel: 'alternate', href: 'https://chatbotcomparison.com', hreflang: 'x-default' },
        { rel: 'preconnect', href: 'https://fonts.googleapis.com' },
        { rel: 'preconnect', href: 'https://fonts.gstatic.com', crossorigin: '' },
        { rel: 'preconnect', href: 'https://www.googletagmanager.com' },
        { rel: 'preconnect', href: 'https://www.google-analytics.com' },
        {
          rel: 'preload',
          as: 'style',
          href: 'https://fonts.googleapis.com/css2?family=DM+Sans:ital,opsz,wght@0,9..40,100..1000;1,9..40,100..1000&family=Inter:ital,opsz,wght@0,14..32,100..900;1,14..32,100..900&display=swap',
          onload: "this.onload=null;this.rel='stylesheet'"
        }
      ],
      // Optional: GA/GTAG – drop in your ID or remove.
      // script: [
      //   { src: 'https://www.googletagmanager.com/gtag/js?id=G-XXXX', async: true, defer: true },
      //   { children: `window.dataLayer=window.dataLayer||[];function gtag(){dataLayer.push(arguments);}gtag('js',new Date());gtag('config','G-XXXX');` }
      // ],
      noscript: [
        {
          children:
            `<link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=DM+Sans:ital,opsz,wght@0,9..40,100..1000;1,9..40,100..1000&family=Inter:ital,opsz,wght@0,14..32,100..900;1,14..32,100..900&display=swap">`
        }
      ]
    }
  },
  css: ['~/assets/styles/main.scss'],
  postcss: {
    plugins: {
      'tailwindcss/nesting': {},
      tailwindcss: {},
      autoprefixer: {}
    }
  },
  modules: ['@nuxtjs/sitemap', 'nuxt-seo-utils', '@nuxt/icon', 'nuxt-gtag'],
  gtag: {
    id: 'G-D655E1QKNB',
    enabled: process.env.NODE_ENV === 'production'
  },
  plugins: ['~/plugins/seo.ts'],
})