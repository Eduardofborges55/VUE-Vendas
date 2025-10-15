import { defineStore } from 'pinia'
import type { Produto } from '../services/produtoService'

export const useCartStore = defineStore('cart', {
  state: () => ({
    items: [] as Produto[]
  }),
  actions: {
    addToCart(produto: Produto) {
      const existing = this.items.find(item => item.Id === produto.Id)
      if (existing) {
        existing.Quantidade++
      } else {
        this.items.push({ ...produto, Quantidade: 1 })
      }
    },
    removeFromCart(id: number) {
      this.items = this.items.filter(item => item.Id !== id)
    },
    clearCart() {
      this.items = []
    }
  },
  getters: {
    total: (state) => state.items.reduce((acc, item) => acc + item.Preco * item.Quantidade, 0)
  }
})
