import tripApi from '../api/trip.api';
import useApi from '../api/useApi';

export const useTrips = () => {
  const myTrips = useApi(tripApi.getMyTrips);
  const create = useApi(tripApi.createTrip);
  const getById = useApi(tripApi.getTripById);
  const updateStatus = useApi(tripApi.updateTripStatus);
  const destinations = useApi(tripApi.getTripDestinations);
  const addDestination = useApi(tripApi.addDestinationToTrip);

  return {
    myTrips,
    create,
    getById,
    updateStatus,
    destinations,
    addDestination,
  };
};

export default useTrips;
