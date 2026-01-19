import apiClient from './client';

export const getMyTrips = () => apiClient.get('/trips');

export const createTrip = (data) => apiClient.post('/trips', data);

export const getTripById = (tripId) => apiClient.get(`/trips/${tripId}`);

export const updateTripStatus = (tripId, status) => apiClient.patch(`/trips/${tripId}`, { status });

export const getTripDestinations = (tripId) => apiClient.get(`/trips/${tripId}/destinations`);

export const addDestinationToTrip = (tripId, data) => apiClient.post(`/trips/${tripId}/destinations`, data);

export default {
  getMyTrips,
  createTrip,
  getTripById,
  updateTripStatus,
  getTripDestinations,
  addDestinationToTrip,
};
