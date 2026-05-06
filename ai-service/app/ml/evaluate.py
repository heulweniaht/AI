"""Script đánh giá model sau khi training"""
import joblib
import pandas as pd
import numpy as np
from sklearn.metrics import (
    classification_report, confusion_matrix, f1_score
)
from sklearn.model_selection import train_test_split

from app.ml.preprocess import VietnameseMedicalPreprocessor


def evaluate_model():
    # 1. Load model và data
    pipeline = joblib.load("app/models/symptom_classifier.pkl")
    le       = joblib.load("app/models/specialty_encoder.pkl")
    df       = pd.read_csv("app/data/symptoms_dataset.csv")

    # 2. Preprocess
    pre = VietnameseMedicalPreprocessor()
    df["processed"] = df["symptoms_text"].apply(pre.preprocess)

    # 3. Train/test split
    X_train, X_test, y_train, y_test = train_test_split(
        df["processed"], df["specialty"],
        test_size=0.2, stratify=df["specialty"], random_state=42
    )

    # 4. Predict
    y_pred = pipeline.predict(X_test)

    # 5. Reports
    print("=" * 60)
    print("CLASSIFICATION REPORT")
    print("=" * 60)
    print(classification_report(y_test, y_pred, target_names=le.classes_))

    f1_macro = f1_score(
        y_test, y_pred, average="macro", labels=le.classes_
    )
    print(f"F1 Macro: {f1_macro:.4f}")

    # 6. Confusion Matrix (text-based, không cần matplotlib)
    cm = confusion_matrix(y_test, y_pred, labels=le.classes_)
    print("\nConfusion Matrix:")
    print(cm)

    # 7. Top errors analysis
    errors = pd.DataFrame({
        "text":      X_test.values,
        "true":      y_test.values,
        "predicted": y_pred
    })
    errors = errors[errors["true"] != errors["predicted"]]
    print(f"\nTotal errors: {len(errors)}/{len(X_test)}")
    print("\nMost confused pairs:")
    print(
        errors.groupby(["true", "predicted"]).size()
        .sort_values(ascending=False).head(10)
    )


if __name__ == "__main__":
    evaluate_model()
