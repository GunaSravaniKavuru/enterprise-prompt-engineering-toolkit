from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from pydantic import BaseModel
from typing import List, Dict, Any, Optional
import time

from app.database import get_db
from app.models import ComparisonRun, Prompt, User
from app.core.deps import get_current_user
from app.services.gemini_service import ask_gemini

router = APIRouter(prefix="", tags=["Comparison"])

class ComparisonRequest(BaseModel):
    prompt_id: Optional[int] = None
    prompt_text: str
    models: List[str]
    system_instruction: Optional[str] = None
    temperature: Optional[float] = 0.7

@router.post("/side-by-side", status_code=status.HTTP_200_OK)
def run_side_by_side_comparison(
    request: ComparisonRequest,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
) -> Dict[str, Any]:
    if not request.models or len(request.models) < 2:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Comparison requires selecting at least two models."
        )

    comparison_results = []
    
    for model_name in request.models:
        start_time = time.time()
        try:
            raw_response = ask_gemini(
                prompt=request.prompt_text,
                model_name=model_name,
                system_instruction=request.system_instruction,
                temperature=request.temperature
            )
            elapsed_time_ms = int((time.time() - start_time) * 1000)
            
            output_text = raw_response.get("text", "")
            estimated_tokens = len(request.prompt_text.split()) + len(output_text.split())

            comparison_results.append({
                "model": model_name,
                "output": output_text,
                "latency_ms": elapsed_time_ms,
                "tokens": estimated_tokens,
                "status": "success"
            })
        except Exception as e:
            elapsed_time_ms = int((time.time() - start_time) * 1000)
            comparison_results.append({
                "model": model_name,
                "output": f"Error: {str(e)}",
                "latency_ms": elapsed_time_ms,
                "tokens": 0,
                "status": "error"
            })

    run_record = ComparisonRun(
        prompt_id=request.prompt_id,
        models_used=request.models,
        results=comparison_results,
        created_by=current_user.id
    )
    db.add(run_record)
    db.commit()
    db.refresh(run_record)

    return {
        "comparison_id": run_record.id,
        "prompt_id": request.prompt_id,
        "results": comparison_results
    }