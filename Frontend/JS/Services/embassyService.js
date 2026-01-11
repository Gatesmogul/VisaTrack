import { API_BASE_URL } from "./apiConfig.js";

/**
 * Fetch all embassies with optional query parameters.
 * @param {Object} filters - Optional filters (e.g., { country: 'US', city: 'New York' })
 * @returns {Promise<Array>} List of embassies
 */
export async function getEmbassies(filters = {}) {
  const query = new URLSearchParams(filters).toString();
  const url = `${API_BASE_URL}/embassies${query ? `?${query}` : ''}`;

  try {
    const response = await fetch(url, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        // 'Authorization': `Bearer ${token}` // If auth is needed later
      }
    });

    if (!response.ok) {
      throw new Error(`Error fetching embassies: ${response.statusText}`);
    }

    return await response.json();
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
  const url = `${API_BASE_URL}/embassies/${id}`;

  try {
    const response = await fetch(url);
    if (!response.ok) {
      throw new Error(`Error fetching embassy: ${response.statusText}`);
    }
    return await response.json();
  } catch (error) {
    console.error("Embassy Service Error:", error);
    throw error;
  }
}
