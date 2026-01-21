from fastapi import FastAPI
from pydantic import BaseModel
import pickle
import numpy as np
import pandas as pd

# -----------------------------
# App initialization
# -----------------------------
app = FastAPI(
    title="Health Insight ML Service",
    description="AI-powered symptom-based health risk analysis",
    version="1.1.0"
)

# -----------------------------
# Load trained models & artifacts
# -----------------------------
with open("models/naive_bayes.pkl", "rb") as f:
    nb_model = pickle.load(f)

with open("models/random_forest.pkl", "rb") as f:
    rf_model = pickle.load(f)

with open("models/logistic_regression.pkl", "rb") as f:
    lr_model = pickle.load(f)

with open("models/label_encoder.pkl", "rb") as f:
    label_encoder = pickle.load(f)

with open("models/symptom_list.pkl", "rb") as f:
    symptom_list = pickle.load(f)

# -----------------------------
# Load auxiliary datasets
# -----------------------------
severity_df = pd.read_csv("data/Symptom-severity.csv")
desc_df = pd.read_csv("data/symptom_Description.csv")
prec_df = pd.read_csv("data/symptom_precaution.csv")

severity_df["Symptom"] = severity_df["Symptom"].str.strip().str.lower()

# -----------------------------
# Request schema
# -----------------------------
class SymptomRequest(BaseModel):
    symptoms: list[str]

# -----------------------------
# Helper functions
# -----------------------------
def symptoms_to_vector(user_symptoms):
    vector = np.zeros(len(symptom_list))
    user_symptoms = [s.lower().strip() for s in user_symptoms]

    for i, symptom in enumerate(symptom_list):
        if symptom.lower() in user_symptoms:
            vector[i] = 1

    return vector.reshape(1, -1)


def calculate_severity_score(user_symptoms):
    scores = []
    for symptom in user_symptoms:
        row = severity_df[severity_df["Symptom"] == symptom.lower()]
        if not row.empty:
            scores.append(row["weight"].values[0])

    return sum(scores) / len(scores) if scores else 0


def risk_level(confidence, severity_score):
    if confidence > 0.6 or severity_score > 5:
        return "High"
    elif confidence > 0.3 or severity_score > 3:
        return "Medium"
    else:
        return "Low"

# -----------------------------
# API endpoints
# -----------------------------
@app.get("/")
def health_check():
    return {"status": "ML service running successfully"}


@app.post("/predict")
def predict_disease(request: SymptomRequest):
    user_symptoms = request.symptoms

    # Convert symptoms to model input
    X = symptoms_to_vector(user_symptoms)

    # Get probabilities from all models
    nb_probs = nb_model.predict_proba(X)[0]
    rf_probs = rf_model.predict_proba(X)[0]
    lr_probs = lr_model.predict_proba(X)[0]

    # Ensemble (weighted average)
    final_probs = (
        0.3 * nb_probs +
        0.4 * rf_probs +
        0.3 * lr_probs
    )

    # -----------------------------
    # TOP-3 DISEASE PREDICTION
    # -----------------------------
    top_indices = np.argsort(final_probs)[-3:][::-1]

    possible_conditions = []
    for idx in top_indices:
        disease_name = label_encoder.inverse_transform([idx])[0]
        confidence_score = float(final_probs[idx])

        possible_conditions.append({
            "name": disease_name,
            "confidence": round(confidence_score, 2)
        })

    # -----------------------------
    # Risk & severity calculation
    # -----------------------------
    top_confidence = possible_conditions[0]["confidence"]
    severity_score = calculate_severity_score(user_symptoms)
    risk = risk_level(top_confidence, severity_score)

    # -----------------------------
    # Description & precautions
    # (based on top disease)
    # -----------------------------
    top_disease = possible_conditions[0]["name"]

    description = desc_df[desc_df["Disease"] == top_disease]["Description"].values
    description = description[0] if len(description) > 0 else "No description available."

    precautions = prec_df[prec_df["Disease"] == top_disease]
    precautions = precautions.iloc[0, 1:].dropna().tolist() if not precautions.empty else []

    # -----------------------------
    # Final response
    # -----------------------------
    return {
        "possible_conditions": possible_conditions,
        "risk_level": risk,
        "severity_score": round(severity_score, 2),
        "description": description,
        "precautions": precautions,
        "disclaimer": "This is not a medical diagnosis. Consult a qualified medical professional."
    }