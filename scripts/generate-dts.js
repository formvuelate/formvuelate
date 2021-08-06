/**
 * Node.js script to bundle the .d.ts files into a single output
 */

const dts = require('dts-bundle')
const path = require('path')
const chalk = require('chalk')
const fs = require('fs-extra')
const { pkgNameMap } = require('./config')

function generateDts (pkg) {
  const entry = path.join(__dirname, `../packages/${pkg}/src/types`)
  if (!fs.existsSync(entry)) {
    console.log(chalk.yellow(`No types directory was detected for package: ${pkg}`))
    return
  }

  const namespace = require(path.resolve(__dirname, `../packages/${pkg}/package.json`)).name
  const fileName = pkgNameMap[pkg]

  dts.bundle({
    name: namespace,
    main: entry,
    out: path.resolve(__dirname, `../packages/${pkg}/dist/${fileName}.d.ts`),
    indent: '  '
  })

  console.log(chalk.blue(`Bundled typescript types for ${pkg}`))
}

module.exports = { generateDts }
