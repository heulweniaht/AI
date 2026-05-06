from fastapi import APIRouter, Depends, Request, WebSocket, WebSocketDisconnect
from fastapi.responses import StreamingResponse
import json

from app.schemas.chat_schema import ChatRequest, ChatResponse
from app.core.security import verify_token, TokenData
from app.services.chatbot_service import ChatbotService
from app.core.logger import logger

router = APIRouter()
chatbot_service = ChatbotService()   # Singleton


# ── REST endpoint (non-streaming) ─────────────────────────────────────────
@router.post(
    "/chat",
    response_model=ChatResponse,
    summary="Hỏi đáp y tế (REST)"
)
async def chat(
    request_body: ChatRequest,
    current_user: TokenData = Depends(verify_token)
):
    reply = await chatbot_service.chat(
        user_message         = request_body.message,
        conversation_history = request_body.history,
        patient_context      = request_body.patient_context
    )

    logger.info(
        "Chat served",
        user_id=current_user.user_id,
        message_len=len(request_body.message)
    )

    return ChatResponse(
        reply      = reply,
        role       = "assistant",
        session_id = request_body.session_id
    )


# ── Streaming endpoint (Server-Sent Events) ───────────────────────────────
@router.post(
    "/chat/stream",
    summary="Hỏi đáp y tế (Streaming SSE)"
)
async def chat_stream(
    request_body: ChatRequest,
    current_user: TokenData = Depends(verify_token)
):
    async def generate():
        async for chunk in chatbot_service.chat_stream(
            user_message         = request_body.message,
            conversation_history = request_body.history,
            patient_context      = request_body.patient_context
        ):
            # SSE format: "data: {chunk}\n\n"
            yield f"data: {json.dumps({'chunk': chunk})}\n\n"
        yield "data: [DONE]\n\n"

    return StreamingResponse(
        generate(),
        media_type="text/event-stream",
        headers={
            "Cache-Control": "no-cache",
            "X-Accel-Buffering": "no"
        }
    )


# ── WebSocket endpoint (Real-time bidirectional) ──────────────────────────
@router.websocket("/ws/chat")
async def websocket_chat(websocket: WebSocket):
    await websocket.accept()
    logger.info("WebSocket chat connected", client=str(websocket.client))

    conversation_history = []   # Lưu history trong WebSocket session

    try:
        while True:
            # Nhận message từ client
            raw = await websocket.receive_text()
            data = json.loads(raw)

            user_message    = data.get("message", "")
            patient_context = data.get("patientContext")

            if not user_message.strip():
                await websocket.send_text(json.dumps({"error": "Empty message"}))
                continue

            # Gửi từng chunk ngay khi GPT trả về (streaming)
            full_reply = ""
            async for chunk in chatbot_service.chat_stream(
                user_message         = user_message,
                conversation_history = conversation_history,
                patient_context      = patient_context
            ):
                full_reply += chunk
                await websocket.send_text(json.dumps({
                    "type":  "chunk",
                    "chunk": chunk
                }))

            # Gửi signal kết thúc
            await websocket.send_text(json.dumps({
                "type":  "done",
                "reply": full_reply
            }))

            # Cập nhật history
            conversation_history.append({"role": "user",      "content": user_message})
            conversation_history.append({"role": "assistant", "content": full_reply})

            # Giữ tối đa 20 tin nhắn
            if len(conversation_history) > 20:
                conversation_history = conversation_history[-20:]

    except WebSocketDisconnect:
        logger.info("WebSocket chat disconnected")
    except Exception as e:
        logger.error("WebSocket error", error=str(e))
        await websocket.close(code=1011)
