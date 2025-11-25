import axios from 'axios'

const api = axios.create({
  baseURL: 'http://localhost:5212/auth/',
})

export interface Usuario {
  token: string | null | undefined
  id: number
  nome: string
  cpf: string
  email: string
  password: string
  telefone: string
  data_nascimento: string
  imagem?: string
}

export default {

    async ListarUsuarios(): Promise<Usuario[]> {
      const response = await api.get('/register')
      return response.data
    },

    async CreateUser(user: Usuario): Promise<null> {
    const response = await api.post('/register', user)
    return response.data
  },

  async LoginUser(user: Usuario): Promise<null> {
    const response = await api.post('/register/login', user)
    return response.data
  }

}
