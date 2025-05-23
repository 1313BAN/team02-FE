<script setup>
import { RouterView } from 'vue-router'
import Header from './components/HeaderComponent.vue'
</script>

<template>
  <Header />
  <RouterView />
</template>

<style>
* {
  margin: 0;
  padding: 0;
  box-sizing: border-box;
}
</style>
