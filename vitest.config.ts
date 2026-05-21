import { defineConfig } from 'vitest/config'
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
  },
  test: {
    environment: 'jsdom',
    globals: true,
    include: ['packages/**/tests/**/*.spec.{js,ts}'],
    coverage: {
      provider: 'v8',
      include: ['packages/**/src/**/*.{js,vue}'],
      exclude: ['packages/**/src/index.js']
    }
  }
})
