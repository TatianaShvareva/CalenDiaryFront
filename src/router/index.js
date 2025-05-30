// C:\Users\human\.vscode\CalenDiaryFront\calendiary-frontend\src\router\index.js
import { createRouter, createWebHistory } from 'vue-router';
import HomeView from '@/views/HomeView.vue';
import Registration from '@/views/login/Registration.vue';
import SignIn from '@/views/login/SignIn.vue';
import CalendarsView from '@/views/CalendarsView.vue';
import AddEditEventView from '@/views/CalendarEvents/AddEditEventView.vue'; // <-- Убедитесь, что это правильный путь
import store from '@/store/store';

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
    component: CalendarsView,
    meta: { requiresAuth: true },
  },
  {
    // Маршрут для ДОБАВЛЕНИЯ события
    path: '/add-event/:date?', // :date? делает параметр необязательным
    name: 'add-event',
    component: AddEditEventView, // <-- Указываем на ваш универсальный компонент
    props: true, // Передаем параметры маршрута как пропсы компоненту
    meta: { requiresAuth: true }
  },
  {
    // Маршрут для РЕДАКТИРОВАНИЯ события
    path: '/edit-event/:id', // <-- НОВЫЙ МАРШРУТ для редактирования
    name: 'edit-event',
    component: AddEditEventView, // <-- ТОЖЕ Указываем на ваш универсальный компонент
    props: true, // Передаем ID как пропс (или можно получить через useRoute().params.id)
    meta: { requiresAuth: true }
  },
  {
    path: '/oauth-success',
    name: 'oauth2Redirect',
    beforeEnter: (to, from, next) => {
      const urlParams = new URLSearchParams(window.location.search);
      store.dispatch('auth/handleOAuth2Redirect', urlParams)
        .then(() => {
          // Если handleOAuth2Redirect уже делает router.push('/calendars'), то здесь ничего не нужно
        })
        .catch(() => {
          next('/signin');
        });
    },
    component: { template: '<div></div>' },
    meta: { requiresAuth: false }
  },
];


const router = createRouter({
  history: createWebHistory(process.env.BASE_URL),
  routes
});

router.beforeEach(async (to, from, next) => {
  if (to.matched.some(record => record.meta.requiresAuth)) {
    if (!store.getters['auth/authenticated']) {
      next({ name: 'signin' });
    } else {
      next();
    }
  } else {
    next();
  }
});

export default router;