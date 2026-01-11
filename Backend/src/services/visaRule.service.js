import VisaRequirement from "../models/VisaRequirement.js";
import VisaRequiredDocument from "../models/VisaRequiredDocument.js";

const getMatchingRequirement = async (
  passportCountryId,
  destinationCountryId,
  travelPurpose = "TOURISM"
) => {
  return await VisaRequirement.findOne({
    passportCountry: passportCountryId,
    destinationCountry: destinationCountryId,
    travelPurpose
  });
};

const getRequiredDocuments = async (visaRequirementId) => {
  return await VisaRequiredDocument.find({ visaRequirementId });
};

const requiresPreArrivalAction = (visaType) => {
  return ["E_VISA", "EMBASSY_VISA", "TRANSIT_VISA"].includes(visaType);
};

export {
  getMatchingRequirement,
  getRequiredDocuments,
  requiresPreArrivalAction
};
