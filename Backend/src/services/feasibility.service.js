import { determineVisaRequirement } from './visaRulesEngine.service.js';

/**
 * Feasibility Service
 * Core business logic for Flow #5: Multi-Country Trip Planner
 * 
 * Features:
 * - Multi-destination visa analysis
 * - Timeline conflict detection
 * - Passport submission overlap identification
 * - Optimal application order recommendations
 * - Feasibility scoring
 */

/**
 * Analyze multi-country trip feasibility
 */
export async function analyzeMultiCountryFeasibility({
  passportCountryCode,
  destinations,
  purpose = 'TOURISM',
  userContext = {}
}) {
  if (!destinations || destinations.length === 0) {
    throw new Error('At least one destination is required');
  }

  const today = new Date();
  const passportExpiry = userContext.passportExpiryDate ? new Date(userContext.passportExpiryDate) : null;
  
  // Get visa requirements for each destination
  const visaAnalysis = await Promise.all(
    destinations.map(async (dest, index) => {
      try {
        const visaResult = await determineVisaRequirement(
          passportCountryCode,
          dest.countryCode,
          purpose,
          { arrivalDate: dest.arrivalDate, departureDate: dest.departureDate },
          userContext
        );
        
        return {
          order: index + 1,
          countryCode: dest.countryCode,
          countryName: visaResult.destination?.name,
          arrivalDate: dest.arrivalDate,
          departureDate: dest.departureDate,
          visaType: visaResult.visaType,
          visaTypeFriendly: visaResult.visaTypeFriendly,
          processingTime: visaResult.processingTime,
          requiresPassportSubmission: visaResult.visaType === 'EMBASSY_VISA',
          warnings: visaResult.warnings,
          success: true
        };
      } catch (error) {
        return {
          order: index + 1,
          countryCode: dest.countryCode,
          arrivalDate: dest.arrivalDate,
          error: error.message,
          success: false
        };
      }
    })
  );

  // Detect timeline conflicts
  const conflicts = detectTimelineConflicts(visaAnalysis, today);
  
  // Check passport submission overlaps
  const passportConflicts = detectPassportSubmissionConflicts(visaAnalysis);
  
  // Check passport validity
  const passportIssues = checkPassportValidity(visaAnalysis, passportExpiry);
  
  // Calculate feasibility
  const feasibility = calculateFeasibility(visaAnalysis, conflicts, passportConflicts, passportIssues);
  
  // Generate recommendations
  const recommendations = generateRecommendations(feasibility, conflicts, passportConflicts);
  
  // Calculate optimal application order
  const optimalOrder = calculateOptimalApplicationOrder(visaAnalysis);

  return {
    feasibilityStatus: feasibility.status,
    feasibilityScore: feasibility.score,
    feasibilityMessage: feasibility.message,
    destinations: visaAnalysis,
    issues: [
      ...conflicts.map(c => ({ type: 'TIMELINE_CONFLICT', ...c })),
      ...passportConflicts.map(c => ({ type: 'PASSPORT_CONFLICT', ...c })),
      ...passportIssues.map(i => ({ type: 'PASSPORT_VALIDITY', ...i }))
    ],
    recommendations,
    optimalApplicationOrder: optimalOrder,
    summary: {
      totalDestinations: destinations.length,
      visaFreeDestinations: visaAnalysis.filter(d => d.visaType === 'VISA_FREE').length,
      visasRequired: visaAnalysis.filter(d => d.visaType !== 'VISA_FREE' && d.success).length,
      issueCount: conflicts.length + passportConflicts.length + passportIssues.length
    }
  };
}

/**
 * Detect timeline conflicts between destinations
 */
function detectTimelineConflicts(visaAnalysis, today) {
  const conflicts = [];
  
  const sorted = [...visaAnalysis]
    .filter(d => d.success && d.visaType !== 'VISA_FREE' && d.visaType !== 'VISA_ON_ARRIVAL')
    .sort((a, b) => new Date(a.arrivalDate) - new Date(b.arrivalDate));
  
  for (const dest of sorted) {
    const arrivalDate = new Date(dest.arrivalDate);
    const processingDays = (dest.processingTime?.max || 10) * 1.4;
    const bufferDays = 7;
    const daysNeeded = processingDays + bufferDays;
    const daysAvailable = Math.ceil((arrivalDate - today) / (1000 * 60 * 60 * 24));
    
    if (daysAvailable < daysNeeded) {
      conflicts.push({
        severity: daysAvailable < processingDays ? 'ERROR' : 'WARNING',
        destination: dest.countryCode,
        conflictType: 'INSUFFICIENT_TIME',
        message: `Only ${daysAvailable} days until ${dest.countryName || dest.countryCode}. Need ${Math.ceil(daysNeeded)} days.`,
        suggestedResolution: 'Apply immediately or reschedule.'
      });
    }
  }
  
  return conflicts;
}

/**
 * Detect passport submission conflicts
 */
function detectPassportSubmissionConflicts(visaAnalysis) {
  const conflicts = [];
  const embassyVisas = visaAnalysis.filter(d => d.success && d.requiresPassportSubmission);
  
  if (embassyVisas.length >= 2) {
    conflicts.push({
      severity: 'WARNING',
      destinations: embassyVisas.map(d => d.countryCode),
      conflictType: 'PASSPORT_SUBMISSION_OVERLAP',
      message: `${embassyVisas.length} destinations require passport submission. Apply sequentially.`,
      suggestedResolution: 'Apply for visas one at a time.'
    });
  }
  
  return conflicts;
}

/**
 * Check passport validity for trip
 */
function checkPassportValidity(visaAnalysis, passportExpiry) {
  const issues = [];
  if (!passportExpiry) return issues;
  
  for (const dest of visaAnalysis.filter(d => d.success)) {
    const requiredDays = dest.countryCode === 'ZA' ? 30 : 180;
    const departureDate = new Date(dest.departureDate || dest.arrivalDate);
    const requiredExpiry = new Date(departureDate);
    requiredExpiry.setDate(requiredExpiry.getDate() + requiredDays);
    
    if (passportExpiry < requiredExpiry) {
      issues.push({
        severity: 'ERROR',
        destination: dest.countryCode,
        message: `Passport must be valid for ${requiredDays} days after ${dest.countryName || dest.countryCode}.`,
        suggestedResolution: 'Renew passport before applying.'
      });
    }
  }
  
  return issues;
}

/**
 * Calculate overall feasibility
 */
function calculateFeasibility(visaAnalysis, conflicts, passportConflicts, passportIssues) {
  const errorCount = [
    ...conflicts.filter(c => c.severity === 'ERROR'),
    ...passportConflicts.filter(c => c.severity === 'ERROR'),
    ...passportIssues.filter(i => i.severity === 'ERROR')
  ].length;
  
  let score = 100 - (errorCount * 30);
  score = Math.max(0, score);
  
  let status, message;
  if (score >= 80) {
    status = 'FEASIBLE';
    message = 'Your trip is feasible with proper planning.';
  } else if (score >= 50) {
    status = 'RISKY';
    message = 'Your trip has potential issues that need attention.';
  } else {
    status = 'IMPOSSIBLE';
    message = 'Your trip as planned is not feasible.';
  }
  
  return { status, score, message };
}

/**
 * Generate recommendations
 */
function generateRecommendations(feasibility, conflicts, passportConflicts) {
  const recommendations = [];
  
  if (conflicts.length > 0) {
    recommendations.push({
      type: 'APPLY_IMMEDIATELY',
      priority: 1,
      title: 'Start Applications Now',
      description: 'Some destinations have tight timelines.'
    });
  }
  
  if (passportConflicts.length > 0) {
    recommendations.push({
      type: 'APPLICATION_SEQUENCE',
      priority: 2,
      title: 'Apply Sequentially',
      description: 'Multiple embassy visas require passport - apply one at a time.'
    });
  }
  
  if (feasibility.status === 'IMPOSSIBLE') {
    recommendations.push({
      type: 'RESCHEDULE',
      priority: 1,
      title: 'Consider Rescheduling',
      description: 'Some destinations cannot be reached in time.'
    });
  }
  
  return recommendations.sort((a, b) => a.priority - b.priority);
}

/**
 * Calculate optimal application order
 */
function calculateOptimalApplicationOrder(visaAnalysis) {
  const needsVisa = visaAnalysis.filter(d => 
    d.success && d.visaType !== 'VISA_FREE' && d.visaType !== 'VISA_ON_ARRIVAL'
  );
  
  return needsVisa
    .sort((a, b) => {
      // Embassy visas first
      if (a.requiresPassportSubmission !== b.requiresPassportSubmission) {
        return a.requiresPassportSubmission ? -1 : 1;
      }
      // Longer processing first
      const procA = a.processingTime?.max || 10;
      const procB = b.processingTime?.max || 10;
      return procB - procA;
    })
    .map((d, i) => ({
      order: i + 1,
      countryCode: d.countryCode,
      countryName: d.countryName,
      visaType: d.visaType,
      processingDays: d.processingTime?.max
    }));
}

export default { analyzeMultiCountryFeasibility };
