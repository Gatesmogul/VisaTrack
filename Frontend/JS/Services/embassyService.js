import apiClient from "./apiConfig.js";

/**
 * Fetch all embassies with optional query parameters.
 * @param {Object} filters - Optional filters (e.g., { country: 'US', city: 'New York' })
 * @returns {Promise<Array>} List of embassies
 */
export async function getEmbassies(filters = {}) {
  try {
    const response = await apiClient.get('/embassies', { params: filters });
    return response.data;
  } catch (error) {
    console.error("Embassy Service Error:", error);
    throw error;
  }
}

/**
 * Fetch a single embassy by ID.
 * @param {String} id 
 * @returns {Promise<Object>} Embassy details
 */
export async function getEmbassyById(id) {
  try {
    const response = await apiClient.get(`/embassies/${id}`);
    return response.data;
  } catch (error) {
    console.error("Embassy Service Error:", error);
    throw error;
  }
}
