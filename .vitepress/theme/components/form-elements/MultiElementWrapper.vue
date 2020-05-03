<template>
  <div>
    <FormText label="Favorite color" :value="form.color" @input="textInput('color', $event)"></FormText>
    <FormText label="Favorite song" :value="form.song" @input="textInput('song', $event)"></FormText>
  </div>
</template>

<script>
import FormText from './FormText'

export default {
  components: { FormText },
  data () {
    return {
      form: {
        color: '',
        song: ''
      }
    }
  },
  methods: {
    textInput (field, e) {
      this.$set(this.form, field, e)
      this.$emit('update-batch', this.form)
    }
  }
}
</script>
