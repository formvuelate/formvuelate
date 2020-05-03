<template>
  <div class="curtain">
    <div class="modal">
      <slot/>
    </div>
  </div>
</template>

<style lang="stylus" scoped>
  .curtain
    position: fixed
    top: 0
    left: 0
    right: 0
    bottom: 0
    background-color: rgba(0,0,0,.5)
    display: flex
    align-items: center
    justify-content: center
    z-index: 100
  .modal
    background-color: white
    width: 80%
    margin: 0 auto
    padding: 2rem
</style>
