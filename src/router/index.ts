import { createRouter, createWebHistory } from 'vue-router'
import MusicHall from '../views/MusicHall.vue'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'musichall',
      component: MusicHall,
    },
  ],
})

export default router
