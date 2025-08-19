// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
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
      autoSubfolderIndex: false,
    }
  },
  routeRules: {
    '/blog/**': { prerender: true },
    '/comparison': { prerender: true },
    '/categories/**': { prerender: true },
    '/vendors/**': { prerender: true },
    '/best-of/**': { prerender: true },
    '/guides/**': { prerender: true },
    '/pricing': { prerender: true },
    '/about': { prerender: true }
  },
  compatibilityDate: '2024-11-01',
  devtools: { enabled: true },
  site: { url: 'chatbotcomparison.com' },
  app: {
    head: {
      htmlAttrs: { lang: 'en' },
      title: 'ChatbotComparison — Compare Chatbots & Web Assistants',
      meta: [
        { name: 'robots', content: 'all' },
        { name: 'viewport', content: 'width=device-width, initial-scale=1.0' },
        { name: 'description', content: 'Specialized reviews and an interactive table to compare chatbots and web‑assistants for CRM, sales, support, and e‑commerce.' },
        { property: 'og:title', content: 'ChatbotComparison — Find the Right Web‑Assistant' },
        { property: 'og:description', content: 'Specialized reviews and an interactive comparison hub for chatbots and assistants.' },
        { property: 'og:image', content: 'https://chatbotcomparison.com/images/site-preview.png' },
        { property: 'og:url', content: 'https://chatbotcomparison.com' },
        { property: 'og:type', content: 'website' },
        { name: 'twitter:card', content: 'summary_large_image' },
        { name: 'twitter:title', content: 'ChatbotComparison — Find the Right Web‑Assistant' },
        { name: 'twitter:description', content: 'Compare CRM bots, sales bots, support bots, e‑commerce bots, and DIY stacks.' },
        { name: 'twitter:image', content: 'https://chatbotcomparison.com/images/site-preview.png' },
      ],
      link: [
        { rel: 'icon', type: 'image/svg+xml', href: '/favicon.svg' },
        { rel: 'alternate', href: 'https://chatbotcomparison.com', hreflang: 'en' },
        { rel: 'alternate', href: 'https://chatbotcomparison.com', hreflang: 'x-default' },
      ],
      script: [
        // (Optional) Google Analytics example — replace with your ID or remove
        {
          src: 'https://www.googletagmanager.com/gtag/js?id=G-XXXXXXX',
          async: true,
        },
        {
          children: `
            window.dataLayer = window.dataLayer || [];
            function gtag(){dataLayer.push(arguments);} 
            gtag('js', new Date());
            gtag('config', 'G-XXXXXXX');
          `,
          type: 'text/javascript',
        },
      ],
    }
  },
  css: ['~/assets/styles/main.scss'],
  postcss: {
    plugins: {
      'tailwindcss/nesting': {},
      tailwindcss: {},
      autoprefixer: {},
    },
  },
  vite: {
    css: {
      preprocessorOptions: {
        scss: { api: 'modern-compiler' }
      }
    }
  },
  modules: ['@nuxtjs/sitemap', 'nuxt-seo-utils', '@nuxt/icon'],
  plugins: ['~/plugins/seo.ts'],
  sitemap: {
    hostname: 'https://chatbotcomparison.com',
    gzip: true,
  }
})