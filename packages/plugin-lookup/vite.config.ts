import { defineConfig } from 'vite'
import { fileURLToPath, URL } from 'node:url'
import { copyFileSync, mkdirSync } from 'node:fs'

const here = (p: string) => fileURLToPath(new URL(p, import.meta.url))

export default defineConfig({
  plugins: [
    {
      name: 'plugin-lookup:copy-types',
      closeBundle() {
        mkdirSync(here('./dist'), { recursive: true })
        copyFileSync(
          here('./src/types/index.d.ts'),
          here('./dist/formvuelate-plugin-lookup.d.ts')
        )
      }
    }
  ],
  build: {
    lib: {
      entry: here('./src/index.js'),
      name: 'FormvuelatePluginLookup',
      formats: ['es', 'cjs'],
      fileName: (format) => `formvuelate-plugin-lookup.${format}.js`
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
