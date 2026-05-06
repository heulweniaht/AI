import pytest
from unittest.mock import AsyncMock, MagicMock, patch
import numpy as np


@pytest.fixture
def mock_pipeline():
    """Mock sklearn pipeline"""
    pipeline = MagicMock()
    # Tim mạch=0.7, Hô hấp=0.2, Thần kinh=0.1 + 10 zeros
    pipeline.predict_proba.return_value = np.array([[0.7, 0.2, 0.1] + [0.0] * 10])
    return pipeline


@pytest.fixture
def mock_label_encoder():
    le = MagicMock()
    le.classes_ = np.array([
        "Cơ xương khớp", "Da liễu", "Hô hấp", "Nhi khoa", "Nội tiết",
        "Nội tổng quát", "Nhãn khoa", "Sản phụ khoa", "Tai mũi họng",
        "Thần kinh", "Tiêu hóa", "Tiết niệu", "Tim mạch"
    ])
    return le


@pytest.mark.asyncio
async def test_analyze_returns_top_specialties(mock_pipeline, mock_label_encoder):
    """Test: analyze() trả về list chuyên khoa sorted DESC"""
    from app.services.symptom_analyzer import SymptomAnalyzer

    analyzer = SymptomAnalyzer()
    analyzer.pipeline      = mock_pipeline
    analyzer.label_encoder = mock_label_encoder

    from app.ml.preprocess import VietnameseMedicalPreprocessor
    analyzer.preprocessor = VietnameseMedicalPreprocessor()

    result = await analyzer.analyze(
        symptoms=["đau ngực", "tim đập nhanh"],
        severity=5
    )

    assert len(result.specialties) > 0
    # Tim mạch phải là top 1
    assert result.specialties[0]["name"] == "Tim mạch"
    assert result.specialties[0]["confidence"] == 70.0
    assert result.urgent == False  # severity 5 < threshold 8


@pytest.mark.asyncio
async def test_urgent_flag_when_high_severity(mock_pipeline, mock_label_encoder):
    """Test: urgent=True khi severity >= 8"""
    from app.services.symptom_analyzer import SymptomAnalyzer

    analyzer = SymptomAnalyzer()
    analyzer.pipeline      = mock_pipeline
    analyzer.label_encoder = mock_label_encoder

    from app.ml.preprocess import VietnameseMedicalPreprocessor
    analyzer.preprocessor = VietnameseMedicalPreprocessor()

    result = await analyzer.analyze(
        symptoms=["đau ngực dữ dội"],
        severity=9    # >= threshold
    )

    assert result.urgent == True
    assert "TRIỆU CHỨNG NGHIÊM TRỌNG" in result.disclaimer


@pytest.mark.asyncio
async def test_empty_input_raises_error():
    """Test: ValueError khi input rỗng"""
    from app.services.symptom_analyzer import SymptomAnalyzer

    analyzer = SymptomAnalyzer()

    from app.ml.preprocess import VietnameseMedicalPreprocessor
    analyzer.preprocessor = VietnameseMedicalPreprocessor()

    with pytest.raises(ValueError, match="Vui lòng mô tả triệu chứng"):
        await analyzer.analyze(symptoms=[], description="")


def test_preprocessor_normalize():
    """Test: Vietnamese text normalization"""
    from app.ml.preprocess import VietnameseMedicalPreprocessor

    pre = VietnameseMedicalPreprocessor()
    result = pre._normalize("  ĐAU ĐẦU!!!  ")
    assert result == "đau đầu"


def test_preprocessor_synonym_expansion():
    """Test: Synonym expansion hoạt động"""
    from app.ml.preprocess import VietnameseMedicalPreprocessor

    pre = VietnameseMedicalPreprocessor()
    # Override synonyms dict để test
    pre.synonyms = {"đau tim": "đau ngực"}
    result = pre._expand_synonyms("tôi bị đau tim")
    assert "đau ngực" in result
