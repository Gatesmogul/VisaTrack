import apiClient from './client';

export const getEmbassies = (params) => apiClient.get('/embassies', { params });

export const getEmbassyById = (id) => apiClient.get(`/embassies/${id}`);

export const createEmbassy = (data) => apiClient.post('/embassies', data);

export const updateEmbassy = (id, data) => apiClient.put(`/embassies/${id}`, data);

export const deleteEmbassy = (id) => apiClient.delete(`/embassies/${id}`);

export default {
  getEmbassies,
  getEmbassyById,
  createEmbassy,
  updateEmbassy,
  deleteEmbassy,
};
