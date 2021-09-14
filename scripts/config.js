const path = require('path')
const fs = require('fs-extra')
const { nodeResolve } = require('@rollup/plugin-node-resolve')
const { babel } = require('@rollup/plugin-babel')
const vue = require('rollup-plugin-vue')
const css = require('rollup-plugin-css-only')
const CleanCSS = require('clean-css')

/**
 * A map of each package umd global name (will be injected in window or global)
 */
const formatNameMap = {
  formvuelate: 'Formvuelate',
  'plugin-lookup': 'FormvuelatePluginLookup',
  'plugin-vee-validate': 'FormvuelatePluginVeeValidate'
}

/**
 * A map of the output file name without extension for each package
 */
const pkgNameMap = {
  formvuelate: 'formvuelate',
  'plugin-lookup': 'formvuelate-plugin-lookup',
  'plugin-vee-validate': 'formvuelate-plugin-vee-validate'
}

/**
 * The prefix for each package format to be prepended to the output file before the extension
 * e.g: `formvuelate.{formatPostfix}.js`
 */
const formatPostfixMap = {
  es: 'es',
  umd: 'umd',
  cjs: 'cjs'
}

/**
 * A map of each package and its external dependencies
 */
const pkgExternalsMap = {
  formvuelate: [],
  'plugin-lookup': ['formvuelate'],
  'plugin-vee-validate': ['formvuelate', 'vee-validate']
}

function createConfig (pkg, format) {
  const version = require(path.resolve(__dirname, `../packages/${pkg}/package.json`)).version

  const config = {
    input: {
      input: path.resolve(__dirname, `../packages/${pkg}/src/index.js`),
      external: ['vue', ...pkgExternalsMap[pkg]],
      plugins: [
        nodeResolve(),
        css({
          output (styles) {
            fs.writeFileSync(path.resolve(__dirname, `../packages/${pkg}/dist/${pkg}.css`), new CleanCSS().minify(styles).styles)
          }
        }),
        vue({
          css: false
        }),
        babel({ babelHelpers: 'bundled' })
      ]
    },
    output: {
      banner: `/**
  * ${pkg} v${version}
  */`,
      format,
      exports: 'auto',
      name: format === 'umd' ? formatNameMap[pkg] : undefined,
      globals: {
        vue: 'Vue',
        'vee-validate': 'VeeValidate'
      }
    }
  }

  config.bundleName = `${pkgNameMap[pkg]}${formatPostfixMap[format] ? '.' + formatPostfixMap[format] : ''}.js`

  return config
}

module.exports = {
  formatNameMap,
  pkgNameMap,
  formatPostfixMap,
  createConfig
}
