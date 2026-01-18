import visaRules from '../data/visaRules.js';

// Very small rule engine for front-end lookups. This is intentionally conservative and deterministic.
// It accepts either country name or ISO-like code for passport and destination.

function findRuleForDestination(destination) {
  const key = (destination || '').toString().toLowerCase();
  return visaRules.find(r => r.country.toLowerCase() === key || r.code.toLowerCase() === key) || null;
}

// Some simple passport-based exemptions for demo purposes.
const visaFreePairs = [
  // (passportCode, destinationCode) pairs that are visa-free regardless of rule
  ['SG', 'TH'], // Singapore passport holders visa-free in Thailand (example)
  ['US', 'IT'],
  ['US', 'FR'],
  ['US', 'DE'],
  ['CA', 'FR'],
  ['AU', 'SG']
];

export function lookupVisaRequirement(passport = '', destination = '') {
  const destRule = findRuleForDestination(destination);
  if (!destRule) {
    return { found: false, message: 'No visa data for destination', destination: destination };
  }

  // Passport normalization
  const passportKey = (passport || '').toString().slice(0,3).toUpperCase();

  // Check short-circuit visa-free pairs
  const isVisaFreePair = visaFreePairs.some(([p, d]) => p === passportKey && d === destRule.code);
  if (destRule.visaType === 'visa_free' || isVisaFreePair) {
    return {
      found: true,
      destination: destRule.country,
      type: 'visa_free',
      details: destRule,
      recommendation: 'No visa required for short stays. Check passport validity.'
    };
  }

  // Process other rule kinds
  switch (destRule.visaType) {
    case 'visa_on_arrival':
      return {
        found: true,
        destination: destRule.country,
        type: 'visa_on_arrival',
        details: destRule,
        recommendation: `Visa on arrival. Typical fee ~${destRule.feeUSD} USD upon entry.`
      };
    case 'evisa':
      return {
        found: true,
        destination: destRule.country,
        type: 'evisa',
        details: destRule,
        recommendation: `Apply for an eVisa online. Processing typically ${destRule.processingDays.normal} days.`
      };
    case 'embassy':
    case 'schengen':
      return {
        found: true,
        destination: destRule.country,
        type: destRule.visaType === 'schengen' ? 'schengen' : 'embassy',
        details: destRule,
        recommendation: destRule.appointmentRequired
          ? 'Book an appointment at the local embassy/consulate.'
          : 'Check embassy site for application guidance.'
      };
    default:
      return {
        found: true,
        destination: destRule.country,
        type: 'unknown',
        details: destRule,
        recommendation: 'Check embassy or official sources for latest requirements.'
      };
  }
}

export function getVisaTypeLabel(type) {
  switch (type) {
    case 'visa_free': return 'Visa-free';
    case 'visa_on_arrival': return 'Visa on arrival';
    case 'evisa': return 'eVisa';
    case 'embassy': return 'Embassy / Consulate application';
    case 'schengen': return 'Schengen visa (consulate / short-stay)';
    default: return 'Check requirements';
  }
}

export default {
  lookupVisaRequirement,
  getVisaTypeLabel
};
