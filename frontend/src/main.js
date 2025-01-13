import { createApp } from 'vue'
import { createRouter, createWebHistory } from 'vue-router'
import './style.css'
import App from './App.vue'
import Home from './views/Home.vue'
import Reservation from './views/Reservation.vue'
import Confirmation from './views/Confirmation.vue'

const router = createRouter({
  history: createWebHistory(),
  routes: [
    {
      path: '/',
      name: 'Home',
      component: Home
    },
    {
      path: '/reservation',
      name: 'Reservation',
      component: Reservation
    },
    {
      path: '/confirmation',
      name: 'Confirmation',
      component: Confirmation
    }
  ]
})

const app = createApp(App)
app.use(router)
app.mount('#app')
