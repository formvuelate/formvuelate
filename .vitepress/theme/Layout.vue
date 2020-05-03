<template>
  <div
    class="theme-container"
    :class="pageClasses"
    @touchstart="onTouchStart"
    @touchend="onTouchEnd"
  >
    <!-- <Navbar
      v-if="shouldShowNavbar"
      @toggle-sidebar="toggleSidebar"
    /> -->

    <div
      class="sidebar-mask"
      @click="toggleSidebar(false)"
    />

    <Sidebar
      :items="sidebarItems"
      @toggle-sidebar="toggleSidebar"
    >
      <template #top>
        <slot name="sidebar-top" />
      </template>
      <template #bottom>
        <slot name="sidebar-bottom" />
      </template>
    </Sidebar>

    <!-- <Home v-if="$page.frontmatter.home" /> -->

    <Page
      :sidebar-items="sidebarItems"
    >
      <template #top>
        <slot name="page-top" />
      </template>
      <template #bottom>
        <slot name="page-bottom" />
      </template>
    </Page>
  </div>
  <Debug/>
</template>

<script>
import Page from './components/Page.vue'
import Sidebar from './components/Sidebar.vue'
import { resolveHeaders } from './utils.js'

export default {
  name: 'Layout',

  components: {
    // Home,
    Page,
    Sidebar,
    // Navbar
  },

  data () {
    return {
      isSidebarOpen: false
    }
  },

  computed: {
    shouldShowNavbar () {
      const { themeConfig } = this.$site
      const { frontmatter } = this.$page
      if (
        frontmatter.navbar === false
        || themeConfig.navbar === false) {
        return false
      }
      return (
        this.$site.$title
        || themeConfig.logo
        || themeConfig.repo
        || themeConfig.nav
      )
    },

    shouldShowSidebar () {
      const { frontmatter } = this.$page
      return (
        !frontmatter.home
        && frontmatter.sidebar !== false
        && this.sidebarItems.length
      )
    },

    sidebarItems () {
      return resolveHeaders(this.$page)
      // return resolveSidebarItems(
      //   this.$page,
      //   this.$page.regularPath,
      //   this.$site
      // )
    },

    pageClasses () {
      const userPageClass = this.$page.frontmatter.pageClass
      return [
        {
          'no-navbar': !this.shouldShowNavbar,
          'sidebar-open': this.isSidebarOpen,
          'no-sidebar': !this.shouldShowSidebar
        },
        userPageClass
      ]
    }
  },

  methods: {
    toggleSidebar (to) {
      this.isSidebarOpen = typeof to === 'boolean' ? to : !this.isSidebarOpen
      this.$emit('toggle-sidebar', this.isSidebarOpen)
    },

    // side swipe
    onTouchStart (e) {
      this.touchStart = {
        x: e.changedTouches[0].clientX,
        y: e.changedTouches[0].clientY
      }
    },

    onTouchEnd (e) {
      const dx = e.changedTouches[0].clientX - this.touchStart.x
      const dy = e.changedTouches[0].clientY - this.touchStart.y
      if (Math.abs(dx) > Math.abs(dy) && Math.abs(dx) > 40) {
        if (dx > 0 && this.touchStart.x <= 80) {
          this.toggleSidebar(true)
        } else {
          this.toggleSidebar(false)
        }
      }
    }
  }
}
</script>

<style lang="stylus">
@require './styles/index.styl'

.theme-container {
  font-family: Arial, Helvetica, sans-serif;
}

* {
  box-sizing: border-box;
}

.theme-default-content:not(.custom) {
  max-width: 100%;
}

.schema-form {
  width: 350px;
  margin: 20px 0;
  text-align: left;

  label {
    font-weight: bold;
    font-size: 0.9rem;
    display: block;
  }

  input {
    padding: 8px 10px;
    border-radius: 3px;
    border: 1px solid #ccc;
    margin-bottom: 1rem;
    width: 100%;
    font-size: 1rem;
  }

  input[type='checkbox'] {
    width: auto;
  }

  select {
    width: 100%;
    margin-bottom: 1rem;
    border: 1px solid #ccc;
    border-radius: 3px;
    padding: 8px 10px;
    font-size: 1rem;
    -webkit-appearance: none;
    -moz-appearance: none;
    background-color: white;
    background-image: linear-gradient(45deg, transparent 50%, gray 50%), linear-gradient(135deg, gray 50%, transparent 50%), linear-gradient(to right, #ccc, #ccc);
    background-position: calc(100% - 20px) calc(1em + 0px), calc(100% - 15px) calc(1em + 0px), calc(100% - 2.5em) 0.4em;
    background-size: 5px 5px, 5px 5px, 1px 1.5em;
    background-repeat: no-repeat;
  }
}
</style>
