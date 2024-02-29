// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  extends: ["@plsr/nuxt-layer-base"],
  devtools: { enabled: true },
  nitro: {
    preset: "cloudflare",
  },
});
