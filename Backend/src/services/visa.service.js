import VisaRequirement from "../models/VisaRequirement.js";
import VisaRequiredDocument from "../models/VisaRequiredDocument.js";

export async function getMatchingRequirement(
  passportCountryId,
  destinationCountryId,
  travelPurpose = "TOURISM"
) {
  return VisaRequirement.findOne({
    passportCountry: passportCountryId,
    destinationCountry: destinationCountryId,
    travelPurpose,
  });
}

export async function getRequiredDocuments(visaRequirementId) {
  return VisaRequiredDocument.find({ visaRequirementId });
}

export function requiresPreArrivalAction(visaType) {
  return ["E_VISA", "EMBASSY_VISA", "TRANSIT_VISA"].includes(visaType);
}
