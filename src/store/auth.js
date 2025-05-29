// C:\Users\human\.vscode\CalenDiaryFront\calendiary-frontend\src\store\auth.js

import axios from '@/api/axios'; // Import our configured axios instance
import router from '@/router'; // Import router for redirections
// import { jwtDecode } from 'jwt-decode'; // <-- Раскомментировать, если решите декодировать JWT для email (пока не требуется)

// Constants for API URLs
const AUTH_API_PREFIX = '/auth'; // Prefix for all authentication endpoints

// НОВАЯ КОНСТАНТА ДЛЯ GITHUB OAUTH2
const OAUTH2_GITHUB_AUTH_URL = 'http://localhost:8001/oauth2/authorization/github'; // URL для начала GitHub OAuth2 потока
// Убедитесь, что этот URL правильный и соответствует вашему бэкенду.

const authModule = {
  namespaced: true,

  state: {
    jwtToken: localStorage.getItem('jwt') || null, // Store a single JWT
    isAuthenticated: !!localStorage.getItem('jwt'), // Initialize from localStorage
    user: {
      id: localStorage.getItem('userId') || null,
      name: localStorage.getItem('userName') || null, // Added 'name' to user state
      email: localStorage.getItem('userEmail') || null,
      role: localStorage.getItem('userRole') || null,
    },
    signInError: null,
    registrationError: null,
  },

  getters: {
    authenticated: (state) => state.isAuthenticated,
    jwtToken: (state) => state.jwtToken,
    user: (state) => state.user, // Returns user object {id, name, email, role}
    signInError: (state) => state.signInError,
    registrationError: (state) => state.registrationError,
    userName: (state) => state.user.name, // Getter for user's name
    userId: (state) => state.user.id,
    userRole: (state) => state.user.role,
  },

  mutations: {
    SET_AUTH_DATA(state, { token, user }) {
      state.jwtToken = token;
      state.isAuthenticated = !!token;

      if (token) {
        localStorage.setItem('jwt', token);
      } else {
        localStorage.removeItem('jwt');
      }

      if (user) {
        state.user.id = user.id;
        state.user.name = user.name; // Set user's name
        state.user.email = user.email;
        state.user.role = user.role || 'USER'; // Default role
        localStorage.setItem('userId', user.id);
        localStorage.setItem('userName', user.name); // Store user's name in localStorage
        localStorage.setItem('userEmail', user.email);
        localStorage.setItem('userRole', user.role || 'USER');
      } else {
        state.user = { id: null, name: null, email: null, role: null }; // Reset user state
        localStorage.removeItem('userId');
        localStorage.removeItem('userName'); // Remove user's name from localStorage
        localStorage.removeItem('userEmail');
        localStorage.removeItem('userRole');
      }
    },
    SET_SIGN_IN_ERROR(state, error) {
      state.signInError = error;
    },
    SET_REGISTRATION_ERROR(state, error) {
      state.registrationError = error;
    },
    CLEAR_AUTH_ERRORS(state) {
      state.signInError = null;
      state.registrationError = null;
    },
    LOGOUT(state) {
      state.jwtToken = null;
      state.isAuthenticated = false;
      state.user = { id: null, name: null, email: null, role: null }; // Reset user state on logout
      localStorage.clear(); // Clear all localStorage for a clean state
    },
  },

  actions: {
    async insertUser({ commit }, userData) {
      commit('CLEAR_AUTH_ERRORS'); // Clear previous errors

      try {
        const response = await axios.post(`${AUTH_API_PREFIX}/register`, userData, {
          headers: { skipAuthorization: true }
        });

        // Внимательно: если бэкенд возвращает только текстовое сообщение "User registered successfully",
        // тогда response.data.token будет undefined, и код пойдет в else.
        // Если бэкенд возвращает токен после регистрации, то это хорошо.
        if (response.data && response.data.token) {
          commit('SET_AUTH_DATA', {
            token: response.data.token,
            user: {
              id: response.data.id,
              name: response.data.name,
              email: response.data.email,
              role: response.data.role
            }
          });
          alert('Registration successful! You are now logged in.');
          router.push('/calendars');
        } else {
          alert('Registration successful! Please sign in.');
          router.push('/signin');
        }
      } catch (error) {
        console.error('Registration failed:', error.response || error);
        let errorMessage = 'An unexpected error occurred during registration.';
        if (error.response && error.response.data) {
          if (typeof error.response.data === 'object' && error.response.data.message) {
            errorMessage = error.response.data.message;
          } else if (typeof error.response.data === 'string') {
            errorMessage = error.response.data;
          } else if (error.response.data.errors) {
            errorMessage = Object.values(error.response.data.errors).flat().join('\n');
          }
        }
        commit('SET_REGISTRATION_ERROR', errorMessage);
        throw error;
      }
    },

    async signIn({ commit }, credentials) {
      commit('CLEAR_AUTH_ERRORS');

      try {
        const response = await axios.post(`${AUTH_API_PREFIX}/login`, credentials, {
          headers: { skipAuthorization: true }
        });

        const token = response.data; // Ожидаем, что бэкенд возвращает ТОЛЬКО строку JWT-токена

        if (typeof token === 'string' && token.length > 0) {
          // Если бэкенд возвращает только токен, а не объект с данными пользователя,
          // user будет null. Возможно, вам понадобится другой эндпоинт для получения профиля
          // или декодирование токена, если он содержит id/email.
          // Для простоты, пока что user: null, так как он не приходит с логином.
          commit('SET_AUTH_DATA', { token: token, user: null }); // user: null, так как данные не пришли
          alert('Sign in successful!');
          router.push('/calendars');
        } else {
          // Это случится, если response.data не строка или пустая
          console.error('Sign In successful but no valid token string received or token is empty.');
          alert('Sign in successful, but failed to get user token.');
          router.push('/signin');
        }
      } catch (error) {
        console.error('Sign In failed:', error.response || error);
        let errorMessage = 'Invalid credentials or an unexpected error occurred.';
        if (error.response && error.response.data) {
          errorMessage = error.response.data; // Здесь вы ожидаете, что error.response.data - это строка ошибки
        }
        commit('SET_SIGN_IN_ERROR', errorMessage);
        throw error;
      }
    },

    logout({ commit }) {
      commit('LOGOUT');
      alert('Logged out successfully!');
      router.push('/'); // После выхода можно перенаправить на главную или на страницу входа
    },

    // НОВЫЙ ЭКШЕН: для запуска процесса аутентификации через GitHub OAuth2
    initiateGithubLogin() {
      // Просто перенаправляем пользователя на URL авторизации GitHub OAuth2
      window.location.href = OAUTH2_GITHUB_AUTH_URL;
    },

    // НОВЫЙ ЭКШЕН: для обработки редиректа после успешной аутентификации через OAuth2
    // Этот экшен будет вызываться из router/index.js после редиректа от GitHub
    async handleOAuth2Redirect({ commit }, urlParams) {
      commit('CLEAR_AUTH_ERRORS');
      try {
        const token = urlParams.get('token');
        const id = urlParams.get('id');
        const name = urlParams.get('username'); // Backend часто возвращает 'username'
        const email = urlParams.get('email');
        const role = urlParams.get('role');

        if (token) {
          // Устанавливаем токен и данные пользователя, полученные из URL
          commit('SET_AUTH_DATA', {
            token: token,
            user: { id, name, email, role: role || 'USER' } // Убедимся, что роль по умолчанию 'USER'
          });
          alert('Login via GitHub successful!');
          router.push('/calendars'); // Перенаправляем на страницу календаря
        } else {
          console.error('OAuth2 redirect URL did not contain a token.');
          alert('GitHub login failed: No token received.');
          router.push('/signin'); // Если токена нет, что-то пошло не так, перенаправляем на логин
        }
      } catch (error) {
        console.error('Error handling OAuth2 redirect:', error);
        alert('An error occurred during GitHub login.');
        router.push('/signin');
      }
    },
  },
};

export default authModule;