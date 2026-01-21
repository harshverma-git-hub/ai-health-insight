import axios from "axios";

const ML_BASE_URL = process.env.ML_SERVICE_URL;

export const analyzeSymptoms = async (symptoms) => {
  const response = await axios.post(
    `${ML_BASE_URL}/predict`,
    { symptoms }
  );
  return response.data;
};
