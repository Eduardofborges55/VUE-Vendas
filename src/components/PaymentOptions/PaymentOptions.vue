<template>
  <v-container class="py-10">
    <h1 class="text-h4 mb-6 text-center">Escolha sua forma de pagamento</h1>

    <v-row justify="center" align="center" class="gap-6">
      <!-- PIX -->
      <v-col cols="12" sm="4" md="3">
        <v-card
          class="pa-4 hover:shadow-lg cursor-pointer transition"
          outlined
          :elevation="selected === 'pix' ? 10 : 2"
          @click="selectPayment('pix')"
        >
          <v-img src="src/images/pix.png" height="120" contain class="mb-4" />
          <v-card-title class="text-center">Pix</v-card-title>
        </v-card>
      </v-col>

      <!-- BOLETO -->
      <v-col cols="12" sm="4" md="3">
        <v-card
          class="pa-4 hover:shadow-lg cursor-pointer transition"
          outlined
          :elevation="selected === 'boleto' ? 10 : 2"
          @click="selectPayment('boleto')"
        >
          <v-img src="src/images/boleto.png" height="120" contain class="mb-4" />
          <v-card-title class="text-center">Boleto Bancário</v-card-title>
        </v-card>
      </v-col>

      <!-- CARTÃO -->
      <v-col cols="12" sm="4" md="3">
        <v-card
          class="pa-4 hover:shadow-lg cursor-pointer transition"
          outlined
          :elevation="selected === 'cartao' ? 10 : 2"
          @click="selectPayment('cartao')"
        >
          <v-img src="src/images/cartao.png" height="120" contain class="mb-4" />
          <v-card-title class="text-center">Cartão de Crédito</v-card-title>
        </v-card>
      </v-col>
    </v-row>

    <!-- EXIBIÇÃO DINÂMICA -->
    <v-row class="mt-10" justify="center">
      <v-col cols="12" sm="8" md="6">
        <!-- PIX -->
        <v-card v-if="selected === 'pix'" class="pa-6 text-center">
          <h2 class="text-h6 mb-4">Pagamento via Pix</h2>
          <qrcode-vue :value="pixCode" :size="200" />
          <p class="mt-3 text-caption">Escaneie o QR Code com seu app bancário.</p>
        </v-card>

        <!-- BOLETO -->
        <v-card v-else-if="selected === 'boleto'" class="pa-6 text-center">
          <h2 class="text-h6 mb-4">Pagamento por Boleto</h2>
          <p class="mb-2">Linha digitável:</p>
          <p class="font-weight-bold">{{ linhaDigitavel }}</p>

          <!-- Código de barras gerado -->
          <vue3-barcode
            :value="codigoDeBarras"
            format="CODE128"
            :width="2"
            :height="80"
            display-value="false"
          />

          <p class="mt-3 text-caption">Use o código para pagamento em seu banco.</p>
        </v-card>

        <!-- CARTÃO -->
        <v-card v-else-if="selected === 'cartao'" class="pa-6">
          <h2 class="text-h6 mb-4 text-center">Pagamento com Cartão</h2>
          <v-text-field label="Número do Cartão" v-model="card.number" />
          <v-text-field label="Nome no Cartão" v-model="card.name" />
          <v-row>
            <v-col cols="6">
              <v-text-field label="Validade (MM/AA)" v-model="card.validade" />
            </v-col>
            <v-col cols="6">
              <v-text-field label="CVV" v-model="card.cvv" />
            </v-col>
          </v-row>
          <v-btn color="primary" block class="mt-4" @click="processPayment">Pagar</v-btn>
        </v-card>
      </v-col>
    </v-row>
  </v-container>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import QrcodeVue from 'qrcode-vue3'
import Vue3Barcode from 'vue3-barcode'




// Estado de seleção
const selected = ref('')

// PIX
const pixCode = ref(
  '00020126330014BR.GOV.BCB.PIX0114+5511999999995204000053039865802BR5910LojaTeste6009SCS-SP62290525PagamentoTechStore6304ABCD'
)

// BOLETO (fake)
const linhaDigitavel = ref('34191.79001 01043.510047 91020.150008 9 82710000015000')
const codigoDeBarras = ref('34199827100000150001790010143510049102015000')

// CARTÃO
const card = ref({
  number: '',
  name: '',
  validade: '',
  cvv: '',
})

function selectPayment(type: string) {
  selected.value = type
}

function processPayment() {
  alert('Pagamento processado com sucesso!')
}
</script>

<style scoped>
.transition {
  transition: all 0.3s ease;
}
.cursor-pointer {
  cursor: pointer;
}
</style>


