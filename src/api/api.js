import axios from 'axios'

// const api = axios.create({
//   baseURL: 'http://localhost:8080',
//   headers: { 'Content-Type': 'application/json' },
// })

const api = axios.create({
  baseURL: 'http://localhost:8080',
  headers: {
    'Content-Type': 'application/json;charset=utf-8',
  },
})

// 요청 인터셉터: 토큰 자동 추가
api.interceptors.request.use(
  (config) => {
    const accessToken = sessionStorage.getItem('accessToken')
    if (accessToken) {
      config.headers.Authorization = `${accessToken}`
    }
    return config
  },
  (error) => Promise.reject(error),
)

export default api
