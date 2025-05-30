// src/api/authApi.js
// This module provides an Axios instance for interacting with the authentication backend.

import axios from 'axios';

// Base URL for the authentication backend API.
const AUTH_BASE_URL = 'http://localhost:8001';

console.log('--- Debug: AUTH_BASE_URL in authApi.js is:', AUTH_BASE_URL);

const authApi = axios.create({
  baseURL: AUTH_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Axios Interceptor for Response Handling:
// This interceptor processes responses from the authentication API.
// It's primarily used for error handling, especially for 401/403 status codes.
authApi.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response && (error.response.status === 401 || error.response.status === 403)) {
      console.warn('Authentication API returned 401/403 status. This usually indicates bad credentials or a failed authentication attempt.');
    }
    return Promise.reject(error);
  }
);

export default authApi;

/**
 * Common Authentication Endpoints (examples):
 *
 * @endpoint POST /auth/login
 * - Description: Authenticates a user and typically returns an access token.
 * - Request Body: { email, password }
 * - Response: { accessToken, refreshToken, userDetails }
 *
 * @endpoint POST /auth/register
 * - Description: Registers a new user account.
 * - Request Body: { email, password, firstName, lastName }
 * - Response: { message: "User registered successfully" } or { userId }
 *
 * @endpoint POST /auth/logout (if applicable to this backend, might be handled by resource server)
 * - Description: Invalidates the user's session or token.
 * - Request Body: (optional) { refreshToken }
 */