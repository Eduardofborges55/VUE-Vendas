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
import { useAuthStore } from '../../stores/auth'

interface UserProfile {
  id: number | null
  nome: string
  email: string
  telefone: string
  photoUrl: string
}

const router = useRouter()
const authStore = useAuthStore()

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

// Carrega dados do usuário baseado no JWT
const loadUserProfileFromJWT = () => {
  if (!authStore.isAuthenticated || !authStore.userId) {
    return
  }

  // Tenta carregar a foto do localStorage (se foi salva anteriormente)
  const savedUser = localStorage.getItem('user')
  let photoUrl = ''
  
  if (savedUser) {
    try {
      const parsed = JSON.parse(savedUser)
      photoUrl = parsed.photoUrl || ''
    } catch (e) {
      console.error('Erro ao ler dados salvos:', e)
    }
  }

  // Popula o perfil com dados do JWT
  userProfile.value = {
    id: authStore.userId,
    nome: authStore.userName || 'Usuário',
    email: authStore.userEmail || '',
    telefone: authStore.userPhone || '',
    photoUrl: authStore.userPhoto || photoUrl
  }
  console.log('Perfil carregado:', authStore.userPhoto)
}

// Upload de imagem
const handleImageUpload = async (event: Event) => {
  const file = (event.target as HTMLInputElement).files?.[0]
  if (!file) return

  // Validação do tipo de arquivo
  if (!file.type.startsWith('image/')) {
    alert('Por favor, selecione apenas arquivos de imagem')
    return
  }

  // Validação do tamanho (máximo 5MB)
  const maxSize = 5 * 1024 * 1024 // 5MB
  if (file.size > maxSize) {
    alert('A imagem deve ter no máximo 5MB')
    return
  }

  // Verifica se o usuário tem ID válido
  if (!userProfile.value.id) {
    alert('ID do usuário não encontrado. Por favor, recarregue a página.')
    return
  }

  const reader = new FileReader()
  reader.onload = async (e) => {
    const base64 = e.target?.result as string
    userProfile.value.photoUrl = base64
    
    // Salva no backend - envia todos os campos obrigatórios
    try {
      await axios.patch(
        `http://localhost:5212/auth/Update/${userProfile.value.id}`,
        {
          id: userProfile.value.id,
          nome: userProfile.value.nome,
          email: userProfile.value.email,
          telefone: userProfile.value.telefone,
          imagemBase64: base64
        },
        { headers: { Authorization: `Bearer ${authStore.token}` } }
      )
      
      // Atualiza localStorage apenas após sucesso
      const userData = { ...userProfile.value }
      localStorage.setItem('user', JSON.stringify(userData))
      
      alert('Foto atualizada com sucesso!')
    } catch (error: any) {
      console.error('Erro ao salvar imagem:', error)
      const errorMessage = error.response?.data?.message || error.message || 'Erro ao atualizar foto'
      alert(`Erro ao atualizar foto: ${errorMessage}`)
      // Reverte a mudança visual em caso de erro
      const savedUser = localStorage.getItem('user')
      if (savedUser) {
        const parsed = JSON.parse(savedUser)
        userProfile.value.photoUrl = parsed.photoUrl || ''
      }
    }
  }

  reader.onerror = () => {
    alert('Erro ao ler o arquivo. Tente novamente.')
  }

  reader.readAsDataURL(file)
}

onMounted(() => {
  // Garante que o token está carregado na store
  if (!authStore.token) {
    authStore.loadFromToken()
  }

  // Verifica autenticação usando a store
  if (!authStore.isAuthenticated || !authStore.userId) {
    alert('Usuário não autenticado')
    router.push('/login')
    return
  }

  // Carrega dados do perfil baseado no JWT
  loadUserProfileFromJWT()
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
        imagemBase64: userProfile.value.photoUrl
      },
      {
        headers: { Authorization: `Bearer ${authStore.token}` }
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