import { defineStore } from 'pinia'
import { jwtDecode } from 'jwt-decode'
import axios from 'axios'

// Interface para o token JWT decodificado
export interface JwtPayload {
  Id: string
  email: string
  cpf: string
  telefone: string
  nome: string
  jti: string
  isAdmin: string | boolean
  imagebase64: string
  exp: number
  iss: string
  aud: string
}

export const useAuthStore = defineStore('auth', {
  state: () => ({
    token: localStorage.getItem('token') || '',
    decodedToken: null as JwtPayload | null,
    isAdmin: false,
  }),

  getters: {
    // Retorna o ID do usuário como número
    userId(): number | null {
      if (!this.decodedToken?.Id) return null
      const id = parseInt(this.decodedToken.Id, 10)
      return isNaN(id) ? null : id
    },

    // Retorna o email do usuário
    userEmail(): string {
      return this.decodedToken?.email || ''
    },

    // Retorna o nome do usuário
    userName(): string {
      return this.decodedToken?.nome || ''
    },

    // Retorna o telefone do usuário
    userPhone(): string {
      return this.decodedToken?.telefone || ''
    },

    // Retorna o CPF do usuário
    userCpf(): string {
      return this.decodedToken?.cpf || ''
    },

    // Verifica se o usuário está autenticado
    isAuthenticated(): boolean {
      return !!this.token && !!this.decodedToken
    },

    // Retorna todos os dados do token decodificado
    userData(): JwtPayload | null {
      return this.decodedToken
    },

    userPhoto(): string {
      return this.decodedToken?.imagebase64 || ''
    }
  },

  actions: {
    // Carrega e decodifica o token do localStorage
    loadFromToken() {
      const token = localStorage.getItem('token')
      if (!token) {
        this.token = ''
        this.decodedToken = null
        this.isAdmin = false
        return
      }

      try {
        const decoded = jwtDecode<JwtPayload>(token)
        this.token = token
        this.decodedToken = decoded
        // Converte isAdmin de string para boolean
        this.isAdmin = decoded.isAdmin === 'true' || decoded.isAdmin === true
        
        // Configura o header Authorization do axios automaticamente
        axios.defaults.headers.common['Authorization'] = `Bearer ${token}`
      } catch (err) {
        console.error('Token inválido:', err)
        this.logout()
      }
    },

    // Define um novo token e decodifica
    setToken(token: string) {
      this.token = token
      localStorage.setItem('token', token)
      this.loadFromToken()
    },

    // Limpa a autenticação
    logout() {
      this.token = ''
      this.decodedToken = null
      this.isAdmin = false
      localStorage.removeItem('token')
      localStorage.removeItem('user')
      delete axios.defaults.headers.common['Authorization']
      window.location.href = '/login'
    },

    async socialLogin(token: string) {
      try {
        this.setToken(token)
      } catch (error) {
        console.error('Erro no login social:', error)
        this.logout()
      }
    },
  },
})