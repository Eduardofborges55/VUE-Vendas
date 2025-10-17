import axios from 'axios'

const api = axios.create({
  baseURL: 'http://localhost:5212/api'
})

export interface Usuario {
  token: string | null | undefined
  id: number
  nome: string
  cpf: string
  email: string
  senha: string
  telefone: string
  imagem?: string
}

export default {

    async ListarUsuarios(): Promise<Usuario[]> {
      const response = await api.get('/Usuario')
      return response.data
    },

    async CreateUser(user: Usuario): Promise<null> {
    const response = await api.post('/Usuario', user)
    return response.data
  },

  async LoginUser(user: Usuario): Promise<null> {
    const response = await api.post('/Usuario/login', user)
    return response.data
  }

}
