// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  compatibilityDate: '2025-07-15',
  devtools: { enabled: true },
  ssr: false,
  modules: ['@nuxt/ui'],
  css: ['~/assets/main.css'],
  fonts: {
    families: [
      { name: 'Poppins', weights: ['300', '400', '500', '700', '900'], styles: ['normal', 'italic'] },
    ]
  },
  nitro: {
    preset: 'github-pages'
  },
  app: {
    baseURL: '/WebFlasher/',
    buildAssetsDir: 'assets',
    head: {
      link: [
        { rel: 'icon', type: 'image/x-icon', href: '/WebFlasher/favicon.ico' }
      ]
    }
  }
})