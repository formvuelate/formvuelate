<template>
  <div class="output">
    <p>Formatted Output:</p>
    <VueJsonPretty :data="data" v-if="Object.keys(data).length" />
    <div class="no-data" v-else>No data yet!</div>
  </div>
</template>

<script>
import VueJsonPretty from 'vue-json-pretty'
export default {
  components: { VueJsonPretty },
  props: {
    data: { type: [Object, Array], required: true }
  }
}
</script>

<style lang="stylus">
.output
  max-width: 35rem

  .no-data
    color: lightgrey
</style>
