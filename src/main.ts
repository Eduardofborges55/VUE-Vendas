import { createApp } from 'vue'
import App from './App.vue'
import { createVuetify } from 'vuetify'
import 'vuetify/styles'
import '@mdi/font/css/materialdesignicons.css'
import router from './router'
import { createPinia } from 'pinia'
import * as components from 'vuetify/components'
import * as directives from 'vuetify/directives'

const app = createApp(App)

const pinia = createPinia()
app.use(pinia)

import { useAuthStore } from './stores/auth'
const auth = useAuthStore()
auth.loadFromToken()

const vuetify = createVuetify({
  components,
  directives,
  theme: { defaultTheme: 'light' },
})

app.use(vuetify)
app.use(router)
app.mount('#app')
