<script setup>
import HeaderVue from './components/Header.vue';
import NavbarVue from './components/Navbar.vue';
import TextVue from './components/Solo.vue';
import MultiVue from './components/ChoseRoom.vue';
import { useGameStore } from './store/game'
const game = useGameStore()
</script>

<template>
  <HeaderVue />
  <NavbarVue />
  <div v-if="game.mode == 'solo'">
    <TextVue />
  </div>
  <div v-else-if="game.mode == 'multi'">
    <MultiVue />
  </div>
</template>

<style>
html {
  background-color: #323437;
  color: #646669;
}
</style>
