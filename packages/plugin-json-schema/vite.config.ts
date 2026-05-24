import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import { fileURLToPath, URL } from 'node:url'
import { copyFileSync, mkdirSync } from 'node:fs'

const here = (p: string) => fileURLToPath(new URL(p, import.meta.url))

export default defineConfig({
  plugins: [
    vue(),
    {
      name: 'plugin-json-schema:copy-types',
      closeBundle() {
        mkdirSync(here('./dist'), { recursive: true })
        copyFileSync(
          here('./src/types/index.d.ts'),
          here('./dist/formvuelate-plugin-json-schema.d.ts')
        )
      }
    }
  ],
  build: {
    lib: {
      entry: here('./src/index.js'),
      name: 'FormvuelatePluginJsonSchema',
      formats: ['es', 'cjs'],
      fileName: (format) => `formvuelate-plugin-json-schema.${format}.js`
    },
    rollupOptions: {
      external: ['vue', 'formvuelate'],
      output: {
        exports: 'named',
        globals: {
          vue: 'Vue',
          formvuelate: 'Formvuelate'
        }
      }
    }
  }
})
