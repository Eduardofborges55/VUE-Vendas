<template>
   <v-container>
     <h1>Denuncia</h1>
     <p>denuncie contas suspeitas</p>
    <v-form @submit.prevent="denunciar">
        <v-text-field v-model="denuncia.URL" label="URLProdutoSuspeito"/>
        <v-text-field v-model="denuncia.Preco" label="Preco"/>
        <v-text-field v-model="denuncia.Email" label="Email"/>
        <v-btn type="submit" color="primary">Denunciar</v-btn>
    </v-form>
    <v-divider class="my-4" />
    <v-table>
        <thead>
          <tr>
            <th class="font-weight-bold">URLProdutoSuspeito</th>
            <th class="font-weight-bold">Preco</th>
            <th class="font-weight-bold">Email</th>
          </tr>
        </thead>
        <tbody>
            <tr v-for="(denunciaItem, i) in denunciations" :key="denunciaItem.Id">
              <td>{{ denunciaItem.URL }}</td>
              <td>{{ denunciaItem.Preco }}</td>
              <td>{{ denunciaItem.Email }}</td>
            </tr>
        </tbody>
       </v-table>
   </v-container>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import denunciaService, { Denuncia } from '../../services/denunciarService';

const denuncia = ref<Denuncia>({
        URL: '',
        Preco: 0,
        Email: '',
        Id: 0
    })

const denunciations = ref<Denuncia[]>([]);

onMounted(async () => {
    denunciations.value = await denunciaService.listar()
    denunciations.value = await denunciaService.listar()
})

async function denunciar() {
    await denunciaService.salvar(denuncia.value)
    denuncia.value = { URL: '', Preco: 0, Email: '', Id: 0 }
    denunciations.value = await denunciaService.listar()
}
</script>