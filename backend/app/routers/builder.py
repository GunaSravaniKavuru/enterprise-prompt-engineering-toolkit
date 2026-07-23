from fastapi import APIRouter, Depends
from pydantic import BaseModel
from typing import Optional, List

from app.models import User
from app.core.deps import get_current_user
from app.services.builder_service import generate_prompt

router = APIRouter(tags=["builder"])


class BuilderExample(BaseModel):
    input: Optional[str] = None
    output: Optional[str] = None
class BuilderRequest(BaseModel):
    promptName: Optional[str] = None
    category: Optional[str] = None
    customDomain: Optional[str] = None
    taskType: Optional[str] = None
    customPurpose: Optional[str] = None
    technique: Optional[str] = None
    role: Optional[str] = None
    experienceLevel: Optional[str] = None
    domain: Optional[str] = None
    communicationStyle: Optional[str] = None
    context: Optional[str] = None
    taskDescription: Optional[str] = None
    outputFormat: Optional[str] = None
    customOutputFormat: Optional[str] = None
    maxWords: Optional[str] = None
    tone: Optional[str] = None
    language: Optional[str] = None
    customLanguage: Optional[str] = None
    positiveConstraints: Optional[str] = None
    negativeConstraints: Optional[str] = None
    examples: Optional[List[BuilderExample]] = None

class BuilderResponse(BaseModel):
      generated_prompt: str


@router.post("/generate", response_model=BuilderResponse)
@router.post("/generate/", response_model=BuilderResponse)
def generate(
    request: BuilderRequest,
    current_user: User = Depends(get_current_user),
):
    result = generate_prompt(request.model_dump(exclude_none=True))

    print("\n========== GEMINI GENERATED ==========")
    print(result["text"])
    print("======================================\n")

    return BuilderResponse(generated_prompt=result["text"])