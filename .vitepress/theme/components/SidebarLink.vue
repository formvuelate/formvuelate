<script>
import { isActive, hashRE, groupHeaders } from '../utils.js'
import { h, inject } from 'vue'

export default {
  props: ['item', 'sidebarDepth'],
  setup () {
    const { route, go } = inject('router')

    return function ({ item, sidebarDepth }) {
      // use custom active class matching logic
      // due to edge case of paths ending with / + hash
      const selfActive = isActive(route, item.path)
      // for sidebar: auto pages, a hash link should be active if one of its child
      // matches
      const active = item.type === 'auto'
        ? selfActive || item.children.some(c => isActive(route, item.basePath + '#' + c.slug))
        : selfActive
      const link = item.type === 'external'
        ? renderExternal(item.path, item.title || item.path)
        : renderLink(go, item.path, item.title || item.path, active)

      const maxDepth = [
        this.$page.frontmatter.sidebarDepth,
        sidebarDepth,
        this.$site.themeConfig.sidebarDepth,
        1
      ].find(depth => depth !== undefined)

      const displayAllHeaders = this.$site.themeConfig.displayAllHeaders
        || true

      if (item.type === 'auto') {
        return [link, renderChildren(go, item.children, item.basePath, route, maxDepth)]
      } else if ((active || displayAllHeaders) && item.headers && !hashRE.test(item.path)) {
        const children = groupHeaders(item.headers)
        return [link, renderChildren(go, children, item.path, route, maxDepth)]
      } else {
        return link
      }
    }
  }
}

function renderLink (go, to, text, active, level) {
  const component = {
    href: to,
    onClick () {
      go(to)
    },
    class: {
      active,
      'sidebar-link': true
    }
  }

  if (level > 2) {
    component.style = {
      'padding-left': level + 'rem'
    }
  }

  return h('a', component, text)
}

function renderChildren (go, children, path, route, maxDepth, depth = 1) {
  if (!children || depth > maxDepth) return null
  return h('ul', { class: 'sidebar-sub-headers' }, children.map(c => {
    const active = isActive(route, path + '#' + c.slug)
    return h('li', { class: 'sidebar-sub-header' }, [
      renderLink(go, path + '#' + c.slug, c.title, active, c.level - 1),
      renderChildren(c.children, path, route, maxDepth, depth + 1)
    ])
  }))
}

function renderExternal (to, text) {
  return h('a', {
    attrs: {
      href: to,
      target: '_blank',
      rel: 'noopener noreferrer'
    },
    class: {
      'sidebar-link': true
    }
  }, [text, h('OutboundLink')])
}
</script>

<style lang="stylus">
.sidebar .sidebar-sub-headers
  padding-left 1rem
  font-size 0.95em

a.sidebar-link
  font-size 1em
  font-weight 400
  display inline-block
  color $textColor
  border-left 0.25rem solid transparent
  padding 0.35rem 1rem 0.35rem 1.25rem
  line-height 1.4
  width: 100%
  box-sizing: border-box
  &:hover
    color $accentColor
  &.active
    font-weight 600
    color $accentColor
    border-left-color $accentColor
  .sidebar-group &
    padding-left 2rem
  .sidebar-sub-headers &
    padding-top 0.25rem
    padding-bottom 0.25rem
    border-left none
    &.active
      font-weight 500
</style>
