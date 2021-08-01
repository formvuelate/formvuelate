module.exports = {
  rootDir: __dirname,

  moduleFileExtensions: [
    'js',
    'jsx',
    'json',
    'vue'
  ],

  transform: {
    '^.+\\.vue$': 'vue-jest',
    '.+\\.(css|styl|less|sass|scss|svg|png|jpg|ttf|woff|woff2)$': 'jest-transform-stub',
    '^.+\\.jsx?$': 'babel-jest'
  },

  transformIgnorePatterns: [
    '/node_modules/'
  ],

  moduleNameMapper: {
    '^@/(.+)$': '<rootDir>/packages/$1/src'
  },

  snapshotSerializers: [
    'jest-serializer-vue'
  ],

  testMatch: [
    '<rootDir>/packages/**/tests/**/*spec.[jt]s?(x)'
  ],

  collectCoverageFrom: [
    'src/**/*.{js,jsx,vue}',
    '!src/**/*.e2e.js',
    '!src/index.js'
  ],

  testURL: 'http://localhost/',
  preset: '@vue/cli-plugin-unit-jest'
}
