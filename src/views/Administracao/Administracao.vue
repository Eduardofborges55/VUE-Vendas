<template>
  <v-container>
    <h1>Administração</h1>
    <p>Área para remover anúncios maliciosos, manter a ordem no site e bloquear CPFs suspeitos.</p>

    <v-divider class="my-4"></v-divider>

    <h2>Lista de Usuários</h2>

    <v-alert
      v-if="loading"
      type="info"
      class="mt-4"
    >
      Carregando usuários...
    </v-alert>

    <v-alert
      v-if="error"
      type="error"
      class="mt-4"
    >
      {{ error }}
    </v-alert>

    <v-table v-if="users.length > 0" class="mt-4">
      <thead>
        <tr>
          <th>ID</th>
          <th>Nome</th>
          <th>Email</th>
          <th>Telefone</th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="user in users" :key="user.id">
          <td>{{ user.id }}</td>
          <td>{{ user.nome }}</td>
          <td>{{ user.email }}</td>
          <td>{{ user.telefone }}</td>
        </tr>
      </tbody>
    </v-table>
  </v-container>
</template>
<script setup>
import axios from 'axios'
import { ref, onMounted } from 'vue'

// estados reativos
const users = ref([])
const loading = ref(true)
const error = ref(null)

onMounted(async () => {
  try {
    const token = localStorage.getItem("token")
    const user = localStorage.getItem("user")

    if (!token) {
      error.value = "Token não encontrado! Faça login novamente."
      loading.value = false
      return
    }

    // seta o token no axios
    axios.defaults.headers.common['Authorization'] = `Bearer ${token}`

    const response = await axios.get("http://localhost:5212/auth/GetAllUsers")

    users.value = response.data
    console.log("Usuários recebidos:", users.value)
  } 
  catch (err) {
    error.value = "Erro ao carregar usuários."
    console.error(err)
  } 
  finally {
    loading.value = false
  }
})
</script>
