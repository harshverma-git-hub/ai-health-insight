import pickle
import numpy as np
import pandas as pd

# -----------------------------
# 1. Load saved models & files
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

# Load auxiliary datasets
severity_df = pd.read_csv("data/Symptom-severity.csv")
desc_df = pd.read_csv("data/symptom_Description.csv")
prec_df = pd.read_csv("data/symptom_precaution.csv")

# Normalize text
severity_df["Symptom"] = severity_df["Symptom"].str.strip().str.lower()

# -----------------------------
# 2. Helper functions
# -----------------------------

def symptoms_to_vector(user_symptoms):
    """
    Convert user symptom list into binary vector
    """
    vector = np.zeros(len(symptom_list))
    user_symptoms = [s.lower().strip() for s in user_symptoms]

    for i, symptom in enumerate(symptom_list):
        if symptom.lower() in user_symptoms:
            vector[i] = 1

    return vector.reshape(1, -1)


def calculate_severity_score(user_symptoms):
    """
    Calculate average severity score
    """
    scores = []
    for symptom in user_symptoms:
        row = severity_df[severity_df["Symptom"] == symptom.lower()]
        if not row.empty:
            scores.append(row["weight"].values[0])

    if not scores:
        return 0

    return sum(scores) / len(scores)


def risk_level(confidence, severity_score):
    """
    Decide risk level
    """
    if confidence > 0.6 or severity_score > 5:
        return "High"
    elif confidence > 0.3 or severity_score > 3:
        return "Medium"
    else:
        return "Low"


# -----------------------------
# 3. Main prediction function
# -----------------------------

def predict_disease(user_symptoms):
    """
    Main prediction pipeline
    """

    X = symptoms_to_vector(user_symptoms)

    # Get probabilities
    nb_probs = nb_model.predict_proba(X)[0]
    rf_probs = rf_model.predict_proba(X)[0]
    lr_probs = lr_model.predict_proba(X)[0]

    # Ensemble (weighted average)
    final_probs = (
        0.3 * nb_probs +
        0.4 * rf_probs +
        0.3 * lr_probs
    )

    # Get top prediction
    top_index = np.argmax(final_probs)
    confidence = final_probs[top_index]
    disease = label_encoder.inverse_transform([top_index])[0]

    # Severity & risk
    severity_score = calculate_severity_score(user_symptoms)
    risk = risk_level(confidence, severity_score)

    # Description
    description = desc_df[desc_df["Disease"] == disease]["Description"].values
    description = description[0] if len(description) > 0 else "No description available."

    # Precautions
    precautions = prec_df[prec_df["Disease"] == disease]
    if not precautions.empty:
        precautions = precautions.iloc[0, 1:].dropna().tolist()
    else:
        precautions = []

    return {
        "possible_condition": disease,
        "confidence": round(float(confidence), 2),
        "risk_level": risk,
        "severity_score": round(float(severity_score), 2),
        "description": description,
        "precautions": precautions,
        "disclaimer": "This is not a medical diagnosis. Please consult a qualified doctor."
    }


# -----------------------------
# 4. Test run (optional)
# -----------------------------
if __name__ == "__main__":
    test_symptoms = ["fever", "headache", "fatigue"]
    result = predict_disease(test_symptoms)
    print(result)