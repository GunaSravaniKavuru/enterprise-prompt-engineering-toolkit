from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session

from app.database import get_db
from app.models import Prompt, User
from app.schemas import PromptResponse, PromptUpdate
from app.core.deps import get_current_user

router = APIRouter(tags=["library"])

@router.get("/", response_model=list[PromptResponse])
def list_prompts(
    category: str | None = None,
    favorite: bool | None = None,
    search: str | None = None,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    query = db.query(Prompt).filter(Prompt.user_id == current_user.id)

    if category:
        query = query.filter(Prompt.category == category)

    if favorite is not None:
        query = query.filter(Prompt.favorite == favorite)

    if search:
        query = query.filter(Prompt.title.ilike(f"%{search}%"))

    return query.order_by(Prompt.updated_at.desc()).all()