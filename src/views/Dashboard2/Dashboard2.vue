<template>
  <v-container>
    <h1>Dashboard Administrativo</h1>
    <p>Aqui ficam todos os produtos/anúncios cadastrados na plataforma.</p>

    <v-divider class="my-4" />

    <v-alert v-if="loading" type="info">
      Carregando anúncios...
    </v-alert>

    <v-alert v-if="error" type="error">
      {{ error }}
    </v-alert>

    <v-table v-if="anuncios.length > 0">
      <thead>
        <tr>
          <th class="font-weight-bold">Nome</th>
          <th class="font-weight-bold">Descrição</th>
          <th class="font-weight-bold">Preço</th>
          <th class="font-weight-bold">Quantidade</th>
        </tr>
      </thead>

      <tbody>
        <tr v-for="item in anuncios" :key="item.id">
          <td>{{ item.nome }}</td>
          <td>{{ item.descricao }}</td>
          <td>R$ {{ item.preco }}</td>
          <td>{{ item.qtde_estoque }}</td>
        </tr>
      </tbody>
    </v-table>
  </v-container>
</template>
<script setup>
import axios from "axios"
import { ref, onMounted } from "vue"

const anuncios = ref([])
const loading = ref(true)
const error = ref(null)

onMounted(async () => {
  try {
    const token = localStorage.getItem("token")

    if (!token) {
      error.value = "Token não encontrado. Faça login novamente."
      loading.value = false
      return
    }

    axios.defaults.headers.common["Authorization"] = `Bearer ${token}`

    const response = await axios.get("http://localhost:5212/api/produto")

    anuncios.value = response.data
    console.log("Anúncios carregados:", anuncios.value)

  } catch (err) {
    error.value = "Erro ao carregar produtos/anúncios."
    console.error(err)
  } finally {
    loading.value = false
  }
})
</script>
