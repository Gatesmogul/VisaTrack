const DEFAULT_PROCESSING_TIME = 15;
const SAFETY_BUFFER_DAYS = 7;
const PREPARATION_DAYS = 14;

import Milestone from '../models/Milestone.js';
import VisaRequirement from '../models/VisaRequirement.js';

/**
 * Timeline Calculator Service
 * Core business logic for Flow #4: Timeline Calculator
 * 
 * Features:
 * - Processing time calculations with buffers
 * - Peak season detection
 * - Milestone generation
 * - Risk assessment
 */

/**
 * Peak travel seasons that may cause delays
 */
const PEAK_SEASONS = [
  { name: 'Summer', startMonth: 6, endMonth: 8 },      // June-August
  { name: 'Winter Holidays', startMonth: 12, endMonth: 1 }, // December-January
  { name: 'Easter', startMonth: 3, endMonth: 4 }      // March-April (varies)
];

/**
 * Country-specific peak seasons
 */
const COUNTRY_PEAK_SEASONS = {
  'IN': [{ name: 'Diwali Season', startMonth: 10, endMonth: 11 }],
  'AE': [{ name: 'Expo/Events Season', startMonth: 10, endMonth: 3 }],
  'AU': [{ name: 'Australian Summer', startMonth: 12, endMonth: 2 }],
  'TH': [{ name: 'High Season', startMonth: 11, endMonth: 2 }],
  'KE': [{ name: 'Safari Season', startMonth: 7, endMonth: 10 }]
};

/**
 * Calculate complete application timeline
 * 
 * @param {Object} params
 * @param {string} params.visaRequirementId - Visa rule ID
 * @param {Date} params.tripDate - Planned travel date
 * @param {string} params.destinationIsoCode - Destination country code
 * @param {string} params.visaType - Type of visa
 * @param {Object} params.userPreferences - User notification preferences
 * @returns {Object} Complete timeline with milestones and risk assessment
 */
export async function calculateTimeline({
  visaRequirementId,
  tripDate,
  destinationIsoCode,
  visaType,
  processingTimeMin,
  processingTimeMax,
  userPreferences = {}
}) {
  const travelDate = new Date(tripDate);
  const today = new Date();
  
  // Get visa requirement if ID provided
  let visaRule = null;
  if (visaRequirementId) {
    visaRule = await VisaRequirement.findById(visaRequirementId);
    processingTimeMin = visaRule?.processingTimeMin || processingTimeMin || 3;
    processingTimeMax = visaRule?.processingTimeMax || processingTimeMax || 10;
    visaType = visaRule?.visaType || visaType;
  }

  // Calculate days until trip
  const daysUntilTrip = Math.ceil((travelDate - today) / (1000 * 60 * 60 * 24));

  // Determine if peak season
  const peakSeasonInfo = checkPeakSeason(travelDate, destinationIsoCode);
  
  // Calculate buffer based on conditions
  const buffer = calculateBuffer(visaType, peakSeasonInfo.isPeakSeason);
  
  // Calculate key dates
  const timeline = calculateKeyDates({
    travelDate,
    processingTimeMin,
    processingTimeMax,
    buffer,
    visaType
  });

  // Risk assessment
  const riskAssessment = assessRisk({
    daysUntilTrip,
    processingTimeMax,
    buffer,
    timeline,
    peakSeasonInfo
  });

  // Generate milestones
  const milestones = generateMilestones({
    timeline,
    visaType,
    travelDate,
    userPreferences
  });

  return {
    summary: {
      daysUntilTrip,
      visaType,
      processingTime: {
        min: processingTimeMin,
        max: processingTimeMax,
        buffer,
        unit: 'business days'
      }
    },
    
    keyDates: {
      travelDate: travelDate.toISOString(),
      latestSubmissionDate: timeline.latestSubmissionDate.toISOString(),
      recommendedStartDate: timeline.recommendedStartDate.toISOString(),
      expectedDecisionDate: timeline.expectedDecisionDate.toISOString()
    },
    
    peakSeason: peakSeasonInfo,
    riskAssessment,
    milestones,
    
    recommendations: generateRecommendations(riskAssessment, timeline, daysUntilTrip)
  };
}

/**
 * Check if travel date falls in peak season
 */
function checkPeakSeason(travelDate, destinationIsoCode) {
  const month = travelDate.getMonth() + 1; // 1-12
  
  // Check global peak seasons
  for (const season of PEAK_SEASONS) {
    if (isInSeasonRange(month, season.startMonth, season.endMonth)) {
      return {
        isPeakSeason: true,
        seasonName: season.name,
        impact: 'Processing times may be 30-50% longer during this period'
      };
    }
  }
  
  // Check country-specific peak seasons
  const countrySeasons = COUNTRY_PEAK_SEASONS[destinationIsoCode] || [];
  for (const season of countrySeasons) {
    if (isInSeasonRange(month, season.startMonth, season.endMonth)) {
      return {
        isPeakSeason: true,
        seasonName: season.name,
        impact: `${destinationIsoCode} experiences high demand during this period`
      };
    }
  }
  
  return { isPeakSeason: false };
}

/**
 * Helper to check if month is in season range (handles year wrap)
 */
function isInSeasonRange(month, startMonth, endMonth) {
  if (startMonth <= endMonth) {
    return month >= startMonth && month <= endMonth;
  }
  // Handle wrap around (e.g., Dec-Jan)
  return month >= startMonth || month <= endMonth;
}

/**
 * Calculate buffer days based on visa type and season
 */
function calculateBuffer(visaType, isPeakSeason) {
  // Base buffer by visa type
  const baseBuffers = {
    'VISA_FREE': 0,
    'ETA': 3,
    'E_VISA': 5,
    'VISA_ON_ARRIVAL': 0,
    'EMBASSY_VISA': 10,
    'TRANSIT_VISA': 3
  };
  
  let buffer = baseBuffers[visaType] || 7;
  
  // Add peak season buffer (50% increase)
  if (isPeakSeason) {
    buffer = Math.ceil(buffer * 1.5);
  }
  
  return buffer;
}

/**
 * Calculate key application dates
 */
function calculateKeyDates({ travelDate, processingTimeMin, processingTimeMax, buffer, visaType }) {
  // Convert business days to calendar days (assume 5 business days = 7 calendar days)
  const calendarDaysMax = Math.ceil(processingTimeMax * 1.4);
  const calendarDaysMin = Math.ceil(processingTimeMin * 1.4);
  
  // Latest submission date (must submit by this date to get visa on time)
  const latestSubmissionDate = new Date(travelDate);
  latestSubmissionDate.setDate(latestSubmissionDate.getDate() - calendarDaysMax - buffer);
  
  // Recommended start date (when to begin gathering documents)
  const recommendedStartDate = new Date(latestSubmissionDate);
  recommendedStartDate.setDate(recommendedStartDate.getDate() - 14); // 2 weeks for document prep
  
  // Expected decision date (if submitted today)
  const expectedDecisionDate = new Date();
  expectedDecisionDate.setDate(expectedDecisionDate.getDate() + calendarDaysMax);
  
  // Pre-arrival form deadline (if applicable)
  const preArrivalDeadline = new Date(travelDate);
  preArrivalDeadline.setDate(preArrivalDeadline.getDate() - 3); // 72 hours before

  return {
    latestSubmissionDate,
    recommendedStartDate,
    expectedDecisionDate,
    preArrivalDeadline,
    calendarDaysMax,
    calendarDaysMin
  };
}

/**
 * Assess risk level of the application timeline
 */
function assessRisk({ daysUntilTrip, processingTimeMax, buffer, timeline, peakSeasonInfo }) {
  const totalRequired = Math.ceil(processingTimeMax * 1.4) + buffer;
  const margin = daysUntilTrip - totalRequired;
  
  let riskLevel, riskMessage, riskColor;
  
  if (daysUntilTrip < processingTimeMax) {
    riskLevel = 'CRITICAL';
    riskMessage = 'Not enough time to process visa before travel date';
    riskColor = 'red';
  } else if (margin < 0) {
    riskLevel = 'HIGH';
    riskMessage = 'Very tight timeline. Apply immediately.';
    riskColor = 'orange';
  } else if (margin < 7) {
    riskLevel = 'MEDIUM';
    riskMessage = 'Limited buffer. Start application soon.';
    riskColor = 'yellow';
  } else {
    riskLevel = 'LOW';
    riskMessage = 'Comfortable timeline for application.';
    riskColor = 'green';
  }
  
  // Increase risk if peak season
  if (peakSeasonInfo.isPeakSeason && riskLevel === 'LOW') {
    riskLevel = 'MEDIUM';
    riskMessage = 'Peak season may cause delays. Apply early.';
    riskColor = 'yellow';
  }
  
  return {
    level: riskLevel,
    message: riskMessage,
    color: riskColor,
    daysMargin: margin,
    factors: [
      ...(peakSeasonInfo.isPeakSeason ? [`Peak season: ${peakSeasonInfo.seasonName}`] : []),
      `Processing: ${processingTimeMax} business days`,
      `Buffer: ${buffer} days`
    ]
  };
}

/**
 * Generate milestones for tracking
 */
function generateMilestones({ timeline, visaType, travelDate, userPreferences }) {
  const milestones = [];
  const reminderDaysBefore = userPreferences.reminderDaysBefore || 3;
  
  // Milestone 1: Start Application
  milestones.push({
    milestoneType: 'START_APPLICATION',
    name: 'Begin Application Process',
    description: 'Start gathering required documents',
    dueDate: timeline.recommendedStartDate,
    order: 1
  });
  
  // Milestone 2: Complete Documents (if embassy visa)
  if (visaType === 'EMBASSY_VISA') {
    const docDeadline = new Date(timeline.latestSubmissionDate);
    docDeadline.setDate(docDeadline.getDate() - 7);
    
    milestones.push({
      milestoneType: 'COMPLETE_DOCUMENTS',
      name: 'Complete All Documents',
      description: 'Have all documents ready for submission',
      dueDate: docDeadline,
      order: 2
    });
    
    // Milestone 3: Book Appointment
    milestones.push({
      milestoneType: 'BOOK_APPOINTMENT',
      name: 'Book Visa Appointment',
      description: 'Schedule biometric/submission appointment',
      dueDate: docDeadline,
      order: 3
    });
  }
  
  // Milestone 4: Submit Application
  milestones.push({
    milestoneType: 'SUBMIT_APPLICATION',
    name: 'Submit Visa Application',
    description: visaType === 'E_VISA' ? 'Submit online application' : 'Submit at embassy/center',
    dueDate: timeline.latestSubmissionDate,
    order: 4
  });
  
  // Milestone 5: Expected Decision
  milestones.push({
    milestoneType: 'EXPECTED_DECISION',
    name: 'Expected Decision Date',
    description: 'Visa decision expected by this date',
    dueDate: timeline.expectedDecisionDate,
    order: 5
  });
  
  // Milestone 6: Pre-arrival Forms
  milestones.push({
    milestoneType: 'PRE_ARRIVAL_FORM',
    name: 'Complete Pre-Arrival Forms',
    description: 'Submit any required digital forms (e-Ticket, TDAC, etc.)',
    dueDate: timeline.preArrivalDeadline,
    order: 6
  });
  
  // Milestone 7: Travel Date
  milestones.push({
    milestoneType: 'TRAVEL_DATE',
    name: 'Travel Day',
    description: 'Your departure date',
    dueDate: travelDate,
    order: 7
  });
  
  // Add reminders to each milestone
  return milestones.map(m => ({
    ...m,
    reminders: [{
      daysBefore: reminderDaysBefore,
      channel: 'PUSH'
    }]
  }));
}

/**
 * Generate actionable recommendations
 */
function generateRecommendations(riskAssessment, timeline, daysUntilTrip) {
  const recommendations = [];
  
  if (riskAssessment.level === 'CRITICAL') {
    recommendations.push({
      priority: 1,
      type: 'URGENT',
      title: 'Consider Rescheduling',
      description: 'Your travel date may not allow enough time for visa processing. Consider postponing your trip.'
    });
  }
  
  if (riskAssessment.level === 'HIGH' || riskAssessment.level === 'CRITICAL') {
    recommendations.push({
      priority: 2,
      type: 'APPLY_IMMEDIATELY',
      title: 'Apply Immediately',
      description: 'Start your visa application today to maximize chances of approval before travel.'
    });
  }
  
  if (daysUntilTrip > 30 && riskAssessment.level === 'LOW') {
    recommendations.push({
      priority: 3,
      type: 'OPTIMAL_TIMING',
      title: 'Good Timing',
      description: 'You have plenty of time. Start preparing documents now for a stress-free process.'
    });
  }
  
  return recommendations;
}

/**
 * Create milestones in database for an application
 */
export async function createMilestonesForApplication(applicationId, timelineData) {
  const milestones = timelineData.milestones.map(m => ({
    ...m,
    applicationId
  }));
  
  return Milestone.insertMany(milestones);
}

/**
 * Get application timeline from database
 */
export async function getApplicationTimeline(applicationId) {
  return Milestone.find({ applicationId }).sort({ order: 1 });
}

export default {
  calculateTimeline,
  createMilestonesForApplication,
  getApplicationTimeline
};
