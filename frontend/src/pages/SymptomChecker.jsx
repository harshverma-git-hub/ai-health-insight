import { useState } from "react";
import axios from "axios";
import SymptomSelector from "../components/SymptomSelector";
import ResultCard from "../components/ResultCard";

function SymptomChecker() {
  const [selectedSymptoms, setSelectedSymptoms] = useState([]);
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleAnalyze = async () => {
    if (selectedSymptoms.length === 0) {
      setError("Please select at least one symptom.");
      return;
    }

    try {
      setLoading(true);
      setError("");
      setResult(null);

      const response = await axios.post(
        "http://localhost:5000/api/health/analyze",
        { symptoms: selectedSymptoms }
      );

      setResult(response.data.data);
    } catch (err) {
      setError("Unable to connect to AI health analysis service.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-gray-50 min-h-screen">
      <div className="max-w-5xl mx-auto px-6 py-14">
        {/* ================= HEADER ================= */}
        <div className="text-center mb-10">
          <h1 className="text-3xl md:text-4xl font-bold text-gray-800">
            AI Symptom Checker
          </h1>
          <p className="mt-4 text-gray-600 max-w-3xl mx-auto">
            Select the symptoms you are experiencing to receive AI-powered
            insights about possible health conditions and associated risk
            levels.
          </p>
        </div>

        {/* ================= INPUT CARD ================= */}
        <div className="bg-white rounded-2xl shadow-md p-8">
          <SymptomSelector onChange={setSelectedSymptoms} />

          <div className="mt-6 text-center">
            <button
              onClick={handleAnalyze}
              disabled={loading}
              className={`px-10 py-3 rounded-lg font-medium text-white transition ${
                loading
                  ? "bg-blue-400 cursor-not-allowed"
                  : "bg-blue-600 hover:bg-blue-700"
              }`}
            >
              {loading ? "Analyzing..." : "Analyze Symptoms"}
            </button>
          </div>

          {error && (
            <p className="mt-4 text-center text-red-600">
              {error}
            </p>
          )}
        </div>

        {/* ================= LOADING ================= */}
        {loading && (
          <div className="mt-8 text-center text-blue-600">
            AI is analyzing your symptoms. Please wait…
          </div>
        )}

        {/* ================= RESULT ================= */}
        {result && (
          <div className="mt-10">
            <ResultCard data={result} />
          </div>
        )}

        {/* ================= DISCLAIMER ================= */}
        <div className="mt-12 text-center text-sm text-gray-500">
          ⚠️ This AI tool provides informational health insights only and does
          not replace professional medical advice. Always consult a qualified
          healthcare provider.
        </div>
      </div>
    </div>
  );
}

export default SymptomChecker;
