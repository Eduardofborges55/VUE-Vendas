<template>
  <v-container>
    <v-row>
      <v-col cols="12" md="4">
        <v-card class="pa-4">
          <div class="text-center mb-4">
            <v-avatar size="150" color="grey-lighten-2">
              <v-img
                :src="userProfile.photoUrl || 'https://cdn.vuetifyjs.com/images/parallax/material.jpg'"
                cover
              />
              
              <input
                type="file"
                ref="fileInput"
                accept="image/*"
                style="display: none"
                @change="handleImageUpload"
              />
              
              <v-btn
                icon="mdi-camera"
                size="small"
                color="primary"
                class="upload-button"
                @click="fileInput?.click()"
              />
            </v-avatar>

            <h2 class="mt-4">{{ userProfile.nome }}</h2>
            <p class="text-subtitle-1 text-grey">{{ userProfile.email }}</p>
          </div>

          <v-list>
            <v-list-item>
              <template v-slot:prepend>
                <v-icon>mdi-phone</v-icon>
              </template>
              <v-list-item-title>{{ userProfile.telefone }}</v-list-item-title>
            </v-list-item>
          </v-list>

          <v-btn color="primary" block class="mt-4" @click="editProfile">
            Editar Perfil
          </v-btn>
        </v-card>
      </v-col>

      <v-col cols="12" md="8">
        <v-card class="pa-4">
          <h3 class="text-h5 mb-4">Dashboard</h3>

          <v-row>
            <v-col cols="12" sm="6" md="4">
              <v-card elevation="2" class="pa-4">
                <div class="text-center">
                  <div class="text-h4 text-primary">{{ stats.totalAnuncios }}</div>
                  <div class="text-subtitle-1">Anúncios Ativos</div>
                </div>
              </v-card>
            </v-col>

            <v-col cols="12" sm="6" md="4">
              <v-card elevation="2" class="pa-4">
                <div class="text-center">
                  <div class="text-h4 text-success">{{ stats.totalVendas }}</div>
                  <div class="text-subtitle-1">Vendas Realizadas</div>
                </div>
              </v-card>
            </v-col>

            <v-col cols="12" sm="6" md="4">
              <v-card elevation="2" class="pa-4">
                <div class="text-center">
                  <div class="text-h4 text-info">{{ stats.avaliacaoMedia }}</div>
                  <div class="text-subtitle-1">Avaliação Média</div>
                </div>
              </v-card>
            </v-col>
          </v-row>

          <v-card class="mt-6" elevation="2">
            <v-card-title>Atividades Recentes</v-card-title>
            <v-list>
              <v-list-item
                v-for="activity in recentActivities"
                :key="activity.id"
              >
                <v-list-item-title>{{ activity.description }}</v-list-item-title>
                <v-list-item-subtitle>{{ activity.date }}</v-list-item-subtitle>
              </v-list-item>
            </v-list>
          </v-card>
        </v-card>
      </v-col>
    </v-row>
  </v-container>
</template>

<script setup lang="ts">
import axios from 'axios'
import { ref, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { jwtDecode } from 'jwt-decode'

interface UserProfile {
  id: number | null
  nome: string
  email: string
  telefone: string
  photoUrl: string
}

const router = useRouter()
const token = localStorage.getItem('token')

const userProfile = ref<UserProfile>({
  id: 0,
  nome: '',
  email: '',
  telefone: '',
  photoUrl: ''
})

const stats = ref({
  totalAnuncios: 0,
  totalVendas: 0,
  avaliacaoMedia: 0
})

const recentActivities = ref([
  { id: 1, description: 'Novo produto anunciado', date: '2024-03-20' },
  { id: 2, description: 'Venda realizada', date: '2024-03-19' },
  { id: 3, description: 'Avaliação recebida', date: '2024-03-18' }
])

const fileInput = ref<HTMLInputElement | null>(null)

// Buscar dados do backend
const fetchUserData = async (userId: number) => {
  try {
    const response = await axios.get(`http://localhost:5212/auth/${userId}`, {
      headers: { Authorization: `Bearer ${token}` }
    })
    
    const user = response.data
    userProfile.value = {
      id: user.id,
      nome: user.nome || 'Usuário',
      email: user.email || 'email@exemplo.com',
      telefone: user.telefone || '(00) 00000-0000',
      photoUrl: user.photoUrl || ''
    }
    
    localStorage.setItem('user', JSON.stringify(userProfile.value))
  } catch (error) {
    console.error('Erro ao buscar dados:', error)
    alert('Erro ao carregar dados do usuário')
  }
}

// Upload de imagem
const handleImageUpload = async (event: Event) => {
  const file = (event.target as HTMLInputElement).files?.[0]
  if (!file) return

  const reader = new FileReader()
  reader.onload = async (e) => {
    const base64 = e.target?.result as string
    userProfile.value.photoUrl = base64
    
    // Salva no backend
    try {
      await axios.patch(
        `http://localhost:5212/auth/Update/${userProfile.value.id}`,
        { photoUrl: base64 },
        { headers: { Authorization: `Bearer ${token}` } }
      )
      
      // Atualiza localStorage apenas após sucesso
      const userData = { ...userProfile.value }
      localStorage.setItem('user', JSON.stringify(userData))
      
      alert('Foto atualizada com sucesso!')
    } catch (error) {
      console.error('Erro ao salvar imagem:', error)
      alert('Erro ao atualizar foto')
    }
  }

  reader.readAsDataURL(file)
}

onMounted(() => {
  if (!token) {
    alert('Usuário não autenticado')
    router.push('/login')
    return
  }

  try {
    const decoded = jwtDecode<{ userId: number }>(token)
    fetchUserData(decoded.userId)
  } catch (error) {
    console.error('Token inválido:', error)
    localStorage.clear()
    router.push('/login')
  }
})

// Editar perfil
const editProfile = async () => {
  if (!userProfile.value.id) {
    alert("ID do usuário não encontrado!")
    return
  }

  try {
    await axios.patch(
      `http://localhost:5212/auth/Update/${userProfile.value.id}`,
      {
        id: userProfile.value.id,
        nome: userProfile.value.nome,
        email: userProfile.value.email,
        telefone: userProfile.value.telefone,
        photoUrl: userProfile.value.photoUrl
      },
      {
        headers: { Authorization: `Bearer ${token}` }
      }
    )

    alert('Perfil editado com sucesso!')
  } catch (error) {
    console.error('Erro ao editar:', error)
    alert('Erro ao editar perfil. Tente novamente.')
  }
}
</script>

<style scoped>
.upload-button {
  position: absolute !important;
  bottom: 0;
  right: 0;
  margin: 8px;
}
</style>