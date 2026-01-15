/**
 * Seed Data for Visa Requirements
 * 2026 Visa Policies for 15 Target Countries
 * 
 * This creates visa rules for common passport nationalities
 */

import Country from '../models/Country.js';
import VisaRequirement from '../models/VisaRequirement.js';

/**
 * Common passport countries for seeding
 */
const commonPassports = ['US', 'GB', 'CA', 'DE', 'FR', 'IN', 'CN', 'NG', 'ZA', 'KE', 'GH'];

/**
 * Visa rules by destination
 * Format: destination -> passport -> rule
 */
const visaRules = {
  // SOUTH AFRICA (ZA)
  ZA: {
    default: {
      visaType: 'EMBASSY_VISA',
      applicationMethod: 'VFS_GLOBAL',
      processingTimeMin: 5,
      processingTimeMax: 15,
      visaCost: 50,
      passportValidityDays: 30,
      yellowFeverRequired: 'CONDITIONAL',
      yellowFeverConditions: { ifFromEndemicCountry: true },
      notes: 'South Africa requires only 30 days passport validity beyond departure'
    },
    US: { visaType: 'VISA_FREE', visaFreeDays: 90, applicationMethod: 'NONE' },
    GB: { visaType: 'VISA_FREE', visaFreeDays: 90, applicationMethod: 'NONE' },
    CA: { visaType: 'VISA_FREE', visaFreeDays: 90, applicationMethod: 'NONE' },
    DE: { visaType: 'VISA_FREE', visaFreeDays: 90, applicationMethod: 'NONE' },
    FR: { visaType: 'VISA_FREE', visaFreeDays: 90, applicationMethod: 'NONE' }
  },

  // KENYA (KE) - ETA only since Jan 2024
  KE: {
    default: {
      visaType: 'ETA',
      applicationMethod: 'ONLINE',
      applicationUrl: 'https://www.etakenya.go.ke',
      processingTimeMin: 1,
      processingTimeMax: 3,
      visaCost: 30,
      allowedStayDays: 90,
      notes: 'Kenya eliminated VOA. ETA mandatory for all non-EAC nationals.'
    }
    // EAC members handled by regional bloc exemption in rules engine
  },

  // NIGERIA (NG) - eVisa only since May 2025
  NG: {
    default: {
      visaType: 'E_VISA',
      applicationMethod: 'ONLINE',
      applicationUrl: 'https://immigration.gov.ng',
      processingTimeMin: 2,
      processingTimeMax: 5,
      visaCost: 50,
      allowedStayDays: 90,
      passportValidityDays: 180,
      preArrivalRequirements: [{
        type: 'DIGITAL_LANDING_CARD',
        name: 'Nigeria Digital Landing Card',
        portalUrl: 'https://immigration.gov.ng',
        advanceHours: 24,
        mandatory: true
      }],
      notes: 'Nigeria discontinued VOA effective May 1, 2025. eVisa required for all non-ECOWAS nationals.'
    }
    // ECOWAS members handled by regional bloc exemption
  },

  // GHANA (GH)
  GH: {
    default: {
      visaType: 'EMBASSY_VISA',
      applicationMethod: 'EMBASSY',
      processingTimeMin: 7,
      processingTimeMax: 15,
      visaCost: 60,
      allowedStayDays: 60,
      passportValidityDays: 180,
      yellowFeverRequired: 'ALWAYS',
      notes: 'Ghana eVisa system launching Q1 2026. Yellow fever certificate mandatory.'
    }
    // ECOWAS members visa-free
  },

  // TANZANIA (TZ) - eVisa only since Jan 2025
  TZ: {
    default: {
      visaType: 'E_VISA',
      applicationMethod: 'ONLINE',
      applicationUrl: 'https://eservices.immigration.go.tz/visa/',
      processingTimeMin: 3,
      processingTimeMax: 10,
      visaCost: 50,
      allowedStayDays: 90,
      notes: 'Tanzania suspended VOA from January 2025. eVisa mandatory.'
    },
    US: { visaCost: 100, allowedStayDays: 90 } // US citizens pay more, get multiple entry
  },

  // UGANDA (UG) - eVisa mandatory
  UG: {
    default: {
      visaType: 'E_VISA',
      applicationMethod: 'ONLINE',
      applicationUrl: 'https://visas.immigration.go.ug',
      processingTimeMin: 3,
      processingTimeMax: 7,
      visaCost: 50,
      allowedStayDays: 90,
      yellowFeverRequired: 'ALWAYS',
      notes: 'Uganda VOA phased out. eVisa mandatory for all non-EAC nationals.'
    }
  },

  // RWANDA (RW) - Visa-free for all Africans
  RW: {
    default: {
      visaType: 'VISA_ON_ARRIVAL',
      applicationMethod: 'ON_ARRIVAL',
      processingTimeMin: 0,
      processingTimeMax: 1,
      visaCost: 30,
      allowedStayDays: 30,
      notes: 'Rwanda grants free visas on arrival for AU members. Others get VOA.'
    }
    // AU members get visa-free via bloc exemption
  },

  // EGYPT (EG)
  EG: {
    default: {
      visaType: 'E_VISA',
      applicationMethod: 'ONLINE',
      applicationUrl: 'https://visa2egypt.gov.eg',
      processingTimeMin: 3,
      processingTimeMax: 7,
      visaCost: 25,
      allowedStayDays: 30,
      notes: 'Egypt eVisa for tourism. VOA also available for eligible nationalities.'
    },
    US: { visaType: 'VISA_ON_ARRIVAL', visaCost: 25 },
    GB: { visaType: 'VISA_ON_ARRIVAL', visaCost: 25 },
    CA: { visaType: 'E_VISA', visaCost: 25 } // Canada: eVisa required, no VOA
  },

  // MADAGASCAR (MG)
  MG: {
    default: {
      visaType: 'E_VISA',
      applicationMethod: 'ONLINE',
      applicationUrl: 'https://evisamada.gov.mg',
      processingTimeMin: 3,
      processingTimeMax: 5,
      visaCost: 37,
      allowedStayDays: 30,
      notes: 'Madagascar eVisa or VOA available. First 15 days free (admin fee only).'
    }
  },

  // SEYCHELLES (SC) - Most open policy
  SC: {
    default: {
      visaType: 'TRAVEL_AUTH',
      applicationMethod: 'ONLINE',
      applicationUrl: 'https://seychelles.govtas.com',
      processingTimeMin: 0,
      processingTimeMax: 1,
      visaCost: 11, // EUR 10.90
      allowedStayDays: 90,
      validityPeriodDays: 90,
      passportValidityDays: 0, // Valid for duration of stay
      preArrivalRequirements: [{
        type: 'TRAVEL_AUTH',
        name: 'Seychelles Travel Authorization',
        portalUrl: 'https://seychelles.govtas.com',
        advanceHours: 72,
        mandatory: true,
        cost: 10.90,
        currency: 'EUR'
      }],
      notes: 'Seychelles: No visa required, but Travel Authorization mandatory. Visitor permit on arrival extendable to 1 year.'
    }
  },

  // UAE (AE)
  AE: {
    default: {
      visaType: 'E_VISA',
      applicationMethod: 'ONLINE',
      processingTimeMin: 2,
      processingTimeMax: 7,
      visaCost: 100,
      allowedStayDays: 30,
      notes: 'UAE eVisa for most nationalities. VOA for select countries.'
    },
    US: { visaType: 'VISA_FREE', visaFreeDays: 30, applicationMethod: 'NONE' },
    GB: { visaType: 'VISA_FREE', visaFreeDays: 30, applicationMethod: 'NONE' },
    CA: { visaType: 'VISA_FREE', visaFreeDays: 30, applicationMethod: 'NONE' },
    DE: { visaType: 'VISA_FREE', visaFreeDays: 30, applicationMethod: 'NONE' },
    FR: { visaType: 'VISA_FREE', visaFreeDays: 30, applicationMethod: 'NONE' },
    IN: {
      visaType: 'E_VISA',
      applicationMethod: 'ONLINE',
      visaCost: 100,
      allowedStayDays: 60,
      eligibilityConditions: {
        conditionalAccess: {
          requiresValidVisaFrom: ['US', 'GB', 'DE', 'FR', 'IT', 'ES'],
          validVisaTypes: ['TOURIST', 'BUSINESS', 'RESIDENCE'],
          minVisaValidityDays: 180
        },
        notes: 'Indians with valid US/UK/EU visa get 14-day VOA'
      }
    }
  },

  // THAILAND (TH)
  TH: {
    default: {
      visaType: 'E_VISA',
      applicationMethod: 'ONLINE',
      applicationUrl: 'https://www.thaievisa.go.th',
      processingTimeMin: 2,
      processingTimeMax: 7,
      visaCost: 40,
      allowedStayDays: 60,
      preArrivalRequirements: [{
        type: 'TDAC',
        name: 'Thailand Digital Arrival Card',
        portalUrl: 'https://tdac.immigration.go.th',
        advanceHours: 72,
        mandatory: true,
        cost: 0,
        notes: 'TDAC mandatory from May 1, 2025 for all foreign nationals'
      }],
      notes: 'TDAC mandatory 72 hours before arrival. Visa-free up to 60 days for ~93 countries.'
    },
    US: { visaType: 'VISA_FREE', visaFreeDays: 60, applicationMethod: 'NONE' },
    GB: { visaType: 'VISA_FREE', visaFreeDays: 60, applicationMethod: 'NONE' },
    CA: { visaType: 'VISA_FREE', visaFreeDays: 60, applicationMethod: 'NONE' },
    DE: { visaType: 'VISA_FREE', visaFreeDays: 60, applicationMethod: 'NONE' },
    FR: { visaType: 'VISA_FREE', visaFreeDays: 60, applicationMethod: 'NONE' },
    IN: { visaType: 'VISA_ON_ARRIVAL', visaCost: 35, allowedStayDays: 15 }
  },

  // INDIA (IN)
  IN: {
    default: {
      visaType: 'E_VISA',
      applicationMethod: 'ONLINE',
      applicationUrl: 'https://indianvisaonline.gov.in',
      processingTimeMin: 3,
      processingTimeMax: 10, // Actual 8-10 days in 2026
      visaCost: 25, // 30-day
      allowedStayDays: 30,
      preArrivalRequirements: [{
        type: 'HEALTH_DECLARATION',
        name: 'India e-Arrival Card',
        portalUrl: 'https://indianvisaonline.gov.in',
        advanceHours: 72,
        mandatory: false,
        notes: 'Optional digital arrival card launched Oct 2025'
      }],
      notes: 'India eVisa processing taking 8-10 days in 2026. Apply early. 5-year visa now $200.'
    }
  },

  // AUSTRALIA (AU) - No VOA
  AU: {
    default: {
      visaType: 'EMBASSY_VISA', // Visitor visa subclass 600
      applicationMethod: 'ONLINE',
      applicationUrl: 'https://immi.homeaffairs.gov.au',
      processingTimeMin: 7,
      processingTimeMax: 30,
      visaCost: 150,
      allowedStayDays: 90,
      notes: 'Australia: No VOA. ETA for eligible countries, eVisitor for EU, Visitor visa for others.'
    },
    US: { 
      visaType: 'ETA', 
      applicationMethod: 'MOBILE_APP',
      visaCost: 20,
      processingTimeMin: 0,
      processingTimeMax: 1,
      allowedStayDays: 90,
      notes: 'Apply via Australian ETA app'
    },
    GB: { 
      visaType: 'E_VISA', // eVisitor
      applicationMethod: 'ONLINE',
      visaCost: 0,
      processingTimeMin: 0,
      processingTimeMax: 1,
      allowedStayDays: 90
    },
    CA: { 
      visaType: 'ETA', 
      applicationMethod: 'MOBILE_APP',
      visaCost: 20,
      processingTimeMin: 0,
      processingTimeMax: 1,
      allowedStayDays: 90
    },
    DE: { visaType: 'E_VISA', visaCost: 0, processingTimeMin: 0, processingTimeMax: 1, allowedStayDays: 90 },
    FR: { visaType: 'E_VISA', visaCost: 0, processingTimeMin: 0, processingTimeMax: 1, allowedStayDays: 90 }
  },

  // DOMINICAN REPUBLIC (DO)
  DO: {
    default: {
      visaType: 'VISA_FREE',
      applicationMethod: 'NONE',
      visaFreeDays: 30,
      passportValidityDays: 0, // Valid for duration (exemption until Dec 2026)
      preArrivalRequirements: [{
        type: 'E_TICKET',
        name: 'Dominican Republic e-Ticket',
        portalUrl: 'https://eticket.migracion.gob.do',
        advanceHours: 72,
        mandatory: true,
        cost: 0,
        notes: 'Mandatory for ALL travelers (entry and exit). Free. Combines immigration, customs, health.'
      }],
      notes: 'Visa-free for most nationalities. e-Ticket MANDATORY for all travelers.'
    }
  }
};

/**
 * Seed visa requirements
 */
export async function seedVisaRequirements() {
  console.log('Seeding visa requirements for 15 target countries...\n');
  
  // Get all countries
  const countries = await Country.find({});
  const countryMap = new Map(countries.map(c => [c.isoCode, c]));
  
  let created = 0;
  let updated = 0;
  
  for (const [destCode, passportRules] of Object.entries(visaRules)) {
    const destCountry = countryMap.get(destCode);
    if (!destCountry) {
      console.log(`  ⚠ Destination country ${destCode} not found, skipping...`);
      continue;
    }
    
    console.log(`\n${destCountry.name} (${destCode}):`);
    
    // Get default rule
    const defaultRule = passportRules.default;
    
    // Create rules for each passport country
    for (const passportCode of commonPassports) {
      if (passportCode === destCode) continue; // Skip same country
      
      const passportCountry = countryMap.get(passportCode);
      if (!passportCountry) continue;
      
      // Get passport-specific rule or use default
      const specificRule = passportRules[passportCode] || {};
      const rule = { ...defaultRule, ...specificRule };
      
      const visaReq = {
        passportCountry: passportCountry._id,
        destinationCountry: destCountry._id,
        travelPurpose: 'TOURISM',
        visaType: rule.visaType,
        applicationMethod: rule.applicationMethod,
        applicationUrl: rule.applicationUrl,
        processingTimeMin: rule.processingTimeMin || 1,
        processingTimeMax: rule.processingTimeMax || 7,
        visaCost: rule.visaCost || 0,
        currency: 'USD',
        visaFreeDays: rule.visaFreeDays,
        allowedStayDays: rule.allowedStayDays || rule.visaFreeDays,
        passportValidityDays: rule.passportValidityDays !== undefined ? rule.passportValidityDays : 180,
        preArrivalRequirements: rule.preArrivalRequirements || [],
        yellowFeverRequired: rule.yellowFeverRequired || 'NOT_REQUIRED',
        yellowFeverConditions: rule.yellowFeverConditions || {},
        eligibilityConditions: rule.eligibilityConditions || {},
        notes: rule.notes,
        lastVerifiedDate: new Date(),
        lastVerifiedSource: 'Official government sources - January 2026',
        isActive: true
      };
      
      const result = await VisaRequirement.findOneAndUpdate(
        {
          passportCountry: passportCountry._id,
          destinationCountry: destCountry._id,
          travelPurpose: 'TOURISM'
        },
        visaReq,
        { upsert: true, new: true }
      );
      
      if (result.createdAt.getTime() === result.updatedAt.getTime()) {
        created++;
        console.log(`  ✓ ${passportCode} → ${destCode}: ${rule.visaType}`);
      } else {
        updated++;
      }
    }
  }
  
  console.log(`\n✅ Visa requirements seeding complete!`);
  console.log(`   Created: ${created}, Updated: ${updated}`);
}

export default seedVisaRequirements;
