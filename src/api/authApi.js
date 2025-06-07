// src/api/authApi.js
// Axios instance for the authentication backend API.

import axios from 'axios';

const AUTH_BASE_URL = 'http://localhost:8001';

// console.log('--- Debug: AUTH_BASE_URL in authApi.js is:', AUTH_BASE_URL); // Debugging line, can be removed in production

const authApi = axios.create({
  baseURL: AUTH_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Intercepts and handles responses from the authentication API.
// Primarily for error handling (e.g., 401/403 status codes).
authApi.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response && (error.response.status === 401 || error.response.status === 403)) {
      console.warn('Authentication API: Unauthorized (401) or Forbidden (403) status received.');
    }
    return Promise.reject(error);
  }
);

export default authApi;

/**
 * Auth API Endpoints used by the frontend:
 *
 * @endpoint POST /auth/login
 * - Description: Authenticates a user.
 * - Request Body: { email, password }
 * - Response: { accessToken }
 *
 * @endpoint POST /auth/register
 * - Description: Registers a new user.
 * - Request Body: { email, password, name }
 * - Response: { message: "User registered successfully" } or { userId }
 */