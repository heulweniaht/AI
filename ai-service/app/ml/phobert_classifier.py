import torch
from torch.utils.data import Dataset
from transformers import (
    AutoTokenizer, AutoModelForSequenceClassification,
    TrainingArguments, Trainer, EarlyStoppingCallback
)
import numpy as np
from sklearn.metrics import f1_score, accuracy_score
import pandas as pd
import asyncio


class MedicalSymptomDataset(Dataset):
    """Custom Dataset cho symptom classification"""

    def __init__(self, texts, labels, tokenizer, max_length=256):
        self.encodings = tokenizer(
            texts,
            truncation=True,
            padding=True,
            max_length=max_length,
            return_tensors="pt"
        )
        self.labels = torch.tensor(labels, dtype=torch.long)

    def __len__(self):
        return len(self.labels)

    def __getitem__(self, idx):
        return {
            "input_ids":      self.encodings["input_ids"][idx],
            "attention_mask": self.encodings["attention_mask"][idx],
            "labels":         self.labels[idx]
        }


class PhoBERTClassifier:
    """Fine-tuned PhoBERT cho medical specialty classification"""

    MODEL_NAME = "vinai/phobert-base-v2"   # PhoBERT base v2 (VinAI)
    SAVE_PATH  = "app/models/phobert_symptom"

    def __init__(self, num_labels: int = 13):
        self.num_labels = num_labels
        self.tokenizer  = None
        self.model      = None
        self.device     = torch.device("cuda" if torch.cuda.is_available() else "cpu")
        print(f"Using device: {self.device}")

    async def load(self):
        """Load fine-tuned model từ disk"""
        loop = asyncio.get_event_loop()
        await loop.run_in_executor(None, self._load_sync)

    def _load_sync(self):
        self.tokenizer = AutoTokenizer.from_pretrained(self.SAVE_PATH)
        self.model = AutoModelForSequenceClassification.from_pretrained(self.SAVE_PATH)
        self.model.to(self.device)
        self.model.eval()

    def fine_tune(self, train_df: pd.DataFrame, val_df: pd.DataFrame, label_encoder):
        """Fine-tune PhoBERT trên medical dataset"""

        # 1. Load pre-trained tokenizer và model
        tokenizer = AutoTokenizer.from_pretrained(self.MODEL_NAME)
        model = AutoModelForSequenceClassification.from_pretrained(
            self.MODEL_NAME,
            num_labels=self.num_labels,
            ignore_mismatched_sizes=True
        )

        # 2. Tạo datasets
        train_dataset = MedicalSymptomDataset(
            texts=train_df["processed"].tolist(),
            labels=label_encoder.transform(train_df["specialty"]),
            tokenizer=tokenizer
        )
        val_dataset = MedicalSymptomDataset(
            texts=val_df["processed"].tolist(),
            labels=label_encoder.transform(val_df["specialty"]),
            tokenizer=tokenizer
        )

        # 3. Training arguments
        training_args = TrainingArguments(
            output_dir=self.SAVE_PATH,
            num_train_epochs=5,
            per_device_train_batch_size=16,
            per_device_eval_batch_size=32,
            warmup_ratio=0.1,
            weight_decay=0.01,
            learning_rate=2e-5,
            evaluation_strategy="epoch",
            save_strategy="epoch",
            load_best_model_at_end=True,
            metric_for_best_model="f1_macro",
            greater_is_better=True,
            logging_dir="./logs",
            logging_steps=50,
            fp16=torch.cuda.is_available(),  # Mixed precision nếu có GPU
            report_to="none"    # Tắt wandb/tensorboard
        )

        # 4. Custom metrics
        def compute_metrics(eval_pred):
            logits, labels = eval_pred
            preds = np.argmax(logits, axis=-1)
            return {
                "accuracy": accuracy_score(labels, preds),
                "f1_macro": f1_score(labels, preds, average="macro")
            }

        # 5. Trainer
        trainer = Trainer(
            model=model,
            args=training_args,
            train_dataset=train_dataset,
            eval_dataset=val_dataset,
            compute_metrics=compute_metrics,
            callbacks=[EarlyStoppingCallback(early_stopping_patience=2)]
        )

        # 6. Train!
        print("🏋️ Fine-tuning PhoBERT...")
        trainer.train()

        # 7. Lưu model cuối
        trainer.save_model(self.SAVE_PATH)
        tokenizer.save_pretrained(self.SAVE_PATH)
        print(f"✅ PhoBERT saved to {self.SAVE_PATH}")

    def predict(self, text: str, label_encoder) -> list[dict]:
        """Inference với fine-tuned PhoBERT"""
        inputs = self.tokenizer(
            text, return_tensors="pt",
            truncation=True, max_length=256
        )
        inputs = {k: v.to(self.device) for k, v in inputs.items()}

        with torch.no_grad():
            outputs = self.model(**inputs)
            probs = torch.softmax(outputs.logits, dim=-1)
            probs = probs.cpu().numpy()[0]

        results = [
            {"name": cls, "confidence": round(float(p) * 100, 1)}
            for cls, p in zip(label_encoder.classes_, probs)
            if p >= 0.15
        ]
        return sorted(results, key=lambda x: x["confidence"], reverse=True)[:4]
