<template>
  <div>
    <BaseButton class="baseButton" type="button" @click="modalShown = !modalShown">Email</BaseButton>

    <Modal v-if="modalShown">
      <p>Configure your email:</p>
      <FormText label="Title" v-model="values.title" />
      <FormText label="Content" v-model="values.content" />

      <BaseButton @click="save">Save</BaseButton>
      <BaseButton @click="modalShown = false">Cancel</BaseButton>
    </Modal>
  </div>
</template>

<script>
import FormText from './FormText';
import BaseButton from './BaseButton';
import Modal from './Modal';

export default {
  components: { Modal, BaseButton, FormText },
  props: {
    value: { type: Object, required: true },

  },
  data() {
    return {
      modalShown: false,
      values: {
        title: '',
        content: ''
      }
    }
  },
  methods: {
    save() {
      this.$emit('input', {
        ...this.value,
        ...this.values
      });

      this.modalShown = false
    }
  }
}
</script>

<style lang="stylus" scoped>
.baseButton
  margin-bottom: 2rem
</style>
