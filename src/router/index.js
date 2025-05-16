import { createRouter, createWebHashHistory } from 'vue-router';
import HomeView from '@/views/HomeView.vue';
import Registration from '@/views/login/Registration.vue';
import SignIn from '@/views/login/SignIn.vue'; // <--- Добавьте этот импорт

const routes = [
  {
    path: '/',
    name: 'home',
    component: HomeView
  },
  {
    path: '/registration',
    name: 'registration',
    component: Registration
  },
  {
    path: '/signin',
    name: 'signin',
    component: SignIn // <--- Используйте импортированный компонент
  },
  // ... другие ваши маршруты (если есть)
];

const router = createRouter({
  history: createWebHashHistory(),
  routes
});

export default router;