import { defineStore } from 'pinia'
import type { Produto } from '../services/produtoService'

export interface CartItem extends Produto {
  Quantidade: number
}

export const useCartStore = defineStore('cart', {
  state: () => ({
    items: [] as CartItem[]
  }),
  actions: {
    addToCart(produto: Produto) {
      const existing = this.items.find(item => item.id === produto.id)
      if (existing) {
        existing.Quantidade++
      } else {
        this.items.push({ ...produto, Quantidade: 1 })
      }
    },
    decrementQuantity(id: number) {
      const item = this.items.find(item => item.id === id)
      if (item) {
        if (item.Quantidade > 1) {
          item.Quantidade--
        } else {
          this.removeFromCart(id)
        }
      }
    },
    removeFromCart(id: number) {
      this.items = this.items.filter(item => item.id !== id)
    },
    clearCart() {
      this.items = []
    }
  },
  getters: {
    total: (state) => state.items.reduce((acc, item) => acc + item.preco * (item.Quantidade ?? 0), 0)
  }
})
