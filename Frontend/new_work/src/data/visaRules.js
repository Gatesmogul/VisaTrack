// Simplified visa rule dataset for 15 countries
// Each entry includes basic rules: visa type (visa_free, visa_on_arrival, evisa, embassy), typical processing days, example fee (USD), required documents, appointment requirement and embassy contact info.

const visaRules = [
  {
    country: 'France',
    code: 'FR',
    visaType: 'schengen',
    processingDays: { normal: 15, expedited: 7 },
    feeUSD: 80,
    appointmentRequired: true,
    documents: ['Passport (6+ months)', 'Photo', 'Travel itinerary', 'Proof of funds'],
    embassyContact: { office: 'French Consulate', phone: '+33 1 23 45 67 89', address: 'Paris Embassy Address' }
  },
  {
    country: 'Germany',
    code: 'DE',
    visaType: 'schengen',
    processingDays: { normal: 20, expedited: 10 },
    feeUSD: 100,
    appointmentRequired: true,
    documents: ['Passport (6+ months)', 'Photo', 'Proof of accommodation', 'Travel insurance'],
    embassyContact: { office: 'German Embassy', phone: '+49 30 123456', address: 'Berlin Embassy Address' }
  },
  {
    country: 'Italy',
    code: 'IT',
    visaType: 'schengen',
    processingDays: { normal: 15, expedited: 7 },
    feeUSD: 85,
    appointmentRequired: true,
    documents: ['Passport (6+ months)', 'Photo', 'Invitation/Hotel Booking'],
    embassyContact: { office: 'Italian Embassy', phone: '+39 06 123456', address: 'Rome Embassy Address' }
  },
  {
    country: 'Thailand',
    code: 'TH',
    visaType: 'visa_on_arrival',
    processingDays: { normal: 0, expedited: 0 },
    feeUSD: 30,
    appointmentRequired: false,
    documents: ['Passport (6+ months)', 'Photo', 'Proof of funds'],
    embassyContact: { office: 'Thailand Embassy', phone: '+66 2 1234567', address: 'Bangkok Embassy Address' }
  },
  {
    country: 'Vietnam',
    code: 'VN',
    visaType: 'evisa',
    processingDays: { normal: 3, expedited: 1 },
    feeUSD: 25,
    appointmentRequired: false,
    documents: ['Passport (6+ months)', 'Photo', 'Travel itinerary'],
    embassyContact: { office: 'Vietnam Embassy', phone: '+84 24 12345678', address: 'Hanoi Embassy Address' }
  },
  {
    country: 'Singapore',
    code: 'SG',
    visaType: 'visa_free',
    processingDays: { normal: 0, expedited: 0 },
    feeUSD: 0,
    appointmentRequired: false,
    documents: ['Passport (valid)'],
    embassyContact: { office: 'Singapore Consulate', phone: '+65 1234 5678', address: 'Singapore Embassy Address' }
  },
  {
    country: 'United States',
    code: 'US',
    visaType: 'embassy',
    processingDays: { normal: 60, expedited: 30 },
    feeUSD: 185,
    appointmentRequired: true,
    documents: ['Passport (6+ months)', 'Photo', 'DS-160 confirmation', 'Proof of ties'],
    embassyContact: { office: 'US Embassy', phone: '+1 202 555 0100', address: 'Washington D.C. Embassy' }
  },
  {
    country: 'Canada',
    code: 'CA',
    visaType: 'embassy',
    processingDays: { normal: 45, expedited: 21 },
    feeUSD: 100,
    appointmentRequired: true,
    documents: ['Passport (6+ months)', 'Photo', 'Proof of funds'],
    embassyContact: { office: 'Canadian Embassy', phone: '+1 613 555 0101', address: 'Ottawa Embassy Address' }
  },
  {
    country: 'United Arab Emirates',
    code: 'AE',
    visaType: 'evisa',
    processingDays: { normal: 3, expedited: 1 },
    feeUSD: 90,
    appointmentRequired: false,
    documents: ['Passport (6+ months)', 'Photo', 'Hotel booking'],
    embassyContact: { office: 'UAE Embassy', phone: '+971 2 1234567', address: 'Abu Dhabi Embassy Address' }
  },
  {
    country: 'Japan',
    code: 'JP',
    visaType: 'embassy',
    processingDays: { normal: 10, expedited: 5 },
    feeUSD: 40,
    appointmentRequired: true,
    documents: ['Passport (6+ months)', 'Photo', 'Invitation or itinerary'],
    embassyContact: { office: 'Japanese Embassy', phone: '+81 3 1234 5678', address: 'Tokyo Embassy Address' }
  },
  {
    country: 'Australia',
    code: 'AU',
    visaType: 'evisa',
    processingDays: { normal: 7, expedited: 2 },
    feeUSD: 140,
    appointmentRequired: false,
    documents: ['Passport (6+ months)', 'Photo', 'Health insurance'],
    embassyContact: { office: 'Australian Embassy', phone: '+61 2 1234 5678', address: 'Canberra Embassy Address' }
  },
  {
    country: 'India',
    code: 'IN',
    visaType: 'evisa',
    processingDays: { normal: 5, expedited: 1 },
    feeUSD: 25,
    appointmentRequired: false,
    documents: ['Passport (6+ months)', 'Photo', 'Invitation (if applicable)'],
    embassyContact: { office: 'Indian Embassy', phone: '+91 11 12345678', address: 'New Delhi Embassy' }
  },
  {
    country: 'Egypt',
    code: 'EG',
    visaType: 'visa_on_arrival',
    processingDays: { normal: 0, expedited: 0 },
    feeUSD: 25,
    appointmentRequired: false,
    documents: ['Passport (6+ months)', 'Photo'],
    embassyContact: { office: 'Egypt Embassy', phone: '+20 2 12345678', address: 'Cairo Embassy' }
  },
  {
    country: 'Brazil',
    code: 'BR',
    visaType: 'evisa',
    processingDays: { normal: 7, expedited: 3 },
    feeUSD: 40,
    appointmentRequired: false,
    documents: ['Passport (6+ months)', 'Photo'],
    embassyContact: { office: 'Brazil Embassy', phone: '+55 11 1234 5678', address: 'Brasilia Embassy' }
  },
  {
    country: 'Nigeria',
    code: 'NG',
    visaType: 'embassy',
    processingDays: { normal: 30, expedited: 15 },
    feeUSD: 100,
    appointmentRequired: true,
    documents: ['Passport (6+ months)', 'Photo', 'Letter of invitation'],
    embassyContact: { office: 'Nigeria Embassy', phone: '+234 9 1234567', address: 'Abuja Embassy' }
  }
];

export default visaRules;
