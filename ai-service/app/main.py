from contextlib import asynccontextmanager
from fastapi import FastAPI, Request
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import ORJSONResponse
import structlog

from app.core.config import settings
from app.core.exceptions import register_exception_handlers
from app.routers import symptom, recommend, chatbot, health
from app.services.symptom_analyzer import SymptomAnalyzer
from app.services.doctor_recommender import DoctorRecommender
from app.services.cache_service import CacheService

logger = structlog.get_logger()


# ── Lifespan: Load models khi startup, cleanup khi shutdown ───────────────
@asynccontextmanager
async def lifespan(app: FastAPI):
    logger.info("🚀 AI Service starting up...")

    # Load ML models vào memory (tốn RAM nhưng inference nhanh)
    app.state.symptom_analyzer = SymptomAnalyzer()
    await app.state.symptom_analyzer.load_model()
    logger.info("✅ Symptom classifier loaded", model_type=settings.MODEL_TYPE)

    app.state.recommender = DoctorRecommender()
    await app.state.recommender.load_model()
    logger.info("✅ Doctor recommender loaded")

    app.state.cache = CacheService()
    await app.state.cache.connect()
    logger.info("✅ Redis cache connected", host=settings.REDIS_HOST)

    logger.info("🎉 AI Service ready", port=8000)
    yield  # Application runs here

    # Shutdown: cleanup
    logger.info("🛑 AI Service shutting down...")
    await app.state.cache.disconnect()


# ── FastAPI App ────────────────────────────────────────────────────────────
app = FastAPI(
    title="Smart Healthcare AI Service",
    description="AI-powered symptom analysis, doctor recommendation & medical chatbot",
    version="1.0.0",
    docs_url="/ai/docs",
    redoc_url="/ai/redoc",
    openapi_url="/ai/openapi.json",
    default_response_class=ORJSONResponse,  # Nhanh hơn JSONResponse
    lifespan=lifespan,
)

# ── CORS ──────────────────────────────────────────────────────────────────
app.add_middleware(
    CORSMiddleware,
    allow_origins=settings.ALLOWED_ORIGINS,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


# ── Request ID Middleware (tracing) ───────────────────────────────────────
@app.middleware("http")
async def add_request_id(request: Request, call_next):
    import uuid
    request_id = request.headers.get("X-Request-ID", str(uuid.uuid4()))
    structlog.contextvars.bind_contextvars(request_id=request_id)
    response = await call_next(request)
    response.headers["X-Request-ID"] = request_id
    return response


# ── Register exception handlers ───────────────────────────────────────────
register_exception_handlers(app)

# ── Include routers ───────────────────────────────────────────────────────
app.include_router(health.router,    prefix="/ai",  tags=["Health"])
app.include_router(symptom.router,   prefix="/ai",  tags=["Symptom Checker"])
app.include_router(recommend.router, prefix="/ai",  tags=["Recommendation"])
app.include_router(chatbot.router,   prefix="/ai",  tags=["Chatbot"])
