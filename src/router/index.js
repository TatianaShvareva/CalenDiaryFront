// C:\Users\human\.vscode\CalenDiaryFront\calendiary-frontend\src\router\index.js
import { createRouter, createWebHistory } from 'vue-router';
import HomeView from '@/views/HomeView.vue';
import Registration from '@/views/login/Registration.vue';
import SignIn from '@/views/login/SignIn.vue';
import CalendarsView from '@/views/CalendarsView.vue';
import AddEditEventView from '@/views/CalendarEvents/AddEditEventView.vue';
import store from '@/store/store'; // Правильный путь к вашему корневому store

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
    meta: { requiresAuth: true }, // Защищенный маршрут
  },
  {
    path: '/add-event/:date?',
    name: 'add-edit-event',
    component: AddEditEventView,
    props: true
  },
  {
    path: '/oauth-success', // <--- ИЗМЕНИТЕ ЗДЕСЬ!
    name: 'oauth2Redirect', // Имя маршрута можно оставить прежним или поменять
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

// Глобальный навигационный хук для защиты маршрутов
router.beforeEach(async (to, from, next) => {
  // Логика fetchUserProfile здесь отсутствует, так как вы решили ее удалить.
  // Это означает, что user.id и другие user-данные должны быть установлены
  // непосредственно в SET_AUTH_DATA при обычном логине и GitHub OAuth2.

  // Защита маршрутов
  if (to.matched.some(record => record.meta.requiresAuth)) {
    if (!store.getters['auth/authenticated']) {
      next({ name: 'signin' }); // Перенаправляем на логин, если не аутентифицирован
    } else {
      next(); // Все хорошо, разрешаем переход
    }
  } else {
    next(); // Разрешаем переход на незащищенные маршруты
  }
});

export default router;