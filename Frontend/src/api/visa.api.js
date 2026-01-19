import apiClient from './client';

export const lookupVisa = (params) => apiClient.post('/visa/lookup', params);

export const getVisaDetails = (ruleId) => apiClient.get(`/visa/details/${ruleId}`);

export const getRecentLookups = () => apiClient.get('/visa/recent');

export const saveRequirement = (visaRequirementId) => apiClient.post('/visa/save', { visaRequirementId });

export const getSavedRequirements = () => apiClient.get('/visa/saved');

export const removeSavedRequirement = (id) => apiClient.delete(`/saved/${id}`);

export const calculateTimeline = (params) => apiClient.post('/timeline/calculate', params);

export const planTrip = (params) => apiClient.post('/trips/plan', params);

export const getTripFeasibility = (tripId) => apiClient.get(`/trips/${tripId}/feasibility`);

export default {
  lookupVisa,
  getVisaDetails,
  getRecentLookups,
  saveRequirement,
  getSavedRequirements,
  removeSavedRequirement,
  calculateTimeline,
  planTrip,
  getTripFeasibility,
};
