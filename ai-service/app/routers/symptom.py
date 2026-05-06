from fastapi import APIRouter, Depends, Request, HTTPException, status
from app.schemas.symptom_schema import SymptomRequest, SymptomResponse
from app.core.security import verify_token, optional_token, TokenData
from app.core.logger import logger
from app.services.cache_service import CacheService

router = APIRouter()


@router.post(
    "/symptom-check",
    response_model=SymptomResponse,
    summary="Phân tích triệu chứng và gợi ý chuyên khoa",
    description="""
    Nhận mô tả triệu chứng bằng tiếng Việt và trả về danh sách chuyên khoa phù hợp.

    **Input:**
    - symptoms: Danh sách tag triệu chứng chọn nhanh (optional)
    - description: Mô tả tự do bằng văn bản (optional, nhưng nên có ít nhất 1 trong 2)
    - severity: Mức độ nghiêm trọng 1-10 (1=nhẹ, 10=rất nặng)

    **Output:**
    - specialties: Top 4 chuyên khoa với confidence score (%)
    - urgent: true nếu cần khám khẩn (severity >= 8)
    - disclaimer: Cảnh báo đây là tham khảo, không thay thế bác sĩ
    """,
    status_code=status.HTTP_200_OK
)
async def check_symptoms(
    request_body: SymptomRequest,
    request:      Request,
    # optional_token: không bắt buộc login (bất kỳ ai cũng dùng được)
    current_user: TokenData | None = Depends(optional_token)
):
    # Validate: phải có ít nhất symptoms hoặc description
    if not request_body.symptoms and not request_body.description:
        raise HTTPException(
            status_code=400,
            detail="Vui lòng nhập ít nhất một triệu chứng hoặc mô tả tình trạng."
        )

    analyzer = request.app.state.symptom_analyzer
    cache    = request.app.state.cache

    try:
        result = await analyzer.analyze(
            symptoms    = request_body.symptoms,
            description = request_body.description or "",
            severity    = request_body.severity,
            cache       = cache
        )

        logger.info(
            "Symptom check served",
            user_id=current_user.user_id if current_user else "anonymous",
            cached=result.cached,
            top_specialty=result.specialties[0]["name"] if result.specialties else "none"
        )

        return SymptomResponse(
            specialties = result.specialties,
            urgent      = result.urgent,
            disclaimer  = result.disclaimer,
            model_type  = result.model_type,
            cached      = result.cached
        )
    except ValueError as e:
        raise HTTPException(status_code=400, detail=str(e))
    except Exception as e:
        logger.error("Symptom analysis failed", error=str(e))
        raise HTTPException(
            status_code=500,
            detail="Lỗi phân tích triệu chứng. Vui lòng thử lại."
        )


@router.get(
    "/symptom-check/model-info",
    summary="Thông tin model đang dùng"
)
async def get_model_info(
    request: Request,
    _: TokenData = Depends(verify_token)   # Chỉ authenticated user
):
    analyzer = request.app.state.symptom_analyzer
    return await analyzer.get_model_info()
