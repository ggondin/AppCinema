<template>
  <AppHeader msg="header component" />
  <router-view/>
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
body {
  background-image: url('./assets/backgropund-krists-luhaers-unsplash.png');
  background-repeat: no-repeat;
  background-size: cover;
  height: 50vh;
  font-family: 'Inter', sans-serif;
  background-color: #121113;
}
</style>
