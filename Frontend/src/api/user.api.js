import apiClient from './client';

export const getCurrentUser = () => apiClient.get('/users/me');

export const updatePersonalProfile = (data) => apiClient.post('/users/profile/personal', data);

export const updateContactProfile = (data) => apiClient.post('/users/profile/contact', data);

export const updatePassportProfile = (data) => apiClient.post('/users/profile/passport', data);

export const acceptTerms = () => apiClient.post('/users/accept-terms');

export default {
  getCurrentUser,
  updatePersonalProfile,
  updateContactProfile,
  updatePassportProfile,
  acceptTerms,
};
