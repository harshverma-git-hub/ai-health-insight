import pandas as pd
import numpy as np
import pickle

from sklearn.preprocessing import LabelEncoder
from sklearn.model_selection import train_test_split
from sklearn.naive_bayes import MultinomialNB
from sklearn.ensemble import RandomForestClassifier
from sklearn.linear_model import LogisticRegression
from sklearn.metrics import accuracy_score

# =============================
# CONFIG
# =============================
DATASET_FILE = "data/dataset_augmented.csv"   # 🔴 use augmented dataset
MODELS_DIR = "models/"

# =============================
# 1. Load dataset
# =============================
df = pd.read_csv(DATASET_FILE)
df = df.fillna("")

print(f"Loaded dataset with {len(df)} rows")

# =============================
# 2. Collect all symptoms
# =============================
symptom_cols = [col for col in df.columns if col != "Disease"]

all_symptoms = set()
for col in symptom_cols:
    all_symptoms.update(df[col].unique())

all_symptoms.discard("")
all_symptoms = sorted(all_symptoms)

print(f"Total unique symptoms: {len(all_symptoms)}")

# =============================
# 3. Create binary feature matrix
# =============================
X = np.zeros((df.shape[0], len(all_symptoms)))

for i, row in df.iterrows():
    for symptom in row[symptom_cols]:
        if symptom != "":
            X[i, all_symptoms.index(symptom)] = 1

# =============================
# 4. Encode disease labels
# =============================
le = LabelEncoder()
y = le.fit_transform(df["Disease"])

# =============================
# 5. Train / test split
# =============================
X_train, X_test, y_train, y_test = train_test_split(
    X, y,
    test_size=0.2,
    random_state=42,
    stratify=y
)

# =============================
# 6. Train models
# =============================
models = {
    "naive_bayes": MultinomialNB(),
    "random_forest": RandomForestClassifier(
        n_estimators=300,
        max_depth=None,
        random_state=42,
        n_jobs=-1
    ),
    "logistic_regression": LogisticRegression(
        max_iter=3000,
        n_jobs=-1
    )
}

trained_models = {}

print("\nTraining models...\n")

for name, model in models.items():
    model.fit(X_train, y_train)
    preds = model.predict(X_test)
    acc = accuracy_score(y_test, preds)

    print(f"{name} accuracy: {acc:.4f}")
    trained_models[name] = model

# =============================
# 7. Save models & artifacts
# =============================
with open(f"{MODELS_DIR}/symptom_list.pkl", "wb") as f:
    pickle.dump(all_symptoms, f)

with open(f"{MODELS_DIR}/label_encoder.pkl", "wb") as f:
    pickle.dump(le, f)

for name, model in trained_models.items():
    with open(f"{MODELS_DIR}/{name}.pkl", "wb") as f:
        pickle.dump(model, f)

print("\n✅ Models trained and saved successfully using augmented dataset")