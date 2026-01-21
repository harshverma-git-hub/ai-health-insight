function ResultCard({ data }) {
  if (!data) return null;

  const {
    possible_conditions,
    risk_level,
    severity_score,
    description,
    precautions,
    disclaimer
  } = data;

  const topConfidence = possible_conditions[0]?.confidence || 0;
  const CONFIDENCE_THRESHOLD = 0.15;
  const isBelowThreshold = topConfidence < CONFIDENCE_THRESHOLD;

  const riskColor =
    risk_level === "High"
      ? "bg-red-100 text-red-700"
      : risk_level === "Medium"
      ? "bg-yellow-100 text-yellow-700"
      : "bg-green-100 text-green-700";

  return (
    <div className="bg-white rounded-2xl shadow-lg p-8 max-w-4xl mx-auto">
      {/* ================= HEADER ================= */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-6">
        <h2 className="text-2xl font-semibold text-gray-800">
          AI Health Analysis Result
        </h2>

        {!isBelowThreshold && (
          <span
            className={`mt-3 md:mt-0 px-4 py-2 rounded-full text-sm font-medium ${riskColor}`}
          >
            Risk Level: {risk_level}
          </span>
        )}
      </div>

      {/* ================= BELOW THRESHOLD MESSAGE ================= */}
      {isBelowThreshold ? (
        <div className="p-6 rounded-xl bg-blue-50 border border-blue-200 text-blue-800">
          <h3 className="text-lg font-semibold mb-2">
            Insufficient Information for Reliable Prediction
          </h3>
          <p className="text-sm leading-relaxed">
            Based on the selected symptoms, the AI model does not have enough
            confidence to suggest possible health conditions.
            <br />
            <br />
            👉 Please select more specific or additional symptoms for a more
            reliable analysis.
          </p>

          <p className="mt-4 text-xs text-blue-700">
            This behavior is intentional to avoid misleading or inaccurate
            health insights.
          </p>
        </div>
      ) : (
        <>
          {/* ================= POSSIBLE CONDITIONS ================= */}
          <section className="mb-6">
            <h3 className="text-lg font-medium text-gray-700 mb-3">
              Possible Conditions (AI Estimated)
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              {possible_conditions.map((condition, index) => (
                <div
                  key={index}
                  className="border rounded-xl p-4 bg-gray-50"
                >
                  <h4 className="font-semibold text-gray-800 capitalize">
                    {condition.name}
                  </h4>
                  <p className="text-sm text-gray-600 mt-1">
                    Confidence:{" "}
                    <span className="font-medium">
                      {Math.round(condition.confidence * 100)}%
                    </span>
                  </p>
                </div>
              ))}
            </div>
          </section>

          {/* ================= SEVERITY & EXPLANATION ================= */}
          <section className="mb-6">
            <h3 className="text-lg font-medium text-gray-700 mb-2">
              Severity & Explanation
            </h3>

            <p className="text-sm text-gray-600 mb-3">
              <strong>Severity Score:</strong>{" "}
              <span className="font-medium">
                {severity_score}
              </span>
            </p>

            <p className="text-gray-700 leading-relaxed">
              {description}
            </p>
          </section>

          {/* ================= PRECAUTIONS ================= */}
          {precautions && precautions.length > 0 && (
            <section className="mb-6">
              <h3 className="text-lg font-medium text-gray-700 mb-2">
                Recommended Precautions
              </h3>

              <ul className="list-disc list-inside text-gray-700 space-y-1">
                {precautions.map((precaution, index) => (
                  <li key={index}>
                    {precaution}
                  </li>
                ))}
              </ul>
            </section>
          )}
        </>
      )}

      {/* ================= DISCLAIMER ================= */}
      <section className="border-t pt-4 mt-6 text-sm text-gray-500">
        ⚠️ {disclaimer}
      </section>
    </div>
  );
}

export default ResultCard;