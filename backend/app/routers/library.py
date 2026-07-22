from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session

from app.database import get_db
from app.models import Prompt, User
from app.schemas import PromptCreate, PromptResponse, PromptUpdate
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


# 👇 ADD THIS HERE
@router.post("/", response_model=PromptResponse, status_code=status.HTTP_201_CREATED)
def create_prompt(
    prompt: PromptCreate,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    new_prompt = Prompt(
        user_id=current_user.id,
        title=prompt.title,
        category=prompt.category,
        tags=prompt.tags,
        content=prompt.content,
        technique=prompt.technique,
        output_format=prompt.output_format,
        form_data=prompt.form_data,
    )

    db.add(new_prompt)
    db.commit()
    db.refresh(new_prompt)

    return new_prompt
@router.put("/{prompt_id}", response_model=PromptResponse)
def update_prompt(
    prompt_id: int,
    prompt_update: PromptUpdate,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    prompt = (
        db.query(Prompt)
        .filter(
            Prompt.id == prompt_id,
            Prompt.user_id == current_user.id,
        )
        .first()
    )

    if not prompt:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Prompt not found",
        )

    update_data = prompt_update.model_dump(exclude_unset=True)

    for key, value in update_data.items():
        setattr(prompt, key, value)

    db.commit()
    db.refresh(prompt)

    return prompt
@router.delete("/{prompt_id}", status_code=status.HTTP_204_NO_CONTENT)
def delete_prompt(
    prompt_id: int,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    prompt = (
        db.query(Prompt)
        .filter(
            Prompt.id == prompt_id,
            Prompt.user_id == current_user.id,
        )
        .first()
    )

    if not prompt:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Prompt not found",
        )

    db.delete(prompt)
    db.commit()


@router.patch("/{prompt_id}/favorite", response_model=PromptResponse)
def toggle_favorite(
    prompt_id: int,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    prompt = (
        db.query(Prompt)
        .filter(
            Prompt.id == prompt_id,
            Prompt.user_id == current_user.id,
        )
        .first()
    )

    if not prompt:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Prompt not found",
        )

    prompt.favorite = not prompt.favorite

    db.commit()
    db.refresh(prompt)

    return prompt