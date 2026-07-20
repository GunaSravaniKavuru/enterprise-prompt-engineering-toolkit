from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from sqlalchemy import func
from typing import Dict, Any

from app.database import get_db
from app.models import PlaygroundRun, Prompt, User
from app.routers.auth import get_current_user

router = APIRouter(prefix="", tags=["Analytics"])

@router.get("/dashboard-stats", status_code=status.HTTP_200_OK)
def get_dashboard_analytics(
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
) -> Dict[str, Any]:
    """
    Computes global performance analytics from PlaygroundRun operational logs 
    and prompt assets to populate the monitoring dashboard.
    """
    try:
        total_prompts = db.query(func.count(Prompt.id)).scalar() or 0
        total_executions = db.query(func.count(PlaygroundRun.id)).scalar() or 0
        
        metrics_avg = db.query(
            func.avg(PlaygroundRun.latency_ms).label("avg_latency"),
            func.avg(PlaygroundRun.tokens).label("avg_tokens")
        ).first()
        
        model_distribution = db.query(
            PlaygroundRun.model_used, 
            func.count(PlaygroundRun.id).label("count")
        ).group_by(PlaygroundRun.model_used).all()
        
        model_breakdown = {model: count for model, count in model_distribution if model}

        return {
            "summary": {
                "total_managed_prompts": total_prompts,
                "total_playground_executions": total_executions,
            },
            "performance_averages": {
                "latency_ms": round(metrics_avg.avg_latency or 0.0, 2),
                "token_utilization": round(metrics_avg.avg_tokens or 0.0, 2),
            },
            "model_distribution": model_breakdown
        }
        
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Failed to compile dashboard system metrics: {str(e)}"
        )