import express from "express";
import { analyzeHealth } from "../controllers/healthController.js";

const router = express.Router();

router.post("/analyze", analyzeHealth);

export default router;
