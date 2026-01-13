import { calculateVisaTimeline } from "./visaTimeline";

export type FeasibilityStatus =
  | "FEASIBLE"
  | "RISKY"
  | "NOT_FEASIBLE";

export interface TripFeasibilityResult {
  status: FeasibilityStatus;
  summary: string;
  riskyDestinations: {
    countryName: string;
    reason: string;
  }[];
}

export function checkTripFeasibility(
  destinations: {
    countryName: string;
    entryDate: string;
    visaRequired: boolean;
    processingTimeMax?: number;
  }[]
): TripFeasibilityResult {
  const riskyDestinations: TripFeasibilityResult["riskyDestinations"] =
    [];

  let hasHighRisk = false;

  for (const dest of destinations) {
    if (!dest.visaRequired) continue;

    if (!dest.processingTimeMax) {
      riskyDestinations.push({
        countryName: dest.countryName,
        reason: "Missing visa processing time data",
      });
      hasHighRisk = true;
      continue;
    }

    const timeline = calculateVisaTimeline({
      entryDate: dest.entryDate,
      processingTimeMax: dest.processingTimeMax,
    });

    if (timeline.risk === "HIGH") {
      hasHighRisk = true;
      riskyDestinations.push({
        countryName: dest.countryName,
        reason: "Visa application timeline already exceeded",
      });
    } else if (timeline.risk === "TIGHT") {
      riskyDestinations.push({
        countryName: dest.countryName,
        reason: "Visa timeline is very tight",
      });
    }
  }

  if (hasHighRisk) {
    return {
      status: "NOT_FEASIBLE",
      summary:
        "One or more destinations have impossible or very risky visa timelines.",
      riskyDestinations,
    };
  }

  if (riskyDestinations.length > 0) {
    return {
      status: "RISKY",
      summary:
        "Trip is possible, but some destinations have tight visa timelines.",
      riskyDestinations,
    };
  }

  return {
    status: "FEASIBLE",
    summary: "All destinations have safe visa timelines.",
    riskyDestinations: [],
  };
}
