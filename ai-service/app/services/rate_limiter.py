from fastapi import Depends, HTTPException, Request, status
from app.services.cache_service import CacheService
from app.core.config import settings
from app.core.security import TokenData, optional_token


def create_rate_limiter(endpoint: str, limit_per_minute: int):
    """Factory tạo rate limiter dependency cho từng endpoint"""

    async def rate_limiter(
        request:      Request,
        current_user: TokenData | None = Depends(optional_token)
    ):
        cache: CacheService = request.app.state.cache

        # Xác định identifier (user_id nếu đã login, IP nếu chưa)
        if current_user:
            identifier = f"user:{current_user.user_id}"
        else:
            # Lấy real IP (qua nginx proxy)
            identifier = f"ip:{request.headers.get('X-Forwarded-For', request.client.host)}"

        is_allowed, remaining = await cache.check_rate_limit(
            identifier=identifier,
            endpoint=endpoint,
            limit=limit_per_minute,
            window=60   # 60 giây
        )

        if not is_allowed:
            raise HTTPException(
                status_code=status.HTTP_429_TOO_MANY_REQUESTS,
                detail="Quá nhiều yêu cầu. Vui lòng thử lại sau.",
                headers={
                    "Retry-After": "60",
                    "X-RateLimit-Limit": str(limit_per_minute),
                    "X-RateLimit-Remaining": "0"
                }
            )
        return remaining

    return rate_limiter


# ── Sử dụng trong routers ─────────────────────────────────────────────────
# Mỗi endpoint có giới hạn khác nhau
symptom_rate_limit   = create_rate_limiter("symptom",   settings.RATE_LIMIT_SYMPTOM)    # 10/phút
chatbot_rate_limit   = create_rate_limiter("chatbot",   settings.RATE_LIMIT_CHATBOT)    # 20/phút
recommend_rate_limit = create_rate_limiter("recommend", settings.RATE_LIMIT_RECOMMEND)  # 30/phút
