import { createRouter, createWebHistory } from 'vue-router'
import HomeView from '../views/HomeView.vue'
import MapView from '../views/MapView.vue'
import LoginView from '../views/LoginView.vue'
import SignUpView from '../views/SignUpView.vue'
import ResetPWView from '../views/ResetPWView.vue'
import DetailView from '../views/DetailView.vue'
import UpdatePWView from '@/views/UpdatePWView.vue'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    { path: '/', component: HomeView },
    { path: '/map', component: MapView },
    { path: '/loginForm', component: LoginView },
    { path: '/signUpForm', component: SignUpView },
    { path: '/resetPWForm', component: ResetPWView },
    { path: '/detail', component: DetailView },
    { path: '/updatePassword', component: UpdatePWView },
  ],
})

export default router
