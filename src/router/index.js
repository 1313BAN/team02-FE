import { createRouter, createWebHistory } from 'vue-router'
import HomeView from '../views/HomeView.vue'
import MapView from '../views/MapView.vue'
import LoginView from '../views/LoginView.vue'
import SignUpView from '../views/SignUpView.vue'
import FindPWView from '../views/FindPWView.vue'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    { path: '/', component: HomeView },
    { path: '/map', component: MapView },
    { path: '/loginForm', component: LoginView },
    { path: '/signUpForm', component: SignUpView },
    { path: '/findPWForm', component: FindPWView },
  ],
})

export default router
