const { description } = require('../../package')

module.exports = {
  /**
   * Ref：https://v1.vuepress.vuejs.org/config/#title
   */
  title: 'FormVueLate',
  /**
   * Ref：https://v1.vuepress.vuejs.org/config/#description
   */
  description: description,

  /**
   * Extra tags to be injected to the page HTML `<head>`
   *
   * ref：https://v1.vuepress.vuejs.org/config/#head
   */
  head: [
    ['meta', { name: 'theme-color', content: '#3eaf7c' }],
    ['meta', { name: 'apple-mobile-web-app-capable', content: 'yes' }],
    ['meta', { name: 'apple-mobile-web-app-status-bar-style', content: 'black' }],
    ['link', { rel: 'icon', href: '/favicon.ico' }]
  ],

  /**
   * Theme configuration, here is the default theme configuration for VuePress.
   *
   * ref：https://v1.vuepress.vuejs.org/theme/default-theme-config.html
   */
  themeConfig: {
    repo: '',
    editLinks: false,
    docsDir: '',
    editLinkText: '',
    lastUpdated: false,
    displayAllHeaders: true,
    nav: [
      {
        text: 'Guide',
        link: '/guide/',
      },
      {
        text: 'Examples',
        link: '/examples/'
      },
      {
        text: 'GitHub',
        link: 'https://github.com/formvuelate'
      },
      {
        text: '2.x',
        items: [
          {
            text: '3.x', link: 'https://formvuelate.js.org/'
          }
        ]
      }
    ],
    sidebar: {
      '/guide/': [
        {
          title: 'Essentials',
          collapsable: false,
          children: [
            '',
            'schema-form',
            'schema-wizard',
            'accessibility'
          ]
        },
        {
          title: 'Plugins',
          collapsable: false,
          children: [
            'plugins',
            'lookup',
            'veevalidate',
            'customplugins'
          ]
        }
      ],
      '/examples/': [
        {
          title: 'Examples',
          collapsable: false,
          children: [
            ''
          ]
        }
      ]
    }
  },

  /**
   * Apply plugins，ref：https://v1.vuepress.vuejs.org/zh/plugin/
   */
  plugins: [
    '@vuepress/plugin-back-to-top',
    '@vuepress/plugin-medium-zoom',
  ]
}
