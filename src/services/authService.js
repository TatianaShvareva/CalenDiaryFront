// src/services/authService.js
// Provides methods for user authentication and registration by interacting with the auth API.

import authApi from '@/api/authApi'; // Axios instance configured for the authentication backend

export const authService = {
  /**
   * Attempts to log in a user with the provided credentials.
   * @param {Object} credentials - User login credentials (e.g., { email, password }).
   * @returns {Promise<Object>} A promise that resolves with the full AuthResponse object:
   *    {
   *      token: "JWT...",
   *      userId: 123,
   *      email: "user@example.com",
   *      name: "John Doe",
   *      oauthUser: false,
   *      faceId: null
   *    }
   */
  async login(credentials) {
    try {
      const response = await authApi.post('/auth/login', credentials);
      return response.data; // now contains full AuthResponse object
    } catch (error) {
      console.error('Auth Service: Login failed:', error.response ? error.response.data : error.message);
      throw error;
    }
  },

  /**
   * Registers a new user with the provided data.
   * @param {Object} userData - User registration data (e.g., name, email, password).
   * @returns {Promise<Object>} A promise that resolves with the full AuthResponse object.
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
   * Optionally logs out the user on the backend (if an endpoint exists).
   * Mainly used for client-side cleanup in this app.
   */
  async logoutBackend() {
    try {
      // Uncomment if backend logout endpoint is implemented
      // await authApi.post('/auth/logout');
      console.log("Auth Service: Backend logout call (if endpoint exists).");
    } catch (error) {
      console.error('Auth Service: Error calling logout backend endpoint:', error);
    }
  }
};

export default authService;
