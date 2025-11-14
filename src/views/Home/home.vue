<template>
  <v-container class="py-6">
    <h1 class="text-h4 mb-4 text-center text-md-left">Home</h1>
    <p class="text-subtitle-1 mb-6 text-center text-md-left">
      Procure produtos e compre com facilidade.
    </p>

    <p>Bem-vindo, {{ auth.isAdmin }}</p>

    <!-- 🔍 Busca, categoria e preço -->
    <v-row class="mb-4" align="center" justify="center">
      <v-col cols="12" sm="6" md="4">
        <v-text-field
          v-model="search"
          label="Buscar produtos"
          prepend-inner-icon="mdi-magnify"
          variant="outlined"
          density="comfortable"
          hide-details
        />
      </v-col>

      <v-col cols="12" sm="6" md="3">
        <v-select
          v-model="selectedCategory"
          :items="categories"
          label="Filtrar por categoria"
          variant="outlined"
          density="comfortable"
          hide-details
        />
      </v-col>

      <v-col cols="12" sm="6" md="3">
        <v-select
          v-model="selectedPriceRange"
          :items="priceRanges"
          label="Faixa de preço"
          variant="outlined"
          density="comfortable"
          hide-details
        />
      </v-col>
    </v-row>

    <!-- 🛍️ Grid de produtos -->
    <v-row dense>
      <v-col
        v-for="produto in filteredProducts"
        :key="produto.id"
        cols="12"
        sm="6"
        md="4"
        lg="3"
        class="d-flex"
      >
        <v-card elevation="2" class="product-card flex-grow-1">
          <v-img
            :src="produto.imagem"
            height="180"
            cover
            class="bg-grey-lighten-3"
          />

          <v-card-title class="text-h6 text-truncate">
            {{ produto.nome }}
          </v-card-title>

          <v-card-text class="pb-0">
            <div class="text-h6 text-primary mb-1">
              R$ {{ produto.preco.toFixed(2) }}
            </div>

            <v-chip
              size="small"
              color="success"
              class="mb-2"
              variant="flat"
              v-if="produto.categoria"
            >
              {{ produto.categoria }}
            </v-chip>

            <p class="text-body-2 mb-2 truncate-text">
              {{ produto.descricao || 'Sem descrição disponível' }}
            </p>
          </v-card-text>

          <v-card-actions>
            <v-btn
              variant="outlined"
              color="primary"
              block
              @click="addToCart(produto)"
              :disabled="produto.Quantidade === 0"
            >
              <v-icon start>mdi-cart</v-icon>
              Adicionar ao carrinho
            </v-btn>
          </v-card-actions>
        </v-card>
      </v-col>
    </v-row>

    <!-- ⏳ Loading -->
    <v-row v-if="loading">
      <v-col cols="12" class="text-center py-10">
        <v-progress-circular indeterminate color="primary" size="48" />
      </v-col>
    </v-row>

    <!-- ✅ Snackbar -->
    <v-snackbar
      v-model="snackbar.show"
      :color="snackbar.color"
      :timeout="3000"
    >
      {{ snackbar.message }}
      <template v-slot:actions>
        <v-btn variant="text" @click="snackbar.show = false">Fechar</v-btn>
      </template>
    </v-snackbar>
  </v-container>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import produtoService, { Produto } from '../../services/produtoService'
import { useCartStore } from '../../stores/cartStore'
import { useAuthStore } from '../../stores/auth'

const auth = useAuthStore()

const produtos = ref<(Produto & { categoria?: string })[]>([])
const loading = ref(true)
const search = ref('')
const selectedCategory = ref('Todos')
const selectedPriceRange = ref('Todos')

const categories = ref(['Todos', 'Eletrônicos', 'Roupas', 'Livros', 'Games'])
const priceRanges = ref([
  'Todos',
  '0 a 100',
  '100 a 250',
  '250 a 500',
  '500 a 1000',
  '1000 a 2000',
  '2000 a 3000',
  '3000 a 4000',
  '4000 a 5000'
])

const snackbar = ref({
  show: false,
  message: '',
  color: 'success'
})

// 🧮 Filtro combinado
const filteredProducts = computed(() =>
  produtos.value.filter(produto => {
    const matchSearch =
      produto.nome.toLowerCase().includes(search.value.toLowerCase()) ||
      produto.descricao?.toLowerCase().includes(search.value.toLowerCase())

    const matchCategory =
      selectedCategory.value === 'Todos' ||
      produto.categoria === selectedCategory.value

    const matchPrice = (() => {
      const preco = produto.preco
      switch (selectedPriceRange.value) {
        case '0 a 100':
          return preco >= 0 && preco <= 100
        case '100 a 250':
          return preco > 100 && preco <= 250
        case '250 a 500':
          return preco > 250 && preco <= 500
        case '500 a 1000':
          return preco > 500 && preco <= 1000
        case '1000 a 2000':
          return preco > 1000 && preco <= 2000
        case '2000 a 3000':
          return preco > 2000 && preco <= 3000
        case '3000 a 4000':
          return preco > 3000 && preco <= 4000
        case '4000 a 5000':
          return preco > 4000 && preco <= 5000
        case '5000 a 6000':
          return preco > 5000 && preco <= 6000
        case '6000 a 7000':
          return preco > 6000 && preco <= 7000
        case '7000 a 8000':
          return preco > 7000 && preco <= 8000
        case '8000 a 9000':
          return preco > 8000 && preco <= 9000
        case '9000 a 10000':
          return preco > 9000 && preco <= 10000
        default:
          return true
      }
    })()

    return matchSearch && matchCategory && matchPrice
  })
)

const addToCart = (produto: Produto & { categoria?: string }) => {
  try {
    useCartStore().addToCart(produto)
    showSnackbar('Produto adicionado ao carrinho!', 'success')
  } catch (error) {
    console.error('Erro ao adicionar ao carrinho:', error)
    showSnackbar('Erro ao adicionar ao carrinho', 'error')
  }
}

const showSnackbar = (message: string, color: 'success' | 'error') => {
  snackbar.value = { show: true, message, color }
  setTimeout(() => (snackbar.value.show = false), 3000)
}

onMounted(async () => {
  try {
    loading.value = true
    const response = await produtoService.listar()
    produtos.value = response || []
  } catch (error) {
    console.error('Erro ao buscar produtos:', error)
  } finally {
    loading.value = false
  }

})


</script>

<style scoped>
.product-card {
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  transition: transform 0.25s, box-shadow 0.25s;
  border-radius: 12px;
}
.product-card:hover {
  transform: translateY(-5px);
  box-shadow: 0 8px 20px rgba(0, 0, 0, 0.12);
}

.truncate-text {
  display: -webkit-box;
  -webkit-line-clamp: 2;
  line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
}

.v-card-title {
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

@media (max-width: 960px) {
  .v-card-title {
    font-size: 1rem;
  }
  .text-subtitle-1 {
    font-size: 0.95rem;
  }
}

@media (max-width: 600px) {
  h1 {
    font-size: 1.5rem;
    text-align: center;
  }
  .v-card-title {
    font-size: 0.9rem;
  }
  .v-btn {
    font-size: 0.85rem;
  }
  .v-container {
    padding: 10px;
  }
}
</style>
