import TripDestination from "../models/TripDestination.js";
import Trip from "../models/Trip.js";
import User from "../models/User.js";
import {
  getMatchingRequirement,
  requiresPreArrivalAction
} from "../services/visa.service.js";
import { checkDestinationFeasibility, recalculateTripFeasibility } from "../services/feasibility.service.js";
import Country from '../models/Country.js';
import VisaRequirement from '../models/VisaRequirement.js';
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

    const trip = await Trip.findById(tripId)
  .populate({
    path: 'destinations',
    populate: { path: 'countryId' }
  });

    if (!trip) {
      return res.status(404).json({ message: "Trip not found" });
    }

    const user = await User.findById(trip.userId);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    const visaRequirement = await getMatchingRequirement(
      user.passportCountry,
      countryId,
      travelPurpose
    );

    const visaType = visaRequirement?.visaType || null;

    /** ✅ Correct visaRequired logic */
    const visaRequired =
      visaType &&
      !["VISA_FREE", "VISA_ON_ARRIVAL"].includes(visaType);

    /** ✅ Calculate feasibility immediately */
   let feasibilityStatus = "FEASIBLE";
let feasibilityReason = "No visa required";

if (visaRequired) {
  const feasibility = await checkDestinationFeasibility({
    passportCountryId: user.passportCountry,
    destinationCountryId: countryId,
    travelPurpose,
    entryDate,
    tripStartDate: trip.startDate,
  });

  if (feasibility?.status) {
    feasibilityStatus = feasibility.status;
  }

  if (feasibility?.issue?.message) {
    feasibilityReason = feasibility.issue.message;
  }
}


    const destination = await TripDestination.create({
      tripId,
      countryId,
      entryDate,
      exitDate,
      travelPurpose,
      visaRequired,
      visaType,
      processingTimeMin: visaRequirement?.processingTimeMin || null,
      processingTimeMax: visaRequirement?.processingTimeMax || null,
      feasibilityStatus,
      feasibilityReason,
    });
    await destination.save();
    await recalculateTripFeasibility(tripId);


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

    const destinations = await TripDestination.find({ tripId }).populate(
      "countryId"
    );

    res.json(
      destinations.map((dest) => ({
        ...dest.toObject(),
        feasibility: {
          status: dest.feasibilityStatus,
          reason: dest.feasibilityReason,
        },
      }))
    );
  } catch (error) {
    console.error("Get trip destinations error:", error);
    res.status(500).json({ message: "Failed to fetch destinations" });
  }
};



export const getDestinationSummary = async (req, res) => {
  try {
    const { tripId, destinationId } = req.params;

    // ✅ resolve Mongo user
    const user = await User.findOne({ authUserId: req.user.uid });
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    // ✅ validate trip ownership
    const trip = await Trip.findOne({
      _id: tripId,
      userId: user._id,
    });

    if (!trip) {
      return res.status(404).json({ message: "Trip not found" });
    }

    // ✅ get destination
    const destination = await TripDestination.findOne({
      _id: destinationId,
      tripId: trip._id,
    }).populate("countryId");

    if (!destination) {
      return res.status(404).json({ message: "Destination not found" });
    }

    res.json({
      trip: {
        _id: trip._id,
        title: trip.title,
        startDate: trip.startDate,
        endDate: trip.endDate,
      },
      destination,
    });
  } catch (err) {
    console.error("Destination summary error:", err);
    res.status(500).json({ message: "Failed to get summary" });
  }
};
