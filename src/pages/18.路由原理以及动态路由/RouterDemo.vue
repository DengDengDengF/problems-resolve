<script setup>
import {ref, computed} from 'vue'
import Home from '../../components/RouterDemo/Home.vue'
import About from '../../components/RouterDemo/About.vue'
import NotFound from '../../components/RouterDemo/NotFound.vue'


const routes = {
  '/': Home,
  '/about': About
}

const currentPath = ref(window.location.hash);

window.addEventListener('hashchange', () => {
  currentPath.value = window.location.hash
})


const currentView = computed(() => {
  return routes[currentPath.value.slice(1) || '/'] || NotFound
})
</script>
<template>
  <a href="#/">Home</a> |
  <a href="#/about">About</a> |
  <a href="#/non-existent-path">Broken Link</a>

  <component :is="currentView"/>
</template>