/* eslint-disable arrow-body-style */
// https://docs.cypress.io/guides/guides/plugins-guide.html

// if you need a custom webpack configuration you can uncomment the following import
// and then use the `file:preprocessor` event
// as explained in the cypress docs
// https://docs.cypress.io/api/plugins/preprocessors-api.html#Examples

// /* eslint-disable import/no-extraneous-dependencies, global-require */
// const webpack = require('@cypress/webpack-preprocessor')

const { startDevServer } = require('@cypress/webpack-dev-server')
const webpackConfig = require('@vue/cli-service/webpack.config.js')

module.exports = (on, config) => {
  // on('file:preprocessor', webpack({
  //  webpackOptions: require('@vue/cli-service/webpack.config'),
  //  watchOptions: {}
  // }))

  on('dev-server:start', options =>
    startDevServer({
      options,
      webpackConfig
    })
  )

  return Object.assign({}, config, {
    fixturesFolder: 'packages/formvuelate/tests/e2e/fixtures',
    integrationFolder: 'packages/formvuelate/tests/e2e/specs',
    screenshotsFolder: 'packages/formvuelate/tests/e2e/screenshots',
    videosFolder: 'packages/formvuelate/tests/e2e/videos',
    supportFile: 'packages/formvuelate/tests/e2e/support/index.js'
  })
}
