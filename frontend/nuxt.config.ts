// https://nuxt.com/docs/api/configuration/nuxt-config
import { fileURLToPath } from "url";

export default defineNuxtConfig({
  modules: ["@ant-design-vue/nuxt"],
  devtools: { enabled: true },
  alias: {
    "@shared-types": fileURLToPath(new URL("../shared-types", import.meta.url)),
  },
});
