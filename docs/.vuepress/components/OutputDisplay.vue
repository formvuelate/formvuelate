<template>
  <div class="output">
    <p>Formatted Output:</p>
    <VueJsonPretty :data="data" />
  </div>
</template>

<script>
import VueJsonPretty from 'vue-json-pretty'
export default {
  components: { VueJsonPretty },
  props: {
    data: { type: Object, required: true }
  }
}
</script>

<style lang="stylus">
.output
  max-width: 35rem
</style>
