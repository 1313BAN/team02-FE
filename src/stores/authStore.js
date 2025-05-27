import { defineStore } from 'pinia'

export const useAuthStore = defineStore('auth', {
  state: () => ({
    accessToken: sessionStorage.getItem('accessToken') || null,
    nickname: sessionStorage.getItem('nickname') || null,
  }),
  getters: {
    isLoggedIn: (state) => !!state.accessToken,
    getNickname: (state) => state.nickname,
  },
  actions: {
    login(token, nickname) {
      this.accessToken = token
      this.nickname = nickname
      sessionStorage.setItem('accessToken', token)
      sessionStorage.setItem('nickname', nickname)
    },
    logout() {
      this.accessToken = null
      this.nickname = null
      sessionStorage.removeItem('accessToken')
      sessionStorage.removeItem('nickname')
    },
    checkToken() {
      this.accessToken = sessionStorage.getItem('accessToken')
    },
  },
})
