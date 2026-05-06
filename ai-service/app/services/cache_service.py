import redis.asyncio as aioredis
import time
from typing import Optional

from app.core.config import settings
from app.core.logger import logger


class CacheService:
    """Async Redis wrapper cho AI Service"""

    def __init__(self):
        self.client: Optional[aioredis.Redis] = None

    async def connect(self):
        try:
            self.client = aioredis.Redis(
                host=settings.REDIS_HOST,
                port=settings.REDIS_PORT,
                password=settings.REDIS_PASSWORD or None,
                db=settings.REDIS_DB,
                decode_responses=True,
                socket_connect_timeout=5
            )
            await self.client.ping()
            logger.info("Redis connected", db=settings.REDIS_DB)
        except Exception as e:
            logger.warning("Redis connection failed, cache disabled", error=str(e))
            self.client = None

    async def disconnect(self):
        if self.client:
            await self.client.aclose()

    async def get(self, key: str) -> Optional[str]:
        if not self.client:
            return None
        try:
            return await self.client.get(key)
        except Exception as e:
            logger.warning("Redis GET failed", key=key, error=str(e))
            return None

    async def set(self, key: str, value: str, ttl: int = 3600):
        if not self.client:
            return
        try:
            await self.client.setex(key, ttl, value)
        except Exception as e:
            logger.warning("Redis SET failed", key=key, error=str(e))

    async def delete(self, key: str):
        if not self.client:
            return
        try:
            await self.client.delete(key)
        except Exception as e:
            logger.warning("Redis DELETE failed", key=key, error=str(e))

    # ── Rate Limiting (Sliding Window Algorithm) ──────────────────────────
    async def check_rate_limit(
        self,
        identifier: str,   # "user:{user_id}" hoặc "ip:{ip_address}"
        endpoint:   str,   # "symptom", "chatbot", "recommend"
        limit:      int,   # Số request tối đa
        window:     int    # Cửa sổ thời gian (giây)
    ) -> tuple[bool, int]:
        """
        Sliding window rate limiter bằng Redis sorted set.
        Returns: (is_allowed: bool, remaining: int)
        """
        if not self.client:
            return True, limit  # Không có Redis -> cho phép hết

        key = f"ratelimit:{endpoint}:{identifier}"
        now = time.time()
        window_start = now - window

        pipe = self.client.pipeline()
        # 1. Xoá các entries cũ hơn cửa sổ
        pipe.zremrangebyscore(key, 0, window_start)
        # 2. Đếm số requests trong cửa sổ hiện tại
        pipe.zcard(key)
        # 3. Thêm request hiện tại
        pipe.zadd(key, {str(now): now})
        # 4. Set TTL
        pipe.expire(key, window)

        results = await pipe.execute()
        current_count = results[1]
        is_allowed = current_count < limit
        remaining  = max(0, limit - current_count - 1)

        if not is_allowed:
            logger.warning(
                "Rate limit exceeded",
                endpoint=endpoint,
                identifier=identifier,
                limit=limit
            )

        return is_allowed, remaining
