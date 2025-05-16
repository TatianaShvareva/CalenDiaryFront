import { createApp } from 'vue';
import App from './App.vue';
import router from './router';
import vuetify from './plugins/vuetify';
import { loadFonts } from './plugins/webfontloader';

const store = require('./store/store').default;

loadFonts();

const app = createApp(App);

console.log(store);
app.use(store);
app.use(router);
app.use(vuetify);

app.mount('#app');