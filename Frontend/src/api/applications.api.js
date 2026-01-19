import apiClient from './client';

export const getApplicationDashboard = () => apiClient.get('/applications/dashboard');

export const createApplication = (data) => apiClient.post('/applications', data);

export const getApplicationChecklist = (applicationId) => apiClient.get(`/applications/${applicationId}/checklist`);

export const updateApplicationStatus = (applicationId, statusData) => 
  apiClient.patch(`/applications/${applicationId}/status`, statusData);

export default {
  getApplicationDashboard,
  createApplication,
  getApplicationChecklist,
  updateApplicationStatus,
};
