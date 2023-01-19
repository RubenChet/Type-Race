<script setup>
import HeaderVue from './components/Header.vue';
import NavbarVue from './components/Navbar.vue';
// import TextVue from './components/Solo/Solo.vue';
import MultiplayerVue from './components/Multiplayer/Multiplayer.vue';
import { useGameStore } from './store/game'
const game = useGameStore()
</script>

<template>
  <HeaderVue />
  <div v-if="game.isRunning != true">
    <NavbarVue />
  </div>
  <!-- <div v-if="game.mode == 'solo'">
    <TextVue />
  </div> -->
  <MultiplayerVue />
  <!-- <div v-else-if="game.mode == 'multi'">
   
  </div> -->
</template>

<style>
html {
  background-color: #323437;
  color: #646669;
  scroll-behavior: smooth;
}
</style>
