import asyncio
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
from app.kafka.ai_request_consumer import get_ai_consumer

logger = structlog.get_logger()


@asynccontextmanager
async def lifespan(app: FastAPI):
    logger.info("🚀 AI Service starting up...")

    # Load ML models
    app.state.symptom_analyzer = SymptomAnalyzer()
    await app.state.symptom_analyzer.load_model()
    logger.info("✅ Symptom classifier loaded", model_type=settings.MODEL_TYPE)

    app.state.recommender = DoctorRecommender()
    await app.state.recommender.load_model()
    logger.info("✅ Doctor recommender loaded")

    app.state.cache = CacheService()
    await app.state.cache.connect()
    logger.info("✅ Redis cache connected", host=settings.REDIS_HOST)

    # Khởi động Kafka consumer bất đồng bộ (chạy song song với FastAPI)
    ai_consumer = get_ai_consumer()
    await ai_consumer.start()
    consumer_task = asyncio.create_task(ai_consumer.run())
    logger.info("✅ Kafka AI consumer started", topic="ai-request-topic")

    logger.info("🎉 AI Service ready", port=8000)
    yield  # Application runs here

    # Shutdown: dừng consumer trước, rồi cleanup
    logger.info("🛑 AI Service shutting down...")
    await ai_consumer.stop()
    consumer_task.cancel()
    try:
        await consumer_task
    except asyncio.CancelledError:
        pass
    await app.state.cache.disconnect()


app = FastAPI(
    title="Smart Healthcare AI Service",
    description="AI-powered symptom analysis, doctor recommendation & medical chatbot",
    version="1.0.0",
    docs_url="/ai/docs",
    redoc_url="/ai/redoc",
    openapi_url="/ai/openapi.json",
    default_response_class=ORJSONResponse,
    lifespan=lifespan,
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=settings.ALLOWED_ORIGINS,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


@app.middleware("http")
async def add_request_id(request: Request, call_next):
    import uuid
    request_id = request.headers.get("X-Request-ID", str(uuid.uuid4()))
    structlog.contextvars.bind_contextvars(request_id=request_id)
    response = await call_next(request)
    response.headers["X-Request-ID"] = request_id
    return response


register_exception_handlers(app)

app.include_router(health.router,    prefix="/ai", tags=["Health"])
app.include_router(symptom.router,   prefix="/ai", tags=["Symptom Checker"])
app.include_router(recommend.router, prefix="/ai", tags=["Recommendation"])
app.include_router(chatbot.router,   prefix="/ai", tags=["Chatbot"])
