import js from '@eslint/js'
import vue from 'eslint-plugin-vue'
import n from 'eslint-plugin-n'
import cypress from 'eslint-plugin-cypress/flat'
import tseslint from 'typescript-eslint'
import prettier from 'eslint-config-prettier'
import globals from 'globals'

export default [
  {
    ignores: [
      '**/dist/**',
      '**/coverage/**',
      '**/node_modules/**',
      '**/.vitepress/cache/**',
      '**/.vitepress/dist/**',
      'docs/2.x/**',
      'docs/3.x/**'
    ]
  },

  js.configs.recommended,
  ...vue.configs['flat/recommended'],
  n.configs['flat/recommended-module'],

  // Parse TypeScript files with the TS parser so syntax like `declare global`
  // doesn't blow up the parser. Keep type-aware rules off — we don't want
  // to enforce a full TS lint pass on a JS codebase.
  {
    files: ['**/*.ts', '**/*.tsx'],
    languageOptions: {
      parser: tseslint.parser
    }
  },

  // .d.ts files document type signatures. Parameter names that aren't
  // "used" inside the declaration are intentional (they document the API).
  // no-unused-vars makes no sense on declarations.
  {
    files: ['**/*.d.ts'],
    rules: {
      'no-unused-vars': 'off'
    }
  },

  {
    languageOptions: {
      ecmaVersion: 2022,
      sourceType: 'module',
      globals: {
        ...globals.browser,
        ...globals.node,
        ...globals.es2022
      }
    },
    rules: {
      'no-console': process.env.NODE_ENV === 'production' ? 'error' : 'off',
      'no-debugger': process.env.NODE_ENV === 'production' ? 'error' : 'off',

      'vue/attribute-hyphenation': 'off',
      'vue/attributes-order': 'off',
      'vue/multi-word-component-names': 'off',
      // The `@update:modelValue` form is the convention in user-facing schema
      // examples, so leave it alone.
      'vue/v-on-event-hyphenation': 'off',
      'vue/component-tags-order': ['error', {
        order: [['template', 'script'], 'style']
      }],

      'n/no-missing-import': 'off',
      'n/no-unpublished-import': 'off',
      'n/no-extraneous-import': 'off'
    }
  },

  {
    files: ['**/*.spec.{js,ts}', '**/tests/**/*.{js,ts}'],
    languageOptions: {
      globals: {
        ...globals.jest,
        vi: 'readonly',
        describe: 'readonly',
        it: 'readonly',
        test: 'readonly',
        expect: 'readonly',
        beforeAll: 'readonly',
        beforeEach: 'readonly',
        afterAll: 'readonly',
        afterEach: 'readonly'
      }
    },
    rules: {
      'n/no-unsupported-features/node-builtins': 'off'
    }
  },

  {
    files: ['**/*.e2e.{js,ts}', '**/cypress/**/*.{js,ts}', '**/tests/e2e/**/*.{js,ts}'],
    ...cypress.configs.recommended
  },

  // Cypress support files do module augmentation with `declare global`;
  // the type-level names inside namespace blocks look "unused" to the
  // base no-unused-vars rule.
  {
    files: ['**/tests/e2e/support/*.{js,ts}'],
    rules: {
      'no-unused-vars': 'off'
    }
  },

  prettier
]
