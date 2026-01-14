import { apiFetch } from "../lib/api";

export const createTrip = async (data: {
  title: string;
  startDate: string;
  endDate: string;
}) => {
  return apiFetch("/trips", {
    method: "POST",
    body: JSON.stringify(data)
  });
};

export const getMyTrips = async () => {
  return apiFetch("/trips");
};
