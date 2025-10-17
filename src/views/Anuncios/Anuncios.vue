<template>
  <v-container>
    <h1>Anuncios</h1>
    <p>Anuncie seus itens</p>
    <v-form @submit.prevent="adicionarProduto">
      <v-text-field v-model="produto.nome" label="Nome" />
      <v-text-field v-model="produto.preco" label="Preço" type="number" />
      <v-text-field
        v-model="produto.descricao"
        label="Descrição"
        type="text"
      />
      <v-file-input v-img-model="produto.imagem" label="Imagem" type="file" />
      <v-btn type="submit" color="primary">Adicionar</v-btn>
    </v-form>
    <v-divider class="my-4" />
    <v-table>
      <thead>
        <tr>
          <th class="font-weight-bold">Nome</th>
          <th class="font-weight-bold">Descrição</th>
          <th class="font-weight-bold">Preço</th>
          <th class="font-weight-bold">Quantidade</th>
          <th class="font-weight-bold">Imagem</th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="(p, i) in produtos" :key="i">
          <td>{{ p.nome }}</td>
          <td>{{ p.descricao }}</td>
          <td>{{ p.preco }}</td>
          <td>{{ p.descricao }}</td>
          <td><v-img :src="p.imagem" height="100" contain /></td>
        </tr>
      </tbody>
    </v-table>
  </v-container>
</template>

<script setup lang="ts">
import { ref, onMounted } from "vue";
import produtoService, { Produto } from "../../services/produtoService";
import axios from "axios";
const produtos = ref<Produto[]>([]);
const produto = ref<Omit<Produto, "img"> & { img: File | null }>({
  nome: "",
  preco: 0,
  descricao: "",
  id: 0,
  imagem: "",
  quantidade: 0,
  img: null
});

onMounted(async () => {
  produtos.value = await produtoService.listar();
  console.log('Produtos carregados:', produtos.value);
});

async function adicionarProduto() {
  try {
    // Caso o produto tenha imagem em arquivo
    if (produto.value.img && produto.value.img instanceof File) {
      const reader = new FileReader();

      reader.onload = async (e) => {
        const base64Img = e.target?.result as string;

        if (!base64Img) {
          console.error("Erro ao converter imagem");
          return;
        }

        // Faz o POST (ou chama o serviço)
        const response = await axios.post("http://localhost:5212/api/produto", {
  //        ...produto.value,
          img: base64Img,
        });

        if (response.status === 200 || response.status === 201) {
          console.log("✅ Produto adicionado com sucesso");
        } else {
          console.error("Erro ao adicionar produto:", response.statusText);
        }

        // Limpa o formulário e recarrega lista
        const produto = ref<Omit<Produto, "img"> & { img: File | null }>({
          nome: "",
          preco: 0,
          id: 0,
          descricao: "",
          imagem: "",
          quantidade: 0,
          img: null
        });

        produtos.value = await produtoService.listar();
      };

      reader.readAsDataURL(produto.value.img);
    } else {
      // Caso não tenha imagem, só salva direto
      const response = await axios.post("http://localhost:5212/api/produto", {
        ...produto.value,
      });

      if (response.status === 200 || response.status === 201) {
        console.log("✅ Produto adicionado com sucesso (sem imagem)");
      }

      produto.value = {
        id: 0,
        nome: "",
        preco: 0,
        descricao: "",
        imagem: "",
        quantidade: 0,
        img: null
      };

      produtos.value = await produtoService.listar();
    }
  } catch (error) {
    console.error("Erro ao adicionar produto:", error);
  }
}

</script>
