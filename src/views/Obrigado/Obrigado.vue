<template>
  <v-container
    class="fill-height d-flex flex-column align-center justify-center text-center"
  >
    <transition name="fade">
      <div v-if="showPage">
        <h1 class="mb-4">🎉 Obrigado pela sua compra!</h1>
        <p class="text-subtitle-1 mb-6">Agradecemos por testar o sistema 😊</p>

        <v-btn color="primary" @click="goToStore">
          Voltar à loja
        </v-btn>
      </div>
    </transition>
  </v-container>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'

const showPage = ref(true)

function goToStore() {
  showPage.value = false
  setTimeout(() => {
    window.location.href = '/'
  }, 1000)
}

onMounted(() => {
  // Transição automática após 10 segundos
  setTimeout(() => {
    goToStore()
  }, 10000)
})
</script>

<style scoped>
.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.8s ease;
}
.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}
</style>
