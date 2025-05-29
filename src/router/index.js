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
    // Маршрут для обработки OAuth2 редиректа от бэкенда
    // Бэкенд перенаправляет сюда с токеном, id, username, email, role в параметрах URL
    path: '/oauth2/redirect',
    name: 'oauth2Redirect',
    beforeEnter: (to, from, next) => {
      const urlParams = new URLSearchParams(to.fullPath.split('?')[1]); // Получаем параметры из URL
      // Проверяем, есть ли токен в URL. Если есть, передаем его в auth модуль
      if (urlParams.has('token')) {
        store.dispatch('auth/handleOAuth2Redirect', urlParams);
        next('/'); // Перенаправляем на главную после обработки
      } else {
        console.error('OAuth2 redirect URL did not contain a token.');
        next('/signin'); // Если токена нет, что-то пошло не так, перенаправляем на логин
      }
    },
  },
];

const router = createRouter({
  history: createWebHistory(process.env.BASE_URL),
  routes
});

// Глобальный навигационный хук для защиты маршрутов
router.beforeEach(async (to, from, next) => {
  // Перед каждым маршрутом пытаемся получить профиль пользователя, если токен есть, но профиля нет
  // Это полезно при перезагрузке страницы
  if (store.getters['auth/jwtToken'] && !store.getters['auth/user'].id) {
    try {
      await store.dispatch('auth/fetchUserProfile');
    } catch (error) {
      console.warn("Failed to re-fetch user profile on navigation, likely due to expired token.");
      // Если профиль не удалось получить, токен недействителен, интерсептор уже разлогинит
    }
  }

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