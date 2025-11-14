import { defineStore } from 'pinia'
import type { Produto } from '../services/produtoService'

export interface CartItem extends Produto {
  Quantidade: number
}

export const useCartStore = defineStore('cart', {
  state: () => ({
    items: [] as CartItem[],
  }),

  actions: {
    addToCart(produto: Produto) {
      if (produto.estoque <= 0) return // sem estoque

      const existing = this.items.find(item => item.id === produto.id)

      if (existing) {
        if (produto.estoque > 0) {
          existing.Quantidade++
          produto.estoque-- // decrementa estoque TEMPORÁRIO
        }
      } else {
        this.items.push({ ...produto, Quantidade: 1 })
        produto.estoque--
      }
    },

    decrementQuantity(id: number) {
      const item = this.items.find(item => item.id === id)
      if (!item) return

      // devolve estoque
      item.estoque++

      if (item.Quantidade > 1) {
        item.Quantidade--
      } else {
        this.removeFromCart(id)
      }
    },

    removeFromCart(id: number) {
      const item = this.items.find(item => item.id === id)
      if (item) {
        // devolve o estoque total do item removido
        item.estoque += item.Quantidade
      }

      this.items = this.items.filter(item => item.id !== id)
    },

    clearCart() {
      // devolve tudo ao estoque
      this.items.forEach(item => {
        item.estoque += item.Quantidade
      })

      this.items = []
    },

    finalizarPagamento() {
      // aqui você NÃO devolve estoque
      // apenas limpa o carrinho sem restaurar nada
      this.items = []
    },
  },

  getters: {
    total: state =>
      state.items.reduce((acc, item) => acc + item.preco * item.Quantidade, 0),
  },
})
