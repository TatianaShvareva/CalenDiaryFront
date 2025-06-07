// src/api/mainApi.js
// Configures an Axios instance for the main application API.
// Handles JWT token injection and global error responses (401/403).

import router from '@/router';
import store from '@/store/store';
import axios from 'axios';

const API_BASE_URL = 'http://localhost:8002'; // Base URL for the main application API.

const mainApi = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request Interceptor: Attaches JWT token from Vuex store to Authorization header.
mainApi.interceptors.request.use(
  (config) => {
    const token = store.getters['auth/jwtToken'];
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Response Interceptor: Handles 401/403 errors by logging out and redirecting to sign-in.
mainApi.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response && (error.response.status === 401 || error.response.status === 403)) {
      console.warn('Main API: Unauthorized (401) or Forbidden (403) access. Initiating logout.');
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
 * Main API Endpoints used by the frontend (as per associated services):
 *
 * Calendar Endpoints (from calendarService.js):
 * @endpoint GET /calendar/my-entries
 * - Description: Retrieves all calendar entries for the authenticated user.
 *
 * @endpoint GET /calendar/my-entries/{id}
 * - Description: Retrieves a specific calendar entry by ID.
 *
 * @endpoint POST /calendar/my-entries
 * - Description: Creates a new calendar entry.
 * - Request Body: { title, startTime, endTime, description, location, labels, diaryEntry, moodRating, userId }
 *
 * @endpoint PUT /calendar/my-entries/{id}
 * - Description: Updates an existing calendar entry by ID.
 * - Request Body: { title, startTime, endTime, description, location, labels, diaryEntry, moodRating }
 *
 * @endpoint DELETE /calendar/my-entries/{id}
 * - Description: Deletes a specific calendar entry by ID.
 *
 * @endpoint DELETE /calendar/my-entries
 * - Description: Deletes all calendar entries for the authenticated user. (Use with caution!)
 *
 * Label Endpoints (from labelService.js):
 * @endpoint GET /labels
 * - Description: Retrieves all available event labels.
 *
 * @endpoint POST /labels
 * - Description: Creates a new label.
 * - Request Body: { name, color }
 *
 * @endpoint PUT /labels/{id}
 * - Description: Updates an existing label by ID.
 * - Request Body: { name, color }
 *
 * @endpoint DELETE /labels/{id}
 * - Description: Deletes a specific label by ID.
 */