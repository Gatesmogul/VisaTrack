export type VisaTimelineRisk = "SAFE" | "TIGHT" | "HIGH";

export function calculateVisaTimeline({
  entryDate,
  processingTimeMax,
  bufferDays = 7,
}: {
  entryDate: string | Date;
  processingTimeMax: number;
  bufferDays?: number;
}) {
  const entry = new Date(entryDate);

  const latestApplyDate = new Date(entry);
  latestApplyDate.setDate(
    latestApplyDate.getDate() -
      processingTimeMax -
      bufferDays
  );

  const daysLeft = Math.floor(
    (latestApplyDate.getTime() - Date.now()) /
      (1000 * 60 * 60 * 24)
  );

  let risk: VisaTimelineRisk = "SAFE";

  if (daysLeft < 0) {
    risk = "HIGH"; // already too late
  } else if (daysLeft <= 14) {
    risk = "TIGHT"; // last two weeks
  }

  return {
    latestApplyDate,
    daysLeft,
    risk,
  };
}
