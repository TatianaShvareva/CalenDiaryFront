// src/api/mainApi.js (для взаимодействия с основным бэкендом: /calendar, /labels)
import axios from 'axios';
//import { API_BASE_URL } from '@/config/apiConfig'; // Импортируем из нового файла
import store from '@/store/store';
import router from '@/router';

const API_BASE_URL = 'http://localhost:8002'

const mainApi = axios.create({
  baseURL: API_BASE_URL, // Используем URL основного API
  headers: {
    'Content-Type': 'application/json',
  },
});

// Перехватчик запросов: добавляем JWT-токен авторизации
mainApi.interceptors.request.use(
  (config) => {
    const token = store.getters['auth/jwtToken'];
    // Здесь мы всегда добавляем токен, если он есть, так как это
    // основной API, и большинство его эндпоинтов аутентифицированы.
    // Исключения (no-auth эндпоинты) будут обрабатываться по-другому,
    // см. ниже в сервисах.
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Перехватчик ответов: обрабатываем ошибки, особенно 401 (Unauthorized)
mainApi.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response && (error.response.status === 401 || error.response.status === 403)) {
      console.warn('Unauthorized or Forbidden access to Main API. Logging out...');
      // Если это не страницы входа/регистрации (чтобы избежать бесконечного редиректа)
      const currentRouteName = router.currentRoute.value.name;
      if (currentRouteName !== 'signin' && currentRouteName !== 'registration') {
        store.dispatch('auth/logout'); // Разлогиниваем
        router.push('/signin'); // Перенаправляем на страницу входа
      }
    }
    return Promise.reject(error);
  }
);

export default mainApi;