import { createRouter, createWebHistory } from 'vue-router'
import HomeView from '../views/HomeView.vue'
import MapView from '../views/MapView.vue'
import LoginView from '../views/LoginView.vue'
import SignUpView from '../views/SignUpView.vue'
import FindPWView from '../views/FindPWView.vue'
import DetailView from '../views/DetailView.vue'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    { path: '/', component: HomeView },
    { path: '/map', component: MapView },
    { path: '/loginForm', component: LoginView },
    { path: '/signUpForm', component: SignUpView },
    { path: '/findPWForm', component: FindPWView },
    { path: '/detail', component: DetailView },
  ],
})

export default router
