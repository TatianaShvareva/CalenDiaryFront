// src/services/calendarService.js
// Provides methods for interacting with the calendar-related endpoints of the main API.

import mainApi from '@/api/mainApi'; // Axios instance configured for the main backend API

const CALENDAR_API_PREFIX = '/calendar'; // Base path for the calendar controller endpoints

const calendarService = {
  /**
   * Fetches all calendar entries for the currently authenticated user.
   * Corresponds to backend's @GetMapping("/my-entries").
   * @returns {Promise<Array>} A promise that resolves with an array of calendar event data.
   * @throws {Error} Throws an error if the API call fails.
   */
  async getAllEvents() {
    try {
      const response = await mainApi.get(`${CALENDAR_API_PREFIX}/my-entries`);
      return response.data;
    } catch (error) {
      console.error('Error fetching calendar events:', error);
      throw error;
    }
  },

  /**
   * Creates a new calendar entry for the current user.
   * Corresponds to backend's @PostMapping("/my-entries").
   * @param {Object} eventData - The data for the event to be created.
   * @returns {Promise<Object>} A promise that resolves with the created event data.
   * @throws {Error} Throws an error if the API call fails.
   */
  async createEvent(eventData) {
    try {
      const response = await mainApi.post(`${CALENDAR_API_PREFIX}/my-entries`, eventData);
      return response.data;
    } catch (error) {
      console.error('Error creating calendar event:', error);
      throw error;
    }
  },

  /**
   * Fetches a specific calendar entry by its ID for the current user.
   * Corresponds to backend's @GetMapping("/my-entries/{id}").
   * @param {string} id - The ID of the event to fetch.
   * @returns {Promise<Object>} A promise that resolves with the event data.
   * @throws {Error} Throws an error if the API call fails or event is not found.
   */
  async getEventById(id) {
    try {
      const response = await mainApi.get(`${CALENDAR_API_PREFIX}/my-entries/${id}`);
      return response.data;
    } catch (error) {
      console.error(`Error fetching event with ID ${id}:`, error);
      throw error;
    }
  },

  /**
   * Updates an existing calendar entry by its ID for the current user.
   * Corresponds to backend's @PutMapping("/my-entries/{id}").
   * @param {string} id - The ID of the event to update.
   * @param {Object} eventData - The updated data for the event.
   * @returns {Promise<Object>} A promise that resolves with the updated event data.
   * @throws {Error} Throws an error if the API call fails.
   */
  async updateEvent(id, eventData) {
    try {
      const response = await mainApi.put(`${CALENDAR_API_PREFIX}/my-entries/${id}`, eventData);
      return response.data;
    } catch (error) {
      console.error(`Error updating event with ID ${id}:`, error);
      throw error;
    }
  },

  /**
   * Deletes a specific calendar entry by its ID for the current user.
   * Corresponds to backend's @DeleteMapping("/my-entries/{id}").
   * @param {string} id - The ID of the event to delete.
   * @returns {Promise<Object>} A promise that resolves with the deletion confirmation (or empty response).
   * @throws {Error} Throws an error if the API call fails.
   */
  async deleteEvent(id) {
    try {
      const response = await mainApi.delete(`${CALENDAR_API_PREFIX}/my-entries/${id}`);
      return response.data;
    } catch (error) {
      console.error(`Error deleting event with ID ${id}:`, error);
      throw error;
    }
  },

  /**
   * (Optional) Deletes all calendar entries for the current user.
   * Corresponds to backend's @DeleteMapping("/my-entries") without an ID.
   * Use with caution.
   * @returns {Promise<Object>} A promise that resolves with the deletion confirmation (or empty response).
   * @throws {Error} Throws an error if the API call fails.
   */
  async deleteAllEventsForUser() {
    try {
      const response = await mainApi.delete(`${CALENDAR_API_PREFIX}/my-entries`);
      return response.data;
    } catch (error) {
      console.error('Error deleting all events for user:', error);
      throw error;
    }
  },
};

export default calendarService;