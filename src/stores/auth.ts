import { defineStore } from 'pinia'
import { jwtDecode } from 'jwt-decode'

export const useAuthStore = defineStore('auth', {
  state: () => ({
    token: localStorage.getItem('token') || '',
    user: null as any,
    isAdmin: false,
  }),

  actions: {
    loadFromToken() {
      const token = localStorage.getItem('token')
      if (!token) return

      try {
        const decoded = jwtDecode(token) as any
        this.user = decoded
        this.isAdmin = decoded.role === 'admin'
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
      window.location.href = '/login'
    },
  },
})
