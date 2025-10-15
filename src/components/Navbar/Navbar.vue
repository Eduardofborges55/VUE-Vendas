<template>
  <div>
    <v-app-bar app color="primary" dark>
      <v-toolbar-title>Qualquer Coisa Store</v-toolbar-title>
      <v-spacer />
      <v-btn to="/" text>Cadastro</v-btn>
      <v-btn to="/login" text>login</v-btn>
      <v-btn to="/Home" text>Home</v-btn>
      <v-btn to="/administracao" text>Administracao</v-btn>
      <v-btn to="/denuncia" text>Denuncia</v-btn>
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
          <div v-if="cartItems.length === 0" class="text-center pa-4">
            <v-icon size="64" color="grey lighten-1">mdi-cart-outline</v-icon>
            <p class="text-h6 grey--text mt-2">Seu carrinho está vazio</p>
          </div>

          <v-list v-else>
            <v-list-item v-for="item in cartItems" :key="item.Id">
              <v-list-item-avatar tile size="80">
                <v-img :src="item.img || 'https://via.placeholder.com/80'"></v-img>
              </v-list-item-avatar>

              <v-list-item-content>
                <v-list-item-title class="text-h6">{{ item.Nome }}</v-list-item-title>
                <v-list-item-subtitle>R$ {{ item.Preco.toFixed(2) }}</v-list-item-subtitle>
                
                <v-row align="center" class="mx-0">
                  <v-btn small icon @click="decrementQuantity(item)">
                    <v-icon>mdi-minus</v-icon>
                  </v-btn>
                  <span class="mx-2">{{ item.cartQuantity }}</span>
                  <v-btn small icon @click="incrementQuantity(item)">
                    <v-icon>mdi-plus</v-icon>
                  </v-btn>
                </v-row>
              </v-list-item-content>

              <v-list-item-action>
                <v-btn icon @click="removeFromCart(item)">
                  <v-icon color="error">mdi-delete</v-icon>
                </v-btn>
              </v-list-item-action>
            </v-list-item>
          </v-list>
        </v-card-text>

        <v-divider v-if="cartItems.length > 0"></v-divider>

        <v-card-actions v-if="cartItems.length > 0" class="pa-4">
          <div class="text-h6">Total: R$ {{ cartTotal.toFixed(2) }}</div>
          <v-spacer></v-spacer>
          <v-btn color="error" text @click="clearCart">
            Limpar Carrinho
          </v-btn>
          <v-btn color="primary" @click="checkout">
            Finalizar Compra
          </v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'
import { Produto } from '../../services/produtoService'

const showCart = ref(false)
const cartItems = ref<(Produto & { cartQuantity: number })[]>([])

const cartItemCount = computed(() => 
  cartItems.value.reduce((total, item) => total + item.cartQuantity, 0)
)

const cartTotal = computed(() => 
  cartItems.value.reduce((total, item) => total + (item.Preco * item.cartQuantity), 0)
)

const addToCart = (produto: Produto) => {
  const existingItem = cartItems.value.find(item => item.Id === produto.Id)
  
  if (existingItem) {
    existingItem.cartQuantity++
  } else {
    cartItems.value.push({
      ...produto,
      cartQuantity: 1
    })
  }
}

const removeFromCart = (item: Produto & { cartQuantity: number }) => {
  cartItems.value = cartItems.value.filter(cartItem => cartItem.Id !== item.Id)
}

const incrementQuantity = (item: Produto & { cartQuantity: number }) => {
  if (item.cartQuantity < item.Quantidade) {
    item.cartQuantity++
  }
}

const decrementQuantity = (item: Produto & { cartQuantity: number }) => {
  if (item.cartQuantity > 1) {
    item.cartQuantity--
  } else {
    removeFromCart(item)
  }
}

const clearCart = () => {
  cartItems.value = []
}

const checkout = () => {
  console.log('Checkout:', cartItems.value)
}

// Expose methods to parent components
defineExpose({
  addToCart,
  removeFromCart,
  clearCart,
  checkout
})
</script>

<style scoped>
.v-dialog {
  border-radius: 8px;
}

.v-list-item {
  margin-bottom: 8px;
}
</style>