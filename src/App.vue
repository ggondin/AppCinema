<template>
  <div id="background-image"></div> <!-- Adicione esta linha -->
  <AppHeader msg="header component" />
  <router-view />
  <AppFooter />
</template>

<script>
import AppHeader from './components/Header.vue';
import AppFooter from './components/Footer.vue'

export default {
  name: 'App',
  components: {
    AppHeader,
    AppFooter
  }
}
</script>

<style>
#app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
}
#background-image {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 80vh;
  background-image: url('./assets/backgropund-krists-luhaers-unsplash.png');
  background-repeat: no-repeat;
  background-size: cover;
  z-index: -1;
}
body {
  font-family: 'Inter', sans-serif;
  background-color: #121113;
}
</style>
