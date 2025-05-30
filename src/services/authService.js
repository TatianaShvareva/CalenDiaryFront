// src/services/authService.js
import authApi from '@/api/authApi'; // Используем инстанс для AUTH бэкенда

export const authService = {
  async login(credentials) {
    try {
      const response = await authApi.post('/auth/login', credentials);
      // Если бэкенд возвращает ТОЛЬКО строку токена при успешном логине,
      // то возвращаем именно эту строку.
      return response.data; // Ожидается, что response.data будет строкой JWT
    } catch (error) {
      console.error('Auth Service: Login failed:', error.response ? error.response.data : error.message);
      throw error; // Перебрасываем ошибку для обработки на следующем уровне (Vuex action)
    }
  },

  async register(userData) {
    try {
      const response = await authApi.post('/auth/register', userData);
      // Для регистрации вы написали, что response.data может быть объектом с токеном или просто сообщением.
      // Возвращаем как есть.
      return response.data;
    } catch (error) {
      console.error('Auth Service: Registration failed:', error.response ? error.response.data : error.message);
      throw error;
    }
  },

  async logoutBackend() {
    try {
      // Пример: await authApi.post('/auth/logout'); // Если такой эндпоинт есть
      console.log("Auth Service: Logout backend endpoint called (if exists).");
    } catch (error) {
      console.error('Auth Service: Error calling logout backend endpoint:', error);
    }
  }
};

export default authService;