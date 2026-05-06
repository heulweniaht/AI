import pytest
from unittest.mock import AsyncMock, MagicMock, patch


@pytest.mark.asyncio
async def test_chat_returns_string():
    """Test: chat() trả về string (mock OpenAI)"""
    with patch("app.services.chatbot_service.AsyncOpenAI") as mock_openai:
        # Setup mock
        mock_client = MagicMock()
        mock_openai.return_value = mock_client

        mock_response = MagicMock()
        mock_response.choices[0].message.content = "Bạn nên đi khám bác sĩ."
        mock_client.chat.completions.create = AsyncMock(return_value=mock_response)

        from app.services.chatbot_service import ChatbotService
        service = ChatbotService()
        service.client = mock_client

        result = await service.chat(
            user_message="Tôi bị đau đầu",
            conversation_history=[]
        )

        assert isinstance(result, str)
        assert len(result) > 0


def test_build_messages_includes_system_prompt():
    """Test: _build_messages() luôn có system prompt đầu tiên"""
    with patch("app.services.chatbot_service.AsyncOpenAI"):
        from app.services.chatbot_service import ChatbotService, MEDICAL_SYSTEM_PROMPT

        service = ChatbotService()
        messages = service._build_messages(
            user_message="Test",
            history=[],
            context=None
        )

        assert messages[0]["role"] == "system"
        assert MEDICAL_SYSTEM_PROMPT in messages[0]["content"]


def test_build_messages_with_patient_context():
    """Test: context bệnh nhân được thêm vào messages"""
    with patch("app.services.chatbot_service.AsyncOpenAI"):
        from app.services.chatbot_service import ChatbotService

        service = ChatbotService()
        context = {"name": "Nguyễn Văn A", "age": 35, "gender": "Nam"}
        messages = service._build_messages(
            user_message="Test",
            history=[],
            context=context
        )

        # Phải có 2 system messages (system prompt + context)
        system_messages = [m for m in messages if m["role"] == "system"]
        assert len(system_messages) >= 2
        assert "Nguyễn Văn A" in system_messages[1]["content"]
