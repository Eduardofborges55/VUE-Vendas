<template>
  <v-container class="py-6">
    <!-- 🏷️ Título -->
    <h1 class="text-h4 mb-2 text-center">Anúncios</h1>
    <p class="text-subtitle-1 text-center mb-6">Anuncie seus itens facilmente</p>

    <!-- 🧾 Formulário de anúncio -->
    <v-form @submit.prevent="adicionarProduto" class="form-card pa-4 mb-8">
      <v-row dense>
        <v-col cols="12" sm="6" md="4">
          <v-text-field v-model="produto.nome" label="Nome do Produto" outlined required />
        </v-col>

        <v-col cols="12" sm="6" md="4">
          <v-text-field v-model="produto.preco" label="Preço" type="number" outlined required />
        </v-col>

        <v-col cols="12" md="4">
          <v-select
            v-model="produto.categoria"
            :items="categorias"
            label="Categoria"
            variant="outlined"
            density="comfortable"
          />
        </v-col>

        <v-col cols="12">
          <v-textarea
            v-model="produto.descricao"
            label="Descrição"
            variant="outlined"
            rows="2"
          />
        </v-col>

        <v-col cols="12" sm="6">
          <v-file-input
            v-model="produto.img"
            label="Imagem"
            accept="image/*"
            prepend-icon="mdi-image"
            outlined
          />
        </v-col>

        <v-col cols="12" sm="6" class="d-flex align-center">
          <v-btn type="submit" color="primary" block class="py-3">Adicionar Produto</v-btn>
        </v-col>
      </v-row>
    </v-form>

    <v-divider class="my-6" />

    <!-- 🛒 Lista de produtos -->
    <h2 class="text-h5 mb-4 text-center">Seus Anúncios</h2>

    <v-row v-if="produtos.length > 0" dense>
      <v-col
        v-for="(p, i) in produtos"
        :key="i"
        cols="12"
        sm="6"
        md="4"
        lg="3"
        class="d-flex"
      >
        <v-card elevation="3" class="w-100">
          <v-img :src="p.imagem" height="160" cover class="bg-grey-lighten-2" />
          <v-card-title class="text-h6">{{ p.nome }}</v-card-title>

          <v-card-text>
            <div class="text-primary font-weight-medium mb-2">
              R$ {{ p.preco.toFixed(2) }}
            </div>
            <v-chip color="success" size="small" class="mb-2">{{ p.categoria }}</v-chip>
            <p class="text-body-2">{{ p.descricao }}</p>
          </v-card-text>
        </v-card>
      </v-col>
    </v-row>

    <div v-else class="text-center mt-6">
      <v-icon size="60" color="grey lighten-1">mdi-package-variant</v-icon>
      <p class="text-h6 grey--text">Nenhum produto anunciado ainda</p>
    </div>
  </v-container>
</template>

<script setup lang="ts">
import { ref, onMounted } from "vue";
import produtoService, { Produto as ProdutoBase } from "../../services/produtoService";
import axios from "axios";

type Produto = ProdutoBase & { categoria: string };

const produtos = ref<Produto[]>([]);
const categorias = ref([
  "Eletrônicos",
  "Roupas",
  "Livros",
  "Games",
  "Esportes",
  "Casa e Jardim"
]);

const produto = ref<Omit<Produto, "img"> & { img: File | null }>({
  id: 0,
  nome: "",
  preco: 0,
  descricao: "",
  imagem: "",
  categoria: "",
  quantidade: 0,
  img: null,
});

onMounted(async () => {
  const lista = await produtoService.listar();
  produtos.value = lista.map(p => ({ ...p, categoria: (p as any).categoria ?? "" }));
});

async function adicionarProduto() {
  try {
    if (produto.value.img && produto.value.img instanceof File) {
      const reader = new FileReader();
      reader.onload = async (e) => {
        const base64Img = e.target?.result as string;
        if (!base64Img) return;

        const response = await axios.post("http://localhost:5212/api/produto", {
          ...produto.value,
          img: base64Img,
        });

        if ([200, 201].includes(response.status)) console.log("✅ Produto adicionado com sucesso");
        limparFormulario();
      };
      reader.readAsDataURL(produto.value.img);
    } else {
      const response = await axios.post("http://localhost:5212/api/produto", { ...produto.value });
      if ([200, 201].includes(response.status)) console.log("✅ Produto adicionado com sucesso (sem imagem)");
      limparFormulario();
    }
  } catch (error) {
    console.error("Erro ao adicionar produto:", error);
  }
}

async function limparFormulario() {
  produto.value = {
    id: 0,
    nome: "",
    preco: 0,
    descricao: "",
    imagem: "",
    categoria: "",
    quantidade: 0,
    img: null,
  };
  const lista = await produtoService.listar();
  produtos.value = lista.map(p => ({ ...p, categoria: (p as any).categoria ?? "" }));
}
</script>

<style scoped>
.form-card {
  background: #fafafa;
  border-radius: 12px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.05);
}

.v-card {
  transition: transform 0.2s ease;
}

.v-card:hover {
  transform: translateY(-4px);
}

@media (max-width: 600px) {
  h1 {
    font-size: 1.6rem;
  }
  h2 {
    font-size: 1.3rem;
  }
  .v-btn {
    font-size: 0.9rem;
  }
}
</style>
