from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from typing import List

from app.database import get_db
from app.models import PromptVersion, User
from app.routers.auth import get_current_user
from app.services.gemini_service import ask_gemini, GeminiServiceError

router = APIRouter(prefix="", tags=["Comparison"])

@router.post("/side-by-side", status_code=status.HTTP_200_OK)
def compare_prompts_side_by_side(
    version_ids: List[int],
    test_input: str,
    model_id: str = "gemini:3.5-flash",
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    """
    Compares multiple prompt versions side-by-side by executing them 
    against the same test input using the shared ask_gemini function.
    """
    if len(version_ids) < 2:
        raise HTTPException(
            status_code=400, 
            detail="You must provide at least two version IDs for comparison."
        )
        
    results = []
    
    for v_id in version_ids:
        version = db.query(PromptVersion).filter(PromptVersion.id == v_id).first()
        if not version:
            raise HTTPException(
                status_code=404, 
                detail=f"Prompt version with ID {v_id} not found."
            )
            
        try:
            full_prompt = f"{version.system_prompt}\n\nInput:\n{test_input}"
            gemini_response = ask_gemini(prompt_text=full_prompt, model_id=model_id)
            
            results.append({
                "version_id": v_id,
                "version_number": version.version_number,
                "parent_prompt_id": version.prompt_id,
                "system_prompt": version.system_prompt,
                "model_output": gemini_response["text"],
                "metrics": {
                    "response_time_ms": gemini_response["response_time_ms"],
                    "input_tokens": gemini_response["input_tokens"],
                    "output_tokens": gemini_response["output_tokens"],
                    "total_tokens": gemini_response["total_tokens"]
                }
            })
        except GeminiServiceError as e:
            results.append({
                "version_id": v_id,
                "version_number": version.version_number,
                "error": str(e)
            })
            
    return {"comparison_results": results}