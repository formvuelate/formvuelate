<script setup>
// Presentational shell for the in-doc demos: a bordered "widget" card with a
// Demo / Code tab bar. The live playground goes in the #demo slot; the source
// snippet goes in the #code slot (a fenced code block in markdown, highlighted
// by VitePress at build time). v-show keeps the demo mounted so its form state
// survives toggling to Code and back.
import { ref, computed, useSlots } from 'vue'

const slots = useSlots()
const hasCode = computed(() => !!slots.code)
const tab = ref('demo')
</script>

<template>
  <div class="fvl-demo-card">
    <div class="fvl-demo-card__tabs" role="tablist">
      <button
        type="button"
        class="fvl-demo-card__tab"
        :class="{ 'is-active': tab === 'demo' }"
        @click="tab = 'demo'"
      >
        Demo
      </button>
      <button
        v-if="hasCode"
        type="button"
        class="fvl-demo-card__tab"
        :class="{ 'is-active': tab === 'code' }"
        @click="tab = 'code'"
      >
        Code
      </button>
    </div>

    <div class="fvl-demo-card__body">
      <div v-show="tab === 'demo'">
        <slot name="demo" />
      </div>
      <div v-show="hasCode && tab === 'code'" class="fvl-demo-card__code">
        <slot name="code" />
      </div>
    </div>
  </div>
</template>
