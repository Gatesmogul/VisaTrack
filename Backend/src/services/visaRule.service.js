import VisaRequirement from "../models/VisaRequirement.js";
import VisaRequiredDocument from "../models/VisaRequiredDocument.js";

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

const requiresPreArrivalAction = (visaType) => {
    const preArrivalTypes = ['E_VISA', 'EMBASSY_VISA', 'TRANSIT_VISA'];
    return preArrivalTypes.includes(visaType);
};

export {
    getMatchingRequirement,
    getRequiredDocuments,
    requiresPreArrivalAction
};
