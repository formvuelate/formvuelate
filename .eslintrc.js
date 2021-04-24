module.exports = {
  root: true,

  env: {
    node: true
  },

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

  parserOptions: {
    parser: 'babel-eslint'
  },

  overrides: [
    {
      files: [
        '**/tests/unit/**/*.spec.js'
      ],
      env: {
        jest: true
      }
    }
  ]
}
