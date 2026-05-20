import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import { fileURLToPath, URL } from 'node:url'
import { copyFileSync, mkdirSync } from 'node:fs'

const here = (p: string) => fileURLToPath(new URL(p, import.meta.url))

export default defineConfig({
  plugins: [
    vue(),
    {
      name: 'formvuelate:copy-types',
      closeBundle() {
        mkdirSync(here('./dist'), { recursive: true })
        copyFileSync(here('./src/types/index.d.ts'), here('./dist/formvuelate.d.ts'))
      }
    }
  ],
  build: {
    lib: {
      entry: here('./src/index.js'),
      name: 'Formvuelate',
      formats: ['es', 'cjs'],
      fileName: (format) => `formvuelate.${format}.js`
    },
    rollupOptions: {
      external: ['vue'],
      output: {
        exports: 'named',
        globals: { vue: 'Vue' }
      }
    }
  }
})
