import axios from "axios";

const ML_SERVICE_URL = process.env.ML_SERVICE_URL || "http://127.0.0.1:8000";

export const analyzeSymptoms = async (symptoms) => {
  const response = await axios.post(
    `${ML_SERVICE_URL}/predict`,
    { symptoms },
    { timeout: 5000 }
  );

  return response.data;
};