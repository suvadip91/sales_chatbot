from fastapi import APIRouter, HTTPException

from app.models.request_models import GenerateRequest, ResetRequest
from app.models.response_models import GenerateResponse
from app.services.ai_service import AIService
from app.services.config_service import ConfigService
from app.services.conversation_service import conversation_service

router = APIRouter()

config_service = ConfigService()
ai_service = AIService()


@router.get("/health")
def health() -> dict[str, str]:
    return {"status": "ok"}


@router.post("/generate", response_model=GenerateResponse)
async def generate(request: GenerateRequest) -> GenerateResponse:
    config = config_service.load_config(request.config_name, request.config)
    history = conversation_service.get_or_create_history(request.customer_id)

    try:
        bot_response = await ai_service.generate_response(request.prompt, config, history, request.customer_id)
    except Exception as error:
        raise HTTPException(status_code=502, detail=str(error)) from error

    conversation_service.append_turn(request.customer_id, "user", request.prompt)
    conversation_service.append_turn(request.customer_id, "assistant", bot_response)
    return GenerateResponse(response=bot_response)


@router.post("/reset")
def reset(request: ResetRequest) -> dict[str, str]:
    conversation_service.reset(request.customer_id)
    return {"status": "history cleared"}


@router.get("/history")
def history(customer_id: str | None = None) -> dict[str, list[dict[str, str]]]:
    return {"conversation_history": conversation_service.get_history(customer_id)}
