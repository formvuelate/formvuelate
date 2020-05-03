<template>
  <button v-on="$listeners" type="button"><slot/></button>
</template>

<style lang="stylus" scoped>
button
  color: #fff;
  background: #3eaf7c;
  padding: 12px 24px;
  font-size: 14px;
  border: none
</style>
