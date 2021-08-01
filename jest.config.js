module.exports = {
  rootDir: __dirname,

  preset: 'ts-jest',

  moduleFileExtensions: [
    'js',
    'jsx',
    'json',
    'vue'
  ],

  testEnvironment: 'jsdom',

  transform: {
    '^.+\\.vue$': 'vue3-jest',
    '.+\\.(css|styl|less|sass|scss|svg|png|jpg|ttf|woff|woff2)$': 'jest-transform-stub',
    '^.+\\.jsx?$': 'babel-jest'
  },

  transformIgnorePatterns: [
    '/node_modules/'
  ],

  moduleNameMapper: {
    '^@formvuelate/(.+)$': '<rootDir>/packages/$1/src',
    '^(formvuelate)$': '<rootDir>/packages/formvuelate/src'
  },

  snapshotSerializers: [
    'jest-serializer-vue'
  ],

  testMatch: ['<rootDir>/packages/**/tests/**/*spec.[jt]s?(x)'],

  collectCoverageFrom: [
    '<rootDir>/packages/**/src/*.{js,jsx,vue}',
    '!<rootDir>/packages/**/*.e2e.js',
    '!<rootDir>/packages/src/index.js'
  ],

  setupFilesAfterEnv: ['./jest.setup.js'],

  testURL: 'http://localhost/'
}
