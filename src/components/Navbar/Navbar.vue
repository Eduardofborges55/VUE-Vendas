<template>
  <div>
    <v-app-bar app color="primary" dark>
      <v-toolbar-title>Qualquer Coisa Store</v-toolbar-title>
      <v-spacer />

      <template v-if="!isLoggedIn">
        <v-btn to="/" text>Cadastro</v-btn>
        <v-btn to="/login" text>login</v-btn>
      </template>
      <template v-else>
        <v-btn text @click="logout">Sair</v-btn>
      </template>

      <v-btn to="/Home" text>Home</v-btn>
      <!-- <v-btn to="/administracao" text>Administracao</v-btn> -->
      <!-- <v-btn to="/denuncia" text>Denuncia</v-btn> -->
      <v-btn to="/anuncios" text>Anuncios</v-btn>
      <v-btn to="/perfil" text>Perfil</v-btn>

      <v-btn
        class="ma-2"
        color="white"
        @click="showCart = true"
      >
        Carrinho
        <v-badge
          :content="cartItemCount"
          :value="cartItemCount"
          color="error"
          offset-x="12"
          offset-y="-8"
        >
          <v-icon end>mdi-cart</v-icon>
        </v-badge>
      </v-btn>
    </v-app-bar>

    <v-dialog v-model="showCart" max-width="700px">
      <v-card>
        <v-card-title class="text-h5 grey lighten-2">
          Carrinho de Compras
          <v-spacer></v-spacer>
          <v-btn icon @click="showCart = false">
            <v-icon>mdi-close</v-icon>
          </v-btn>
        </v-card-title>

        <v-card-text class="mt-4">
          <div v-if="cartStore.items.length === 0" class="text-center pa-4">
            <v-icon size="64" color="grey lighten-1">mdi-cart-outline</v-icon>
            <p class="text-h6 grey--text mt-2">Seu carrinho está vazio</p>
          </div>

          <v-list v-else>
            <v-list-item v-for="item in cartStore.items" :key="item.id">
              <v-list-item-avatar tile size="80">
                <v-img :src="item.imagem"></v-img>
              </v-list-item-avatar>

              <v-list-item-content>
                <v-list-item-title class="text-h6">{{ item.nome }}</v-list-item-title>
                <v-list-item-subtitle>R$ {{ item.preco.toFixed(2) }}</v-list-item-subtitle>

                <v-row align="center" class="mx-0">
                  <v-btn small icon @click="cartStore.decrementQuantity(item.id)">
                    <v-icon>mdi-minus</v-icon>
                  </v-btn>
                  <span class="mx-2">{{ item.Quantidade }}</span>
                  <v-btn small icon @click="cartStore.addToCart(item)">
                    <v-icon>mdi-plus</v-icon>
                  </v-btn>
                </v-row>
              </v-list-item-content>

              <v-list-item-action>
                <v-btn icon @click="cartStore.removeFromCart(item.id)">
                  <v-icon color="error">mdi-delete</v-icon>
                </v-btn>
              </v-list-item-action>
            </v-list-item>
          </v-list>
        </v-card-text>

        <v-divider v-if="cartStore.items.length > 0"></v-divider>

        <v-card-actions v-if="cartStore.items.length > 0" class="pa-4">
          <div class="text-h6">Total: R$ {{ cartStore.total.toFixed(2) }}</div>
          <v-spacer></v-spacer>
          <v-btn color="error" text @click="cartStore.clearCart">
            Limpar Carrinho
          </v-btn>
          <v-btn color="primary" @click="checkout">
            Comprar
          </v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import { useCartStore } from '../../stores/cartStore'
import type { CartItem } from '../../stores/cartStore'
import { finalizarCompra } from '../../services/compraService'
import { tr } from 'vuetify/locale'


const showCart = ref(false)
const cartStore = useCartStore()
const isLoggedIn = ref(false);

onMounted(() => {
  const checkToken = setInterval(() => {
    const token = localStorage.getItem('token');
    if (token) {
      isLoggedIn.value = true;
      clearInterval(checkToken);
    }
  }, 100); // checa a cada 100ms
});
function logout() {
  localStorage.removeItem('user');
  localStorage.removeItem('token');
  isLoggedIn.value = false;
  window.location.href = '/login'; // Redireciona para a página de login
}

// const cartItemCount = computed(() => 
//   cartStore.items.reduce((total: number, item: CartItem) => total + item.Quantidade, 0)
// )

const processing = ref(false)

const cartItemCount = computed(() =>
  cartStore.items.reduce((total: number, item: CartItem) => total + item.Quantidade, 0)
);

async function checkout() {
  if (cartStore.items.length === 0) return;

  processing.value = true;

  window.location.href = '/PaymentPag';
  
}
</script>

<style scoped>
.v-dialog {
  border-radius: 8px;
}

.v-list-item {
  margin-bottom: 8px;
}
</style>