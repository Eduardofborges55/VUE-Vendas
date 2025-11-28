<template>
  <v-container>
    <h1>Cadastro</h1>
    <p>Acesse a sua conta e Dashboard</p>

    <v-form @submit.prevent="salvarUsuario">
      <v-text-field v-model="usuario.nome" label="Nome" />
      <v-text-field v-model="usuario.email" label="Email" />
      <v-text-field v-model="usuario.password" label="Senha" type="password" />
      <v-text-field v-model="usuario.telefone" label="Telefone" />
      <v-text-field v-model="usuario.cpf" label="CPF" />
      <v-text-field v-model="usuario.data_nascimento" label="Data de Nascimento" type="date" />
      <v-btn type="submit" color="primary">Cadastrar</v-btn>
    </v-form>
  </v-container>
</template>

<script setup lang="ts">
import { computed, h, ref } from 'vue'
import usuarioService, { Usuario } from '../../services/usuarioService.ts'
import axios, { AxiosError } from 'axios'
const checkMin = computed(() => usuario.value.password.length >= 8)
const checkUpper = computed(() => /[A-Z]/.test(usuario.value.password))
const checkLower = computed(() => /[a-z]/.test(usuario.value.password))
const checkNumber = computed(() => /\d/.test(usuario.value.password))
const checkSpecial = computed(() => /[!@#$%^&*(),.?":{}|<>-_]/.test(usuario.value.password))
const isPasswordValid = computed(() => 
  checkMin.value && checkUpper.value && checkLower.value && checkNumber.value && checkSpecial.value
)

async function handleRegister() {
  loading.value = true
  errorMessage.value = ""

  // Verifica se a senha é válida
  if (!isPasswordValid.value) {
    errorMessage.value = "❌ A senha não atende aos requisitos mínimos."
    loading.value = false
    return
  }

  try {
    const response = await axios.post("http://localhost:8000/api/user", formData.value)

    if (response.data.token) {
      localStorage.setItem("token", response.data.token)
    }

    showSuccess.value = true
    
    // Redireciona com delay para ver a animação
    setTimeout(() => {
      window.location.href = "/login"
    }, 2000)
  } catch (error) {
    const axiosError = error as AxiosError
    errorMessage.value = (axiosError.response?.data && typeof axiosError.response.data === 'object' && 'message' in axiosError.response.data)
      ? (axiosError.response.data as { message: string }).message
      : "Falha no cadastro. Verifique os dados."
  } finally {
    loading.value = false
  }
}


// Estado do usuário
const usuario = ref<Usuario>({
  token: '',
  id: 0,
  nome: '',
  cpf: '',
  data_nascimento: '',
  email: '',
  password: '',
  telefone: ''
})

// Estados para o registro
const loading = ref(false)
const errorMessage = ref('')
const showSuccess = ref(false)
const formData = ref(usuario.value)

// Token salvo no localStorage
const token = localStorage.getItem('token') || ''
localStorage.setItem('token', token)

// --- Funções auxiliares ---

async function makeApiRequest() {
  const headers = {
    'Authorization': `Bearer ${token}`
  }

  try {
    const response = await axios.post('http://localhost:5212/', { headers })
    console.log(response.data)
  } catch (error) {
    console.error('Erro ao buscar usuários:', error)
  }
}

// ---- Validação de CPF ----
function validarCPF(cpf: string): boolean {
  cpf = cpf.replace(/\D/g, '')

  if (cpf.length < 11) return false
  if (/^(\d)\1+$/.test(cpf)) return false

  let soma = 0
  for (let i = 0; i < 9; i++) soma += parseInt(cpf.charAt(i)) * (10 - i)
  let resto = (soma * 10) % 11
  if (resto === 10 || resto === 11) resto = 0
  if (resto !== parseInt(cpf.charAt(9))) return false

  soma = 0
  for (let i = 0; i < 10; i++) soma += parseInt(cpf.charAt(i)) * (11 - i)
  resto = (soma * 10) % 11
  if (resto === 10 || resto === 11) resto = 0

  return resto === parseInt(cpf.charAt(10))
}

// ---- Validação de maioridade ----
function isMaiorDeIdade(dataNascimento: string): boolean {
  const hoje = new Date()
  const nascimento = new Date(dataNascimento)

  let idade = hoje.getFullYear() - nascimento.getFullYear()
  const mes = hoje.getMonth() - nascimento.getMonth()

  // Ajuste caso ainda não tenha feito aniversário este ano
  if (mes < 0 || (mes === 0 && hoje.getDate() < nascimento.getDate())) {
    idade--
  }

  return idade >= 18
}

// --- Função principal de salvamento ---
async function salvarUsuario() {

  // Valida CPF
  if (!validarCPF(usuario.value.cpf)) {
    console.error('CPF inválido')
    return
  }

  // Valida maioridade
  if (!isMaiorDeIdade(usuario.value.data_nascimento)) {
    console.error('Usuário precisa ter 18 anos ou mais')
    return
  }

  

  try {
    await usuarioService.CreateUser(usuario.value)
    console.log('Usuário criado com sucesso!')
    makeApiRequest()

    // Limpa o formulário
    usuario.value = {
      token: '',
      id: 0,
      nome: '',
      cpf: '',
      data_nascimento: '',
      email: '',
      password: '',
      telefone: ''
    }
  } catch (error) {
    console.error('Erro ao salvar usuário:', error)
  }
}

handleRegister()
</script>
