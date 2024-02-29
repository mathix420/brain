// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  extends: ["@plsr/nuxt-layer-base"],
  app: {
    head: {
      title: "Brain - Personal Search Engine",
    },
  },
  devtools: { enabled: true },
  // nitro: {
  //   preset: "cloudflare",
  // },
});
