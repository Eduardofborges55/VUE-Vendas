<template>
  <v-container>
    <v-row>
      <v-col cols="12" md="4">
        <v-card class="pa-4">
          <div class="text-center mb-4">
            <v-avatar size="150" color="grey lighten-2">
              <v-img
                :width="300"
                aspect-ratio="16/9"
                cover
                :src="userProfile.photoUrl || 'https://cdn.vuetifyjs.com/images/parallax/material.jpg'"
              ></v-img>
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
              >
                <v-icon>mdi-camera</v-icon>
              </v-btn>
              <!-- <v-icon v-else size="100" color="grey">mdi-account</v-icon> -->
            </v-avatar>
            <h2 class="mt-4">{{ userProfile.nome }}</h2>
            <p class="text-subtitle-1 grey--text">{{ userProfile.email }}</p>
          </div>
          <v-list>
            <v-list-item>
              <v-list-item-title>
                <v-icon start>mdi-phone</v-icon>
                {{ userProfile.telefone }}
              </v-list-item-title>
            </v-list-item>
          </v-list>

          <v-btn 
            color="primary" 
            block 
            class="mt-4"
            @click="editProfile"
          >
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
                  <div class="text-h4 primary--text">{{ stats.totalAnuncios }}</div>
                  <div class="text-subtitle-1">Anúncios Ativos</div>
                </div>
              </v-card>
            </v-col>

            <v-col cols="12" sm="6" md="4">
              <v-card elevation="2" class="pa-4">
                <div class="text-center">
                  <div class="text-h4 success--text">{{ stats.totalVendas }}</div>
                  <div class="text-subtitle-1">Vendas Realizadas</div>
                </div>
              </v-card>
            </v-col>

            <v-col cols="12" sm="6" md="4">
              <v-card elevation="2" class="pa-4">
                <div class="text-center">
                  <div class="text-h4 info--text">{{ stats.avaliacaoMedia }}</div>
                  <div class="text-subtitle-1">Avaliação Média</div>
                </div>
              </v-card>
            </v-col>
          </v-row>

          <!-- Recent Activities -->
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

const router = useRouter()

const userProfile = ref({
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
const base64Image = ref<string | null>(null)

const handleImageUpload = (event: Event) => {
  const file = (event.target as HTMLInputElement).files?.[0]
  if(!file) return

  const reader = new FileReader()
  reader.onload = () => {
    const result = reader.result as string
    base64Image.value = result
    userProfile.value.photoUrl = result
    console.log('Imagem convertida com sucesso!')
  }
  reader.readAsDataURL(file)
}



onMounted(async () => {
  try {
    const userData = localStorage.getItem('user')
    if (userData) {
      const user = JSON.parse(userData)
      userProfile.value = {
        nome: user.nome || 'Usuário',
        email: user.email || 'email@exemplo.com',
        telefone: user.telefone || '(00) 00000-0000',
        photoUrl: user.photoUrl || ''
      }
    }

    
  } catch (error) {
    console.error('Error loading profile:', error)
  }
})

const editProfile = async () => {
  console.log('Editando perfil...');

  try{
    const payload = {
      nome: userProfile.value.nome,
      email: userProfile.value.email,
      telefone: userProfile.value.telefone,
      photoUrl: userProfile.value.photoUrl
    }

    await axios.patch('/api/update-profile', payload)

    console.log('Perfil editado com sucesso!');
    alert('Perfil editado com sucesso!');
  } catch (error) {
    console.error('Erro ao editar perfil:', error);
    alert('Erro ao editar perfil: ' + error);
  }
}
</script>

<style scoped>
.v-card {
  transition: transform 0.2s;
}

.v-card:hover {
  transform: translateY(-2px);
}
.profile-avatar {
  position: relative;
}

.upload-button {
  position: absolute !important;
  bottom: 0;
  right: 0;
  margin: 8px;
}
</style>