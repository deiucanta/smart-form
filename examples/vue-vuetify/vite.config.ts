import { defineConfig } from "vite";
import vue from "@vitejs/plugin-vue";
import vuetify from "vite-plugin-vuetify";

export default defineConfig({
  base: "/smart-form/vue/",
  build: {
    outDir: "../../public/vue",
    emptyOutDir: true,
  },
  plugins: [
    vue(),
    vuetify({ autoImport: true }),
  ],
});
