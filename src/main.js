import { createApp } from 'vue';
import App from './App.vue';
import router from './router';

// Import PrimeVue and PrimeIcons
import PrimeVue from 'primevue/config';
import Aura from '@primevue/themes/aura';
import 'primeflex/primeflex.css';
import 'primeicons/primeicons.css'


// Import individual PrimeVue components
import Button from 'primevue/button';

const app = createApp(App);

// Use PrimeVue
app.use(PrimeVue, {
    theme: {
        preset: Aura
    }
}
);

// Register individual PrimeVue components globally
app.component('Button', Button);

app.use(router);
app.mount('#app');
