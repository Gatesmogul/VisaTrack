import TripDestination from "../models/TripDestination.js";
import Trip from "../models/Trip.js";
import User from "../models/User.js";
import {
  getMatchingRequirement,
  requiresPreArrivalAction
} from "../services/visa.service.js";
import { checkDestinationFeasibility } from "../services/feasibility.service.js";
/**
 * Add destination to a trip
 */
export const addDestinationToTrip = async (req, res) => {
  try {
    const { countryId, entryDate, exitDate, travelPurpose } = req.body;
    const { tripId } = req.params;

    if (!countryId || !entryDate || !exitDate || !travelPurpose) {
      return res.status(400).json({ message: "Missing required fields" });
    }

    const trip = await Trip.findById(tripId);
    if (!trip) {
      return res.status(404).json({ message: "Trip not found" });
    }

    // 🔴 FIX: Load user to get passportCountry
    const user = await User.findById(trip.userId);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    const visaRequirement = await getMatchingRequirement(
      user.passportCountry,
      countryId,
      travelPurpose
    );

    const visaRequired =
      visaRequirement &&
      requiresPreArrivalAction(visaRequirement.visaType);

    const destination = await TripDestination.create({
      tripId,
      countryId,
      entryDate,
      exitDate,
      travelPurpose,
      visaRequired,
      visaType: visaRequirement?.visaType || null,
      processingTimeMin: visaRequirement?.processingTimeMin || null,
        processingTimeMax: visaRequirement?.processingTimeMax || null
    });

    res.status(201).json(destination);
  } catch (error) {
    console.error("Add destination error:", error);
    res.status(500).json({ message: "Failed to add destination" });
  }
};

/**
 * Get all destinations for a trip
 */




export const getTripDestinations = async (req, res) => {
  try {
    const { tripId } = req.params;

    const destinations = await TripDestination.find({ tripId })
      .populate("countryId");

    const enriched = destinations.map((dest) => {
      if (!dest.visaRequired) {
        return {
          ...dest.toObject(),
          feasibility: {
            status: "FEASIBLE",
            reason: "Visa not required",
          },
        };
      }

      const feasibility = checkDestinationFeasibility({
        entryDate: dest.entryDate,
        processingTimeMax: dest.processingTimeMax,
      });

      return {
        ...dest.toObject(),
        feasibility,
      };
    });

    res.json(enriched);
  } catch (error) {
    console.error("Get trip destinations error:", error);
    res.status(500).json({ message: "Failed to fetch destinations" });
  }
};
