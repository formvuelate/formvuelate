import { defineConfig } from 'vitepress'

export default defineConfig({
  title: 'FormVueLate',
  description: 'FormVueLate — Schema-driven form generation for Vue 3',

  head: [
    ['meta', { name: 'theme-color', content: '#3eaf7c' }],
    ['meta', { name: 'apple-mobile-web-app-capable', content: 'yes' }],
    ['meta', { name: 'apple-mobile-web-app-status-bar-style', content: 'black' }],
    ['link', { rel: 'icon', href: '/favicon.ico' }]
  ],

  themeConfig: {
    logo: '/formvuelate-icon.jpg',

    nav: [
      { text: 'Guide', link: '/guide/' },
      { text: 'Examples', link: '/examples/' },
      { text: 'Migrating from 3.x', link: '/migration/3-to-4' },
      { text: 'GitHub', link: 'https://github.com/formvuelate/formvuelate' }
    ],

    sidebar: {
      '/guide/': [
        {
          text: 'Essentials',
          collapsed: false,
          items: [
            { text: 'Getting Started', link: '/guide/' },
            { text: 'SchemaForm', link: '/guide/schema-form' },
            { text: 'SchemaWizard', link: '/guide/schema-wizard' },
            { text: 'SchemaArray', link: '/guide/arrays' },
            { text: 'Advanced schema', link: '/guide/advanced-schema' },
            { text: 'Accessibility', link: '/guide/accessibility' },
            { text: 'TypeScript', link: '/guide/typescript' }
          ]
        },
        {
          text: 'Plugins',
          collapsed: false,
          items: [
            { text: 'Plugins overview', link: '/guide/plugins' },
            { text: 'Lookup plugin', link: '/guide/lookup' },
            { text: 'vee-validate plugin', link: '/guide/veevalidate' },
            { text: 'Custom plugins', link: '/guide/customplugins' }
          ]
        }
      ],
      '/examples/': [
        { text: 'Examples', collapsed: false, items: [{ text: 'Overview', link: '/examples/' }] }
      ],
      '/migration/': [
        {
          text: 'Migration',
          collapsed: false,
          items: [{ text: '3.x → 4.x', link: '/migration/3-to-4' }]
        }
      ]
    },

    socialLinks: [
      { icon: 'github', link: 'https://github.com/formvuelate/formvuelate' }
    ],

    footer: {
      message: 'Released under the MIT License.',
      copyright: 'Copyright © Marina Mosti'
    },

    search: {
      provider: 'local'
    }
  }
})
