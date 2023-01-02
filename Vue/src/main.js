import { createApp } from 'vue'
import App from './App.vue'
import { createPinia } from 'pinia'

// PrimeVue
import PrimeVue from 'primevue/config'
import 'primevue/resources/themes/mdc-dark-indigo/theme.css'     //theme
import 'primevue/resources/primevue.min.css'                 //core css
import 'primeicons/primeicons.css'                           //icons
import Divider from 'primevue/divider';


// Tailwind CSS
import './assets/main.css'

const app = createApp(App)
app.use(createPinia())
app.component('Divider', Divider);
app.use(PrimeVue);    
app.mount('#app')



