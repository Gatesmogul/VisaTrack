import Trip from "../models/Trip.js";
import User from "../models/User.js";

/**
 * Create a new tri
 * POST /api/trips
 */
export const createTrip = async (req, res) => {
  try {
    const { title, description, startDate, endDate } = req.body;

    if (!title || !startDate || !endDate) {
      return res.status(400).json({ message: "Missing required fields" });
    }

    // Find user by authUserId (Firebase UID)
    const user = await User.findOne({ authUserId: req.user.uid });
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    const trip = await Trip.create({
      userId: user._id,
      title,
      description,
      startDate,
      endDate
    });

    res.status(201).json(trip);
  } catch (error) {
    console.error("Create trip error:", error);
    res.status(500).json({ message: "Failed to create trip" });
  }
};

/**
 * Get all trips for logged-in user
 * GET /api/trips
 */
export const getMyTrips = async (req, res) => {
  try {
    const user = await User.findOne({ authUserId: req.user.uid });
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    const trips = await Trip.find({ userId: user._id }).sort({ createdAt: -1 });
    res.json(trips);
  } catch (error) {
    console.error("Get trips error:", error);
    res.status(500).json({ message: "Failed to fetch trips" });
  }
};

/**
 * Get single trip
 * GET /api/trips/:tripId
 */
export const getTripById = async (req, res) => {
  try {
   const user = await User.findOne({ authUserId: req.user.uid });

const trip = await Trip.findOne({
  _id: req.params.tripId,
  userId: user._id,
});

    if (!trip) {
      return res.status(404).json({ message: "Trip not found" });
    }

    res.json(trip);
  } catch (error) {
    console.error("Get trip error:", error);
    res.status(500).json({ message: "Failed to fetch trip" });
  }
};

/**
 * Update trip status
 * PATCH /api/trips/:tripId
 */
export const updateTripStatus = async (req, res) => {
  try {
    const { status } = req.body;

    const updatedTrip = await Trip.findByIdAndUpdate(
      req.params.tripId,
      { status },
      { new: true }
    );

    res.json(updatedTrip);
  } catch (error) {
    console.error("Update trip error:", error);
    res.status(500).json({ message: "Failed to update trip" });
  }
};