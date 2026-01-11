import VisaLookup from "../models/VisaLookup.js";
import SavedRequirement from "../models/SavedRequirement.js";
import {
  getMatchingRequirement,
  getRequiredDocuments,
} from "../services/visaRule.service.js";


export const lookupVisa = async (req, res) => {
  try {
    const userId = req.user._id;
    const { passportCountryId, destinationCountryId, travelPurpose } = req.query;

    const requirement = await getMatchingRequirement(
      passportCountryId,
      destinationCountryId,
      travelPurpose
    );

    // Save lookup (even if no result)
    await VisaLookup.create({
      user: userId,
      passportCountry: passportCountryId,
      destinationCountry: destinationCountryId,
      travelPurpose,
      visaRequirement: requirement?._id,
      visaType: requirement.visaType,
    });

    if (!requirement) {
      return res.status(404).json({ message: "No visa information found" });
    }

    const documents = await getRequiredDocuments(requirement._id);

    res.json({
      requirement,
      documents,
    });
  } catch (err) {
    res.status(500).json({ message: "Visa lookup failed" });
  }
};

export const getRecentLookups = async (req, res) => {
  const lookups = await VisaLookup.find({ user: req.user._id })
    .sort({ createdAt: -1 })
    .limit(5)
    .populate("passportCountry destinationCountry visaRequirement");

  res.json(lookups);
};

export const saveRequirement = async (req, res) => {
  const { visaRequirementId } = req.body;

  await SavedRequirement.create({
    user: req.user._id,
    visaRequirement: visaRequirementId,
  });

  res.json({ message: "Saved successfully" });
};
