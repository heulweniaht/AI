import numpy as np
import asyncio
import hashlib
import json
from typing import Optional

from scipy.sparse import csr_matrix
from sklearn.metrics.pairwise import cosine_similarity
import httpx

from app.core.config import settings
from app.core.logger import logger


class DoctorRecommender:
    """
    Hybrid Recommender System:
    - Content-Based: specialty matching, location, rating
    - Collaborative: user-doctor interaction matrix (implicit feedback)
    """

    def __init__(self):
        self.user_doctor_matrix: Optional[csr_matrix] = None
        self.user_sim_matrix:    Optional[np.ndarray]  = None
        self.doctor_ids:         list = []
        self.user_ids:           list = []

    async def load_model(self):
        """Load pre-computed matrices từ file"""
        loop = asyncio.get_event_loop()
        try:
            from scipy.sparse import load_npz
            import joblib

            self.user_doctor_matrix = await loop.run_in_executor(
                None, load_npz, "app/models/recommender_matrix.npz"
            )
            meta = await loop.run_in_executor(
                None, joblib.load, "app/models/recommender_meta.pkl"
            )
            self.doctor_ids = meta["doctor_ids"]
            self.user_ids   = meta["user_ids"]

            # Tính user similarity matrix (Cosine)
            self.user_sim_matrix = cosine_similarity(self.user_doctor_matrix)
            logger.info(
                "Recommender loaded",
                users=len(self.user_ids),
                doctors=len(self.doctor_ids)
            )
        except FileNotFoundError:
            logger.warning("Recommender model not found, using content-based only")

    # ── Main recommendation method ────────────────────────────────────────
    async def recommend(
        self,
        patient_id:   int,
        specialty:    Optional[str] = None,   # Từ kết quả symptom checker
        top_n:        int = 6,
        location:     Optional[str] = None,
        max_fee:      Optional[float] = None,
        http_client:  Optional[httpx.AsyncClient] = None
    ) -> list[dict]:

        # 1. Lấy danh sách bác sĩ từ Doctor Service
        doctors = await self._fetch_doctors(specialty, location, max_fee, http_client)
        if not doctors:
            return []

        # 2. Content-Based Score (luôn tính được)
        cb_scores = self._content_based_score(doctors, specialty)

        # 3. Collaborative Filtering Score (chỉ khi có đủ data)
        cf_scores = await self._collaborative_score(patient_id, doctors)

        # 4. Popularity Score
        popularity_scores = np.array([d.get("ratingAvg", 3.0) / 5.0 for d in doctors])

        # 5. Hybrid: weighted combination
        final_scores = (
            0.6 * cb_scores +
            0.3 * cf_scores +
            0.1 * popularity_scores
        )

        # 6. Sort và format output
        sorted_idx = np.argsort(final_scores)[::-1][:top_n]
        recommendations = []
        for i, idx in enumerate(sorted_idx):
            doc = doctors[idx]
            recommendations.append({
                "doctorId":        doc["id"],
                "doctorName":      doc["fullName"],
                "specialtyName":   doc["specialtyName"],
                "clinicName":      doc.get("clinicName", ""),
                "clinicCity":      doc.get("clinicCity", ""),
                "ratingAvg":       doc.get("ratingAvg", 0.0),
                "totalReviews":    doc.get("totalReviews", 0),
                "consultationFee": doc.get("consultationFee", 0),
                "avatarUrl":       doc.get("avatarUrl", ""),
                "score":           round(float(final_scores[idx]), 4),
                "rank":            i + 1
            })

        return recommendations

    def _content_based_score(
        self, doctors: list, specialty: Optional[str]
    ) -> np.ndarray:
        """Score dựa trên nội dung: specialty match, rating, fee"""
        scores = np.zeros(len(doctors))
        for i, doc in enumerate(doctors):
            score = 0.0
            # Specialty match (quan trọng nhất)
            if specialty and doc.get("specialtyName", "").lower() == specialty.lower():
                score += 0.5
            # Rating (normalize 0-5 -> 0-1)
            score += (doc.get("ratingAvg", 0) / 5.0) * 0.3
            # Experience (normalize 0-30 năm -> 0-1)
            exp_years = min(doc.get("experienceYears", 0), 30) / 30
            score += exp_years * 0.2
            scores[i] = score
        return scores

    async def _collaborative_score(
        self, patient_id: int, doctors: list
    ) -> np.ndarray:
        """Collaborative Filtering: tìm user tương tự và xem họ book bác sĩ nào"""
        scores = np.zeros(len(doctors))

        if self.user_sim_matrix is None or patient_id not in self.user_ids:
            return scores  # Cold start -> trả về 0

        user_idx = self.user_ids.index(patient_id)

        # Lấy top 10 user tương tự nhất
        sim_scores = self.user_sim_matrix[user_idx]
        top_similar = np.argsort(sim_scores)[::-1][1:11]  # Bỏ chính mình

        doctor_id_to_idx = {did: i for i, did in enumerate(self.doctor_ids)}

        for i, doc in enumerate(doctors):
            doc_id = doc.get("id")
            if doc_id not in doctor_id_to_idx:
                continue
            doc_idx = doctor_id_to_idx[doc_id]

            # Weighted average rating từ similar users
            weighted_sum = 0.0
            weight_total = 0.0
            for u_idx in top_similar:
                rating = self.user_doctor_matrix[u_idx, doc_idx]
                if rating > 0:
                    w = float(sim_scores[u_idx])
                    weighted_sum += w * (rating / 5.0)
                    weight_total += w

            if weight_total > 0:
                scores[i] = weighted_sum / weight_total

        return scores

    async def _fetch_doctors(
        self, specialty, location, max_fee, client
    ) -> list:
        """Gọi Doctor Service để lấy danh sách bác sĩ phù hợp"""
        if client is None:
            return []
        try:
            params = {"size": 50, "sort": "ratingAvg,desc"}
            if specialty:  params["specialtyName"] = specialty
            if location:   params["city"] = location
            if max_fee:    params["maxPrice"] = max_fee

            resp = await client.get(
                f"{settings.DOCTOR_SERVICE_URL}/api/v1/doctors",
                params=params,
                timeout=5.0
            )
            resp.raise_for_status()
            return resp.json().get("data", {}).get("content", [])
        except Exception as e:
            logger.error("Failed to fetch doctors", error=str(e))
            return []
