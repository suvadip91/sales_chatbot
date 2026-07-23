import os

import httpx
from fastapi import FastAPI, HTTPException
from pydantic import BaseModel
from dotenv import load_dotenv

load_dotenv()

app = FastAPI(title="Sales Roleplay Bot API")

HF_API_URL = "https://router.huggingface.co/v1/chat/completions"
HF_MODEL = os.getenv("HF_MODEL")


class GenerateRequest(BaseModel):
    prompt: str


class GenerateResponse(BaseModel):
    response: str


@app.get("/health")
def health() -> dict[str, str]:
    return {"status": "ok"}


@app.post("/generate", response_model=GenerateResponse)
async def generate(request: GenerateRequest) -> GenerateResponse:
    token = os.getenv("HF_TOKEN")
    if not token:
        raise HTTPException(status_code=503, detail="HF_TOKEN is not configured")

    headers = {"Authorization": f"Bearer {token}"}
    payload = {
                "model": HF_MODEL,
                "messages": [{"role": "user", "content": request.prompt}],
              }

    try:
        async with httpx.AsyncClient(timeout=60) as client:
            result = await client.post(
                HF_API_URL, headers=headers, json=payload
            )
    except httpx.RequestError as error:
        print(error)
        raise HTTPException(status_code=502, detail="HuggingFace request failed") from error

    if result.status_code >= 400:
        detail = result.text[:500] or "HuggingFace returned an error"
        raise HTTPException(status_code=502, detail=detail)

    data = result.json()

    return GenerateResponse(response=data["choices"][0]["message"]["content"])
