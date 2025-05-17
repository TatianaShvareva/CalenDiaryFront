import { createRouter, createWebHashHistory } from 'vue-router';
import HomeView from '@/views/HomeView.vue';
import Registration from '@/views/login/Registration.vue';
import SignIn from '@/views/login/SignIn.vue';
import CalendarsView from '@/components/CalendarsView.vue'; // <--- Правильный путь теперь

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
    component: SignIn
  },
  {
    path: '/calendars',
    name: 'calendars',
    component: CalendarsView // <--- Правильный компонент теперь
  }
  // ... другие ваши маршруты (если есть)
];

const router = createRouter({
  history: createWebHashHistory(),
  routes
});

export default router;