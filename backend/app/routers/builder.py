from fastapi import APIRouter, Depends
from pydantic import BaseModel
from typing import Optional, List

from app.models import User
from app.core.deps import get_current_user
from app.services.builder_service import generate_prompt

router = APIRouter(tags=["builder"])


class BuilderRequest(BaseModel):
    role: Optional[str] = None
    domain: Optional[str] = None
    role_domain: Optional[str] = None
    experience_level: Optional[str] = None
    context: Optional[str] = None
    task: Optional[str] = None
    technique: Optional[str] = None
    examples: Optional[List[str]] = None
    rules: Optional[List[str]] = None
    output_format: Optional[str] = None
    output_constraints: Optional[str] = None
    max_words: Optional[int] = None


class BuilderResponse(BaseModel):
    generated_prompt: str


@router.post("/generate", response_model=BuilderResponse)
def generate(
    request: BuilderRequest,
    current_user: User = Depends(get_current_user),
):
    result = generate_prompt(request.model_dump(exclude_none=True))
    return BuilderResponse(generated_prompt=result["text"])