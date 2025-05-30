// Vuex module for authentication, handling user login, registration, and session management.

import authService from '@/services/authService';
import router from '@/router';
// import { jwtDecode } from 'jwt-decode'; // Uncomment if JWT decoding is needed for user data

// GitHub OAuth2 authorization URL
const OAUTH2_GITHUB_AUTH_URL = 'http://localhost:8001/oauth2/authorization/github';

const authModule = {
  namespaced: true, // Ensures the module is self-contained with its own namespace

  state: {
    jwtToken: localStorage.getItem('jwt') || null, // Stores JWT token
    isAuthenticated: !!localStorage.getItem('jwt'), // Authentication status
    user: {
      id: localStorage.getItem('userId') || null,
      name: localStorage.getItem('userName') || null,
      email: localStorage.getItem('userEmail') || null,
      role: localStorage.getItem('userRole') || null,
    },
    signInError: null, // Error message for sign-in attempts
    registrationError: null, // Error message for registration attempts
  },

  getters: {
    authenticated: (state) => state.isAuthenticated,
    jwtToken: (state) => state.jwtToken,
    user: (state) => state.user, // Returns the full user object
    signInError: (state) => state.signInError,
    registrationError: (state) => state.registrationError,
    userName: (state) => state.user.name,
    userId: (state) => state.user.id,
    userRole: (state) => state.user.role,
  },

  mutations: {
    /**
     * Sets authentication data (token and user info) and updates localStorage.
     * @param {Object} state - Vuex state.
     * @param {Object} payload - Contains 'token' string and 'user' object.
     */
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
        state.user.role = user.role || 'USER'; // Default role
        localStorage.setItem('userId', user.id);
        localStorage.setItem('userName', user.name);
        localStorage.setItem('userEmail', user.email);
        localStorage.setItem('userRole', user.role || 'USER');
      } else {
        // Clear user data if no user object provided
        state.user = { id: null, name: null, email: null, role: null };
        localStorage.removeItem('userId');
        localStorage.removeItem('userName');
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
    /**
     * Clears all authentication data from state and localStorage.
     */
    LOGOUT(state) {
      state.jwtToken = null;
      state.isAuthenticated = false;
      state.user = { id: null, name: null, email: null, role: null };
      localStorage.clear(); // Clear all localStorage for a clean state
    },
  },

  actions: {
    /**
     * Registers a new user and attempts to log them in directly.
     * @param {Object} commit - Vuex commit function.
     * @param {Object} userData - User registration details (e.g., name, email, password).
     */
    async insertUser({ commit }, userData) {
      commit('CLEAR_AUTH_ERRORS');

      try {
        const responseData = await authService.register(userData);

        if (responseData && responseData.token) {
          // If backend returns token and user data upon registration
          commit('SET_AUTH_DATA', {
            token: responseData.token,
            user: {
              id: responseData.user?.id,
              name: responseData.user?.name,
              email: responseData.user?.email,
              role: responseData.user?.role
            }
          });
          alert('Registration successful! You are now logged in.');
          router.push('/calendars');
        } else {
          // If registration is successful but no token is returned (e.g., just a message)
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
        throw error; // Re-throw to allow component to catch
      }
    },

    /**
     * Attempts to sign in a user with provided credentials.
     * @param {Object} commit - Vuex commit function.
     * @param {Object} credentials - User login credentials (email, password).
     */
    async signIn({ commit }, credentials) {
      commit('CLEAR_AUTH_ERRORS');

      try {
        const token = await authService.login(credentials); // authService returns only token string
        const user = null; // Backend might not send user details with login response for now

        if (token && typeof token === 'string' && token.length > 0) {
          commit('SET_AUTH_DATA', { token: token, user: user });
          alert('Sign in successful!');
          router.push('/calendars');
        } else {
          console.error('Sign In successful but no valid token string received or token is empty.');
          alert('Sign in successful, but failed to get user token.');
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
        // Do not re-throw here if you want the error to be handled primarily by the state.
      }
    },

    /**
     * Logs out the user by clearing local authentication data and calling backend logout (if applicable).
     * @param {Object} commit - Vuex commit function.
     */
    logout({ commit }) {
      commit('LOGOUT');
      authService.logoutBackend(); // Call backend logout endpoint if it exists
      alert('Logged out successfully!');
      router.push('/'); // Redirect to home or sign-in page after logout
    },

    /**
     * Initiates the GitHub OAuth2 login flow by redirecting the user to the GitHub authorization URL.
     */
    initiateGithubLogin() {
      window.location.href = OAUTH2_GITHUB_AUTH_URL;
    },

    /**
     * Handles the redirect after successful OAuth2 authentication.
     * Extracts token and user data from URL parameters and sets authentication state.
     * @param {Object} commit - Vuex commit function.
     * @param {URLSearchParams} urlParams - URLSearchParams object containing parameters from the redirect.
     */
    async handleOAuth2Redirect({ commit }, urlParams) {
      commit('CLEAR_AUTH_ERRORS');
      try {
        const token = urlParams.get('token');
        const id = urlParams.get('id');
        const name = urlParams.get('username'); // Assuming backend provides 'username'
        const email = urlParams.get('email');
        const role = urlParams.get('role');

        if (token) {
          commit('SET_AUTH_DATA', {
            token: token,
            user: { id, name, email, role: role || 'USER' }
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
    },
  },
};

export default authModule;