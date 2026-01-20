import Country from "../models/Country.js";

export const getCountries = async (req, res) => {
  try {
    const countries = await Country.find().sort({ name: 1 });
    res.json(countries);
  } catch (err) {
    res.status(500).json({ message: "Failed to fetch countries" });
  }
};
