from pydantic_settings import BaseSettings
from pydantic import field_validator
from typing import List
from functools import lru_cache


class Settings(BaseSettings):
    # ── App ───────────────────────────────────────────────────────────────
    APP_NAME: str = "Healthcare AI Service"
    APP_ENV:  str = "development"       # development | production
    DEBUG:    bool = False

    # ── Model Selection ───────────────────────────────────────────────────
    # "sklearn" = nhanh, nhẹ | "phobert" = chính xác hơn nhưng cần GPU
    MODEL_TYPE: str = "sklearn"
    MODEL_DIR:  str = "app/models"
    PHOBERT_MODEL_NAME: str = "vinai/phobert-base-v2"

    # ── OpenAI ────────────────────────────────────────────────────────────
    OPENAI_API_KEY:     str = ""
    OPENAI_MODEL:       str = "gpt-4o-mini"     # gpt-4o-mini tiết kiệm chi phí hơn
    OPENAI_MAX_TOKENS:  int = 800
    OPENAI_TEMPERATURE: float = 0.3             # Thấp = deterministic, phù hợp y tế

    # ── Redis ─────────────────────────────────────────────────────────────
    REDIS_HOST:     str = "localhost"
    REDIS_PORT:     int = 6379
    REDIS_PASSWORD: str = ""
    REDIS_DB:       int = 2                     # DB 2 riêng cho AI service
    CACHE_TTL_SYMPTOM:  int = 3600              # 1 giờ cache kết quả phân tích
    CACHE_TTL_RECOMMEND: int = 1800             # 30 phút cache recommendation

    # ── JWT (verify token từ Spring Auth Service) ─────────────────────────
    JWT_SECRET: str = ""
    JWT_ALGORITHM: str = "HS256"

    # ── Spring Services (gọi qua internal network) ────────────────────────
    DOCTOR_SERVICE_URL:      str = "http://doctor-service:8083"
    APPOINTMENT_SERVICE_URL: str = "http://appointment-service:8084"
    USER_SERVICE_URL:        str = "http://user-service:8082"

    # ── Database (PostgreSQL cho AI data) ─────────────────────────────────
    DATABASE_URL: str = "postgresql+asyncpg://ai_user:pass@localhost:5432/ai_db"

    # ── Kafka ─────────────────────────────────────────────────────────────
    KAFKA_BOOTSTRAP_SERVERS: str = "localhost:9092"

    # ── CORS ──────────────────────────────────────────────────────────────
    ALLOWED_ORIGINS: List[str] = ["http://localhost:3000"]

    # ── Rate Limiting ─────────────────────────────────────────────────────
    RATE_LIMIT_SYMPTOM:  int = 10    # 10 req/phút/user
    RATE_LIMIT_CHATBOT:  int = 20    # 20 messages/phút/user
    RATE_LIMIT_RECOMMEND: int = 30   # 30 req/phút/user

    # ── Confidence Thresholds ─────────────────────────────────────────────
    MIN_CONFIDENCE_THRESHOLD: float = 0.15   # Dưới ngưỡng này -> không hiển thị
    URGENT_SEVERITY_THRESHOLD: int = 8       # severity >= 8 -> cảnh báo khẩn

    @field_validator("OPENAI_API_KEY")
    @classmethod
    def validate_openai_key(cls, v):
        if v and not v.startswith("sk-"):
            raise ValueError("OpenAI API key phải bắt đầu bằng 'sk-'")
        return v

    class Config:
        env_file = ".env"
        case_sensitive = True


@lru_cache()         # Singleton pattern - load settings một lần
def get_settings() -> Settings:
    return Settings()


settings = get_settings()
