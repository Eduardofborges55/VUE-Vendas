<template>
  <v-container>
    <h1 class="text-h4 mb-4">Home</h1>
    <p class="text-subtitle-1 mb-6">Procure produtos e compre com facilidade.</p>

    <!-- Search and Filter Section -->
    <v-row class="mb-4">
      <v-col cols="12" sm="6">
        <v-text-field
          v-model="search"
          label="Buscar produtos"
          prepend-inner-icon="mdi-magnify"
          variant="outlined"
          density="comfortable"
        />
      </v-col>
    </v-row>

    <!-- Products Grid -->
    <v-row>
      <v-col
        v-for="produto in produtos"
        :key="produto.Id"
        cols="12"
        sm="6"
        md="4"
        lg="3"
      >
        <v-card elevation="2" height="100%">
          <v-img
            src="https://m.media-amazon.com/images/I/61Li7rC13PL._AC_SX679_.jpg"
            height="150"
            cover
            class="bg-grey-lighten-2"
          />
          
          <v-card-title class="text-h6">
            {{ produto.Nome }}
          </v-card-title>

          <v-card-text>
            <div class="text-h6 text-primary mb-2">
              R$ {{ produto.Preco.toFixed(2) }}
            </div>
            <div class="mb-2">
              <v-chip size="small" color="success" class="mr-2">
                {{ produto.Quantidade }} em estoque
              </v-chip>
            </div>
            <p class="text-body-2">{{ produto.Descricao || 'Sem descrição disponível' }}</p>
          </v-card-text>

          <v-card-actions>
            <v-btn variant="outlined" color="primary" block>
              Ver detalhes
            </v-btn>
          </v-card-actions>
        </v-card>
      </v-col>
    </v-row>

    <!-- Loading State -->
    <v-row v-if="loading">
      <v-col cols="12" class="text-center">
        <v-progress-circular
          indeterminate
          color="primary"
        />
      </v-col>
    </v-row>
  </v-container>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import produtoService, { Produto } from '../../services/produtoService'
const produtos = ref<Produto[]>([])
const loading = ref(true)
const search = ref('')

// Produtos de demonstração
const produtosDemo: Produto[] = [
  {
    Id: 2,
    Nome: 'Smartphone Motorola G9 Plus',
    Descricao: 'Um excelente smartphone com ótimo custo-benefício',
    Preco: 1299.99,
    Quantidade: 10
  }
]

onMounted(async () => {
  try {
    loading.value = true
    // Busca produtos da API
    const response = await produtoService.listar()
    produtos.value = response

    // Se não houver produtos, adiciona os produtos de demonstração
    if (produtos.value.length === 0) {
      produtos.value = produtosDemo
    }
  } catch (error) {
    console.error('Erro ao carregar produtos:', error)
    // Em caso de erro, mostra os produtos de demonstração
    produtos.value = produtosDemo
  } finally {
    loading.value = false
  }
})
</script>

<style scoped>
.v-card {
  transition: transform 0.2s;
}

.v-card:hover {
  transform: translateY(-5px);
}
</style>