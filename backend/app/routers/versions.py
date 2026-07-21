from typing import List, Optional
from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from datetime import datetime
from pydantic import BaseModel, Field

from app.database import get_db
from app.models import Prompt, PromptVersion
from app.schemas import PromptVersionResponse
from app.core.deps import get_current_user

router = APIRouter(tags=["versions"])


class VersionCreateRequest(BaseModel):
    title: str
    user_prompt: str
    commit_message: Optional[str] = "Manual update"
    changes: List[str] = Field(default_factory=list)
    status: Optional[str] = "Draft"
    model_used: Optional[str] = None
    system_prompt: Optional[str] = None
    variables: List[str] = Field(default_factory=list)
    tags: List[str] = Field(default_factory=list)
    prompt_settings: dict = Field(
        default_factory=lambda: {"temperature": 0.7, "topP": 0.9, "maxTokens": 2048}
    )
    notes: Optional[str] = None


@router.get("/prompt/{prompt_id}", response_model=List[PromptVersionResponse])
def list_prompt_versions(
    prompt_id: int,
    limit: int = 3,
    db: Session = Depends(get_db),
    current_user=Depends(get_current_user),
):
    """Lists the latest versions for a prompt, newest first. Defaults to 3, matching the frontend."""
    prompt = db.query(Prompt).filter(Prompt.id == prompt_id).first()
    if not prompt:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Prompt not found.")

    return (
        db.query(PromptVersion)
        .filter(PromptVersion.prompt_id == prompt_id)
        .order_by(PromptVersion.version_number.desc())
        .limit(limit)
        .all()
    )


@router.get("/{version_id}", response_model=PromptVersionResponse)
def get_version_details(
    version_id: int,
    db: Session = Depends(get_db),
    current_user=Depends(get_current_user),
):
    version = db.query(PromptVersion).filter(PromptVersion.id == version_id).first()
    if not version:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Prompt version not found.")
    return version


@router.post("/prompt/{prompt_id}", response_model=PromptVersionResponse, status_code=status.HTTP_201_CREATED)
def create_new_version(
    prompt_id: int,
    payload: VersionCreateRequest,
    db: Session = Depends(get_db),
    current_user=Depends(get_current_user),
):
    """Creates a new version snapshot for a prompt."""
    prompt = db.query(Prompt).filter(Prompt.id == prompt_id).first()
    if not prompt:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Prompt not found.")

    max_version = (
        db.query(PromptVersion)
        .filter(PromptVersion.prompt_id == prompt_id)
        .order_by(PromptVersion.version_number.desc())
        .first()
    )
    next_version_num = (max_version.version_number + 1) if max_version else 1

    new_version = PromptVersion(
        prompt_id=prompt_id,
        version_number=next_version_num,
        title=payload.title,
        commit_message=payload.commit_message,
        changes=payload.changes,
        status=payload.status,
        model_used=payload.model_used,
        system_prompt=payload.system_prompt,
        user_prompt=payload.user_prompt,
        variables=payload.variables,
        tags=payload.tags,
        prompt_settings=payload.prompt_settings,
        notes=payload.notes,
        created_by=current_user.id,
    )

    db.add(new_version)
    prompt.updated_at = datetime.utcnow()
    db.commit()
    db.refresh(new_version)

    return new_version


@router.post("/{version_id}/restore", response_model=PromptVersionResponse)
def restore_version_as_current(
    version_id: int,
    db: Session = Depends(get_db),
    current_user=Depends(get_current_user),
):
    """Restores an old version by creating a brand new version copying its content forward."""
    target_version = db.query(PromptVersion).filter(PromptVersion.id == version_id).first()
    if not target_version:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Target version to restore not found.")

    prompt = db.query(Prompt).filter(Prompt.id == target_version.prompt_id).first()
    max_version = (
        db.query(PromptVersion)
        .filter(PromptVersion.prompt_id == prompt.id)
        .order_by(PromptVersion.version_number.desc())
        .first()
    )
    next_version_num = (max_version.version_number + 1) if max_version else 1

    restored_version = PromptVersion(
        prompt_id=prompt.id,
        version_number=next_version_num,
        title=target_version.title,
        commit_message=f"Restored from Version {target_version.version_number}",
        changes=target_version.changes,
        status=target_version.status,
        model_used=target_version.model_used,
        system_prompt=target_version.system_prompt,
        user_prompt=target_version.user_prompt,
        variables=target_version.variables,
        tags=target_version.tags,
        prompt_settings=target_version.prompt_settings,
        notes=target_version.notes,
        created_by=current_user.id,
    )

    db.add(restored_version)
    db.commit()
    db.refresh(restored_version)

    return restored_version