import { createRouter, createWebHistory } from 'vue-router'
import { useAuth } from '../composables/useAuth'
import Landing from '../views/Landing.vue'
import Login from '../views/Login.vue'
import AuthLayout from '../layouts/AuthLayout.vue'
import Dashboard from '../views/Dashboard.vue'
import Users from '../views/Users.vue'
import Analysis from '../views/Analysis.vue'
import AdminDashboard from '../components/AdminDashboard.vue'

const { token } = useAuth()

const routes = [
  { path: '/', name: 'landing', component: Landing },
  { path: '/login', name: 'login', component: Login },
  {
    path: '/',
    component: AuthLayout,
    meta: { requiresAuth: true },
    children: [
      { path: 'dashboard', name: 'dashboard', component: Dashboard },
      { path: 'users', name: 'users', component: Users },
      { path: 'analysis', name: 'analysis', component: Analysis },
      { path: 'admin', name: 'admin-dashboard', component: AdminDashboard },
    ]
  }
]

const router = createRouter({
  history: createWebHistory(),
  routes
})

router.beforeEach((to, from, next) => {
  if (to.meta.requiresAuth && !token.value) {
    next({ name: 'login' })
  } else if (to.name === 'login' && token.value) {
    next({ name: 'dashboard' })
  } else if (to.path === '/' && token.value) {
    next({ name: 'dashboard' })
  } else {
    next()
  }
})

export default router
