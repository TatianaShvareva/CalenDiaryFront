// C:\Users\human\.vscode\CalenDiaryFront\calendiary-frontend\src\api\axios.js
import axios from 'axios';
import store from '@/store/store'; // Путь к вашему корневому store
import router from '@/router'; // Импортируем router

const instance = axios.create({
  baseURL: 'http://localhost:8001', // Базовый URL вашего бэкенда
  headers: {
    'Content-Type': 'application/json',
  },
});

// Перехватчик запросов: добавляем JWT-токен авторизации
instance.interceptors.request.use(
  (config) => {
    // Проверяем, существует ли токен в store (jwtToken теперь)
    const token = store.getters['auth/jwtToken'];

    // Если токен есть И запрос не содержит специального флага 'skipAuthorization'
    // 'skipAuthorization' будет использоваться для запросов signIn и register, которым токен не нужен
    if (token && !config.headers.skipAuthorization) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Перехватчик ответов: обрабатываем ошибки, особенно 401 (Unauthorized)
instance.interceptors.response.use(
  (response) => {
    return response;
  },
  (error) => {
    // Если получаем ошибку 401 (Unauthorized) или 403 (Forbidden)
    if (error.response && (error.response.status === 401 || error.response.status === 403)) {
      console.warn('Unauthorized or Forbidden access. Logging out...');
      // Если это не страница входа, то разлогиниваем и перенаправляем
      if (router.currentRoute.value.name !== 'signin' && router.currentRoute.value.name !== 'registration') {
        store.dispatch('auth/logout'); // Вызываем действие logout из Vuex Store
        router.push('/signin'); // Перенаправляем пользователя на страницу входа
      }
    }
    return Promise.reject(error);
  }
);

export default instance;