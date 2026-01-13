import { calculateVisaTimeline } from "./visaTimeline";

export function shouldAlertVisaTimeline(
  params: Parameters<typeof calculateVisaTimeline>[0]
) {
  const timeline = calculateVisaTimeline(params);

  return {
    shouldAlert:
      timeline.risk === "HIGH" ||
      timeline.risk === "TIGHT",
    priority:
      timeline.risk === "HIGH" ? "CRITICAL" : "WARNING",
    timeline,
  };
}
