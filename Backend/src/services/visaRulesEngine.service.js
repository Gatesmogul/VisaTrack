import Country from '../models/Country.js';
import DocumentRequirement from '../models/DocumentRequirement.js';
import VisaRequirement from '../models/VisaRequirement.js';

/**
 * Visa Rules Engine Service
 * Core business logic for Flow #1: Visa Requirement Lookup
 * 
 * Handles:
 * - Visa type determination based on nationality + destination
 * - Regional bloc exemptions (ECOWAS, EAC, GCC, AU)
 * - Conditional access (e.g., Indians with US/UK/EU visas for UAE)
 * - Pre-arrival requirements (TDAC, e-Ticket, ETA)
 * - Yellow fever requirements
 */

/**
 * Main function: Determine visa requirement for a traveler
 * This is the primary endpoint for Flow #1
 * 
 * @param {string} passportCountryCode - ISO 3166-1 alpha-2 code
 * @param {string} destinationCountryCode - ISO 3166-1 alpha-2 code  
 * @param {string} purpose - Travel purpose (TOURISM, BUSINESS, etc.)
 * @param {Object} travelDates - { arrivalDate, departureDate }
 * @param {Object} userContext - Optional: { hasValidVisaFrom: ['US', 'UK'] }
 * @returns {Object} Visa requirement result
 */
export async function determineVisaRequirement(
  passportCountryCode,
  destinationCountryCode,
  purpose = 'TOURISM',
  travelDates = {},
  userContext = {}
) {
  // Step 1: Get country documents
  const [passportCountry, destinationCountry] = await Promise.all([
    Country.findOne({ isoCode: passportCountryCode.toUpperCase() }),
    Country.findOne({ isoCode: destinationCountryCode.toUpperCase() })
  ]);

  if (!passportCountry) {
    throw new Error(`Unknown passport country: ${passportCountryCode}`);
  }
  if (!destinationCountry) {
    throw new Error(`Unknown destination country: ${destinationCountryCode}`);
  }

  // Step 2: Check for regional bloc exemptions FIRST
  const blocExemption = checkRegionalBlocExemption(passportCountry, destinationCountry);
  if (blocExemption) {
    return formatVisaResult({
      visaType: 'VISA_FREE',
      reason: blocExemption.reason,
      exemptionType: blocExemption.bloc,
      allowedStayDays: blocExemption.stayDays || 90,
      passportCountry,
      destinationCountry,
      purpose
    });
  }

  // Step 3: Look up specific visa rule
  const visaRule = await VisaRequirement.findOne({
    passportCountry: passportCountry._id,
    destinationCountry: destinationCountry._id,
    travelPurpose: purpose,
    isActive: true
  }).populate('passportCountry destinationCountry');

  if (!visaRule) {
    // No specific rule found - check for default destination rule
    const defaultRule = await getDefaultDestinationRule(destinationCountry._id, purpose);
    if (defaultRule) {
      return formatVisaResult({
        ...defaultRule.toObject(),
        passportCountry,
        destinationCountry,
        isDefaultRule: true
      });
    }
    
    // No rule at all - assume embassy visa required
    return formatVisaResult({
      visaType: 'EMBASSY_VISA',
      reason: 'No specific visa rule found. Embassy visa likely required.',
      requiresConfirmation: true,
      passportCountry,
      destinationCountry,
      purpose
    });
  }

  // Step 4: Check for conditional access (e.g., UAE VOA for Indians with US visa)
  if (visaRule.eligibilityConditions?.conditionalAccess?.requiresValidVisaFrom) {
    const conditionalResult = checkConditionalAccess(visaRule, userContext);
    if (conditionalResult.eligible) {
      return formatVisaResult({
        ...visaRule.toObject(),
        conditionalAccessGranted: true,
        conditionalReason: conditionalResult.reason,
        passportCountry,
        destinationCountry
      });
    }
  }

  // Step 5: Add validation warnings
  const warnings = await generateWarnings(
    visaRule, 
    passportCountry, 
    destinationCountry, 
    travelDates,
    userContext
  );

  // Step 6: Get pre-arrival requirements
  const preArrivalInfo = getPreArrivalRequirements(visaRule, destinationCountryCode);

  return formatVisaResult({
    ...visaRule.toObject(),
    passportCountry,
    destinationCountry,
    warnings,
    preArrivalInfo
  });
}

/**
 * Check if traveler qualifies for regional bloc exemption
 */
function checkRegionalBlocExemption(passportCountry, destinationCountry) {
  const passportBlocs = passportCountry.regionalBlocs || [];
  const destIsoCode = destinationCountry.isoCode;

  // ECOWAS: Visa-free in Ghana, Nigeria for ECOWAS members
  if ((destIsoCode === 'GH' || destIsoCode === 'NG') && passportBlocs.includes('ECOWAS')) {
    return {
      bloc: 'ECOWAS',
      reason: 'ECOWAS member nationals enjoy visa-free travel within the community',
      stayDays: 90
    };
  }

  // EAC: Visa-free in Kenya, Uganda, Tanzania, Rwanda for EAC members
  if (['KE', 'UG', 'TZ', 'RW'].includes(destIsoCode) && passportBlocs.includes('EAC')) {
    return {
      bloc: 'EAC',
      reason: 'East African Community member nationals enjoy visa-free travel',
      stayDays: 90
    };
  }

  // AU: Visa-free in Rwanda for ALL African Union members
  if (destIsoCode === 'RW' && passportBlocs.includes('AU')) {
    return {
      bloc: 'AU',
      reason: 'Rwanda grants visa-free entry to all African Union member nationals',
      stayDays: 30
    };
  }

  // GCC: ID-only entry to UAE for GCC nationals
  if (destIsoCode === 'AE' && passportBlocs.includes('GCC')) {
    return {
      bloc: 'GCC',
      reason: 'GCC nationals can enter UAE with national ID only',
      stayDays: 90
    };
  }

  // Kenya: Visa-free for most African nationals (May 2025 policy)
  if (destIsoCode === 'KE' && passportBlocs.includes('AU')) {
    // Except Libya and Somalia
    if (!['LY', 'SO'].includes(passportCountry.isoCode)) {
      return {
        bloc: 'AU',
        reason: 'Kenya grants visa-free entry to most African nationals',
        stayDays: 90
      };
    }
  }

  return null;
}

/**
 * Check conditional access requirements (e.g., UAE VOA for Indians with US visa)
 */
function checkConditionalAccess(visaRule, userContext) {
  const conditions = visaRule.eligibilityConditions?.conditionalAccess;
  if (!conditions?.requiresValidVisaFrom || !conditions.requiresValidVisaFrom.length) {
    return { eligible: false };
  }

  const userVisas = userContext.hasValidVisaFrom || [];
  const requiredVisas = conditions.requiresValidVisaFrom;
  
  // Check if user has valid visa from any of the required countries
  const matchingVisa = requiredVisas.find(country => userVisas.includes(country));
  
  if (matchingVisa) {
    return {
      eligible: true,
      reason: `Eligible for visa on arrival with valid ${matchingVisa} visa/residence permit`
    };
  }

  return { eligible: false };
}

/**
 * Generate validation warnings for rejection prevention
 */
async function generateWarnings(visaRule, passportCountry, destinationCountry, travelDates, userContext) {
  const warnings = [];
  const { arrivalDate, departureDate } = travelDates;
  const passportExpiry = userContext.passportExpiryDate;

  // Warning 1: Passport validity
  if (passportExpiry && arrivalDate) {
    const requiredValidityDays = visaRule.passportValidityDays || 180;
    const tripEndDate = departureDate || arrivalDate;
    const daysAfterTrip = Math.ceil((new Date(passportExpiry) - new Date(tripEndDate)) / (1000 * 60 * 60 * 24));
    
    if (daysAfterTrip < requiredValidityDays) {
      warnings.push({
        type: 'PASSPORT_VALIDITY',
        severity: 'ERROR',
        message: `Passport must be valid for at least ${requiredValidityDays} days beyond trip end date. Your passport expires ${daysAfterTrip} days after your trip.`,
        action: 'Renew passport before applying for visa'
      });
    }
  }

  // Warning 2: Yellow fever
  if (visaRule.yellowFeverRequired === 'ALWAYS') {
    warnings.push({
      type: 'YELLOW_FEVER',
      severity: 'ERROR',
      message: 'Yellow fever vaccination certificate is mandatory for entry',
      action: 'Get vaccinated at least 10 days before travel'
    });
  } else if (visaRule.yellowFeverRequired === 'CONDITIONAL') {
    if (passportCountry.yellowFeverEndemic) {
      warnings.push({
        type: 'YELLOW_FEVER',
        severity: 'ERROR',
        message: 'Yellow fever certificate required when traveling from endemic countries',
        action: 'Get vaccinated at least 10 days before travel'
      });
    }
  }

  // Warning 3: Pre-arrival digital requirements
  if (visaRule.preArrivalRequirements && visaRule.preArrivalRequirements.length > 0) {
    visaRule.preArrivalRequirements.forEach(req => {
      if (req.mandatory) {
        warnings.push({
          type: 'PRE_ARRIVAL_FORM',
          severity: 'WARNING',
          message: `${req.name} must be completed ${req.advanceHours || 72} hours before arrival`,
          action: `Complete at: ${req.portalUrl}`,
          formType: req.type
        });
      }
    });
  }

  // Warning 4: Processing time vs travel date
  if (arrivalDate && visaRule.processingTimeMax) {
    const daysUntilTrip = Math.ceil((new Date(arrivalDate) - new Date()) / (1000 * 60 * 60 * 24));
    const bufferDays = 7; // Standard buffer
    const requiredDays = visaRule.processingTimeMax + bufferDays;
    
    if (daysUntilTrip < requiredDays) {
      warnings.push({
        type: 'PROCESSING_TIME',
        severity: daysUntilTrip < visaRule.processingTimeMax ? 'ERROR' : 'WARNING',
        message: `Only ${daysUntilTrip} days until travel. Processing takes ${visaRule.processingTimeMin}-${visaRule.processingTimeMax} business days.`,
        action: 'Apply immediately or consider rescheduling travel'
      });
    }
  }

  return warnings;
}

/**
 * Get pre-arrival requirements formatted for display
 */
function getPreArrivalRequirements(visaRule, destinationIsoCode) {
  const requirements = visaRule.preArrivalRequirements || [];
  
  // Add known country-specific requirements
  const knownRequirements = {
    'TH': { type: 'TDAC', name: 'Thailand Digital Arrival Card', advanceHours: 72, portalUrl: 'https://tdac.immigration.go.th' },
    'DO': { type: 'E_TICKET', name: 'Dominican Republic e-Ticket', advanceHours: 72, portalUrl: 'https://eticket.migracion.gob.do' },
    'KE': { type: 'ETA', name: 'Kenya Electronic Travel Authorization', advanceHours: 72, portalUrl: 'https://www.etakenya.go.ke' },
    'SC': { type: 'TRAVEL_AUTH', name: 'Seychelles Travel Authorization', advanceHours: 72, portalUrl: 'https://seychelles.govtas.com' },
    'NG': { type: 'DIGITAL_LANDING_CARD', name: 'Nigeria Digital Landing Card', advanceHours: 24, portalUrl: 'https://immigration.gov.ng' }
  };

  const countryReq = knownRequirements[destinationIsoCode];
  if (countryReq && !requirements.find(r => r.type === countryReq.type)) {
    requirements.push({ ...countryReq, mandatory: true });
  }

  return requirements;
}

/**
 * Get default visa rule for a destination (when no specific passport-destination pair exists)
 */
async function getDefaultDestinationRule(destinationCountryId, purpose) {
  // Look for a wildcard rule (if implemented) or return null
  return null;
}

/**
 * Format visa result for API response
 */
function formatVisaResult(data) {
  return {
    visaType: data.visaType,
    visaTypeFriendly: getVisaTypeFriendlyName(data.visaType),
    
    destination: {
      name: data.destinationCountry?.name,
      isoCode: data.destinationCountry?.isoCode
    },
    passport: {
      name: data.passportCountry?.name,
      isoCode: data.passportCountry?.isoCode
    },
    purpose: data.travelPurpose || data.purpose,
    
    // Key info
    allowedStayDays: data.allowedStayDays || data.visaFreeDays,
    processingTime: {
      min: data.processingTimeMin,
      max: data.processingTimeMax,
      unit: 'business days'
    },
    
    // Fees
    fees: {
      visaCost: data.visaCost,
      currency: data.currency || 'USD',
      additionalFees: data.additionalFees || []
    },
    
    // Requirements
    passportValidityDays: data.passportValidityDays || 180,
    blankPagesRequired: data.blankPagesRequired || 2,
    
    // Application
    applicationMethod: data.applicationMethod,
    applicationUrl: data.applicationUrl,
    
    // Pre-arrival
    preArrivalRequirements: data.preArrivalInfo || data.preArrivalRequirements || [],
    
    // Yellow fever
    yellowFeverRequired: data.yellowFeverRequired,
    yellowFeverConditions: data.yellowFeverConditions,
    
    // Special cases
    exemptionType: data.exemptionType,
    exemptionReason: data.reason,
    conditionalAccessGranted: data.conditionalAccessGranted,
    conditionalReason: data.conditionalReason,
    
    // Warnings & validation
    warnings: data.warnings || [],
    
    // Restrictions
    restrictions: data.restrictions || [],
    notes: data.notes,
    
    // Metadata
    ruleId: data._id,
    lastUpdated: data.lastUpdated,
    lastVerifiedDate: data.lastVerifiedDate,
    lastVerifiedSource: data.lastVerifiedSource,
    requiresConfirmation: data.requiresConfirmation || false,
    isDefaultRule: data.isDefaultRule || false
  };
}

/**
 * Get friendly name for visa type
 */
function getVisaTypeFriendlyName(visaType) {
  const names = {
    'VISA_FREE': 'Visa Not Required',
    'E_VISA': 'Electronic Visa (eVisa)',
    'VISA_ON_ARRIVAL': 'Visa on Arrival',
    'EMBASSY_VISA': 'Embassy/Consulate Visa',
    'TRANSIT_VISA': 'Transit Visa',
    'ETA': 'Electronic Travel Authorization',
    'TRAVEL_AUTH': 'Travel Authorization'
  };
  return names[visaType] || visaType;
}

/**
 * Get detailed visa information (lazy-loaded)
 * For Flow #1: Detailed Visa Information screen
 */
export async function getVisaDetails(ruleId) {
  const rule = await VisaRequirement.findById(ruleId)
    .populate('passportCountry destinationCountry');
  
  if (!rule) {
    throw new Error('Visa rule not found');
  }

  // Get document requirements
  const documents = await DocumentRequirement.find({
    visaRequirementId: ruleId,
    isActive: true
  }).sort({ mandatory: -1, displayOrder: 1 });

  return {
    ...formatVisaResult(rule),
    documentChecklist: documents.map(doc => ({
      id: doc._id,
      type: doc.documentType,
      name: doc.name,
      description: doc.description,
      mandatory: doc.mandatory,
      specifications: doc.specifications,
      tips: doc.tips,
      templateUrls: doc.templateUrls
    })),
    applicationSteps: generateApplicationSteps(rule),
    officialGuidelinesUrl: rule.officialGuidelinesUrl
  };
}

/**
 * Generate step-by-step application guide
 */
function generateApplicationSteps(rule) {
  const steps = [];
  
  if (rule.visaType === 'VISA_FREE') {
    steps.push({
      step: 1,
      title: 'No Visa Application Needed',
      description: 'You can travel without a visa. Just ensure your passport is valid.'
    });
  } else if (rule.visaType === 'E_VISA' || rule.visaType === 'ETA') {
    steps.push(
      { step: 1, title: 'Gather Documents', description: 'Prepare passport scan, photo, and supporting documents' },
      { step: 2, title: 'Apply Online', description: `Visit ${rule.applicationUrl} to submit your application` },
      { step: 3, title: 'Pay Fee', description: `Pay the visa fee of ${rule.visaCost} ${rule.currency}` },
      { step: 4, title: 'Wait for Approval', description: `Processing takes ${rule.processingTimeMin}-${rule.processingTimeMax} business days` },
      { step: 5, title: 'Download & Print', description: 'Print your approved visa for travel' }
    );
  } else if (rule.visaType === 'EMBASSY_VISA') {
    steps.push(
      { step: 1, title: 'Gather Documents', description: 'Prepare all required documents as per checklist' },
      { step: 2, title: 'Book Appointment', description: 'Schedule an appointment at the embassy or visa center' },
      { step: 3, title: 'Submit Application', description: 'Attend appointment and submit documents' },
      { step: 4, title: 'Biometrics', description: 'Provide fingerprints and photo if required' },
      { step: 5, title: 'Wait for Decision', description: `Processing takes ${rule.processingTimeMin}-${rule.processingTimeMax} business days` },
      { step: 6, title: 'Collect Passport', description: 'Pick up your passport with the visa' }
    );
  }

  // Add pre-arrival form step if needed
  if (rule.preArrivalRequirements && rule.preArrivalRequirements.length > 0) {
    steps.push({
      step: steps.length + 1,
      title: 'Complete Pre-Arrival Forms',
      description: 'Submit required digital forms before travel',
      forms: rule.preArrivalRequirements.map(r => r.name)
    });
  }

  return steps;
}

export default {
  determineVisaRequirement,
  getVisaDetails
};
