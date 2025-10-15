import { createApp } from 'vue'
import App from './App.vue'
import 'vuetify/styles'
import { createVuetify } from 'vuetify'
import '@mdi/font/css/materialdesignicons.css'
import router from './router'
import { createPinia } from 'pinia'


import * as components from 'vuetify/components'
import * as directives from 'vuetify/directives'

const vuetify = createVuetify({
    components,
    directives,
    theme: {
        defaultTheme: 'light',
    }
})
createApp(App).
use(createPinia()).
use(vuetify).use(router).mount('#app')
