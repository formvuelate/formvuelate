import { useSiteData, usePageData, useRoute } from 'vitepress';
import { computed, h } from 'vue';
import { useActiveSidebarLinks } from '../composables/activeSidebarLink';
const SideBarItem = (props) => {
  const { item: { link, text, children } } = props;
  return h('li', [
    h('a', { href: link }, text),
    children
      ? h('ul', children.map((c) => h(SideBarItem, { item: c })))
      : null
  ]);
};
export default {
  components: {
    SideBarItem
  },
  setup () {
    const pageData = usePageData();
    const siteData = useSiteData();
    const route = useRoute();
    useActiveSidebarLinks();
    const resolveSidebar = () => {
      const { headers, frontmatter: { sidebar, sidebarDepth = 2 } } = pageData.value;
      if (sidebar === 'auto') {
        // auto, render headers of current page
        return resolveAutoSidebar(headers, sidebarDepth);
      }
      else if (Array.isArray(sidebar)) {
        // in-page array config
        return resolveArraySidebar(sidebar, sidebarDepth);
      }
      else if (sidebar === false) {
        return [];
      }
      else {
        // no explicit page sidebar config
        // check global theme config
        const { sidebar: themeSidebar } = siteData.value.themeConfig;
        if (themeSidebar === 'auto') {
          return resolveAutoSidebar(headers, sidebarDepth);
        }
        else if (Array.isArray(themeSidebar)) {
          return resolveArraySidebar(themeSidebar, sidebarDepth);
        }
        else if (themeSidebar === false) {
          return [];
        }
        else if (typeof themeSidebar === 'object') {
          return resolveMultiSidebar(themeSidebar, route.path, sidebarDepth);
        }
      }
    };
    return {
      items: __DEV__ ? computed(resolveSidebar) : resolveSidebar()
    };
  }
};
function resolveAutoSidebar (headers, depth) {
  const ret = [];
  let lastH2 = undefined;
  headers.forEach(({ level, title, slug }) => {
    if (level - 1 > depth) {
      return;
    }
    const item = {
      text: title,
      link: `#${slug}`
    };
    if (level === 2) {
      lastH2 = item;
      ret.push(item);
    }
    else if (lastH2) {
      ;
      (lastH2.children || (lastH2.children = [])).push(item);
    }
  });
  return ret;
}
function resolveArraySidebar (config, depth) {
  return [];
}
function resolveMultiSidebar (config, path, depth) {
  return [];
}
