// src/services/labelService.js
// Provides methods for interacting with label-related endpoints of the main API.

import mainApi from '@/api/mainApi'; // Axios instance configured for the main backend API

const LABEL_API_PREFIX = '/labels'; // Base path for the label controller endpoints

const labelService = {
  /**
   * Fetches all labels available to the authenticated user.
   * Corresponds to backend's GET /labels endpoint.
   * @returns {Promise<Array>} A promise that resolves with an array of label data.
   * @throws {Error} Throws an error if the API call fails.
   */
  async getAllLabels() {
    try {
      const response = await mainApi.get(LABEL_API_PREFIX);
      return response.data;
    } catch (error) {
      console.error('Error fetching labels:', error);
      throw error;
    }
  },

  /**
   * Creates a new label.
   * Corresponds to backend's POST /labels endpoint.
   * @param {Object} labelData - The data for the label to be created.
   * @returns {Promise<Object>} A promise that resolves with the created label data.
   * @throws {Error} Throws an error if the API call fails.
   */
  async createLabel(labelData) {
    try {
      const response = await mainApi.post(LABEL_API_PREFIX, labelData);
      return response.data;
    } catch (error) {
      console.error('Error creating label:', error);
      throw error;
    }
  },

  /**
   * Updates an existing label by its ID.
   * Corresponds to backend's PUT /labels/{id} endpoint.
   * @param {string} id - The ID of the label to update.
   * @param {Object} labelData - The updated data for the label.
   * @returns {Promise<Object>} A promise that resolves with the updated label data.
   * @throws {Error} Throws an error if the API call fails.
   */
  async updateLabel(id, labelData) {
    try {
      const response = await mainApi.put(`${LABEL_API_PREFIX}/${id}`, labelData);
      return response.data;
    } catch (error) {
      console.error(`Error updating label with ID ${id}:`, error);
      throw error;
    }
  },

  /**
   * Deletes a label by its ID.
   * Corresponds to backend's DELETE /labels/{id} endpoint.
   * @param {string} id - The ID of the label to delete.
   * @returns {Promise<Object>} A promise that resolves with the deletion confirmation (or empty response).
   * @throws {Error} Throws an error if the API call fails.
   */
  async deleteLabel(id) {
    try {
      const response = await mainApi.delete(`${LABEL_API_PREFIX}/${id}`);
      return response.data;
    } catch (error) {
      console.error(`Error deleting label with ID ${id}:`, error);
      throw error;
    }
  },
};

export default labelService;