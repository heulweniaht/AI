from pydantic import BaseModel, Field, field_validator
from typing import List, Optional


class SymptomRequest(BaseModel):
    symptoms: List[str] = Field(
        default=[],
        description="Danh sách triệu chứng chọn từ tag input",
        examples=[["sốt cao", "đau đầu", "ho khan"]]
    )
    description: Optional[str] = Field(
        default=None,
        max_length=1000,
        description="Mô tả triệu chứng tự do bằng tiếng Việt",
        examples=["Tôi bị đau đầu dữ dội kèm theo chóng mặt và buồn nôn"]
    )
    severity: int = Field(
        default=5,
        ge=1, le=10,
        description="Mức độ nghiêm trọng từ 1 (nhẹ) đến 10 (rất nặng)"
    )

    @field_validator("symptoms")
    @classmethod
    def validate_symptoms(cls, v):
        # Lọc bỏ empty strings
        cleaned = [s.strip() for s in v if s.strip()]
        if len(cleaned) > 10:
            raise ValueError("Tối đa 10 triệu chứng")
        return cleaned

    @field_validator("description")
    @classmethod
    def validate_description(cls, v):
        if v and len(v.strip()) < 3:
            raise ValueError("Mô tả quá ngắn (tối thiểu 3 ký tự)")
        return v.strip() if v else v

    model_config = {
        "json_schema_extra": {
            "example": {
                "symptoms":    ["sốt", "đau đầu", "mệt mỏi"],
                "description": "Tôi bị sốt 3 ngày, đau đầu nhiều, người mệt mỏi",
                "severity":    6
            }
        }
    }


class SpecialtyResult(BaseModel):
    name:        str   = Field(description="Tên chuyên khoa")
    confidence:  float = Field(description="Độ tin cậy (%)", ge=0, le=100)
    description: str   = Field(description="Mô tả ngắn về chuyên khoa")


class SymptomResponse(BaseModel):
    specialties: List[SpecialtyResult] = Field(
        description="Top chuyên khoa gợi ý, sorted by confidence DESC"
    )
    urgent:      bool   = Field(description="true nếu cần khám khẩn cấp")
    disclaimer:  str    = Field(description="Cảnh báo pháp lý")
    model_type:  str    = Field(description="Loại model đang dùng")
    cached:      bool   = Field(description="true nếu kết quả từ cache")

    model_config = {
        "json_schema_extra": {
            "example": {
                "specialties": [
                    {"name": "Hô hấp",        "confidence": 72.5, "description": "Phổi, phế quản"},
                    {"name": "Thần kinh",      "confidence": 45.1, "description": "Não bộ, dây thần kinh"},
                    {"name": "Nội tổng quát",  "confidence": 30.2, "description": "Khám tổng quát"}
                ],
                "urgent":     False,
                "disclaimer": "Kết quả này chỉ mang tính tham khảo...",
                "model_type": "sklearn",
                "cached":     False
            }
        }
    }
