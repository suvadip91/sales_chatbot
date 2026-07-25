from typing import Optional

import httpx
from app.core.constants import HF_API_URL
from app.core.prompts import build_prompt
from app.core.settings import HF_MODEL, HF_TOKEN, GROQ_API_KEY

try:
    from langchain_groq import ChatGroq
except ImportError:  # pragma: no cover - depends on optional runtime dependency
    ChatGroq = None


class AIService:
    def __init__(self) -> None:
        self.llm: Optional[object] = None

    def get_llm(self):
        if self.llm is not None:
            return self.llm
        if not GROQ_API_KEY or ChatGroq is None:
            return None

        try:
            self.llm = ChatGroq(model=HF_MODEL, api_key=GROQ_API_KEY, temperature=0.7)
            return self.llm
        except Exception as exc:
            raise ImportError(f"Could not instantiate ChatGroq: {exc}") from exc

    async def generate_response(self, prompt: str, config: dict, history: list[dict[str, str]], customer_id: str | None = None) -> str:
        template = build_prompt(config)
        if GROQ_API_KEY:
            llm = self.get_llm()
            if llm:
                conversation_prompt = "\n".join(f"{item['role']}: {item['content']}" for item in history)
                roleplay_prompt = template
                if conversation_prompt:
                    roleplay_prompt += "\n" + conversation_prompt
                roleplay_prompt += f"\nSales Rep: {prompt}"

                try:
                    result = await llm.ainvoke(roleplay_prompt)
                    return result.content
                except Exception as error:
                    raise RuntimeError("GROQ request failed") from error

        if not HF_TOKEN or not HF_MODEL:
            raise RuntimeError("No LLM configured (set GROQ_API_KEY or HF_TOKEN+HF_MODEL)")

        headers = {"Authorization": f"Bearer {HF_TOKEN}"}
        payload = {
            "model": HF_MODEL,
            "messages": [{"role": "system", "content": template}],
        }
        payload["messages"].extend(history)
        payload["messages"].append({"role": "user", "content": prompt})

        try:
            async with httpx.AsyncClient(timeout=60) as client:
                result = await client.post(HF_API_URL, headers=headers, json=payload)
        except httpx.RequestError as error:
            raise RuntimeError("HuggingFace request failed") from error

        if result.status_code >= 400:
            detail = result.text[:500] or "HuggingFace returned an error"
            raise RuntimeError(detail)

        data = result.json()
        return data["choices"][0]["message"]["content"]
