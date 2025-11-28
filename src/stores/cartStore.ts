import { defineStore } from 'pinia'
import type { Produto } from '../services/produtoService'

export interface CartItem extends Produto {
  Quantidade: number
}

export const useCartStore = defineStore('cart', {
  state: () => ({
    items: JSON.parse(localStorage.getItem("cartItems") || "[]") as CartItem[],
  }),

  getters: {
    total: state =>
      state.items.reduce((acc, item) => acc + item.preco * item.Quantidade, 0),
  },

  actions: {
    salvarCarrinho() {
      localStorage.setItem("cartItems", JSON.stringify(this.items))
    },

    addToCart(produto: Produto) {
      if (produto.estoque <= 0) return

      const existing = this.items.find(item => item.id === produto.id)

      if (existing) {
        existing.Quantidade++
        produto.estoque--
      } else {
        this.items.push({ ...produto, Quantidade: 1 })
        produto.estoque--
      }

      this.salvarCarrinho()
    },

    decrementQuantity(id: number) {
      const item = this.items.find(item => item.id === id)
      if (!item) return

      item.estoque++

      if (item.Quantidade > 1) {
        item.Quantidade--
      } else {
        this.removeFromCart(id)
        return
      }

      this.salvarCarrinho()
    },

    removeFromCart(id: number) {
      const item = this.items.find(item => item.id === id)
      if (item) {
        item.estoque += item.Quantidade
      }

      this.items = this.items.filter(item => item.id !== id)
      this.salvarCarrinho()
    },

    clearCart() {
      this.items.forEach(item => {
        item.estoque += item.Quantidade
      })

      this.items = []
      this.salvarCarrinho()
    },

    finalizarPagamento() {
      // NÃO devolve estoque
      this.items = []
      this.salvarCarrinho()
    },
  },
})
