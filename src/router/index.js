import { createRouter, createWebHashHistory } from 'vue-router';
import HomeView from '@/views/HomeView.vue';
import Registration from '@/views/login/Registration.vue';
import SignIn from '@/views/login/SignIn.vue';
import CalendarsView from '@/views/CalendarsView.vue';
import AddEditEventView from '@/views/CalendarEvents/AddEditEventView.vue';

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
    component: CalendarsView
  },
  {
    path: '/add-event/:date', // <--- Добавьте этот маршрут
    name: 'add-event',
    component: AddEditEventView
  }
  // ... другие ваши маршруты (если есть)
];

const router = createRouter({
  history: createWebHashHistory(),
  routes
});

export default router;