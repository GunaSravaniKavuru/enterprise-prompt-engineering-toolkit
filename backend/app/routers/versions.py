from typing import List, Optional
from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from datetime import datetime

from app.database import get_db
from app.models import Prompt, PromptVersion
from app.core.deps import get_current_user
from pydantic import BaseModel, Field

router = APIRouter()

# --- Request & Response Schemas ---
class VersionCreateRequest(BaseModel):
    version_number: int
    prompt_text: str
    changelog: Optional[str] = "Manual update"
    tags: Optional[List[str]] = Field(default_factory=list)
    prompt_settings: Optional[dict] = Field(
        default_factory=lambda: {"temperature": 0.7, "topP": 0.9, "maxTokens": 2048}
    )

class VersionResponse(BaseModel):
    id: int
    prompt_id: int
    version_number: int
    prompt_text: str
    changelog: Optional[str]
    tags: List[str]
    prompt_settings: dict
    created_at: datetime
    created_by: int

    class Config:
        from_attributes = True


# --- Endpoints ---

@router.get("/prompt/{prompt_id}", response_model=List[VersionResponse])
def list_prompt_versions(
    prompt_id: int, 
    limit: int = 3, 
    db: Session = Depends(get_db),
    current_user = Depends(get_current_user)
):
    """
    Lists the versions for a given prompt, sorted by version number descending.
    Defaults to returning the latest 3 versions to match frontend behavior.
    """
    # Verify the prompt exists and belongs to the user (or organization)
    prompt = db.query(Prompt).filter(Prompt.id == prompt_id).first()
    if not prompt:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND, 
            detail="Prompt not found."
        )

    versions = db.query(PromptVersion)\
        .filter(PromptVersion.prompt_id == prompt_id)\
        .order_by(PromptVersion.version_number.desc())\
        .limit(limit)\
        .all()
        
    return versions


@router.get("/{version_id}", response_model=VersionResponse)
def get_version_details(
    version_id: int, 
    db: Session = Depends(get_db),
    current_user = Depends(get_current_user)
):
    """
    Fetches details of a specific prompt version by its ID.
    """
    version = db.query(PromptVersion).filter(PromptVersion.id == version_id).first()
    if not version:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND, 
            detail="Prompt version not found."
        )
    return version


@router.post("/prompt/{prompt_id}", response_model=VersionResponse, status_code=status.HTTP_201_CREATED)
def create_new_version(
    prompt_id: int,
    payload: VersionCreateRequest,
    db: Session = Depends(get_db),
    current_user = Depends(get_current_user)
):
    """
    Manually snapshot a new version state for a specific prompt.
    """
    prompt = db.query(Prompt).filter(Prompt.id == prompt_id).first()
    if not prompt:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND, 
            detail="Prompt not found."
        )

    # Check if version number already conflicts
    existing = db.query(PromptVersion).filter(
        PromptVersion.prompt_id == prompt_id,
        PromptVersion.version_number == payload.version_number
    ).first()
    if existing:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail=f"Version {payload.version_number} already exists for this prompt."
        )

    new_version = PromptVersion(
        prompt_id=prompt_id,
        version_number=payload.version_number,
        prompt_text=payload.prompt_text,
        changelog=payload.changelog,
        tags=payload.tags,
        prompt_settings=payload.prompt_settings,
        created_by=current_user.id
    )

    db.add(new_version)
    
    # Keep parent prompt text synced with latest text changes if this is the newest version
    prompt.updated_at = datetime.utcnow()
    
    db.commit()
    db.refresh(new_version)
    return new_version


@router.post("/{version_id}/restore", response_model=VersionResponse)
def restore_version_as_current(
    version_id: int,
    db: Session = Depends(get_db),
    current_user = Depends(get_current_user)
):
    """
    Grabs an old version's prompt text and settings, creates a brand new version 
    incremented forward, effectively rolling back the 'current' active state.
    """
    target_version = db.query(PromptVersion).filter(PromptVersion.id == version_id).first()
    if not target_version:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND, 
            detail="Target version to restore not found."
        )

    prompt = db.query(Prompt).filter(Prompt.id == target_version.prompt_id).first()
    
    # Determine next version increment number
    max_version = db.query(PromptVersion).filter(PromptVersion.prompt_id == prompt.id).order_by(PromptVersion.version_number.desc()).first()
    next_version_num = (max_version.version_number + 1) if max_version else 1

    restored_version = PromptVersion(
        prompt_id=prompt.id,
        version_number=next_version_num,
        prompt_text=target_version.prompt_text,
        changelog=f"Restored from Version {target_version.version_number}",
        tags=target_version.tags,
        prompt_settings=target_version.prompt_settings,
        created_by=current_user.id
    )

    db.add(restored_version)
    db.commit()
    db.refresh(restored_version)
    return restored_version