from fastapi import FastAPI, Request
from fastapi.responses import ORJSONResponse
import structlog

logger = structlog.get_logger()


def register_exception_handlers(app: FastAPI):
    """Đăng ký các custom exception handlers cho FastAPI app."""

    @app.exception_handler(ValueError)
    async def value_error_handler(request: Request, exc: ValueError):
        logger.warning("Validation error", path=request.url.path, error=str(exc))
        return ORJSONResponse(
            status_code=400,
            content={"detail": str(exc), "type": "validation_error"}
        )

    @app.exception_handler(Exception)
    async def generic_exception_handler(request: Request, exc: Exception):
        logger.error("Unhandled exception",
                     path=request.url.path,
                     method=request.method,
                     error=str(exc),
                     exc_info=True)
        return ORJSONResponse(
            status_code=500,
            content={
                "detail": "Lỗi hệ thống. Vui lòng thử lại sau.",
                "type": "internal_server_error"
            }
        )
