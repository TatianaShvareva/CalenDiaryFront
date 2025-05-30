// src/services/authService.js
// Provides methods for user authentication and registration by interacting with the auth API.

import authApi from '@/api/authApi'; // Axios instance configured for the authentication backend

export const authService = {
  /**
   * Attempts to log in a user with the provided credentials.
   * @param {Object} credentials - User login credentials (e.g., { email, password }).
   * @returns {Promise<string>} A promise that resolves with the JWT token string on success.
   * @throws {Error} Throws an error if the login fails.
   */
  async login(credentials) {
    try {
      const response = await authApi.post('/auth/login', credentials);
      // Expects the backend to return the JWT token directly in response.data
      return response.data;
    } catch (error) {
      console.error('Auth Service: Login failed:', error.response ? error.response.data : error.message);
      throw error;
    }
  },

  /**
   * Attempts to register a new user with the provided data.
   * @param {Object} userData - User registration data.
   * @returns {Promise<Object>} A promise that resolves with the backend response (e.g., { token: '...' } or { message: '...' }).
   * @throws {Error} Throws an error if the registration fails.
   */
  async register(userData) {
    try {
      const response = await authApi.post('/auth/register', userData);
      return response.data;
    } catch (error) {
      console.error('Auth Service: Registration failed:', error.response ? error.response.data : error.message);
      throw error;
    }
  },

  /**
   * (Optional) Calls a backend endpoint to invalidate session/token on the server side.
   * This method might be empty if the backend doesn't require an explicit logout endpoint,
   * relying instead on client-side token deletion.
   * Current backend implementation does not provide a dedicated logout endpoint.
   */
  async logoutBackend() {
    try {
      // Example: await authApi.post('/auth/logout'); // Uncomment if backend has a logout endpoint
      console.log("Auth Service: Backend logout call (if endpoint exists).");
    } catch (error) {
      console.error('Auth Service: Error calling logout backend endpoint:', error);
      // Do not re-throw error for logout, as client-side cleanup is primary
    }
  }
};

export default authService;