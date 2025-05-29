// C:\Users\human\.vscode\CalenDiaryFront\calendiary-frontend\src\main.js
import { createApp } from 'vue';
import App from './App.vue';
import router from './router';
import vuetify from './plugins/vuetify';
import { loadFonts } from './plugins/webfontloader';
import store from './store/store'; // Правильный импорт

loadFonts();

const app = createApp(App);

// console.log(store); // Этот console.log можно убрать
app.use(store);
app.use(router);
app.use(vuetify);

app.mount('#app');