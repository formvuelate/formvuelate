module.exports = {
  root: true,

  parser: 'vue-eslint-parser',
  parserOptions: {
    parser: '@typescript-eslint/parser'
  },

  env: {
    node: true
  },

  plugins: [
    'cypress'
  ],

  extends: [
    'standard',
    'plugin:vue/vue3-recommended'
  ],

  rules: {
    'no-console': process.env.NODE_ENV === 'production' ? 'error' : 'off',
    'no-debugger': process.env.NODE_ENV === 'production' ? 'error' : 'off',

    'vue/attribute-hyphenation': 'off',
    'vue/attributes-order': 'off',
    'vue/component-tags-order': ['error', {
      order: [['template', 'script'], 'style']
    }]
  },

  overrides: [
    {
      files: [
        '**/*.spec.js'
      ],
      env: {
        jest: true
      }
    },
    {
      files: [
        '**/*.e2e.js'
      ],
      env: {
        mocha: true,
        'cypress/globals': true
      }
    }
  ]
}
