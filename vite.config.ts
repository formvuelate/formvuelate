// Root Vite config used by Cypress component-testing dev server.
// Per-package library builds use their own vite.config.ts files.
import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import { fileURLToPath, URL } from 'node:url'

const here = (p: string) => fileURLToPath(new URL(p, import.meta.url))

export default defineConfig({
  plugins: [vue()],
  resolve: {
    alias: {
      formvuelate: here('./packages/formvuelate/src/index.js'),
      '@formvuelate/plugin-lookup': here('./packages/plugin-lookup/src/index.js'),
      '@formvuelate/plugin-vee-validate': here('./packages/plugin-vee-validate/src/index.js')
    }
  }
})
