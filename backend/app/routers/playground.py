from typing import Optional

from fastapi import APIRouter, Depends, HTTPException, status
from pydantic import BaseModel
from sqlalchemy.orm import Session

from app.database import get_db
from app.models import PlaygroundRun, Prompt
from app.core.deps import get_current_user
from app.services.gemini_service import ask_gemini, GeminiServiceError

router = APIRouter()


# -----------------------------
# Request & Response Schemas
# -----------------------------
class PlaygroundRunRequest(BaseModel):
    prompt_text: str
    model_id: str = "gemini-2.0-flash"
    prompt_id: Optional[int] = None


class PlaygroundRunResponse(BaseModel):
    id: int
    prompt_id: Optional[int]
    prompt_text: str
    model_id: str
    output_text: str
    input_tokens: Optional[int]
    output_tokens: Optional[int]
    total_tokens: Optional[int]
    latency_ms: int

    class Config:
        from_attributes = True


# -----------------------------
# Playground Endpoint
# -----------------------------
@router.post(
    "/run",
    response_model=PlaygroundRunResponse,
    status_code=status.HTTP_201_CREATED,
)
def run_playground_prompt(
    payload: PlaygroundRunRequest,
    db: Session = Depends(get_db),
    current_user=Depends(get_current_user),
):
    """
    Executes a prompt using the Gemini API,
    stores the execution details in the database,
    and returns the generated response.
    """

    # Validate prompt_id (if provided)
    if payload.prompt_id is not None:
        existing_prompt = (
            db.query(Prompt)
            .filter(Prompt.id == payload.prompt_id)
            .first()
        )

        if existing_prompt is None:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail=f"Prompt with ID {payload.prompt_id} not found.",
            )

    # Call Gemini
    try:
        gemini_result = ask_gemini(
            prompt_text=payload.prompt_text,
            model_id=payload.model_id,
        )
    except GeminiServiceError as e:
        raise HTTPException(
            status_code=status.HTTP_502_BAD_GATEWAY,
            detail=str(e),
        )

    # Save execution
    new_run = PlaygroundRun(
        prompt_id=payload.prompt_id,
        user_id=current_user.id,
        prompt_text=payload.prompt_text,
        model_id=payload.model_id,
        output_text=gemini_result["text"],
        input_tokens=gemini_result.get("input_tokens"),
        output_tokens=gemini_result.get("output_tokens"),
        total_tokens=gemini_result.get("total_tokens"),
        latency_ms=gemini_result.get("response_time_ms", 0),
    )

    db.add(new_run)
    db.commit()
    db.refresh(new_run)

    return new_run