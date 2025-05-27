import { defineStore } from 'pinia'

export const useAuthStore = defineStore('auth', {
  state: () => ({
    accessToken: sessionStorage.getItem('accessToken') || null,
  }),
  getters: {
    isLoggedIn: (state) => !!state.accessToken,
  },
  actions: {
    login(token, nickname) {
      this.accessToken = token
      sessionStorage.setItem('accessToken', token)
      sessionStorage.setItem('nickname', nickname)
    },
    logout() {
      this.accessToken = null
      sessionStorage.removeItem('accessToken')
      sessionStorage.removeItem('nickname')
    },
    checkToken() {
      this.accessToken = sessionStorage.getItem('accessToken')
    },
  },
})
