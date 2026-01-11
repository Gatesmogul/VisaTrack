const DEFAULT_PROCESSING_TIME = 15;
const SAFETY_BUFFER_DAYS = 7;
const PREPARATION_DAYS = 14;

const calculateTimeline = (visaRequirement, entryDate, submissionDate = null) => {
  const targetEntryDate = new Date(entryDate);
  const maxProcTime = visaRequirement?.processingTimeMax || DEFAULT_PROCESSING_TIME;

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

  return {
    latestSubmissionDate,
    recommendedSubmissionDate,
    expectedDecisionDate
  };
};

export {
  calculateTimeline,
  DEFAULT_PROCESSING_TIME,
  SAFETY_BUFFER_DAYS,
  PREPARATION_DAYS
};
