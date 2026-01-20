import mongoose from 'mongoose';

/**
 * Regional Bloc Constants for visa exemption logic
 * ECOWAS: 15 West African countries - visa-free in Ghana, Nigeria
 * EAC: East African Community - visa-free in Kenya, Uganda, Tanzania
 * GCC: Gulf Cooperation Council - ID-only entry to UAE
 * AU: African Union - visa-free in Rwanda
 * EU/SCHENGEN: European visa agreements
 */
const REGIONAL_BLOCS = [
  'ECOWAS',    // Economic Community of West African States
  'EAC',       // East African Community
  'GCC',       // Gulf Cooperation Council
  'AU',        // African Union
  'EU',        // European Union
  'SCHENGEN',  // Schengen Area
  'SADC',      // Southern African Development Community
  'COMESA'     // Common Market for Eastern and Southern Africa
];

const CONTINENTS = ['AFRICA', 'ASIA', 'EUROPE', 'NORTH_AMERICA', 'SOUTH_AMERICA', 'OCEANIA', 'ANTARCTICA'];

/**
 * @swagger
 * components:
 *   schemas:
 *     Country:
 *       type: object
 *       required:
 *         - name
 *         - isoCode
 *       properties:
 *         name:
 *           type: string
 *           example: "Thailand"
 *         isoCode:
 *           type: string
 *           description: ISO 3166-1 alpha-2 code
 *           example: "TH"
 *         continent:
 *           type: string
 *           enum: [AFRICA, ASIA, EUROPE, NORTH_AMERICA, SOUTH_AMERICA, OCEANIA, ANTARCTICA]
 *         regionalBlocs:
 *           type: array
 *           items:
 *             type: string
 *             enum: [ECOWAS, EAC, GCC, AU, EU, SCHENGEN, SADC, COMESA]
 *         hasEVisaSystem:
 *           type: boolean
 *         hasVOA:
 *           type: boolean
 *         eVisaPortalUrl:
 *           type: string
 */
const countrySchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    isoCode: { type: String, required: true, unique: true },
    region: { type: String },
 
    isoCode3: { type: String },  // ISO 3166-1 alpha-3
    continent: { 
      type: String, 
      enum: CONTINENTS 
    },
    regionalBlocs: [{
      type: String,
      enum: REGIONAL_BLOCS
    }],
    // For visa rules engine - default passport validity requirement
    defaultPassportValidityDays: { 
      type: Number, 
      default: 180  // 6 months standard, some countries like South Africa use 30
    },
    // Country-specific flags
    hasEVisaSystem: { type: Boolean, default: false },
    hasETASystem: { type: Boolean, default: false },    // Kenya, Australia, South Africa
    hasVOA: { type: Boolean, default: false },          // Visa on Arrival availability
    yellowFeverEndemic: { type: Boolean, default: false },
    // Official immigration portal URLs
    immigrationPortalUrl: { type: String },
    eVisaPortalUrl: { type: String },
    // Currency for visa fees
    currency: { type: String, default: 'USD' },
    // Active status for soft delete
    isActive: { type: Boolean, default: true }
  },
  { timestamps: true }
);

// Indexes for fast lookups
countrySchema.index({ regionalBlocs: 1 });
countrySchema.index({ continent: 1 });

// Virtual to check if country is in a specific bloc
countrySchema.methods.isInBloc = function(blocName) {
  return this.regionalBlocs && this.regionalBlocs.includes(blocName);
};

export default mongoose.model('Country', countrySchema);
export { CONTINENTS, REGIONAL_BLOCS };