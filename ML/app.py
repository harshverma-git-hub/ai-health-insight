import os
import pickle
import numpy as np
from fastapi import FastAPI, HTTPException
from pydantic import BaseModel

# =============================
# CONFIG
# =============================
MODELS_DIR = "models"

NAIVE_BAYES_PATH = os.path.join(MODELS_DIR, "naive_bayes.pkl")
RF_PATH = os.path.join(MODELS_DIR, "random_forest.pkl")
LR_PATH = os.path.join(MODELS_DIR, "logistic_regression.pkl")
LE_PATH = os.path.join(MODELS_DIR, "label_encoder.pkl")
SYMPTOMS_PATH = os.path.join(MODELS_DIR, "symptom_list.pkl")

REQUIRED_FILES = [
    NAIVE_BAYES_PATH,
    RF_PATH,
    LR_PATH,
    LE_PATH,
    SYMPTOMS_PATH
]

# =============================
# VERIFY MODELS EXIST
# =============================
missing = [f for f in REQUIRED_FILES if not os.path.exists(f)]
if missing:
    raise RuntimeError(
        f"Missing model files: {missing}. "
        "This service is inference-only. Train models offline and upload them to the server."
    )

# =============================
# LOAD MODELS
# =============================
with open(NAIVE_BAYES_PATH, "rb") as f:
    nb_model = pickle.load(f)

with open(RF_PATH, "rb") as f:
    rf_model = pickle.load(f)

with open(LR_PATH, "rb") as f:
    lr_model = pickle.load(f)

with open(LE_PATH, "rb") as f:
    label_encoder = pickle.load(f)

with open(SYMPTOMS_PATH, "rb") as f:
    symptom_list = pickle.load(f)

# =============================
# FASTAPI APP
# =============================
app = FastAPI(
    title="AI Health Insight – ML Inference Service",
    description="Inference-only ML service for disease prediction",
    version="1.0.0"
)

# =============================
# REQUEST SCHEMA
# =============================
class SymptomInput(BaseModel):
    symptoms: list[str]

# =============================
# HELPER: VECTORIZE INPUT
# =============================
def vectorize(symptoms):
    vector = np.zeros(len(symptom_list))
    for symptom in symptoms:
        if symptom in symptom_list:
            idx = symptom_list.index(symptom)
            vector[idx] = 1
    return vector.reshape(1, -1)

# =============================
# PREDICT ENDPOINT
# =============================
@app.post("/predict")
def predict(data: SymptomInput):
    if not data.symptoms:
        raise HTTPException(status_code=400, detail="No symptoms provided")

    x = vectorize(data.symptoms)

    nb_probs = nb_model.predict_proba(x)[0]
    rf_probs = rf_model.predict_proba(x)[0]
    lr_probs = lr_model.predict_proba(x)[0]

    # Weighted ensemble
    combined_probs = (
        0.3 * nb_probs +
        0.4 * rf_probs +
        0.3 * lr_probs
    )

    top_indices = np.argsort(combined_probs)[-3:][::-1]

    results = [
        {
            "name": label_encoder.inverse_transform([i])[0],
            "confidence": round(float(combined_probs[i]), 4)
        }
        for i in top_indices
    ]

    return {
        "possible_conditions": results,
        "risk_level": "Medium",
        "description": "AI-estimated health conditions based on provided symptoms.",
        "precautions": [],
        "disclaimer": "This is not a medical diagnosis. Consult a qualified medical professional."
    }

# =============================
# HEALTH CHECK
# =============================
@app.get("/")
def root():
    return {"status": "ML inference service running"}