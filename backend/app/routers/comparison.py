from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from pydantic import BaseModel
from typing import List, Dict, Any, Optional


from app.database import get_db
from app.models import ComparisonRun, User
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
        print("\n========== PROMPT SENT TO GEMINI ==========")
        print(request.prompt_text)
        print("===========================================\n")
        try:
            raw_response = ask_gemini(
    prompt_text=request.prompt_text,
    model_id=model_name,
)
         
            
           
            comparison_results.append({
    "model": raw_response["model"],
    "output": raw_response["text"],
    "latency_ms": raw_response["response_time_ms"],
    "input_tokens": raw_response["input_tokens"],
    "output_tokens": raw_response["output_tokens"],
    "total_tokens": raw_response["total_tokens"],
    "status": "success",
})
        except Exception as e:
            comparison_results.append({
        "model": model_name,
        "output": f"Error: {str(e)}",
        "latency_ms": 0,
        "input_tokens": 0,
        "output_tokens": 0,
        "total_tokens": 0,
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