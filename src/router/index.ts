import { createRouter, createWebHistory } from 'vue-router'
import { useAuthStore } from '../stores/auth'

// 📦 Rotas da aplicação
const routes = [
  {
    path: '/',
    name: 'Cadastro',
    component: () => import('../views/Cadastro/Cadastrar.vue'),
  },
  {
    path: '/login',
    name: 'Login',
    component: () => import('../views/Login/Login.vue'),
  },
  {
    path: '/home',
    name: 'Home',
    component: () => import('../views/Home/home.vue'),
    meta: { requiresAuth: true }, // 🔒 Só logado
  },
  {
    path: '/anuncios',
    name: 'Anuncios',
    component: () => import('../views/Anuncios/Anuncios.vue'),
  },
  {
    path: '/perfil',
    name: 'Perfil',
    component: () => import('../views/Perfil/Perfil.vue'),
    meta: { requiresAuth: true }, // 🔒 Só logado
  },
  {
    path: '/Administracao',
    name: 'Administracao',
    component: () => import('../views/Administracao/Administracao.vue'),
    meta: { requiresAuth: true, requiresAdmin: true }, // 🔒 Só admin
  },
 {
  path: '/Dashboard2',
  name: 'Dashboard2',
  component: () => import('../views/Dashboard2/Dashboard2.vue'),
  meta: { requiresAuth: true, requiresAdmin: true },
},
  {
    path: '/PaymentPag',
    name: 'PaymentPag',
    component: () => import('../views/PaymentPag/PaymentPag.vue'),
    meta: { requiresAuth: true },
  },

  {
    path: '/Obrigado',
    name: 'Obrigado',
    component: () => import('../views/Obrigado/Obrigado.vue'),
    meta: { requiresAuth: true },
  },

  {
    path: '/MinhasCompras',
    name: 'MinhasCompras',
    component: () => import('../views/minhasCompras/minhasCompras.vue'),
    meta: { requiresAuth: true },
  },
]

// 🚦 Criação do router
const router = createRouter({
  history: createWebHistory(),
  routes,
})

// 🧠 Proteção global de rotas
router.beforeEach((to, from, next) => {
  const auth = useAuthStore()

  // Garante que o estado esteja sincronizado com o token localStorage
  if (!auth.isAuthenticated && localStorage.getItem('token')) {
    auth.loadFromToken()
  }

  // 🔐 Rota exige login
  if (to.meta.requiresAuth && !auth.isAuthenticated) {
    return next('/login')
  }

  // 🔐 Rota exige admin
  if (to.meta.requiresAdmin && !auth.isAdmin) {
    return next('/home')
  }

  next()
})

export default router
