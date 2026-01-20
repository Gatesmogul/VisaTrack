/**
 * Seed Data for 15 Target Countries
 * 2026 Visa Policies - Verified January 2026
 * 
 * Usage: node --experimental-json-modules seedCountries.js
 */

import Country from '../models/Country.js';

/**
 * 15 Target Countries with 2026-accurate data
 */
const countries = [
  // AFRICA
  {
    name: 'South Africa',
    isoCode: 'ZA',
    isoCode3: 'ZAF',
    continent: 'AFRICA',
    region: 'Southern Africa',
    regionalBlocs: ['AU', 'SADC'],
    defaultPassportValidityDays: 30, // Unique: only 30 days required
    hasEVisaSystem: true,
    hasETASystem: true, // Rolling out 2026
    hasVOA: false,
    yellowFeverEndemic: false,
    currency: 'ZAR',
    eVisaPortalUrl: 'https://www.dha.gov.za',
    immigrationPortalUrl: 'https://www.dha.gov.za'
  },
  {
    name: 'Ghana',
    isoCode: 'GH',
    isoCode3: 'GHA',
    continent: 'AFRICA',
    region: 'West Africa',
    regionalBlocs: ['AU', 'ECOWAS'],
    defaultPassportValidityDays: 180,
    hasEVisaSystem: true, // Launching Q1 2026
    hasETASystem: false,
    hasVOA: false,
    yellowFeverEndemic: true, // Mandatory yellow fever certificate
    currency: 'GHS',
    immigrationPortalUrl: 'https://www.mfa.gov.gh'
  },
  {
    name: 'Tanzania',
    isoCode: 'TZ',
    isoCode3: 'TZA',
    continent: 'AFRICA',
    region: 'East Africa',
    regionalBlocs: ['AU', 'EAC', 'SADC'],
    defaultPassportValidityDays: 180,
    hasEVisaSystem: true,
    hasETASystem: false,
    hasVOA: false, // VOA suspended Jan 2025
    yellowFeverEndemic: false,
    currency: 'USD',
    eVisaPortalUrl: 'https://eservices.immigration.go.tz/visa/',
    immigrationPortalUrl: 'https://www.immigration.go.tz'
  },
  {
    name: 'Rwanda',
    isoCode: 'RW',
    isoCode3: 'RWA',
    continent: 'AFRICA',
    region: 'East Africa',
    regionalBlocs: ['AU', 'EAC', 'COMESA'],
    defaultPassportValidityDays: 180,
    hasEVisaSystem: true,
    hasETASystem: false,
    hasVOA: true, // Free for AU members
    yellowFeverEndemic: false,
    currency: 'RWF',
    eVisaPortalUrl: 'https://irembo.gov.rw',
    immigrationPortalUrl: 'https://www.migration.gov.rw'
  },
  {
    name: 'Kenya',
    isoCode: 'KE',
    isoCode3: 'KEN',
    continent: 'AFRICA',
    region: 'East Africa',
    regionalBlocs: ['AU', 'EAC', 'COMESA'],
    defaultPassportValidityDays: 180,
    hasEVisaSystem: false,
    hasETASystem: true, // ETA only since Jan 2024
    hasVOA: false, // VOA eliminated
    yellowFeverEndemic: false,
    currency: 'USD',
    eVisaPortalUrl: 'https://www.etakenya.go.ke',
    immigrationPortalUrl: 'https://www.immigration.go.ke'
  },
  {
    name: 'Uganda',
    isoCode: 'UG',
    isoCode3: 'UGA',
    continent: 'AFRICA',
    region: 'East Africa',
    regionalBlocs: ['AU', 'EAC', 'COMESA'],
    defaultPassportValidityDays: 180,
    hasEVisaSystem: true, // eVisa mandatory
    hasETASystem: false,
    hasVOA: false, // VOA phased out
    yellowFeverEndemic: true, // Mandatory certificate
    currency: 'USD',
    eVisaPortalUrl: 'https://visas.immigration.go.ug',
    immigrationPortalUrl: 'https://www.immigration.go.ug'
  },
  {
    name: 'Nigeria',
    isoCode: 'NG',
    isoCode3: 'NGA',
    continent: 'AFRICA',
    region: 'West Africa',
    regionalBlocs: ['AU', 'ECOWAS'],
    defaultPassportValidityDays: 180,
    hasEVisaSystem: true, // eVisa mandatory since May 2025
    hasETASystem: false,
    hasVOA: false, // VOA discontinued May 2025
    yellowFeverEndemic: true,
    currency: 'USD',
    eVisaPortalUrl: 'https://immigration.gov.ng',
    immigrationPortalUrl: 'https://immigration.gov.ng'
  },
  {
    name: 'Egypt',
    isoCode: 'EG',
    isoCode3: 'EGY',
    continent: 'AFRICA',
    region: 'North Africa',
    regionalBlocs: ['AU', 'COMESA'],
    defaultPassportValidityDays: 180,
    hasEVisaSystem: true,
    hasETASystem: false,
    hasVOA: true, // For eligible nationalities
    yellowFeverEndemic: false,
    currency: 'USD',
    eVisaPortalUrl: 'https://visa2egypt.gov.eg',
    immigrationPortalUrl: 'https://www.mofa.gov.eg'
  },
  {
    name: 'Madagascar',
    isoCode: 'MG',
    isoCode3: 'MDG',
    continent: 'AFRICA',
    region: 'East Africa',
    regionalBlocs: ['AU', 'COMESA', 'SADC'],
    defaultPassportValidityDays: 180,
    hasEVisaSystem: true,
    hasETASystem: false,
    hasVOA: true,
    yellowFeverEndemic: false,
    currency: 'EUR',
    eVisaPortalUrl: 'https://evisamada.gov.mg',
    immigrationPortalUrl: 'https://www.diplomatie.gov.mg'
  },
  {
    name: 'Seychelles',
    isoCode: 'SC',
    isoCode3: 'SYC',
    continent: 'AFRICA',
    region: 'East Africa',
    regionalBlocs: ['AU', 'COMESA', 'SADC'],
    defaultPassportValidityDays: 0, // Valid for duration of stay only
    hasEVisaSystem: false,
    hasETASystem: false,
    hasVOA: true, // Automatic visitor permit
    yellowFeverEndemic: false,
    currency: 'EUR',
    eVisaPortalUrl: 'https://seychelles.govtas.com', // Travel Authorization
    immigrationPortalUrl: 'https://www.mfa.gov.sc'
  },
  
  // MIDDLE EAST
  {
    name: 'United Arab Emirates',
    isoCode: 'AE',
    isoCode3: 'ARE',
    continent: 'ASIA',
    region: 'Middle East',
    regionalBlocs: ['GCC'],
    defaultPassportValidityDays: 180,
    hasEVisaSystem: true,
    hasETASystem: false,
    hasVOA: true, // Conditional for some nationalities
    yellowFeverEndemic: false,
    currency: 'AED',
    immigrationPortalUrl: 'https://www.gdrfad.gov.ae'
  },
  
  // ASIA
  {
    name: 'Thailand',
    isoCode: 'TH',
    isoCode3: 'THA',
    continent: 'ASIA',
    region: 'Southeast Asia',
    regionalBlocs: [],
    defaultPassportValidityDays: 180,
    hasEVisaSystem: true,
    hasETASystem: false,
    hasVOA: true, // 15-day VOA for specific nationalities
    yellowFeverEndemic: false,
    currency: 'THB',
    eVisaPortalUrl: 'https://www.thaievisa.go.th',
    immigrationPortalUrl: 'https://www.immigration.go.th'
  },
  {
    name: 'India',
    isoCode: 'IN',
    isoCode3: 'IND',
    continent: 'ASIA',
    region: 'South Asia',
    regionalBlocs: [],
    defaultPassportValidityDays: 180,
    hasEVisaSystem: true,
    hasETASystem: false,
    hasVOA: false,
    yellowFeverEndemic: false,
    currency: 'USD',
    eVisaPortalUrl: 'https://indianvisaonline.gov.in',
    immigrationPortalUrl: 'https://indianvisaonline.gov.in'
  },
  
  // OCEANIA
  {
    name: 'Australia',
    isoCode: 'AU',
    isoCode3: 'AUS',
    continent: 'OCEANIA',
    region: 'Oceania',
    regionalBlocs: [],
    defaultPassportValidityDays: 180,
    hasEVisaSystem: true, // eVisitor
    hasETASystem: true, // ETA app
    hasVOA: false, // No VOA
    yellowFeverEndemic: false,
    currency: 'AUD',
    eVisaPortalUrl: 'https://immi.homeaffairs.gov.au',
    immigrationPortalUrl: 'https://immi.homeaffairs.gov.au'
  },
  
  // CARIBBEAN
  {
    name: 'Dominican Republic',
    isoCode: 'DO',
    isoCode3: 'DOM',
    continent: 'NORTH_AMERICA',
    region: 'Caribbean',
    regionalBlocs: [],
    defaultPassportValidityDays: 0, // Valid for duration (exemption until Dec 2026)
    hasEVisaSystem: false,
    hasETASystem: false,
    hasVOA: false,
    yellowFeverEndemic: false,
    currency: 'USD',
    eVisaPortalUrl: 'https://eticket.migracion.gob.do', // e-Ticket is mandatory
    immigrationPortalUrl: 'https://www.migracion.gob.do'
  },
  
  // EUROPE
  {
    name: 'United Kingdom',
    isoCode: 'GB',
    isoCode3: 'GBR',
    continent: 'EUROPE',
    region: 'Western Europe',
    regionalBlocs: [],
    defaultPassportValidityDays: 180,
    hasEVisaSystem: false,
    hasETASystem: true, // ETA system starting for more nationalities in 2025/2026
    hasVOA: false,
    yellowFeverEndemic: false,
    currency: 'GBP',
    immigrationPortalUrl: 'https://www.gov.uk/government/organisations/uk-visas-and-immigration'
  },
  {
    name: 'United States',
    isoCode: 'US',
    isoCode3: 'USA',
    continent: 'NORTH_AMERICA',
    region: 'North America',
    regionalBlocs: [],
    defaultPassportValidityDays: 180,
    hasEVisaSystem: false,
    hasETASystem: true, // ESTA
    hasVOA: false,
    currency: 'USD',
    immigrationPortalUrl: 'https://www.uscis.gov'
  },
  {
    name: 'Canada',
    isoCode: 'CA',
    isoCode3: 'CAN',
    continent: 'NORTH_AMERICA',
    region: 'North America',
    regionalBlocs: [],
    defaultPassportValidityDays: 180,
    hasEVisaSystem: false,
    hasETASystem: true, // eTA
    hasVOA: false,
    currency: 'CAD',
    immigrationPortalUrl: 'https://www.canada.ca/en/services/immigration-citizenship.html'
  },
  {
    name: 'Germany',
    isoCode: 'DE',
    isoCode3: 'DEU',
    continent: 'EUROPE',
    region: 'Western Europe',
    regionalBlocs: ['EU', 'SCHENGEN'],
    defaultPassportValidityDays: 180,
    hasEVisaSystem: false,
    hasETASystem: false,
    hasVOA: false,
    currency: 'EUR',
    immigrationPortalUrl: 'https://www.auswaertiges-amt.de/en/visa-service'
  },
  {
    name: 'France',
    isoCode: 'FR',
    isoCode3: 'FRA',
    continent: 'EUROPE',
    region: 'Western Europe',
    regionalBlocs: ['EU', 'SCHENGEN'],
    defaultPassportValidityDays: 180,
    hasEVisaSystem: false,
    hasETASystem: false,
    hasVOA: false,
    currency: 'EUR',
    immigrationPortalUrl: 'https://france-visas.gouv.fr/'
  },
  {
    name: 'Japan',
    isoCode: 'JP',
    isoCode3: 'JPN',
    continent: 'ASIA',
    region: 'East Asia',
    regionalBlocs: [],
    defaultPassportValidityDays: 0, // Valid for duration of stay
    hasEVisaSystem: true,
    hasETASystem: false,
    hasVOA: false,
    currency: 'JPY',
    immigrationPortalUrl: 'https://www.mofa.go.jp/j_info/visit/visa/index.html'
  },
  {
    name: 'China',
    isoCode: 'CN',
    isoCode3: 'CHN',
    continent: 'ASIA',
    region: 'East Asia',
    regionalBlocs: [],
    defaultPassportValidityDays: 180,
    hasEVisaSystem: true,
    hasETASystem: false,
    hasVOA: true, // Port visas
    currency: 'CNY',
    immigrationPortalUrl: 'https://www.nia.gov.cn/'
  },
  {
    name: 'Brazil',
    isoCode: 'BR',
    isoCode3: 'BRA',
    continent: 'SOUTH_AMERICA',
    region: 'South America',
    regionalBlocs: [],
    defaultPassportValidityDays: 180,
    hasEVisaSystem: true,
    hasETASystem: false,
    hasVOA: false,
    currency: 'BRL',
    immigrationPortalUrl: 'https://www.gov.br/mre/pt-br/assuntos/portal-consular/vistos/quadro-geral-de-regime-de-vistos-para-entrada-no-brasil'
  },
  {
    name: 'Mexico',
    isoCode: 'MX',
    isoCode3: 'MEX',
    continent: 'NORTH_AMERICA',
    region: 'North America',
    regionalBlocs: [],
    defaultPassportValidityDays: 180,
    hasEVisaSystem: true, // SAE
    hasETASystem: false,
    hasVOA: false,
    currency: 'MXN',
    immigrationPortalUrl: 'https://www.gob.mx/sre'
  },
  {
    name: 'Singapore',
    isoCode: 'SG',
    isoCode3: 'SGP',
    continent: 'ASIA',
    region: 'Southeast Asia',
    regionalBlocs: [],
    defaultPassportValidityDays: 180,
    hasEVisaSystem: false,
    hasETASystem: false,
    hasVOA: false,
    currency: 'SGD',
    immigrationPortalUrl: 'https://www.ica.gov.sg/'
  },
  {
    name: 'South Korea',
    isoCode: 'KR',
    isoCode3: 'KOR',
    continent: 'ASIA',
    region: 'East Asia',
    regionalBlocs: [],
    defaultPassportValidityDays: 180,
    hasEVisaSystem: false,
    hasETASystem: true, // K-ETA
    hasVOA: false,
    currency: 'KRW',
    immigrationPortalUrl: 'https://www.hikorea.go.kr/'
  }
];

/**
 * ECOWAS Member Countries (for visa-free access to Ghana, Nigeria)
 */
const ecowasMembers = [
  { name: 'Benin', isoCode: 'BJ', regionalBlocs: ['AU', 'ECOWAS'] },
  { name: 'Burkina Faso', isoCode: 'BF', regionalBlocs: ['AU', 'ECOWAS'] },
  { name: 'Cape Verde', isoCode: 'CV', regionalBlocs: ['AU', 'ECOWAS'] },
  { name: 'Ivory Coast', isoCode: 'CI', regionalBlocs: ['AU', 'ECOWAS'] },
  { name: 'Gambia', isoCode: 'GM', regionalBlocs: ['AU', 'ECOWAS'] },
  { name: 'Guinea', isoCode: 'GN', regionalBlocs: ['AU', 'ECOWAS'] },
  { name: 'Guinea-Bissau', isoCode: 'GW', regionalBlocs: ['AU', 'ECOWAS'] },
  { name: 'Liberia', isoCode: 'LR', regionalBlocs: ['AU', 'ECOWAS'] },
  { name: 'Mali', isoCode: 'ML', regionalBlocs: ['AU', 'ECOWAS'] },
  { name: 'Niger', isoCode: 'NE', regionalBlocs: ['AU', 'ECOWAS'] },
  { name: 'Senegal', isoCode: 'SN', regionalBlocs: ['AU', 'ECOWAS'] },
  { name: 'Sierra Leone', isoCode: 'SL', regionalBlocs: ['AU', 'ECOWAS'] },
  { name: 'Togo', isoCode: 'TG', regionalBlocs: ['AU', 'ECOWAS'] }
];

/**
 * GCC Member Countries (ID-only entry to UAE)
 */
const gccMembers = [
  { name: 'Saudi Arabia', isoCode: 'SA', regionalBlocs: ['GCC'] },
  { name: 'Qatar', isoCode: 'QA', regionalBlocs: ['GCC'] },
  { name: 'Kuwait', isoCode: 'KW', regionalBlocs: ['GCC'] },
  { name: 'Bahrain', isoCode: 'BH', regionalBlocs: ['GCC'] },
  { name: 'Oman', isoCode: 'OM', regionalBlocs: ['GCC'] }
];

/**
 * Seed function
 */
export async function seedCountries() {
  console.log('Seeding 15 target countries...');
  
  // Upsert each target country
  for (const country of countries) {
    await Country.findOneAndUpdate(
      { isoCode: country.isoCode },
      country,
      { upsert: true, new: true }
    );
    console.log(`  ✓ ${country.name}`);
  }
  
  console.log('\nSeeding ECOWAS member countries...');
  for (const country of ecowasMembers) {
    await Country.findOneAndUpdate(
      { isoCode: country.isoCode },
      { 
        ...country, 
        continent: 'AFRICA',
        region: 'West Africa',
        isActive: true 
      },
      { upsert: true, new: true }
    );
    console.log(`  ✓ ${country.name}`);
  }
  
  console.log('\nSeeding GCC member countries...');
  for (const country of gccMembers) {
    await Country.findOneAndUpdate(
      { isoCode: country.isoCode },
      { 
        ...country, 
        continent: 'ASIA',
        region: 'Middle East',
        isActive: true 
      },
      { upsert: true, new: true }
    );
    console.log(`  ✓ ${country.name}`);
  }
  
  console.log('\n✅ Country seeding complete!');
}

export { countries, ecowasMembers, gccMembers };
export default seedCountries;
