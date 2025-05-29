// C:\Users\human\.vscode\CalenDiaryFront\calendiary-frontend\src\store\auth.js
import axios from '@/api/axios'; // Import our configured axios instance
import router from '@/router'; // Import router for redirections

// Constants for API URLs
const AUTH_API_PREFIX = '/auth'; // Prefix for all authentication endpoints
// const OAUTH2_GITHUB_URL = 'http://localhost:8001/oauth2/authorization/github'; // Removed: GitHub OAuth2 URL is no longer needed

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
    // Removed: foldersData mutation is not needed in the auth module
  },

  actions: {
    async insertUser({ commit }, userData) {
      commit('CLEAR_AUTH_ERRORS'); // Clear previous errors

      try {
        // Use headers: { skipAuthorization: true } so Axios interceptor doesn't try to add a token
        const response = await axios.post(`${AUTH_API_PREFIX}/register`, userData, {
          headers: { skipAuthorization: true }
        });

        // Backend returns token, id, name, email, role after registration
        if (response.data && response.data.token) {
          commit('SET_AUTH_DATA', {
            token: response.data.token,
            user: {
              id: response.data.id,
              name: response.data.name, // Use 'name' from backend response
              email: response.data.email,
              role: response.data.role
            }
          });
          alert('Registration successful! You are now logged in.');
          router.push('/');
        } else {
          // If for some reason the token was not returned, but status is 200
          alert('Registration successful! Please sign in.');
          router.push('/signin');
        }
      } catch (error) {
        console.error('Registration failed:', error.response || error);
        let errorMessage = 'An unexpected error occurred during registration.';
        if (error.response && error.response.data) {
          // If backend returns an object with validation errors (e.g., from Spring Boot)
          if (typeof error.response.data === 'object' && error.response.data.message) {
            errorMessage = error.response.data.message; // Example: if error is in 'message' field
          } else if (typeof error.response.data === 'string') {
            errorMessage = error.response.data;
          } else if (error.response.data.errors) { // For field validation errors, if any
            errorMessage = Object.values(error.response.data.errors).flat().join('\n');
          }
        }
        commit('SET_REGISTRATION_ERROR', errorMessage);
        throw error; // Re-throw error for the component if it wants to handle it
      }
    },

    async signIn({ commit, dispatch }, credentials) {
      commit('CLEAR_AUTH_ERRORS'); // Clear previous errors

      try {
        // Use headers: { skipAuthorization: true } so Axios interceptor doesn't try to add a token
        const response = await axios.post(`${AUTH_API_PREFIX}/login`, credentials, {
          headers: { skipAuthorization: true }
        });
        // Backend returns a raw JWT token in the response body
        const token = response.data; // Now it's just a token string

        if (token) {
          // Set token, but don't get user info yet
          commit('SET_AUTH_DATA', { token: token, user: null });
          await dispatch('fetchUserProfile'); // Request user profile after login
          alert('Sign in successful!');
          router.push('/');
        }
      } catch (error) {
        console.error('Sign In failed:', error.response || error);
        let errorMessage = 'Invalid credentials or an unexpected error occurred.';
        if (error.response && error.response.data) {
          // Assume backend returns an error message
          errorMessage = error.response.data;
        }
        commit('SET_SIGN_IN_ERROR', errorMessage);
        throw error; // Re-throw error
      }
    },

    // Action to fetch current user information (after login)
    async fetchUserProfile({ commit, state }) {
      if (!state.jwtToken) {
        console.warn("No JWT token available to fetch user profile. User might be logged out or token expired.");
        // Could also log out here if token is missing, though interceptor should handle 401/403
        commit('LOGOUT');
        return;
      }
      try {
        // Assume the endpoint for fetching profile is /auth/profile
        const response = await axios.get(`${AUTH_API_PREFIX}/profile`);
        // Update user data in state
        commit('SET_AUTH_DATA', {
          token: state.jwtToken, // Token remains the same
          user: {
            id: response.data.id,
            name: response.data.name, // Use 'name' from profile
            email: response.data.email,
            role: response.data.role
          }
        });
        console.log('User profile fetched:', response.data);
      } catch (error) {
        console.error('Failed to fetch user profile:', error.response || error);
        // Axios interceptor should already handle 401/403, but as a fallback
        if (error.response && (error.response.status === 401 || error.response.status === 403)) {
          commit('LOGOUT');
          alert('Session expired. Please log in again.');
          router.push('/signin');
        }
        throw error;
      }
    },

    logout({ commit }) {
      commit('LOGOUT');
      alert('Logged out successfully!');
      router.push('/'); // Redirect to home or sign-in page
    },

    // Removed: Action for handling OAuth2 redirect (from GitHub)
    // Removed: Action for initiating GitHub OAuth2 authorization
  },
};

export default authModule;