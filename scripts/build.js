const path = require('path')
const chalk = require('chalk')
const fs = require('fs-extra')
const { rollup } = require('rollup')
const Terser = require('terser')
const mkdirp = require('mkdirp')
const { createConfig } = require('./config')
const { generateDts } = require('./generate-dts')

async function minify ({ code, pkg, bundleName }) {
  const pkgout = path.join(__dirname, `../packages/${pkg}/dist`)
  const output = await Terser.minify(code, {
    compress: true,
    mangle: true
  })

  const fileName = bundleName.replace(/\.js$/, '.min.js')
  const filePath = `${pkgout}/${fileName}`
  fs.outputFileSync(filePath, output.code)
}

async function build (pkg) {
  console.log(chalk.cyan(`Bundling package: ${pkg}...`))
  const pkgout = path.join(__dirname, `../packages/${pkg}/dist`)
  await mkdirp(pkgout)
  for (const format of ['es', 'umd', 'cjs']) {
    const { input, output, bundleName } = createConfig(pkg, format)
    const bundle = await rollup(input)
    const {
      output: [{ code }]
    } = await bundle.generate(output)

    const outputPath = path.join(pkgout, bundleName)
    fs.outputFileSync(outputPath, code)
    if (format === 'umd') {
      await minify({ bundleName, pkg, code })
    }
  }

  await generateDts(pkg)
  console.log(chalk.green(`Successfully bundled: ${pkg}!`))

  return true
}

(async function Bundle () {
  const arg = [...process.argv][2]
  if (arg) {
    await build(arg)
    return
  }

  for (const pkg of ['formvuelate', 'plugin-lookup', 'plugin-vee-validate']) {
    await build(pkg)
  }
})()
