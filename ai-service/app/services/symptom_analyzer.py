import hashlib
import json
import asyncio
from typing import Optional
import joblib
import numpy as np

from app.core.config import settings
from app.core.logger import logger
from app.ml.preprocess import VietnameseMedicalPreprocessor
from app.services.cache_service import CacheService


class SymptomAnalyzerResult:
    def __init__(self, specialties, urgent, disclaimer, model_type, cached=False):
        self.specialties = specialties       # [{name, confidence, description}]
        self.urgent      = urgent            # bool: cần đi khám khẩn
        self.disclaimer  = disclaimer        # Cảnh báo pháp lý
        self.model_type  = model_type
        self.cached      = cached


class SymptomAnalyzer:
    """
    Inference service cho symptom classification.
    Thread-safe, model được load một lần vào memory.
    """

    DISCLAIMER = (
        "Kết quả này chỉ mang tính tham khảo và không thay thế "
        "chẩn đoán của bác sĩ. Vui lòng đặt lịch khám để được tư vấn chính xác."
    )

    # Mô tả ngắn cho từng chuyên khoa (hiển thị trên UI)
    SPECIALTY_DESCRIPTIONS = {
        "Tim mạch":      "Bệnh lý tim, mạch máu, huyết áp",
        "Hô hấp":        "Phổi, phế quản, đường thở",
        "Thần kinh":     "Não bộ, tủy sống, dây thần kinh",
        "Tiêu hóa":      "Dạ dày, ruột, gan, tụy",
        "Cơ xương khớp": "Xương, khớp, cơ bắp",
        "Da liễu":       "Bệnh lý da, tóc, móng",
        "Nội tiết":      "Tiểu đường, tuyến giáp, hormone",
        "Nhi khoa":      "Bệnh lý trẻ em dưới 15 tuổi",
        "Sản phụ khoa":  "Phụ khoa, thai sản",
        "Nhãn khoa":     "Mắt, thị lực",
        "Tai mũi họng":  "Tai, mũi, họng, thanh quản",
        "Tiết niệu":     "Thận, bàng quang, đường tiết niệu",
        "Nội tổng quát": "Khám bệnh tổng quát",
    }

    def __init__(self):
        self.pipeline      = None   # sklearn Pipeline
        self.label_encoder = None
        self.preprocessor  = None
        self.model_type    = settings.MODEL_TYPE

    async def load_model(self):
        """Load model file vào memory (async để không block event loop)"""
        loop = asyncio.get_event_loop()

        if self.model_type == "sklearn":
            try:
                # Chạy joblib.load trong thread pool (IO-bound)
                self.pipeline = await loop.run_in_executor(
                    None, joblib.load,
                    f"{settings.MODEL_DIR}/symptom_classifier.pkl"
                )
                self.label_encoder = await loop.run_in_executor(
                    None, joblib.load,
                    f"{settings.MODEL_DIR}/specialty_encoder.pkl"
                )
                logger.info("Sklearn model loaded successfully")
            except FileNotFoundError:
                logger.warning(
                    "Model files not found. Run train_symptom_model.py first.",
                    model_dir=settings.MODEL_DIR
                )
                self.pipeline = None
                self.label_encoder = None

        elif self.model_type == "phobert":
            # Load PhoBERT (nặng hơn, cần GPU)
            from app.ml.phobert_classifier import PhoBERTClassifier
            self.phobert_clf = PhoBERTClassifier()
            await self.phobert_clf.load()

        self.preprocessor = VietnameseMedicalPreprocessor()
        logger.info("Symptom model loaded", type=self.model_type)

    # ── Main inference method ─────────────────────────────────────────────
    async def analyze(
        self,
        symptoms: list[str],
        description: str = "",
        severity: int = 5,
        cache: Optional[CacheService] = None
    ) -> SymptomAnalyzerResult:

        # 1. Tạo cache key từ input
        cache_key = self._make_cache_key(symptoms, description, severity)

        # 2. Kiểm tra cache
        if cache:
            cached = await cache.get(cache_key)
            if cached:
                result_data = json.loads(cached)
                return SymptomAnalyzerResult(**result_data, cached=True)

        # 3. Tiền xử lý text
        combined_input = " . ".join(symptoms)
        if description:
            combined_input += " . " + description

        processed_text = self.preprocessor.preprocess(combined_input)

        if not processed_text.strip():
            raise ValueError(
                "Không thể xử lý input. Vui lòng mô tả triệu chứng chi tiết hơn."
            )

        # 4. Inference (chạy trong thread pool để không block event loop)
        loop = asyncio.get_event_loop()
        specialties = await loop.run_in_executor(
            None, self._predict, processed_text
        )

        # 5. Kiểm tra severity để xác định mức độ khẩn cấp
        urgent = severity >= settings.URGENT_SEVERITY_THRESHOLD

        # 6. Thêm warning nếu khẩn cấp
        disclaimer = self.DISCLAIMER
        if urgent:
            disclaimer = (
                "⚠️ TRIỆU CHỨNG NGHIÊM TRỌNG: Mức độ đau cao. "
                "Vui lòng đến phòng khám/cấp cứu ngay lập tức! "
                + disclaimer
            )

        result = SymptomAnalyzerResult(
            specialties=specialties,
            urgent=urgent,
            disclaimer=disclaimer,
            model_type=self.model_type,
            cached=False
        )

        # 7. Lưu vào cache
        if cache:
            cache_data = {
                "specialties": specialties,
                "urgent":      urgent,
                "disclaimer":  disclaimer,
                "model_type":  self.model_type
            }
            await cache.set(
                cache_key,
                json.dumps(cache_data, ensure_ascii=False),
                ttl=settings.CACHE_TTL_SYMPTOM
            )

        logger.info(
            "Symptom analysis completed",
            top_specialty=specialties[0]["name"] if specialties else "none",
            urgent=urgent,
            cached=False
        )
        return result

    def _predict(self, processed_text: str) -> list[dict]:
        """Sklearn inference - chạy synchronous trong thread pool"""
        if self.pipeline is None or self.label_encoder is None:
            # Fallback khi chưa có model: trả về kết quả mặc định
            logger.warning("Model not loaded, returning default specialty")
            return [{
                "name": "Nội tổng quát",
                "confidence": 50.0,
                "description": "Khám bệnh tổng quát"
            }]

        # predict_proba trả về probability cho tất cả classes
        proba = self.pipeline.predict_proba([processed_text])[0]
        classes = self.label_encoder.classes_

        # Tạo list (specialty, confidence) và sort DESC
        results = [
            {"name": cls, "confidence": round(float(prob) * 100, 1)}
            for cls, prob in zip(classes, proba)
            if prob >= settings.MIN_CONFIDENCE_THRESHOLD
        ]
        results.sort(key=lambda x: x["confidence"], reverse=True)

        # Thêm mô tả cho top kết quả
        top_results = results[:4]   # Chỉ trả về top 4
        for r in top_results:
            r["description"] = self.SPECIALTY_DESCRIPTIONS.get(r["name"], "")

        return top_results

    def _make_cache_key(self, symptoms, description, severity) -> str:
        """Tạo unique cache key từ input parameters"""
        data = json.dumps({
            "symptoms":    sorted(symptoms),  # sort để đồng nhất thứ tự
            "description": description.lower().strip(),
            "severity":    severity
        }, ensure_ascii=False)
        return f"ai:symptom:{hashlib.md5(data.encode()).hexdigest()}"

    async def get_model_info(self) -> dict:
        """Trả về thông tin model (version, accuracy,...)"""
        try:
            with open(f"{settings.MODEL_DIR}/model_metadata.json") as f:
                return json.load(f)
        except FileNotFoundError:
            return {"model_type": self.model_type, "status": "loaded"}
