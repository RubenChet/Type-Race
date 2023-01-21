import { createApp } from 'vue'
import App from './App.vue'
import { createPinia } from 'pinia'

// PrimeVue
import PrimeVue from 'primevue/config'
import 'primevue/resources/themes/mdc-dark-indigo/theme.css'     //theme
import 'primevue/resources/primevue.min.css'                 //core css
import 'primeicons/primeicons.css'                           //icons
import Divider from 'primevue/divider';
import ToastService from 'primevue/toastservice';


// Tailwind CSS
import './assets/main.css'

const app = createApp(App)
app.component('Divider', Divider);
app.use(createPinia())
app.use(ToastService);
app.use(PrimeVue);    
app.mount('#app')



