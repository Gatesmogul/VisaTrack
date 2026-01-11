import {
  getMatchingRequirement,
  getRequiredDocuments,
  requiresPreArrivalAction
} from "../services/visaRule.service.js";

export async function checkVisa(req, res) {
  const { passportCountry, destinationCountry, travelPurpose } = req.query;

  const requirement = await getMatchingRequirement(
    passportCountry,
    destinationCountry,
    travelPurpose
  );

  if (!requirement) {
    return res.json({ visaType: "UNKNOWN" });
  }

  res.json({
    ...requirement.toObject(),
    requiresApplication: requiresPreArrivalAction(requirement.visaType)
  });
}

export async function getVisaDocuments(req, res) {
  const docs = await getRequiredDocuments(req.params.id);
  res.json(docs);
}
