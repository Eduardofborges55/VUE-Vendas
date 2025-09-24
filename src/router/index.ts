import { createRouter, createWebHistory } from 'vue-router'
import Cadastro from '../views/Cadastro/Cadastrar.vue'
import Login from '../views/Login/Login.vue'
import Perfil from '../views/Perfil/Perfil.vue'
import Administracao from '../views/Administracao/Administracao.vue'
import Anuncios from '../views/Anuncios/Anuncios.vue'

const routes = [
  {path: '/', name: 'Cadastro', component: Cadastro},
  {path: '/Login', name: 'Login', component: Login},
  {path: '/Perfil', name: 'Perfil', component: Perfil},
  {path: '/Administracao', name: 'Adiministracao', component: Administracao},
  {path: '/Anuncios', name: 'Anuncios', component: Anuncios}

]

const router = createRouter({
  history: createWebHistory(),
  routes
})

export default router
