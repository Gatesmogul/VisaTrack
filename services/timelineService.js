const DEFAULT_PROCESSING_TIME = 15;
const SAFETY_BUFFER_DAYS = 7;
const PREPARATION_DAYS = 14;

const calculateTimeline = (visaRequirement, entryDate, submissionDate = null) => {
    if (!entryDate) {
        throw new Error('Entry date is required for timeline calculation');
    }

    const targetEntryDate = new Date(entryDate);
    const maxProcTime = (visaRequirement && visaRequirement.processingTimeMax) || DEFAULT_PROCESSING_TIME;
    
    // Latest date to submit to account for max processing time + a safety buffer
    const latestSubmissionDate = new Date(targetEntryDate);
    latestSubmissionDate.setDate(targetEntryDate.getDate() - (maxProcTime + SAFETY_BUFFER_DAYS));

    // Recommended date to start/submit to have extra headspace
    const recommendedSubmissionDate = new Date(latestSubmissionDate);
    recommendedSubmissionDate.setDate(latestSubmissionDate.getDate() - PREPARATION_DAYS);

    // If submitted, when to expect a decision
    let expectedDecisionDate = null;
    if (submissionDate) {
        const actualSubmissionDate = new Date(submissionDate);
        expectedDecisionDate = new Date(actualSubmissionDate);
        expectedDecisionDate.setDate(actualSubmissionDate.getDate() + maxProcTime);
    }

    return {
        latestSubmissionDate,
        recommendedSubmissionDate,
        expectedDecisionDate,
        buffers: {
            safety: SAFETY_BUFFER_DAYS,
            preparation: PREPARATION_DAYS
        }
    };
};

module.exports = {
    calculateTimeline,
    CONSTANTS: {
        DEFAULT_PROCESSING_TIME,
        SAFETY_BUFFER_DAYS,
        PREPARATION_DAYS
    }
};
