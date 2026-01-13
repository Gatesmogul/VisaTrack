import VisaLookup from "../models/VisaLookup.js";
import SavedRequirement from "../models/SavedRequirement.js";
import {
  getMatchingRequirement,
  getRequiredDocuments,
} from "../services/visa.service.js";


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
  const lookups = await VisaLookup.find({ user: req.user.dbUser._id })
    .sort({ createdAt: -1 })
    .limit(5)
    .populate("passportCountry destinationCountry visaRequirement");

  res.json(
    lookups.map((l) => ({
      id: l._id,
      passportCountry: {
        code: l.passportCountry.code,
        name: l.passportCountry.name,
      },
      destinationCountry: {
        code: l.destinationCountry.code,
        name: l.destinationCountry.name,
      },
      travelPurpose: l.travelPurpose,
      visaType: l.visaRequirement?.visaType ?? "UNKNOWN",
      createdAt: l.createdAt,
    }))
  );
};


export const saveRequirement = async (req, res) => {
  const { visaRequirementId } = req.body;

  await SavedRequirement.create({
    user: req.user._id,
    visaRequirement: visaRequirementId,
  });

  res.json({ message: "Saved successfully" });
};

export const getSavedRequirements = async (req, res) => {
  const saved = await SavedRequirement.find({ user: req.user._id })
    .populate({
      path: "visaRequirement",
      populate: [
        { path: "passportCountry" },
        { path: "destinationCountry" },
      ],
    })
    .sort({ createdAt: -1 });

  res.json(saved);
};

// controllers/visa.controller.js
export const removeSavedRequirement = async (req, res) => {
  await SavedRequirement.deleteOne({
    _id: req.params.id,
    user: req.user._id,
  });

  res.json({ success: true });
};
