// src/services/locationService.js
// Provides methods for searching geographical locations using Nominatim API.

import axios from 'axios';

const NOMINATIM_BASE_URL = 'https://nominatim.openstreetmap.org';
const NOMINATIM_EMAIL = 'tatiana.shvareva@stud.fh-campuswien.ac.at';

/**
 * Searches for a geographical location using the Nominatim API.
 * @param {string} query - The search query (e.g., "Paris Eiffel Tower").
 * @param {number} [limit=5] - Maximum number of results to return.
 * @param {string} [countrycodes='us,at,de'] - Comma-separated list of country codes to bias search results.
 * @returns {Promise<Array>} A promise that resolves with an array of location data.
 * @throws {Error} Throws an error if the API call fails.
 */
export const searchLocation = async (query, limit = 5, countrycodes = 'us,at,de') => {
  try {
    const response = await axios.get(`${NOMINATIM_BASE_URL}/search`, {
      params: {
        q: query,
        format: 'jsonv2',
        limit: limit,
        'accept-language': 'en, de',
        email: NOMINATIM_EMAIL,
        addressdetails: 1,
        countrycodes: countrycodes,
      }
    });
    return response.data;
  } catch (error) {
    console.error('Error searching location:', error);
    throw error;
  }
};