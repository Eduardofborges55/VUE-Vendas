<script setup>
import { ref, onMounted } from "vue"

const compras = ref([])

onMounted(() => {
  compras.value = JSON.parse(localStorage.getItem("minhasCompras") || "[]")
})
</script>

<template>
  <v-container class="py-10">
    <h2 class="text-h5 mb-6">Minhas Compras</h2>

    <v-alert type="info" v-if="compras.length === 0">
      Você ainda não fez nenhuma compra.
    </v-alert>

    <v-list v-else>
      <v-list-item
        v-for="compra in compras"
        :key="compra.id"
        class="mb-4"
      >
        <v-card class="pa-4" elevation="4">
          
          <h3 class="text-h6">Compra #{{ compra.id }}</h3>

          <p><strong>Total:</strong> R$ {{ compra.total.toFixed(2) }}</p>
          <p><strong>Data:</strong> {{ compra.data }}</p>

          <h4 class="text-subtitle-2 mt-3">Itens:</h4>

          <ul>
            <li v-for="item in compra.itens" :key="item.id">
              {{ item.nome }} — {{ item.quantidade }}x (R$ {{ item.preco }})
            </li>
          </ul>

        </v-card>
      </v-list-item>
    </v-list>
  </v-container>
</template>
