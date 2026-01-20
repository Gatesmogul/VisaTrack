import apiClient from './client';

export const getMyTrips = () => apiClient.get('/trips');

export const createTrip = (data) => apiClient.post('/trips', data);

export const getTripById = (tripId) => apiClient.get(`/trips/${tripId}`);

export const updateTripStatus = (tripId, status) => apiClient.patch(`/trips/${tripId}`, { status });

export const updateTrip = (tripId, data) => apiClient.put(`/trips/${tripId}`, data);

export const deleteTrip = (tripId) => apiClient.delete(`/trips/${tripId}`);

export const getTripDestinations = (tripId) => apiClient.get(`/trips/${tripId}/destinations`);

export const addDestinationToTrip = (tripId, data) => apiClient.post(`/trips/${tripId}/destinations`, data);

export default {
  getMyTrips,
  createTrip,
  getTripById,
  updateTripStatus,
  updateTrip,
  deleteTrip,
  getTripDestinations,
  addDestinationToTrip,
};
