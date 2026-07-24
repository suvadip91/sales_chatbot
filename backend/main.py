import os

import httpx
from fastapi import FastAPI, HTTPException
from pydantic import BaseModel
from dotenv import load_dotenv
from langchain_groq import ChatGroq

load_dotenv()



app = FastAPI(title="Sales Roleplay Bot API")

HF_API_URL = "https://router.huggingface.co/v1/chat/completions"
HF_MODEL = os.getenv("HF_MODEL")
GROQ_API_KEY = os.getenv("GROQ_API_KEY")

llm = ChatGroq(
    model=HF_MODEL,  # free tier model on Groq
    groq_api_key=GROQ_API_KEY,  # or set GROQ_API_KEY env var
    temperature=0.7
)

class GenerateRequest(BaseModel):
    prompt: str


class GenerateResponse(BaseModel):
    response: str


@app.get("/health")
def health() -> dict[str, str]:
    return {"status": "ok"}


@app.post("/generate", response_model=GenerateResponse)
async def generate(request: GenerateRequest) -> GenerateResponse:
    try:
        result = await llm.ainvoke(request.prompt)
    except Exception as error:
        print(error)
        raise HTTPException(status_code=502, detail="GROQ request failed") from error

    data = result.content
    return GenerateResponse(response=data)
