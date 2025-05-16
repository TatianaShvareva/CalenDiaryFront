import { createRouter, createWebHistory } from 'vue-router';
import HomeView from '../components/HomeView.vue';
// import RegistrationView from '../views/RegistrationView.vue';

const routes = [
  {
    path: '/',
    name: 'home',
    component: HomeView
  },
  {
    path: '/registration',
    name: 'registration',
    // component: RegistrationView
  },
  // Другие маршруты
];

const router = createRouter({
  history: createWebHistory(),
  routes
});

export default router;