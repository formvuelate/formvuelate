import { defineConfig } from 'vite'
import { fileURLToPath, URL } from 'node:url'
import { copyFileSync, mkdirSync } from 'node:fs'

const here = (p: string) => fileURLToPath(new URL(p, import.meta.url))

export default defineConfig({
  plugins: [
    {
      name: 'plugin-vee-validate:copy-types',
      closeBundle() {
        mkdirSync(here('./dist'), { recursive: true })
        copyFileSync(
          here('./src/types/index.d.ts'),
          here('./dist/formvuelate-plugin-vee-validate.d.ts')
        )
      }
    }
  ],
  build: {
    lib: {
      entry: here('./src/index.js'),
      name: 'FormvuelatePluginVeeValidate',
      formats: ['es', 'cjs'],
      fileName: (format) => `formvuelate-plugin-vee-validate.${format}.js`
    },
    rollupOptions: {
      external: ['vue', 'vee-validate', 'formvuelate'],
      output: {
        exports: 'named',
        globals: {
          vue: 'Vue',
          'vee-validate': 'VeeValidate',
          formvuelate: 'Formvuelate'
        }
      }
    }
  }
})
