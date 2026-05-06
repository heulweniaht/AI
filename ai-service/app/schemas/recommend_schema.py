from pydantic import BaseModel, Field
from typing import Optional


class RecommendResponse(BaseModel):
    doctorId:        int    = Field(description="ID bác sĩ")
    doctorName:      str    = Field(description="Họ tên bác sĩ")
    specialtyName:   str    = Field(description="Chuyên khoa")
    clinicName:      str    = Field(description="Tên phòng khám")
    clinicCity:      str    = Field(description="Thành phố")
    ratingAvg:       float  = Field(description="Rating trung bình (0-5)")
    totalReviews:    int    = Field(description="Số lượng đánh giá")
    consultationFee: float  = Field(description="Phí khám (VND)")
    avatarUrl:       str    = Field(description="URL ảnh đại diện")
    score:           float  = Field(description="Điểm recommendation (internal)")
    rank:            int    = Field(description="Thứ hạng trong danh sách")

    model_config = {
        "json_schema_extra": {
            "example": {
                "doctorId": 1,
                "doctorName": "BS. Nguyễn Văn A",
                "specialtyName": "Hô hấp",
                "clinicName": "Bệnh viện Bạch Mai",
                "clinicCity": "Hà Nội",
                "ratingAvg": 4.8,
                "totalReviews": 245,
                "consultationFee": 200000,
                "avatarUrl": "https://...",
                "score": 0.8543,
                "rank": 1
            }
        }
    }
