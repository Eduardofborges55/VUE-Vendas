<template>
  <v-app>
    <Navbar ref="navbar" />
    <v-main>
      <router-view />
    </v-main>
  </v-app>
</template>

<script setup lang="ts">
import { ref } from 'vue' 
import Navbar from './components/Navbar/Navbar.vue'

const navbar = ref()
</script>
