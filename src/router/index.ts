import { createRouter, createWebHistory } from 'vue-router'
import Cadastro from '../views/Cadastro/Cadastrar.vue'
import Login from '../views/Login/Login.vue'
import Perfil from '../views/Perfil/Perfil.vue'
import Administracao from '../views/Administracao/Administracao.vue'
import Denuncia from '../views/Denuncia/Denuncia.vue'
import Anuncios from '../views/Anuncios/Anuncios.vue'
import Dashboard from '../views/Home/home.vue'
import PaymentPag from '../views/PaymentPag/PaymentPag.vue'
import PaymentOptions from '../components/PaymentOptions/PaymentOptions.vue'
import Obrigado from '../views/Obrigado/Obrigado.vue'

const routes = [
  {path: '/', name: 'Cadastro', component: Cadastro},
  {path: '/Login', name: 'Login', component: Login},
  {path: '/Perfil', name: 'Perfil', component: Perfil},
  {path: '/Administracao', name: 'Adiministracao', component: Administracao},
  {path: '/Denuncia', name: 'Denuncia', component: Denuncia}, 
  {path: '/Anuncios', name: 'Anuncios', component: Anuncios},
  {path: '/Home', name: 'Home', component: Dashboard},
  {path: '/PaymentPag', name: 'PaymentPag', component: PaymentPag},
  {path: '/PaymentOptions', name: 'PaymentOptions', component: PaymentOptions},
  {path: '/Obrigado', name: 'Obrigado', component: Obrigado},
]

const router = createRouter({
  history: createWebHistory(),
  routes
})

export default router
