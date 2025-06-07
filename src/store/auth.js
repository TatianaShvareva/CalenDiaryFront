// src/store/modules/auth.js
// Vuex module for authentication: handles login, registration, logout, OAuth2, etc.

import router from '@/router';
import authService from '@/services/authService';

const OAUTH2_GITHUB_AUTH_URL = 'http://localhost:8001/oauth2/authorization/github';

const authModule = {
  namespaced: true,

  state: {
    jwtToken: localStorage.getItem('jwt') || null,
    isAuthenticated: !!localStorage.getItem('jwt'),
    user: {
      id: localStorage.getItem('userId') || null,
      name: localStorage.getItem('userName') || null,
      email: localStorage.getItem('userEmail') || null,
      oauthUser: localStorage.getItem('oauthUser') || null,
      faceId: localStorage.getItem('faceId') || null,
    },
    signInError: null,
    registrationError: null
  },

  getters: {
    authenticated: (state) => state.isAuthenticated,
    jwtToken: (state) => state.jwtToken,
    user: (state) => state.user,
    userName: (state) => state.user.name,
    userId: (state) => state.user.id,
    oauthUser: (state) => state.user.oauthUser,
    faceId: (state) => state.user.faceId,
    signInError: (state) => state.signInError,
    registrationError: (state) => state.registrationError
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
        state.user.name = user.name;
        state.user.email = user.email;
        state.user.oauthUser = user.oauthUser;
        state.user.faceId = user.faceId;
        localStorage.setItem('userId', user.id);
        localStorage.setItem('userName', user.name);
        localStorage.setItem('userEmail', user.email);
        localStorage.setItem('oauthUser', user.oauthUser);
        localStorage.setItem('faceId', user.faceId);
      } else {
        state.user = { id: null, name: null, email: null, faceId: null, oauthUser: false };
        localStorage.removeItem('userId');
        localStorage.removeItem('userName');
        localStorage.removeItem('userEmail');
        localStorage.removeItem('faceId');
        localStorage.removeItem('oauthUser');
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
      state.user = { id: null, name: null, email: null, faceId: null, oauthUser: null };
      localStorage.clear();
    }
  },

  actions: {
    async insertUser({ commit }, userData) {
      commit('CLEAR_AUTH_ERRORS');
      try {
        const responseData = await authService.register(userData);

        if (responseData && responseData.token) {
          commit('SET_AUTH_DATA', {
            token: responseData.token,
            user: {
              id: responseData.userId,
              name: responseData.name,
              email: responseData.email,
              oauthUser: responseData.oauthUser,
              faceId: responseData.faceId,
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
        if (error.response?.data) {
          errorMessage = error.response.data.message || JSON.stringify(error.response.data);
        } else if (error.message) {
          errorMessage = error.message;
        }
        commit('SET_REGISTRATION_ERROR', errorMessage);
        throw error;
      }
    },

    async signIn({ commit }, credentials) {
      commit('CLEAR_AUTH_ERRORS');
      try {
        const responseData = await authService.login(credentials);
        //console.log("->>>>>>> responseData:", JSON.stringify(responseData, null, 2));
        if (responseData && responseData.token) {
          commit('SET_AUTH_DATA', {
            token: responseData.token,
            user: {
              id: responseData.userId,
              name: responseData.name,
              email: responseData.email,
              oauthUser: responseData.oauthUser,
              faceId: responseData.faceId,
            }
          });
          alert('Sign in successful!');
          router.push('/calendars');
        } else {
          alert('Login response did not contain a valid token.');
          router.push('/signin');
        }
      } catch (error) {
        console.error('Sign In failed:', error.response || error);
        let errorMessage = 'Invalid credentials or an unexpected error occurred.';
        if (error.response?.data) {
          errorMessage = error.response.data.message || JSON.stringify(error.response.data);
        } else if (error.message) {
          errorMessage = error.message;
        }
        commit('SET_SIGN_IN_ERROR', errorMessage);
      }
    },

    logout({ commit }) {
      commit('LOGOUT');
      //authService.logoutBackend();
      alert('Logged out successfully!');
      router.push('/');
    },

    initiateGithubLogin() {
      window.location.href = OAUTH2_GITHUB_AUTH_URL;
    },

    async handleOAuth2Redirect({ commit }, urlParams) {
      commit('CLEAR_AUTH_ERRORS');
      try {
        const token = urlParams.get('token');
        const id = urlParams.get('id');

        //const name = urlParams.get('username');
        const name = (urlParams.get('username') || '').split('@')[0] || 'Unknown';

        const email = urlParams.get('username');

        if (token) {
          commit('SET_AUTH_DATA', {
            token: token,
          //     oauthUser: responseData.oauthUser,
          // faceId: responseData.faceId,Add commentMore actions
            user: { id, name, email, }
          });
          alert('Login via GitHub successful!');
          router.push('/calendars');
        } else {
          console.error('OAuth2 redirect URL did not contain a token.');
          alert('GitHub login failed: No token received.');
          router.push('/signin');
        }
      } catch (error) {
        console.error('Error handling OAuth2 redirect:', error);
        alert('An error occurred during GitHub login.');
        router.push('/signin');
      }
    }
  }
};

export default authModule;
