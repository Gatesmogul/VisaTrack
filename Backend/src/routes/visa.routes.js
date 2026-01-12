import express from "express";
import { lookupVisa } from "../controllers/visa.controller.js";
import auth from "../middleware/auth.middleware.js";
import isProfileComplete from "../middleware/isProfileComplete.middleware.js";

const router = express.Router();

router.get("/lookup", auth, isProfileComplete, lookupVisa);
router.get("/recent", auth, isProfileComplete, getRecentLookups);
router.post("/save", auth, isProfileComplete, saveRequirement);

export default router;
