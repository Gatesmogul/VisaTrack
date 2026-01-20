/**
 * Country Normalization Utility
 * Maps known aliases and variations to ISO-3166 alpha-2 codes
 */

const COUNTRY_MAP = {
  'GB': 'GB',
  'UK': 'GB',
  'GREAT BRITAIN': 'GB',
  'UNITED KINGDOM': 'GB',
  'US': 'US',
  'USA': 'US',
  'UNITED STATES': 'US',
  'UNITED STATES OF AMERICA': 'US',
  'CA': 'CA',
  'CANADA': 'CA',
  'AU': 'AU',
  'AUSTRALIA': 'AU',
  'DE': 'DE',
  'GERMANY': 'DE',
  'FR': 'FR',
  'FRANCE': 'FR',
  'JP': 'JP',
  'JAPAN': 'JP',
  'IN': 'IN',
  'INDIA': 'IN',
  'CN': 'CN',
  'CHINA': 'CN',
  'BR': 'BR',
  'BRAZIL': 'BR',
  'MX': 'MX',
  'MEXICO': 'MX',
  'SG': 'SG',
  'SINGAPORE': 'SG',
  'AE': 'AE',
  'UNITED ARAB EMIRATES': 'AE',
  'ZA': 'ZA',
  'SOUTH AFRICA': 'ZA',
  'KR': 'KR',
  'SOUTH KOREA': 'KR',
};

/**
 * Normalizes a country name or code to ISO alpha-2 format
 * @param {string} input - The country string to normalize
 * @returns {string|null} - The normalized 2-letter country code or null if invalid
 */
export const normalizeCountryCode = (input) => {
  if (!input) return null;
  
  const normalized = input.trim().toUpperCase();
  
  // 1. Direct map lookup (covers codes and common names)
  if (COUNTRY_MAP[normalized]) {
    return COUNTRY_MAP[normalized];
  }
  
  // 2. If it's already 2 letters, assume it's a code (could add more validation against a list if needed)
  if (normalized.length === 2) {
    return normalized;
  }
  
  // 3. Fallback: Return null if we can't determine the code
  // In a real production system, we might use a library like 'i18n-iso-countries'
  return null;
};
