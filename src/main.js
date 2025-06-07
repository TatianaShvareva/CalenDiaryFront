import { createApp } from 'vue';
import App from './App.vue';
import router from './router';
import vuetify from './plugins/vuetify';
import store from './store/store';


import '@fontsource/roboto/300.css'; 
import '@fontsource/roboto/400.css'; 
import '@fontsource/roboto/500.css'; 
import '@fontsource/roboto/700.css'; 

const app = createApp(App);

app.use(store);
app.use(router);
app.use(vuetify);

import '@/assets/styles/fullcalendar-overrides.scss';

app.mount('#app');
