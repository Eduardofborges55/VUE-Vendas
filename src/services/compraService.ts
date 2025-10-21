import axios from 'axios'
import type { CartItem } from '../stores/cartStore'

export interface PedidoResponse {
  status: 'aprovado' | 'recusado' | 'processando'
  pedido_id: number
}

export async function finalizarCompra(usuario_id: number, itens: CartItem[], total: number): Promise<PedidoResponse> {
  const response = await axios.post('/api/finalizar-compra', {
    usuario_id,
    itens: itens.map(i => ({
      id: i.id,
      quantidade: i.Quantidade,
      preco: i.preco
    })),
    total
  })
  return response.data
}
