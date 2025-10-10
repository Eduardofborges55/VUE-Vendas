<template>
<v-container>
<h1>Anuncios</h1>
<p>Anuncie seus itens</p>
<v-form @submit.prevent="adicionarProduto">
    <v-text-field v-model="produto.Nome" label="Nome" />
    <v-text-field v-model="produto.Preco" label="Preço" type="number" />
    <v-text-field v-model="produto.Quantidade" label="Quantidade" type="Quantidade"/>
    <v-file-input v-model="produto.img" label="Imagem" type="file"/>
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
        <tr v-for="(p, i) in produtos":key="i">
          <td>{{ p.Nome }}</td>
          <td>{{ p.Descricao }}</td>
          <td>{{ p.Preco }}</td>
          <td>{{ p.Quantidade }}</td>
          <td><v-img :src="p.img" height="100" contain /></td>
        </tr>
    </tbody>
   </v-table>
</v-container>
</template>

<script setup lang="ts">
import {ref, onMounted } from 'vue'
import produtoService, { Produto } from '../../services/produtoService'

const produtos = ref<Produto[]>([])
const produto = ref<Produto>({
  Nome: '', Preco: 0, Descricao: '', Quantidade: 0,
  Id: 0
})

onMounted(async () => {
    produtos.value = await produtoService.listar()
})

async function adicionarProduto() {
    await produtoService.salvar(produto.value)
    produto.value= { Id: 0, Nome: '', Preco: 0, Descricao: '', Quantidade: 0 , img: '' }
    produtos.value = await produtoService.listar()
}
</script>