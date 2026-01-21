import os
import pickle
import pandas as pd
import numpy as np

from sklearn.model_selection import train_test_split
from sklearn.preprocessing import LabelEncoder
from sklearn.naive_bayes import MultinomialNB
from sklearn.linear_model import LogisticRegression
from sklearn.ensemble import RandomForestClassifier

# =============================
# PATHS
# =============================
BASE_DIR = os.path.dirname(os.path.abspath(__file__))
DATA_DIR = os.path.join(BASE_DIR, "data")
MODELS_DIR = os.path.join(BASE_DIR, "models")

os.makedirs(MODELS_DIR, exist_ok=True)

DATASET_PATH = os.path.join(DATA_DIR, "dataset.csv")

# =============================
# LOAD DATASET
# =============================
df = pd.read_csv(DATASET_PATH)

# Assume last column is Disease
symptom_columns = df.columns[:-1]
disease_column = df.columns[-1]

# =============================
# BUILD SYMPTOM VOCABULARY
# =============================
all_symptoms = set()

for col in symptom_columns:
    all_symptoms.update(df[col].dropna().unique())

all_symptoms = sorted(all_symptoms)

print(f"Total unique symptoms: {len(all_symptoms)}")

# Save symptom list
with open(os.path.join(MODELS_DIR, "symptom_list.pkl"), "wb") as f:
    pickle.dump(all_symptoms, f)

# =============================
# VECTORIZE DATASET
# =============================
X = np.zeros((len(df), len(all_symptoms)), dtype=np.int8)

for i, row in df.iterrows():
    for symptom in row[symptom_columns]:
        if pd.notna(symptom):
            idx = all_symptoms.index(symptom)
            X[i, idx] = 1

# =============================
# ENCODE LABELS
# =============================
label_encoder = LabelEncoder()
y = label_encoder.fit_transform(df[disease_column])

with open(os.path.join(MODELS_DIR, "label_encoder.pkl"), "wb") as f:
    pickle.dump(label_encoder, f)

# =============================
# TRAIN / TEST SPLIT
# =============================
X_train, X_test, y_train, y_test = train_test_split(
    X,
    y,
    test_size=0.2,
    random_state=42,
    stratify=y
)

# =============================
# MODEL 1: NAIVE BAYES
# =============================
nb_model = MultinomialNB()
nb_model.fit(X_train, y_train)

with open(os.path.join(MODELS_DIR, "naive_bayes.pkl"), "wb") as f:
    pickle.dump(nb_model, f)

# =============================
# MODEL 2: LOGISTIC REGRESSION
# =============================
lr_model = LogisticRegression(
    max_iter=1000,
    solver="lbfgs",
    n_jobs=1
)
lr_model.fit(X_train, y_train)

with open(os.path.join(MODELS_DIR, "logistic_regression.pkl"), "wb") as f:
    pickle.dump(lr_model, f)

# =============================
# MODEL 3: OPTIMIZED RANDOM FOREST
# =============================
rf_model = RandomForestClassifier(
    n_estimators=80,        # small & efficient
    max_depth=15,
    min_samples_split=10,
    min_samples_leaf=5,
    max_features="sqrt",
    n_jobs=1,
    random_state=42
)
rf_model.fit(X_train, y_train)

with open(os.path.join(MODELS_DIR, "random_forest.pkl"), "wb") as f:
    pickle.dump(rf_model, f)

# =============================
# SUMMARY
# =============================
print("✅ Training completed successfully")
print(f"✔ Diseases: {len(label_encoder.classes_)}")
print(f"✔ Symptoms: {len(all_symptoms)}")
print("✔ Models saved to ML/models/")