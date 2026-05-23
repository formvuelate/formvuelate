import { defineConfig } from 'cypress'

export default defineConfig({
  // Opt out of the legacy Cypress.env() exposure that's slated for removal
  // in a future major. We don't use Cypress.env() in any spec.
  allowCypressEnv: false,
  component: {
    devServer: {
      framework: 'vue',
      bundler: 'vite'
    },
    specPattern: 'packages/formvuelate/tests/e2e/specs/**/*.e2e.{js,ts}',
    supportFile: 'packages/formvuelate/tests/e2e/support/component.ts',
    indexHtmlFile: 'packages/formvuelate/tests/e2e/support/component-index.html'
  }
})
