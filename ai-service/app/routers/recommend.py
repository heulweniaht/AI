from fastapi import APIRouter, Depends, Request, Query
from typing import Optional, List
import httpx

from app.schemas.recommend_schema import RecommendResponse
from app.core.security import verify_token, TokenData
from app.core.logger import logger

router = APIRouter()


@router.get(
    "/recommend",
    response_model=List[RecommendResponse],
    summary="Gợi ý bác sĩ phù hợp",
    description="""
    Gợi ý danh sách bác sĩ phù hợp dựa trên:
    - **Content-Based (60%)**: Specialty match, rating, kinh nghiệm
    - **Collaborative Filtering (30%)**: Lịch sử đặt lịch của người dùng tương tự
    - **Popularity (10%)**: Rating trung bình

    Cần JWT token (phải đăng nhập).
    """
)
async def get_recommendations(
    request:   Request,
    specialty: Optional[str]   = Query(None, description="Tên chuyên khoa (từ symptom checker)"),
    location:  Optional[str]   = Query(None, description="Thành phố/tỉnh"),
    max_fee:   Optional[float] = Query(None, description="Phí khám tối đa (VND)"),
    top_n:     int             = Query(6, ge=1, le=20, description="Số bác sĩ trả về"),
    current_user: TokenData    = Depends(verify_token)
):
    recommender = request.app.state.recommender

    async with httpx.AsyncClient() as http_client:
        recommendations = await recommender.recommend(
            patient_id  = current_user.user_id,
            specialty   = specialty,
            top_n       = top_n,
            location    = location,
            max_fee     = max_fee,
            http_client = http_client
        )

    logger.info(
        "Recommendations served",
        user_id=current_user.user_id,
        specialty=specialty,
        count=len(recommendations)
    )

    return recommendations
