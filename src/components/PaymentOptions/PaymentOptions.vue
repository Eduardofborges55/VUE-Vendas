<template>
  <v-container class="py-10">
    <h1 class="text-h4 mb-6 text-center">Escolha sua forma de pagamento</h1>

      <!-- Tipos de pagamento -->
    <v-row justify="center" align="center" class="gap-6">
      <v-col cols="12" sm="4" md="3" v-for="option in paymentOptions" :key="option.type">
        <v-card
          class="pa-4 hover:shadow-lg cursor-pointer transition"
          outlined
          :elevation="selected === option.type ? 10 : 2"
          @click="selectPayment(option.type)"
        >
          <v-img :src="option.img" height="120" contain class="mb-4" />
          <v-card-title class="text-center">{{ option.label }}</v-card-title>
        </v-card>
      </v-col>
    </v-row>

    <!-- Exibição dinâmica -->
    <v-row class="mt-10" justify="center">
      <v-col cols="12" sm="8" md="6">

        <!-- PIX -->
        <v-card v-if="selected === 'pix'" class="pa-6 text-center">
          <h2 class="text-h6 mb-4">Pagamento via Pix</h2>
          <qrcode-vue :value="pixCode" :size="200" />
          <p class="mt-3 text-caption">Escaneie o QR Code com seu app bancário.</p>

          <v-btn
            color="primary"
            block
            class="mt-4"
            :disabled="isProcessing"
            @click="handlePaymentClick"
          >
            {{ isProcessing ? `Aguardando (${timer}s)` : 'Pagar' }}
          </v-btn>
        </v-card>

        <!-- BOLETO -->
        <v-card v-else-if="selected === 'boleto'" class="pa-6 text-center">
          <h2 class="text-h6 mb-4">Pagamento por Boleto</h2>
          <p class="mb-2">Linha digitável:</p>
          <p class="font-weight-bold">{{ linhaDigitavel }}</p>

          <vue3-barcode
            :value="codigoDeBarras"
            format="CODE128"
            :width="2"
            :height="80"
            display-value="false"
          />

          <p class="mt-3 text-caption">Use o código para pagamento em seu banco.</p>
          <v-btn
            color="primary"
            block
            class="mt-4"
            :disabled="isProcessing"
            @click="handlePaymentClick"
          >
            {{ isProcessing ? `Aguardando (${timer}s)` : 'Pagar' }}
          </v-btn>
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
          <v-btn
            color="primary"
            block
            class="mt-4"
            :disabled="!isCardValid"
            @click="processPayment"
          >
            Pagar
          </v-btn>
        </v-card>
      </v-col>
    </v-row>
  </v-container>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'
import { useRouter } from 'vue-router'
import QrcodeVue from 'qrcode-vue3'
// @ts-ignore: no type declarations for 'vue3-barcode'
import Vue3Barcode from 'vue3-barcode'

// Router
const router = useRouter()

// Estados
const selected = ref('')
const isProcessing = ref(false)
const timer = ref(30)
let intervalId: number | null = null

// Métodos de pagamento
const paymentOptions = [
  { type: 'pix', label: 'Pix', img: 'src/images/pix.png' },
  { type: 'boleto', label: 'Boleto Bancário', img: 'src/images/boleto.png' },
  { type: 'cartao', label: 'Cartão de Crédito', img: 'src/images/cartao.png' }
]

// PIX e BOLETO
const pixCode = ref(
  '00020126330014BR.GOV.BCB.PIX0114+5511999999995204000053039865802BR5910LojaTeste6009SCS-SP62290525PagamentoTechStore6304ABCD'
)
const linhaDigitavel = ref('34191.79001 01043.510047 91020.150008 9 82710000015000')
const codigoDeBarras = ref('34199827100000150001790010143510049102015000')

// CARTÃO
const card = ref({
  number: '',
  name: '',
  validade: '',
  cvv: ''
})

// Validação do cartão
const isCardValid = computed(() => {
  const { number, name, validade, cvv } = card.value
  return number.trim() && name.trim() && validade.trim() && cvv.trim()
})

// Seleciona método e ativa o bloqueio
function selectPayment(type: string) {
  selected.value = type
  resetTimer()

  if (type === 'pix' || type === 'boleto') {
    startTimer() // inicia bloqueio de 30s
  }
}

// Inicia o contador de 30s
function startTimer() {
  isProcessing.value = true
  timer.value = 30
  intervalId = window.setInterval(() => {
    timer.value--
    if (timer.value <= 0) {
      clearInterval(intervalId!)
      isProcessing.value = false
    }
  }, 1000)
}

// Clicou no botão de pagamento (Pix/Boleto)
function handlePaymentClick() {
  if (isProcessing.value) {
    alert(`⚠️ Aguarde o cronômetro de 30 segundos (${timer.value}s restantes).`)
    return
  }
  processPayment()
}

// Finaliza o pagamento
function processPayment() {
  alert('✅ Pagamento processado com sucesso!')
  router.push('/Obrigado')
}

// Reseta o estado
function resetTimer() {
  if (intervalId) clearInterval(intervalId)
  isProcessing.value = false
  timer.value = 30
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
