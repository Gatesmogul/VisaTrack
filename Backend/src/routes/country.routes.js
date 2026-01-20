import express from "express";
import { authMiddleware } from "../middlewares/auth.middleware.js";
import { getCountries } from "../controllers/country.controller.js";

const router = express.Router();

router.get("/countries", authMiddleware, getCountries);

export default router;