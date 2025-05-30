// src/api/authApi.js (для взаимодействия с бэкендом аутентификации: /auth/login, /auth/register)
import axios from 'axios';

const AUTH_BASE_URL = 'http://localhost:8001';

console.log('--- Debug: AUTH_BASE_URL in authApi.js is:', AUTH_BASE_URL);

const authApi = axios.create({
  baseURL: AUTH_BASE_URL, // Используем URL бэкенда аутентификации
  headers: {
    'Content-Type': 'application/json',
  },
});

// Для аутентификационных запросов (login, register) токен не добавляется
// Здесь не нужен interceptor.request, так как authApi не отправляет токен.
// Если бы были аутентифицированные эндпоинты НА ЭТОМ бэкенде (например, для проверки токена),
// тогда бы он здесь был. Пока что оставляем без него.

// Перехватчик ответов: обрабатываем ошибки, особенно 401/403
authApi.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response && (error.response.status === 401 || error.response.status === 403)) {
      console.warn('Authentication API returned 401/403. Likely bad credentials or token issue.');
      // Здесь не нужно разлогинивать, так как это запрос на ЛОГИН.
      // Ошибка 401/403 означает, что логин не удался.
      // Можно добавить специфическую обработку, если нужно.
    }
    return Promise.reject(error);
  }
);

export default authApi;