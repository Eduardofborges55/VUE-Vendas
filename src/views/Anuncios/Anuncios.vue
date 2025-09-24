<template>
<v-container>
<h1>Anuncios</h1>
<p>Anuncie seus itens</p>
<v-form @submit.prevent="adicionarProduto">
    <v-text-field v-model="produto.nome" label="Nome" />
    <v-text-field v-model="produto.preco" label="Preço" type="number" />
    <v-text-field v-model="produto.quantidade" label="Quantidade" type="Quantidade"/>
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
      </tr>
    </thead>
    <tbody>
        <tr v-for="(p, i) in produtos":key="i">
          <td>{{ p.nome }}</td>
          <td>{{ p.descricao }}</td>
          <td>{{ p.preco }}</td>
          <td>{{ p.quantidade }}</td>
        </tr>
    </tbody>
   </v-table>
</v-container>
</template>

<script setup lang="ts">
import {ref, onMounted } from 'vue'
import produtoService, { Produto } from '../../services/produtoService'

const produtos = ref<Produto[]>([])
const produto = ref<Produto>({ nome: '', preco: 0, descricao: '', quantidade: 0 })

onMounted(async () => {
    produtos.value = await produtoService.listar()
})

async function adicionarProduto() {
    await produtoService.salvar(produto.value)
    produto.value= { nome: '', preco: 0, descricao: '', quantidade: 0 }
    produtos.value = await produtoService.listar()
}
</script>