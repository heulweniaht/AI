"""
Kafka Consumer: lắng nghe topic 'ai-request-topic'
Xử lý yêu cầu phân tích AI bất đồng bộ từ Backend-Service,
đẩy kết quả về 'ai-response-topic'.
"""
import json
import asyncio
from aiokafka import AIOKafkaConsumer, AIOKafkaProducer
import structlog

from app.core.config import settings
from app.services.chatbot_service import ChatbotService

logger = structlog.get_logger()

TOPIC_REQUEST  = "ai-request-topic"
TOPIC_RESPONSE = "ai-response-topic"
GROUP_ID       = "ai-service-group"


class AiRequestConsumer:
    def __init__(self):
        self.consumer = None
        self.producer = None
        self.chatbot  = ChatbotService()
        self._running = False

    async def start(self):
        self.consumer = AIOKafkaConsumer(
            TOPIC_REQUEST,
            bootstrap_servers=settings.KAFKA_BOOTSTRAP_SERVERS,
            group_id=GROUP_ID,
            auto_offset_reset="earliest",
            enable_auto_commit=False,          # Manual commit
            value_deserializer=lambda b: json.loads(b.decode("utf-8")),
        )
        self.producer = AIOKafkaProducer(
            bootstrap_servers=settings.KAFKA_BOOTSTRAP_SERVERS,
            value_serializer=lambda v: json.dumps(v).encode("utf-8"),
        )
        await self.consumer.start()
        await self.producer.start()
        self._running = True
        logger.info("[Kafka] AI consumer started", topic=TOPIC_REQUEST)

    async def stop(self):
        self._running = False
        if self.consumer:
            await self.consumer.stop()
        if self.producer:
            await self.producer.stop()
        logger.info("[Kafka] AI consumer stopped")

    async def run(self):
        """Vòng lặp chính — xử lý từng message từ ai-request-topic."""
        async for msg in self.consumer:
            if not self._running:
                break
            event = msg.value
            request_id = event.get("requestId", "unknown")
            user_id    = event.get("userId")
            question   = event.get("message", "")

            logger.info("[Kafka] Nhận AI request",
                        request_id=request_id, user_id=user_id)

            try:
                # Gọi ChatbotService xử lý (non-streaming cho async queue)
                reply = await self.chatbot.chat(
                    user_message=question,
                    conversation_history=event.get("history", []),
                    patient_context=event.get("patientContext"),
                )

                # Đẩy kết quả về ai-response-topic
                await self.producer.send(TOPIC_RESPONSE, value={
                    "requestId": request_id,
                    "userId":    user_id,
                    "status":    "SUCCESS",
                    "reply":     reply,
                })

                await self.consumer.commit()
                logger.info("[Kafka] AI response sent", request_id=request_id)

            except Exception as e:
                logger.error("[Kafka] Xử lý AI request thất bại",
                             request_id=request_id, error=str(e))
                # Gửi error response để frontend không bị treo
                await self.producer.send(TOPIC_RESPONSE, value={
                    "requestId": request_id,
                    "userId":    user_id,
                    "status":    "ERROR",
                    "reply":     "Xin lỗi, đã xảy ra lỗi khi xử lý yêu cầu. Vui lòng thử lại.",
                })
                await self.consumer.commit()


# Singleton
_consumer_instance: AiRequestConsumer | None = None


def get_ai_consumer() -> AiRequestConsumer:
    global _consumer_instance
    if _consumer_instance is None:
        _consumer_instance = AiRequestConsumer()
    return _consumer_instance
