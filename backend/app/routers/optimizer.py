from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session

from app.database import get_db
from app.models import Optimization
from app.schemas import OptimizationCreate, OptimizationResponse
from app.services.optimizer_service import optimize_prompt

router = APIRouter(tags=["Prompt Optimizer"])


@router.post("/", response_model=OptimizationResponse)
def optimize(
    request: OptimizationCreate,
    db: Session = Depends(get_db),
):
    result = optimize_prompt(request.original_content)

    optimization = Optimization(
        prompt_id=request.prompt_id,
        original_content=result["original_content"],
        optimized_content=result["optimized_content"],
        summary=result["summary"],
        score_before=result["score_before"],
        score_after=result["score_after"],

        # Temporary value until authentication is connected
        created_by=1,
    )

    db.add(optimization)
    db.commit()
    db.refresh(optimization)

    return optimization