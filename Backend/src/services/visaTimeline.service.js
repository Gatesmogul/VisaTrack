const DEFAULT_PROCESSING_TIME = 15;
const SAFETY_BUFFER_DAYS = 7;
const PREPARATION_DAYS = 14;

const calculateVisaTimeline = ({ visaRequirement, entryDate, processingTimeMax, submissionDate = null }) => {
  const targetEntryDate = new Date(entryDate);
  const today = new Date();
  const maxProcTime = visaRequirement?.processingTimeMax || processingTimeMax || DEFAULT_PROCESSING_TIME;

  const latestSubmissionDate = new Date(targetEntryDate);
  latestSubmissionDate.setDate(
    targetEntryDate.getDate() - (maxProcTime + SAFETY_BUFFER_DAYS)
  );

  const recommendedSubmissionDate = new Date(latestSubmissionDate);
  recommendedSubmissionDate.setDate(
    latestSubmissionDate.getDate() - PREPARATION_DAYS
  );

  let expectedDecisionDate = null;
  if (submissionDate) {
    expectedDecisionDate = new Date(submissionDate);
    expectedDecisionDate.setDate(
      expectedDecisionDate.getDate() + maxProcTime
    );
  }

  // Calculate risk
  const daysUntilTrip = Math.ceil((targetEntryDate - today) / (1000 * 60 * 60 * 24));
  const bufferDays = SAFETY_BUFFER_DAYS;
  const daysNeeded = maxProcTime + bufferDays;
  
  let risk = "LOW";
  if (daysUntilTrip < maxProcTime) risk = "HIGH";
  else if (daysUntilTrip < daysNeeded) risk = "TIGHT";

  return {
    latestSubmissionDate,
    recommendedSubmissionDate,
    expectedDecisionDate,
    risk
  };
};

export {
    DEFAULT_PROCESSING_TIME, PREPARATION_DAYS, SAFETY_BUFFER_DAYS, calculateVisaTimeline
};

