import { useState } from "react";

/**
 * NOTE:
 * - Symptom list is currently static
 * - Can be replaced later with backend-driven data
 */
const ALL_SYMPTOMS = [
  "fever",
  "headache",
  "fatigue",
  "cough",
  "cold",
  "sore throat",
  "nausea",
  "vomiting",
  "diarrhea",
  "chest pain",
  "shortness of breath",
  "joint pain",
  "muscle pain",
  "back pain",
  "abdominal pain",
  "loss of appetite",
  "dizziness",
  "anxiety",
  "depression",
  "weight loss"
];

function SymptomSelector({ onChange }) {
  const [selected, setSelected] = useState([]);
  const [open, setOpen] = useState(false);

  const toggleSymptom = (symptom) => {
    let updated;

    if (selected.includes(symptom)) {
      updated = selected.filter((s) => s !== symptom);
    } else {
      updated = [...selected, symptom];
    }

    setSelected(updated);
    onChange(updated);
  };

  const removeSymptom = (symptom) => {
    const updated = selected.filter((s) => s !== symptom);
    setSelected(updated);
    onChange(updated);
  };

  return (
    <div className="bg-white p-6 rounded-2xl shadow-md">
      {/* Label */}
      <label className="block mb-2 font-semibold text-gray-700">
        Select Symptoms
      </label>
      <p className="text-sm text-gray-500 mb-4">
        Choose all symptoms you are currently experiencing.
      </p>

      {/* Dropdown Button */}
      <button
        type="button"
        onClick={() => setOpen(!open)}
        className="w-full flex justify-between items-center p-3 border rounded-lg bg-white focus:outline-none focus:ring-2 focus:ring-blue-500"
      >
        <span className="text-gray-600">
          {selected.length === 0
            ? "Select symptoms"
            : `${selected.length} symptom(s) selected`}
        </span>
        <span
          className={`transform transition ${
            open ? "rotate-180" : ""
          }`}
        >
          ▼
        </span>
      </button>

      {/* Dropdown List */}
      {open && (
        <div className="mt-2 max-h-52 overflow-y-auto border rounded-lg bg-white">
          {ALL_SYMPTOMS.map((symptom) => (
            <div
              key={symptom}
              onClick={() => toggleSymptom(symptom)}
              className={`px-4 py-2 cursor-pointer flex justify-between items-center hover:bg-blue-50 ${
                selected.includes(symptom)
                  ? "bg-blue-100 text-blue-700"
                  : "text-gray-700"
              }`}
            >
              <span className="capitalize">
                {symptom}
              </span>
              {selected.includes(symptom) && (
                <span className="text-sm">✔</span>
              )}
            </div>
          ))}
        </div>
      )}

      {/* Selected Symptoms Chips */}
      {selected.length > 0 && (
        <div className="mt-4 flex flex-wrap gap-2">
          {selected.map((symptom) => (
            <span
              key={symptom}
              className="flex items-center gap-2 bg-blue-100 text-blue-700 px-3 py-1 rounded-full text-sm"
            >
              <span className="capitalize">
                {symptom}
              </span>
              <button
                type="button"
                onClick={() => removeSymptom(symptom)}
                className="hover:text-blue-900"
                aria-label={`Remove ${symptom}`}
              >
                ✕
              </button>
            </span>
          ))}
        </div>
      )}
    </div>
  );
}

export default SymptomSelector;