from openai import AsyncOpenAI
from typing import AsyncGenerator
import json
import asyncio

from app.core.config import settings
from app.core.logger import logger


# System prompt được thiết kế kỹ để GPT hoạt động đúng vai trò
MEDICAL_SYSTEM_PROMPT = """
Bạn là trợ lý tư vấn sức khỏe của hệ thống Smart Healthcare Booking (Việt Nam).

VAI TRÒ CỦA BẠN:
- Trả lời câu hỏi về triệu chứng, bệnh lý, thuốc và chăm sóc sức khỏe
- Gợi ý người dùng nên khám chuyên khoa nào
- Hướng dẫn khi nào cần đi khám khẩn cấp
- Giải thích các thông tin y tế bằng ngôn ngữ dễ hiểu

ĐIỀU BẠN LUÔN LÀM:
- Trả lời bằng tiếng Việt, ngắn gọn, dễ hiểu
- Kết thúc bằng khuyến nghị đặt lịch khám nếu phù hợp
- Thêm disclaimer khi cần: "Đây là tư vấn tham khảo, không thay thế ý kiến bác sĩ"

ĐIỀU BẠN KHÔNG LÀM:
- Không đưa ra chẩn đoán chính xác (chỉ bác sĩ mới làm được)
- Không kê đơn thuốc cụ thể
- Không trả lời câu hỏi ngoài chủ đề y tế/sức khỏe
- Không nói chuyện về chính trị, tôn giáo, giải trí

Nếu câu hỏi không liên quan đến y tế: "Xin lỗi, tôi chỉ có thể tư vấn về sức khỏe. Bạn có câu hỏi gì về triệu chứng hoặc cần tìm bác sĩ không?"

Thông tin về hệ thống:
- Website: healthcare.vn
- Hotline: 1900-xxxx
- Đặt lịch: Vào mục "Đặt lịch" trên app
"""


class ConversationMessage:
    def __init__(self, role: str, content: str):
        self.role    = role     # "user" | "assistant" | "system"
        self.content = content


class ChatbotService:
    def __init__(self):
        self.client = AsyncOpenAI(api_key=settings.OPENAI_API_KEY)
        self.max_history = 10    # Giữ tối đa 10 tin nhắn gần nhất (tiết kiệm tokens)

    # ── Non-streaming: POST /ai/chat ─────────────────────────────────────
    async def chat(
        self,
        user_message: str,
        conversation_history: list[dict],
        patient_context: dict | None = None
    ) -> str:
        messages = self._build_messages(user_message, conversation_history, patient_context)
        try:
            response = await self.client.chat.completions.create(
                model       = settings.OPENAI_MODEL,
                messages    = messages,
                max_tokens  = settings.OPENAI_MAX_TOKENS,
                temperature = settings.OPENAI_TEMPERATURE,
                timeout     = 30.0
            )
            return response.choices[0].message.content
        except Exception as e:
            logger.error("OpenAI chat failed", error=str(e))
            return "Xin lỗi, tôi đang gặp sự cố. Vui lòng thử lại sau hoặc gọi hotline 1900-xxxx."

    # ── Streaming: WebSocket /ai/ws/chat ─────────────────────────────────
    async def chat_stream(
        self,
        user_message: str,
        conversation_history: list[dict],
        patient_context: dict | None = None
    ) -> AsyncGenerator[str, None]:
        """Generator trả về từng chunk text (streaming response)"""
        messages = self._build_messages(user_message, conversation_history, patient_context)
        try:
            stream = await self.client.chat.completions.create(
                model       = settings.OPENAI_MODEL,
                messages    = messages,
                max_tokens  = settings.OPENAI_MAX_TOKENS,
                temperature = settings.OPENAI_TEMPERATURE,
                stream      = True    # ← Enable streaming
            )
            async for chunk in stream:
                delta = chunk.choices[0].delta
                if delta.content:
                    yield delta.content    # Yield từng token/word ngay khi có
        except Exception as e:
            logger.error("OpenAI stream failed", error=str(e))
            yield "Xin lỗi, đã có lỗi xảy ra. Vui lòng thử lại."

    def _build_messages(
        self,
        user_message: str,
        history: list[dict],
        context: dict | None
    ) -> list[dict]:
        """Xây dựng message list gửi cho GPT"""
        messages = [{"role": "system", "content": MEDICAL_SYSTEM_PROMPT}]

        # Thêm patient context nếu user đã đăng nhập
        if context:
            ctx_msg = f"""
Thông tin bệnh nhân hiện tại:
- Tên: {context.get('name', 'Không có')}
- Giới tính: {context.get('gender', 'Không có')}
- Tuổi: {context.get('age', 'Không có')}
- Bệnh mãn tính: {', '.join(context.get('chronicDiseases', [])) or 'Không có'}
- Dị ứng: {', '.join(context.get('allergies', [])) or 'Không có'}
"""
            messages.append({"role": "system", "content": ctx_msg})

        # Thêm lịch sử hội thoại (giới hạn max_history tin nhắn)
        recent_history = (
            history[-self.max_history:]
            if len(history) > self.max_history
            else history
        )
        messages.extend(recent_history)

        # Thêm tin nhắn hiện tại
        messages.append({"role": "user", "content": user_message})

        return messages
