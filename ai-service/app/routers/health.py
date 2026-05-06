from fastapi import APIRouter, Request
from fastapi.responses import ORJSONResponse

router = APIRouter()


@router.get(
    "/health",
    summary="Health check (liveness probe)",
    tags=["Health"]
)
async def health_check(request: Request):
    """
    Health check endpoint cho Kubernetes liveness probe và Docker HEALTHCHECK.
    Kiểm tra trạng thái của AI Service và các dependencies.
    """
    # Kiểm tra symptom analyzer
    analyzer = getattr(request.app.state, "symptom_analyzer", None)
    model_loaded = analyzer is not None and analyzer.preprocessor is not None

    # Kiểm tra Redis
    cache = getattr(request.app.state, "cache", None)
    redis_connected = cache is not None and cache.client is not None

    status = "healthy" if model_loaded else "degraded"

    return ORJSONResponse(
        status_code=200,
        content={
            "status":          status,
            "service":         "ai-service",
            "version":         "1.0.0",
            "model_loaded":    model_loaded,
            "redis_connected": redis_connected,
        }
    )
