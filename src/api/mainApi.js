// src/api/mainApi.js
// This module provides an Axios instance for interacting with the main backend API.
// It handles JWT token injection for authenticated requests and global error handling.

import router from '@/router';
import store from '@/store/store';
import axios from 'axios';

// Base URL for the main application API.
const API_BASE_URL = 'http://localhost:8002';

// Create an Axios instance for the main API.
const mainApi = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request Interceptor: Attaches JWT Authorization token to outgoing requests.
// This ensures that all requests to the main API (which are typically authenticated)
// include the necessary token from the Vuex store.
mainApi.interceptors.request.use(
  (config) => {
    const token = store.getters['auth/jwtToken'];
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response Interceptor: Handles API responses, especially for unauthorized (401) or forbidden (403) errors.
// If a 401/403 status is received, it triggers a logout process and redirects the user to the sign-in page,
// unless the current route is already sign-in or registration.
mainApi.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response && (error.response.status === 401 || error.response.status === 403)) {
      console.warn('Unauthorized or Forbidden access to Main API. Initiating logout and redirect.');
      const currentRouteName = router.currentRoute.value.name;

      if (currentRouteName !== 'signin' && currentRouteName !== 'registration') {
        store.dispatch('auth/logout');
        router.push('/signin');
      }
    }
    return Promise.reject(error);
  }
);

export default mainApi;

/**
 * Common Main API Endpoints (examples):
 *
 * @endpoint GET /calendars
 * - Description: Retrieves a list of calendars for the authenticated user.
 * - Response: [{ id, name, color, ... }]
 *
 * @endpoint POST /calendars
 * - Description: Creates a new calendar.
 * - Request Body: { name, color }
 *
 * @endpoint PUT /calendars/{calendarId}
 * - Description: Updates an existing calendar.
 * - Request Body: { name, color }
 *
 * @endpoint DELETE /calendars/{calendarId}
 * - Description: Deletes a specific calendar.
 *
 * @endpoint GET /events
 * - Description: Retrieves events based on filters (e.g., date range, calendar ID).
 * - Query Params: startDate, endDate, calendarId
 * - Response: [{ id, title, start, end, ... }]
 *
 * @endpoint POST /events
 * - Description: Creates a new event.
 * - Request Body: { title, description, start, end, allDay, calendarId }
 *
 * @endpoint PUT /events/{eventId}
 * - Description: Updates an existing event.
 * - Request Body: { title, description, start, end, allDay, calendarId }
 *
 * @endpoint DELETE /events/{eventId}
 * - Description: Deletes a specific event.
 *
 * @endpoint GET /labels
 * - Description: Retrieves available event labels/categories.
 * - Response: [{ id, name, color }]
 */