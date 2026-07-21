from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session

from app.database import get_db
from app.models import Evaluation
from app.schemas import EvaluationCreate, EvaluationResponse
from app.services.evaluator_service import evaluate_prompt
from app.services.gemini_service import GeminiServiceError

router = APIRouter(tags=["Prompt Evaluator"])


@router.post("/", response_model=EvaluationResponse)
def evaluate(
    request: EvaluationCreate,
    db: Session = Depends(get_db),
):
    try:
        result = evaluate_prompt(request.content)

        evaluation = Evaluation(
            prompt_id=request.prompt_id,
            overall_score=result["overall_score"],
            metrics=result["metrics"],
            suggestions=result["suggestions"],
            created_by=1,
        )

        db.add(evaluation)
        db.commit()
        db.refresh(evaluation)

        return evaluation

    except GeminiServiceError as e:
        print("\n===== GEMINI ERROR =====")
        print(e)
        print("========================\n")
        raise HTTPException(status_code=502, detail=str(e))

    except ValueError as e:
        raise HTTPException(status_code=400, detail=str(e))

    except Exception as e:
        import traceback
        traceback.print_exc()
        raise HTTPException(
            status_code=500,
            detail="Unexpected error while evaluating prompt.",
        )