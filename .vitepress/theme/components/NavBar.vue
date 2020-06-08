<template>
  <a
    class="title"
    :aria-label="$site.title + ', back to home'"
    :href="$site.base"
  >
    <img
      class="logo"
      v-if="$theme.logo"
      :src="withBase($theme.logo)"
      alt="logo"
    />
    <span>{{ $site.title }}</span>
  </a>
  <nav class="nav-links" v-if="navData">
    <a
      class="nav-link"
      v-for="{ text, link, target, rel, ariaLabel, external = false } of navData"
      :class="{ active: isActiveLink(link) }"
      :href="external ? link : withBase(link)"
      :target="target"
      :rel="rel"
      :aria-label="ariaLabel"
      >
        {{ text }}
        <svg v-if="target === '_blank'" xmlns="http://www.w3.org/2000/svg" aria-hidden="true" x="0px" y="0px" viewBox="0 0 100 100" width="15" height="15" class="icon outbound"><path fill="currentColor" d="M18.8,85.1h56l0,0c2.2,0,4-1.8,4-4v-32h-8v28h-48v-48h28v-8h-32l0,0c-2.2,0-4,1.8-4,4v56C14.8,83.3,16.6,85.1,18.8,85.1z"></path> <polygon fill="currentColor" points="45.7,48.7 51.3,54.3 77.2,28.5 77.2,37.2 85.2,37.2 85.2,14.9 62.8,14.9 62.8,22.9 71.5,22.9"></polygon></svg>
      </a
    >
  </nav>
</template>

<script src="./NavBar"></script>

<style>
.title {
  font-size: 1.3rem;
  font-weight: 600;
  color: var(--text-color);
}

.logo {
  margin-right: 0.75rem;
  height: 1.3rem;
  vertical-align: bottom;
}

.nav-links {
  list-style-type: none;
}

.nav-link {
  color: var(--text-color);
  margin-left: 1.5rem;
  font-weight: 600;
  display: inline-flex;
  align-items: center;
  height: 1.75rem;
  line-height: 1.75rem;
}

.nav-link svg {
  margin-left: 0.5rem;
  color: grey;
}

.nav-link:hover,
.nav-link.active {
  border-bottom: 2px solid var(--accent-color);
}
</style>
