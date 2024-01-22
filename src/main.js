import { createApp } from 'vue'
import App from './App.vue'
import { createRouter, createWebHistory } from 'vue-router'
import MainPage from './pages/MainPage.vue';
import MoviePage from './pages/MoviePage.vue'
import tmdbService from './services/tmdbSevice';

import { library } from '@fortawesome/fontawesome-svg-core'
import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome'
import { faUserSecret, faSun } from '@fortawesome/free-solid-svg-icons'

import '@fontsource/inter'
import '@fontsource/roboto'
import "@fontsource/montserrat";


tmdbService.init();

library.add(faUserSecret, faSun)

const routes = [
     { path: '/', component: MainPage },
     { path: '/movie', redirect: '/' },
     { path: '/movie/:id', component: MoviePage }
]

const router = createRouter({
     history: createWebHistory(),
     routes
})

createApp(App)
     .use(router)
     .component('font-awesome-icon', FontAwesomeIcon)
     .mount('#app')
