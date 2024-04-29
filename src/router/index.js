import Vue from 'vue'
import VueRouter from 'vue-router'
import HomeView from '../views/HomeView.vue'
import SearchView from '../views/SearchView.vue'
import UpdateView from '@/views/UpdateView.vue'

Vue.use(VueRouter)

const routes = [
  {
    path: '/',
    name: 'update',
    component: UpdateView
  },
  {
    path: '/search',
    name: 'search',
    component: SearchView
    // route level code-splitting
    // this generates a separate chunk (about.[hash].js) for this route
    // which is lazy-loaded when the route is visited.

  }
]

const router = new VueRouter({
  mode: 'history',
  base: process.env.BASE_URL,
  routes
})

export default router
