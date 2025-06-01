import { createRouter, createWebHistory } from 'vue-router'
import { useAuthStore } from '../stores/auth'

const routes = [
  {
    path: '/',
    redirect: '/dashboard'
  },
  {
    path: '/login',
    name: 'Login',
    component: () => import('../pages/Login.vue'),
    meta: { requiresGuest: true }
  },
  {
    path: '/register',
    name: 'Register',
    component: () => import('../pages/Register.vue'),
    meta: { requiresGuest: true }
  },
  {
    path: '/dashboard',
    name: 'Dashboard',
    component: () => import('../pages/Dashboard.vue'),
    meta: { requiresAuth: false }
  }
]

const router = createRouter({
  history: createWebHistory(),
  routes
})

router.beforeEach((to, from, next) => {
  const authStore = useAuthStore()
  
  // If Supabase is not configured, allow access to dashboard for demo
  if (!authStore.hasValidCredentials) {
    if (to.path === '/dashboard') {
      next()
      return
    }
    // Redirect to dashboard if trying to access login/register without Supabase
    if (to.meta.requiresGuest) {
      next('/dashboard')
      return
    }
  }
  
  // Normal auth flow when Supabase is configured
  if (authStore.hasValidCredentials) {
    // Redirect authenticated users away from login/register
    if (to.meta.requiresGuest && authStore.user) {
      next('/dashboard')
      return
    }
    
    // Redirect unauthenticated users to login for protected routes
    if (to.meta.requiresAuth && !authStore.user) {
      next('/login')
      return
    }
  }
  
  next()
})

export default router 