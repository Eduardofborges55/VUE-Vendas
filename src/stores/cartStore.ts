import { defineStore } from 'pinia'
import type { Produto } from '../services/produtoService'

export const useCartStore = defineStore('cart', {
  state: () => ({
    items: [] as Produto[]
  }),
  actions: {
    addToCart(produto: Produto) {
      const existing = this.items.find(item => item.id === produto.id)
      if ((produto as { Quantidade: number }).Quantidade && (produto as { Quantidade: number }).Quantidade < (existing as { Quantidade: number }).Quantidade) {
      (existing as { Quantidade: number }).Quantidade++
      } else {
       this.items.push({ ...produto, Quantidade: 1 })
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
