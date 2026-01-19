// Simple trip feasibility utilities

const DEFAULT_PROCESSING_DAYS = {
  France: 30,
  Germany: 45,
  Italy: 30,
  Thailand: 20,
  Vietnam: 25,
  Singapore: 7,
  USA: 60,
  Canada: 45,
  default: 30,
};

const DEFAULT_DOC_PREP_DAYS = 7; // time to gather docs
const DEFAULT_APPOINTMENT_DAYS = 7; // time to wait for appointment
const MARGINAL_WINDOW_DAYS = 7; // within this margin, mark as marginal

export function getProcessingDaysForCountry(country) {
  return DEFAULT_PROCESSING_DAYS[country] ?? DEFAULT_PROCESSING_DAYS.default;
}

export function assessDestinationFeasibility(destination, departureDate, today = new Date()) {
  const daysUntilDeparture = Math.ceil((new Date(departureDate) - today) / (1000 * 60 * 60 * 24));
  const processingDays = getProcessingDaysForCountry(destination?.country || '');
  const requiredDays = processingDays + DEFAULT_DOC_PREP_DAYS + DEFAULT_APPOINTMENT_DAYS;

  if (daysUntilDeparture < requiredDays) {
    return {
      country: destination?.country,
      requiredDays,
      daysUntilDeparture,
      status: 'impossible',
      reason: `Needs ~${requiredDays} days but only ${daysUntilDeparture} days until departure`,
    };
  }

  if (daysUntilDeparture - requiredDays <= MARGINAL_WINDOW_DAYS) {
    return {
      country: destination?.country,
      requiredDays,
      daysUntilDeparture,
      status: 'marginal',
      reason: `Tight timeline: needs ~${requiredDays} days and ${daysUntilDeparture} days remain`,
    };
  }

  return {
    country: destination?.country,
    requiredDays,
    daysUntilDeparture,
    status: 'feasible',
    reason: `Feasible (needs ~${requiredDays} days, ${daysUntilDeparture} days available)`,
  };
}

export function assessTripFeasibility(trip, today = new Date()) {
  const perDestination = (trip?.destinations || []).map((d) => assessDestinationFeasibility(d, trip.departureDate, today));
  const impossible = perDestination.some((p) => p.status === 'impossible');
  const marginal = perDestination.some((p) => p.status === 'marginal') && !impossible;
  const status = impossible ? 'impossible' : marginal ? 'marginal' : 'feasible';

  const reasons = perDestination.map((p) => ({ country: p.country, status: p.status, reason: p.reason }));

  return { tripId: trip?.id, tripName: trip?.name, status, perDestination, reasons };
}

export function assessTrips(trips, today = new Date()) {
  return (trips || []).map((t) => assessTripFeasibility(t, today));
}

export default { getProcessingDaysForCountry, assessDestinationFeasibility, assessTripFeasibility, assessTrips };
