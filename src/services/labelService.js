// src/services/labelService.js
import mainApi from '@/api/mainApi';

// Измените эту константу
const LABEL_API_PREFIX = '/labels'; // <--- ВОТ ЗДЕСЬ!

const labelService = {
  async getAllLabels() {
    try {
      const response = await mainApi.get(LABEL_API_PREFIX); // GET /labels
      return response.data;
    } catch (error) {
      console.error('Error fetching labels:', error);
      throw error;
    }
  },

  async createLabel(labelData) {
    try {
      const response = await mainApi.post(LABEL_API_PREFIX, labelData); // POST /labels
      return response.data;
    } catch (error) {
      console.error('Error creating label:', error);
      throw error;
    }
  },

  async updateLabel(id, labelData) {
    try {
      const response = await mainApi.put(`${LABEL_API_PREFIX}/${id}`, labelData); // PUT /labels/{id}
      return response.data;
    } catch (error) {
      console.error(`Error updating label with ID ${id}:`, error);
      throw error;
    }
  },

  async deleteLabel(id) {
    try {
      const response = await mainApi.delete(`${LABEL_API_PREFIX}/${id}`); // DELETE /labels/{id}
      return response.data;
    } catch (error) {
      console.error(`Error deleting label with ID ${id}:`, error);
      throw error;
    }
  },
};

export default labelService;