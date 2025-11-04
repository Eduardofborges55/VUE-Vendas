<template>
    <h1>Obrigado pela sua compra!</h1>

    <button @click="goToStore">
        Voltar à loja
    </button>
</template>

<script setup lang="ts">
import { ref } from 'vue'

function goToStore() {
    setTimeout(() => {
        window.location.href = '/';
    }, 1000);
}
</script>