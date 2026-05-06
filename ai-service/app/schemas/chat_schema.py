from pydantic import BaseModel, Field
from typing import List, Optional, Dict, Any


class ChatRequest(BaseModel):
    message:             str  = Field(
        description="Tin nhắn từ người dùng",
        min_length=1,
        max_length=2000
    )
    history:             List[Dict[str, str]] = Field(
        default=[],
        description="Lịch sử hội thoại [{role: 'user'|'assistant', content: '...'}]"
    )
    patient_context:     Optional[Dict[str, Any]] = Field(
        default=None,
        description="Thông tin bệnh nhân để cá nhân hóa (name, gender, age, ...)"
    )
    session_id:          Optional[str] = Field(
        default=None,
        description="Session ID để theo dõi cuộc hội thoại"
    )

    model_config = {
        "json_schema_extra": {
            "example": {
                "message": "Tôi bị đau đầu và sốt 38 độ, tôi nên làm gì?",
                "history": [],
                "patient_context": {
                    "name": "Nguyễn Văn A",
                    "gender": "Nam",
                    "age": 35
                },
                "session_id": "sess_abc123"
            }
        }
    }


class ChatResponse(BaseModel):
    reply:      str  = Field(description="Câu trả lời từ AI")
    role:       str  = Field(default="assistant", description="Vai trò người trả lời")
    session_id: Optional[str] = Field(default=None, description="Session ID")

    model_config = {
        "json_schema_extra": {
            "example": {
                "reply": "Triệu chứng sốt 38°C kèm đau đầu có thể do nhiều nguyên nhân...",
                "role": "assistant",
                "session_id": "sess_abc123"
            }
        }
    }
