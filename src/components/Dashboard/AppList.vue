<template>
  <v-container>
    <h2>Cadastro de Produtos</h2>
    <v-form @submit.prevent="adicionarProduto">
      <v-text-field v-model="produto.nome" label="Nome" />
      <v-text-field v-model="produto.preco" label="Preço" type="number" />
      <v-text-field v-model="produto.quantidade" label="Quantidade" type="number" />
      <v-btn type="submit" color="primary">Adicionar</v-btn>
    </v-form>
    <v-divider class="my-4" />
    <v-table>
      <thead>
        <tr>
          <th class="font-weight-bold">Nome</th>
          <th class="font-weight-bold">Descrição</th>
          <th class="font-weight-bold">Preço</th>
          <th class="font-weight-bold">Quantitade Estoque</th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="(p, i) in produtos" :key="i">
          <td>{{ p.nome }}</td>
          <td>{{ p.descricao }}</td>
          <td>{{ p.preco }}</td>
          <td>{{ p.qtde_estoque }}</td>
        </tr>
      </tbody>
    </v-table>
  </v-container>
</template>
<script>
export default {
    
}
</script>