"""
Script huấn luyện model phân loại triệu chứng -> chuyên khoa.
Dùng pipeline sklearn: TF-IDF -> LogisticRegression
Chạy: python -m app.ml.train_symptom_model
"""
import pandas as pd
import numpy as np
from sklearn.pipeline import Pipeline
from sklearn.feature_extraction.text import TfidfVectorizer
from sklearn.linear_model import LogisticRegression
from sklearn.preprocessing import LabelEncoder
from sklearn.model_selection import StratifiedKFold, cross_val_score
from sklearn.metrics import classification_report
import joblib
import json
import os

from app.ml.preprocess import VietnameseMedicalPreprocessor


def train():
    # ── 1. Load dữ liệu ────────────────────────────────────────────────────────
    print("📂 Loading dataset...")
    data_path = "app/data/symptoms_dataset.csv"

    if not os.path.exists(data_path):
        print(f"❌ Dataset không tìm thấy tại {data_path}")
        print("   Hãy tạo file CSV với cột 'symptoms_text' và 'specialty'")
        return

    df = pd.read_csv(data_path)
    # Dataset format:
    # symptoms_text (str),  specialty (str)
    # "đau đầu chóng mặt buồn nôn",  "Thần kinh"
    # "ho khan sốt khó thở",          "Hô hấp"
    # "đau ngực tim đập nhanh",        "Tim mạch"
    # ...  (khoảng 5000-10000 samples)

    print(f"Dataset size: {len(df)} samples")
    print(f"Specialties: {df['specialty'].nunique()} classes")
    print(df['specialty'].value_counts())

    # ── 2. Tiền xử lý ─────────────────────────────────────────────────────────
    print("\n🔄 Preprocessing text...")
    preprocessor = VietnameseMedicalPreprocessor()
    df['processed'] = df['symptoms_text'].apply(preprocessor.preprocess)

    print("Sample after preprocessing:")
    print(df[['symptoms_text', 'processed', 'specialty']].head(3))

    # ── 3. Encode labels ──────────────────────────────────────────────────────
    le = LabelEncoder()
    y = le.fit_transform(df['specialty'])
    X = df['processed'].values

    print(f"\nLabel mapping:")
    for i, name in enumerate(le.classes_):
        print(f"  {i}: {name}")

    # ── 4. Xây dựng Pipeline ──────────────────────────────────────────────────
    pipeline = Pipeline([
        ('tfidf', TfidfVectorizer(
            ngram_range=(1, 2),        # Unigram + bigram (quan trọng cho tiếng Việt)
            max_features=15000,        # Giới hạn vocabulary
            min_df=2,                  # Bỏ từ xuất hiện < 2 lần
            max_df=0.95,               # Bỏ từ xuất hiện > 95% documents
            sublinear_tf=True,         # log(1+tf) thay vì tf
            analyzer='word'
        )),
        ('clf', LogisticRegression(
            C=1.0,                     # Regularization strength
            max_iter=1000,
            multi_class='multinomial', # Softmax cho multi-class
            solver='lbfgs',
            class_weight='balanced',   # Xử lý class imbalance
            n_jobs=-1,                 # Dùng tất cả CPU cores
            random_state=42
        ))
    ])

    # ── 5. Cross-validation ───────────────────────────────────────────────────
    print("\n📊 Cross-validating (5-fold)...")
    cv = StratifiedKFold(n_splits=5, shuffle=True, random_state=42)
    scores = cross_val_score(pipeline, X, y, cv=cv, scoring='f1_macro', n_jobs=-1)
    print(f"F1-Macro: {scores.mean():.4f} ± {scores.std():.4f}")

    # ── 6. Train final model ──────────────────────────────────────────────────
    print("\n🏋️ Training final model on full dataset...")
    pipeline.fit(X, y)

    # ── 7. Evaluation ─────────────────────────────────────────────────────────
    y_pred = pipeline.predict(X)
    print("\n📈 Classification Report:")
    print(classification_report(y, y_pred, target_names=le.classes_))

    # ── 8. Lưu model ─────────────────────────────────────────────────────────
    os.makedirs("app/models", exist_ok=True)
    print("\n💾 Saving models...")
    joblib.dump(pipeline, "app/models/symptom_classifier.pkl", compress=3)
    joblib.dump(le,       "app/models/specialty_encoder.pkl",  compress=3)

    # Lưu metadata
    metadata = {
        "model_type":   "TF-IDF + LogisticRegression",
        "n_classes":    len(le.classes_),
        "classes":      list(le.classes_),
        "vocabulary_size": len(pipeline.named_steps['tfidf'].vocabulary_),
        "f1_macro_cv":  float(scores.mean()),
        "trained_at":   pd.Timestamp.now().isoformat()
    }
    with open("app/models/model_metadata.json", "w", encoding="utf-8") as f:
        json.dump(metadata, f, ensure_ascii=False, indent=2)

    print(f"✅ Model saved! Classes: {le.classes_}")
    print(f"   Vocabulary size: {metadata['vocabulary_size']}")
    print(f"   F1-Macro: {metadata['f1_macro_cv']:.4f}")


if __name__ == "__main__":
    train()
