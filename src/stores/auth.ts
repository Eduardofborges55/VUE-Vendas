import { defineStore } from 'pinia'
import { jwtDecode } from 'jwt-decode'


interface JwtPayload {
  sub?: string
  email?: string
  role?: string
  isAdmin?: boolean | 0 | 1
  exp?: number
}

export const useAuthStore = defineStore('auth', {
  state: () => ({
    token: localStorage.getItem('token') || '',
    user: null as null | JwtPayload,
    isAdmin: true,
  }),

  actions: {
    loadFromToken() {
      const token = localStorage.getItem('token')
      console.log('aquiiii ', token)
      if (!token) return

      try {
        const decoded = jwtDecode<JwtPayload>(token)
        this.user = decoded
        this.token = token
        this.isAdmin = decoded.role === 'admin' || decoded.isAdmin === true || decoded.isAdmin === 1
      } catch (err) {
        console.error('Token inválido:', err)
        this.logout()
      }
    },

    setToken(token: string) {
      this.token = token
      localStorage.setItem('token', token)
      this.loadFromToken()
    },

    logout() {
      this.token = ''
      this.user = null
      this.isAdmin = false
      localStorage.removeItem('token')
    },
  },
})
