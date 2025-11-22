<template>
  <div>
    <!-- 🔝 App Bar -->
    <v-app-bar app color="primary" dark density="comfortable">
      <!-- Título -->
      <v-toolbar-title class="font-weight-bold text-truncate">
        Qualquer Coisa Store
      </v-toolbar-title>

      <v-spacer />

      <!-- Menu Desktop -->
      <template v-if="!isMobile">
        <template v-if="!isLoggedIn">
          <v-btn to="/" text>Cadastro</v-btn>
          <v-btn to="/login" text>Login</v-btn>
        </template>
        <template v-else>
          <v-btn text @click="logout">Sair</v-btn>
          <v-btn to="/home" text>Home</v-btn>
          <v-btn to="/anuncios" text>Anúncios</v-btn>
          <v-btn to="/perfil" text>Perfil</v-btn>
        </template>
        <template v-if="isAdmin">
          <v-btn to="/Administracao" text>Administração</v-btn>
          <v-btn to="/Dashboard2" text>Dashboard</v-btn>
        </template>
          <v-btn class="ma-2" color="white" @click="showCart = true">
          Carrinho
          <v-badge
            :content="cartItemCount"
            :value="cartItemCount"
            color="error"
            offset-x="8"
            offset-y="-8"
          >
            <v-icon end>mdi-cart</v-icon>
          </v-badge>
        </v-btn>
      </template>

      <!-- Menu Mobile -->
      <template v-else>
        <v-menu offset-y left>
          <template v-slot:activator="{ props }">
            <v-btn icon v-bind="props">
              <v-icon>mdi-menu</v-icon>
            </v-btn>
          </template>

          <v-list>
            <v-list-item v-if="!isLoggedIn" to="/">
              <v-list-item-title>Cadastro</v-list-item-title>
            </v-list-item>
            <v-list-item v-if="!isLoggedIn" to="/login">
              <v-list-item-title>Login</v-list-item-title>
            </v-list-item>
            <v-list-item v-if="isLoggedIn" @click="logout">
              <v-list-item-title>Sair</v-list-item-title>
            </v-list-item>

            <v-list-item to="/home"><v-list-item-title>Home</v-list-item-title></v-list-item>
            <v-list-item to="/anuncios"><v-list-item-title>Anúncios</v-list-item-title></v-list-item>
            <v-list-item to="/perfil"><v-list-item-title>Perfil</v-list-item-title></v-list-item>

            <v-list-item @click="showCart = true">
              <v-list-item-title>
                Carrinho ({{ cartItemCount }})
              </v-list-item-title>
            </v-list-item>
          </v-list>
        </v-menu>
      </template>
    </v-app-bar>

    <!-- 🛒 Dialog Carrinho -->
    <v-dialog v-model="showCart" max-width="700px" transition="dialog-bottom-transition">
      <v-card>
        <v-card-title class="text-h5 bg-grey-lighten-3 d-flex align-center">
          Carrinho de Compras
          <v-spacer />
          <v-btn icon @click="showCart = false"><v-icon>mdi-close</v-icon></v-btn>
        </v-card-title>

        <v-card-text class="mt-4">
          <div v-if="cartStore.items.length === 0" class="text-center pa-6">
            <v-icon size="64" color="grey">mdi-cart-outline</v-icon>
            <p class="text-h6 text-grey mt-2">Seu carrinho está vazio</p>
          </div>

          <v-list v-else>
            <v-list-item
              v-for="item in cartStore.items"
              :key="item.id"
              class="cart-item"
            >
              <v-list-item-avatar tile size="70" class="hidden-xs-only">
                <v-img :src="item.imagem" cover />
              </v-list-item-avatar>

              <v-list-item-content class="px-2">
                <v-list-item-title class="font-weight-medium">
                  {{ item.nome }}
                </v-list-item-title>
                <v-list-item-subtitle>
                  R$ {{ item.preco.toFixed(2) }}
                </v-list-item-subtitle>

                <div class="d-flex align-center mt-2">
                  <v-btn
                    icon
                    density="comfortable"
                    @click="cartStore.decrementQuantity(item.id)"
                  >
                    <v-icon>mdi-minus</v-icon>
                  </v-btn>
                  <span class="mx-3">{{ item.Quantidade }}</span>
                  <v-btn
                    icon
                    density="comfortable"
                    @click="cartStore.addToCart(item)"
                  >
                    <v-icon>mdi-plus</v-icon>
                  </v-btn>
                  <v-btn
                    icon
                    color="error"
                    density="comfortable"
                    @click="cartStore.removeFromCart(item.id)"
                  >
                    <v-icon>mdi-delete</v-icon>
                  </v-btn>
                </div>
              </v-list-item-content>
            </v-list-item>
          </v-list>
        </v-card-text>

        <v-divider v-if="cartStore.items.length > 0" />

        <v-card-actions v-if="cartStore.items.length > 0" class="pa-4">
          <div class="text-h6">Total: R$ {{ cartStore.total.toFixed(2) }}</div>
          <v-spacer />
          <v-btn color="error" text @click="cartStore.clearCart">Limpar</v-btn>
          <v-btn color="primary" @click="checkout">Comprar</v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'
import { useDisplay } from 'vuetify'
import { useCartStore } from '../../stores/cartStore'
import type { CartItem } from '../../stores/cartStore'
import { useAuthStore } from '../../stores/auth'

const authStore = useAuthStore()
const cartStore = useCartStore()
const showCart = ref(false)
const { mdAndDown } = useDisplay()
const isMobile = computed(() => mdAndDown.value)

// Usa computed para reatividade automática
const isLoggedIn = computed(() => authStore.isAuthenticated)
const isAdmin = computed(() => authStore.isAdmin)

function logout() {
  authStore.logout()
}

const cartItemCount = computed(() =>
  cartStore.items.reduce((total: number, item: CartItem) => total + item.Quantidade, 0)
)

async function checkout() {
  if (cartStore.items.length === 0) return
  window.location.href = '/PaymentPag'
}
</script>


<style scoped>
.cart-item {
  border-bottom: 1px solid #eee;
  padding-bottom: 8px;
  margin-bottom: 8px;
}

.v-list-item-avatar {
  border-radius: 8px;
  overflow: hidden;
}

@media (max-width: 600px) {
  .v-app-bar {
    flex-wrap: wrap;
    padding: 0 8px;
  }

  .v-toolbar-title {
    font-size: 1.1rem;
    max-width: 60%;
  }

  .v-btn {
    font-size: 0.85rem;
    padding: 0 6px;
  }

  .v-dialog .v-card {
    border-radius: 12px 12px 0 0;
  }

  .cart-item {
    flex-direction: column;
    align-items: flex-start;
  }

  .v-list-item-avatar {
    width: 100%;
    height: 120px;
    margin-bottom: 8px;
  }

  .v-card-title {
    font-size: 1rem;
  }
}
</style>
