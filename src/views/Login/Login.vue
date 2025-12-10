<template>
  <v-container>
    <h1>Logue-se</h1>
    <p>acesse a sua conta e Dashboard</p>
    
    <v-form @submit.prevent="handleLogin" :disabled="loading">
      <v-text-field 
        v-model="formData.email"
        label="Email"
        :rules="[rules.required, rules.email]"
        required
      />
      <v-text-field 
        v-model="formData.senha"
        label="Senha"
        type="password"
        :rules="[rules.required]"
        required
      />
      <v-btn 
        type="submit" 
        color="primary"
        :loading="loading"
        block
      >
        {{ loading ? 'Entrando...' : 'Login' }}
      </v-btn>
    </v-form>

    <v-snackbar
      v-model="snackbar.show"
      :color="snackbar.color"
      timeout="3000"
    >
      {{ snackbar.message }}
    </v-snackbar>
  </v-container>
</template>

<script setup>
import { ref, reactive, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import axios from 'axios'

import { useAuthStore } from '../../stores/auth'

const API_URL = 'http://localhost:5212/auth/login'
const router = useRouter()
const authStore = useAuthStore()
const loading = ref(false)

const formData = reactive({
  email: '',
  senha: ''
})

const snackbar = reactive({
  show: false,
  message: '',
  color: 'success'
})

const rules = {
  required: v => !!v || 'Campo obrigatório',
  email: v => /.+@.+\..+/.test(v) || 'Email inválido'
}

const handleLogin = async () => {
  loading.value = true
  
  try {
    console.log('Enviando dados de login:', formData)
    const response = await axios.post(`${API_URL}`, {
      Email: formData.email,
      Password: formData.senha
    })

    const { token, user } = response.data

    // Usa a store centralizada para setar o token
    authStore.setToken(token)
    
    // Salva dados do usuário no localStorage (se necessário)
    if (user) {
      localStorage.setItem('user', JSON.stringify(user))
    }

    snackbar.color = 'success'
    snackbar.message = 'Login realizado com sucesso!'
    snackbar.show = true
    
    // Redirect to home
    window.location.href = '/home'

  } catch (error) {
    snackbar.color = 'error'
    snackbar.message = error.response?.data?.message || 'Erro ao fazer login'
    snackbar.show = true
    
    console.error('Login error:', error)
  } finally {
    loading.value = false
  }
}


</script>

<style scoped>
.v-container {
  max-width: 450px;
  margin: 2rem auto;
}

.v-form {
  margin-top: 2rem;
}

.google-wrapper {
  width: 100%;
  display: flex;
}

.google-wrapper > div {
  width: 100%; /* força o botão do Google a ocupar toda a largura */
}
</style>