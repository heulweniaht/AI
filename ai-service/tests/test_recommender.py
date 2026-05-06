import pytest
from unittest.mock import MagicMock, AsyncMock
import numpy as np


@pytest.fixture
def recommender_with_matrix():
    """Mock recommender có loaded matrix"""
    from app.services.doctor_recommender import DoctorRecommender
    from scipy.sparse import csr_matrix

    rec = DoctorRecommender()
    # Simple 2x2 matrix: user 1 book doctor 101 & 102, user 2 book doctor 101
    data = np.array([3.0, 3.0, 3.0])
    rows = np.array([0, 0, 1])
    cols = np.array([0, 1, 0])
    rec.user_doctor_matrix = csr_matrix((data, (rows, cols)), shape=(2, 2))
    rec.user_ids   = [1, 2]
    rec.doctor_ids = [101, 102]
    from sklearn.metrics.pairwise import cosine_similarity
    rec.user_sim_matrix = cosine_similarity(rec.user_doctor_matrix)
    return rec


def test_content_based_score_with_specialty_match():
    """Test: bác sĩ đúng chuyên khoa có score cao hơn"""
    from app.services.doctor_recommender import DoctorRecommender

    rec = DoctorRecommender()
    doctors = [
        {"id": 1, "specialtyName": "Hô hấp", "ratingAvg": 4.5, "experienceYears": 10},
        {"id": 2, "specialtyName": "Tim mạch", "ratingAvg": 4.8, "experienceYears": 15},
    ]

    scores = rec._content_based_score(doctors, specialty="Hô hấp")

    # Bác sĩ Hô hấp phải có score cao hơn
    assert scores[0] > scores[1]


@pytest.mark.asyncio
async def test_collaborative_score_cold_start():
    """Test: user mới (cold start) -> CF score = 0"""
    from app.services.doctor_recommender import DoctorRecommender

    rec = DoctorRecommender()
    # Không có matrix (cold start)
    doctors = [{"id": 101}]

    scores = await rec._collaborative_score(patient_id=999, doctors=doctors)
    assert all(s == 0 for s in scores)
