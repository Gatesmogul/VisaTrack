import { calculateVisaTimeline } from "./visaTimeline.service.js";

export const checkDestinationFeasibility = ({
  entryDate,
  processingTimeMax,
}) => {
  if (!processingTimeMax) {
    return {
      status: "UNKNOWN",
      reason: "Processing time unavailable",
    };
  }

  const timeline = calculateVisaTimeline({
    entryDate,
    processingTimeMax,
  });

  if (timeline.risk === "HIGH") {
    return {
      status: "NOT_FEASIBLE",
      reason: "Insufficient time to apply",
      timeline,
    };
  }

  if (timeline.risk === "TIGHT") {
    return {
      status: "RISKY",
      reason: "Timeline is tight",
      timeline,
    };
  }

  return {
    status: "FEASIBLE",
    reason: "Enough time to apply",
    timeline,
  };
};
