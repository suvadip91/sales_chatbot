from typing import Optional

from pydantic import BaseModel


class GenerateRequest(BaseModel):
    prompt: str
    customer_id: Optional[str] = None
    config_name: Optional[str] = None
    config: Optional[dict] = None


class ResetRequest(BaseModel):
    customer_id: Optional[str] = None
