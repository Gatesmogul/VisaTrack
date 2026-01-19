import apiClient from './client';

export const getNotifications = () => apiClient.get('/notifications');

export const markAsRead = (id) => apiClient.patch(`/notifications/${id}/read`);

export default {
  getNotifications,
  markAsRead,
};
