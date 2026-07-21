from typing import Optional
from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session

from app.database import get_db
from app.models import PlaygroundRun, Prompt
from app.schemas import PlaygroundRunResponse
from app.core.deps import get_current_user
from app.services.gemini_service import ask_gemini, GeminiServiceError

router = APIRouter(tags=["playground"])


class PlaygroundRunRequest:
    """Kept as a plain reference — actual validation model below."""
    pass


from pydantic import BaseModel

class PlaygroundRunCreate(BaseModel):
    prompt_id: Optional[int] = None
    model_used: str = "gemini:2.5-flash"
    input_text: str


@router.post("/run", response_model=PlaygroundRunResponse, status_code=status.HTTP_201_CREATED)
def run_playground_prompt(
    payload: PlaygroundRunCreate,
    db: Session = Depends(get_db),
    current_user=Depends(get_current_user),
):
    """
    Executes a prompt using the Gemini API, stores the run, and returns the result.
    """
    if payload.prompt_id is not None:
        existing_prompt = db.query(Prompt).filter(Prompt.id == payload.prompt_id).first()
        if existing_prompt is None:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail=f"Prompt with ID {payload.prompt_id} not found.",
            )

    try:
        gemini_result = ask_gemini(payload.input_text, model_id=payload.model_used)
    except GeminiServiceError as e:
        raise HTTPException(status_code=status.HTTP_502_BAD_GATEWAY, detail=str(e))

    new_run = PlaygroundRun(
        prompt_id=payload.prompt_id,
        model_used=payload.model_used,
        input_text=payload.input_text,
        output_text=gemini_result["text"],
        latency_ms=gemini_result.get("response_time_ms"),
        tokens=gemini_result.get("total_tokens"),
        created_by=current_user.id,
    )

    db.add(new_run)
    db.commit()
    db.refresh(new_run)

    return new_run