<template>
  <div class="theme">
    <header>
      <NavBar />
    </header>
    <aside>
      <SideBar />
    </aside>
    <main>
      <Page />
    </main>
  </div>
  <Debug />
</template>

<script>
import NavBar from './components/NavBar.vue'
import SideBar from './components/SideBar.vue'
import Page from './components/Page.vue'

export default {
  components: {
    NavBar,
    SideBar,
    Page
  }
}
</script>

<style lang="stylus">
.content {
  margin: 0;
  max-width: 56rem;
}

.theme-container {
  font-family: Arial, Helvetica, sans-serif;
}

* {
  box-sizing: border-box;
}

.theme-default-content:not(.custom) {
  max-width: 100%;
}

.schema-form {
  width: 350px;
  margin: 20px 0;
  text-align: left;

  label {
    font-weight: bold;
    font-size: 0.9rem;
    display: block;
  }

  input {
    padding: 8px 10px;
    border-radius: 3px;
    border: 1px solid #ccc;
    margin-bottom: 1rem;
    width: 100%;
    font-size: 1rem;
  }

  input[type='checkbox'] {
    width: auto;
  }

  select {
    width: 100%;
    margin-bottom: 1rem;
    border: 1px solid #ccc;
    border-radius: 3px;
    padding: 8px 10px;
    font-size: 1rem;
    -webkit-appearance: none;
    -moz-appearance: none;
    background-color: white;
    background-image: linear-gradient(45deg, transparent 50%, gray 50%), linear-gradient(135deg, gray 50%, transparent 50%), linear-gradient(to right, #ccc, #ccc);
    background-position: calc(100% - 20px) calc(1em + 0px), calc(100% - 15px) calc(1em + 0px), calc(100% - 2.5em) 0.4em;
    background-size: 5px 5px, 5px 5px, 1px 1.5em;
    background-repeat: no-repeat;
  }
}
</style>
