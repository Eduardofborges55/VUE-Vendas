import axios from 'axios'

const api = axios.create({
  baseURL: 'http://localhost:5212/api'
})

export interface Produto {
  id: number
  nome: string
  descricao?: string
  preco: number
  quantidade: number
  Quantidade?: number
  imagem: string
}

export default {

  async listar(): Promise<Produto[]> {
    const response = await api.get('/Produto')
    return response.data
  },
  async salvar(produto: Produto): Promise<void> {
    await api.post('/produtos', produto)
  },

  async excluir(id: number): Promise<void> {
    await api.delete(`/produtos/${id}`)
  },

  async editar(produto: Produto): Promise<void> {
    await api.put(`/produtos/${produto.id}`, produto)
  },

  async buscarPorId(id: number): Promise<Produto> {
    const response = await api.get(`/produtos/${id}`)
    return response.data
  },

  async buscarPorNome(nome: string): Promise<Produto[]> {
    const response = await api.get(`/produtos?nome=${nome}`)
    return response.data
  }
}
