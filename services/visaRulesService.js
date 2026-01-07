const VisaRequirement = require('../models/VisaRequirement');
const VisaRequiredDocument = require('../models/VisaRequiredDocument');

/**
 * Service to handle visa rules logic
 */

/**
 * Finds the visa requirement for a specific passport and destination
 * @param {String} passportCountryId - ID of the user's passport country
 * @param {String} destinationCountryId - ID of the destination country
 * @param {String} travelPurpose - Purpose of travel (TOURISM, BUSINESS, etc.)
 * @returns {Promise<Object|null>} The matching visa requirement
 */
const getMatchingRequirement = async (passportCountryId, destinationCountryId, travelPurpose = 'TOURISM') => {
    try {
        const requirement = await VisaRequirement.findOne({
            passportCountry: passportCountryId,
            destinationCountry: destinationCountryId,
            travelPurpose: travelPurpose
        });

        return requirement;
    } catch (error) {
        console.error('Error matching visa requirement:', error);
        throw error;
    }
};

/**
 * Gets mandatory documents for a specific visa requirement
 * @param {String} visaRequirementId 
 * @returns {Promise<Array>} List of required documents
 */
const getRequiredDocuments = async (visaRequirementId) => {
    try {
        return await VisaRequiredDocument.find({
            visaRequirementId: visaRequirementId
        });
    } catch (error) {
        console.error('Error fetching required documents:', error);
        throw error;
    }
};

/**
 * Logic to determine if a visa type requires an application
 * @param {String} visaType - enum: VISA_FREE, E_VISA, VISA_ON_ARRIVAL, EMBASSY_VISA, TRANSIT_VISA
 * @returns {Boolean}
 */
const requiresPreArrivalAction = (visaType) => {
    const preArrivalTypes = ['E_VISA', 'EMBASSY_VISA', 'TRANSIT_VISA'];
    return preArrivalTypes.includes(visaType);
};

module.exports = {
    getMatchingRequirement,
    getRequiredDocuments,
    requiresPreArrivalAction
};
