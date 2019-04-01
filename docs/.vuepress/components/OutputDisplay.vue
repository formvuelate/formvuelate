<template>
  <div class="output">
      <ul>
        <li
          v-for="(value, prop) in data"
          :key="prop"
        >
          <template v-if="typeof value !== 'object'">
            {{ prop }}: {{ value }}
          </template>

          <template v-else>
            <OutputDisplay :data="value" />
          </template>
        </li>
      </ul>
    </div>
</template>

<script>
export default {
  props: {
    data: { type: Object, required: true }
  }
}
</script>

<style lang="stylus">
.output
  max-width: 35rem
  ul
    list-style: none
    padding-left: 0
</style>
