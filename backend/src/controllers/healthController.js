import { analyzeSymptoms } from "../services/mlService.js";

export const analyzeHealth = async (req, res) => {
  try {
    const { symptoms } = req.body;

    if (!Array.isArray(symptoms) || symptoms.length === 0) {
      return res.status(400).json({
        success: false,
        message: "Symptoms array is required"
      });
    }

    const result = await analyzeSymptoms(symptoms);

    res.status(200).json({
      success: true,
      data: result
    });
  } catch (error) {
    res.status(503).json({
      success: false,
      message: "ML service unavailable"
    });
  }
};
