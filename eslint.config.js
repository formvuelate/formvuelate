import js from '@eslint/js'
import vue from 'eslint-plugin-vue'
import n from 'eslint-plugin-n'
import cypress from 'eslint-plugin-cypress/flat'
import prettier from 'eslint-config-prettier'
import globals from 'globals'

export default [
  {
    ignores: [
      '**/dist/**',
      '**/coverage/**',
      '**/node_modules/**',
      'docs/2.x/**',
      'docs/3.x/**'
    ]
  },

  js.configs.recommended,
  ...vue.configs['flat/recommended'],
  n.configs['flat/recommended-module'],

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
    files: ['**/*.e2e.{js,ts}', '**/cypress/**/*.{js,ts}'],
    ...cypress.configs.recommended
  },

  prettier
]
