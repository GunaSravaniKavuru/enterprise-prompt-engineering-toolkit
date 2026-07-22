from datetime import datetime
from typing import Optional, List, Dict, Any
from pydantic import BaseModel, EmailStr, Field


# ==================== Users ====================
class UserCreate(BaseModel):
    name: str
    email: EmailStr
    password: str
    org: Optional[str] = None
    role: Optional[str] = None

class UserLogin(BaseModel):
    email: EmailStr
    password: str

class UserResponse(BaseModel):
    id: int
    name: str
    email: EmailStr
    org: Optional[str] = None
    role: Optional[str] = None
    avatar_initials: Optional[str] = None
    created_at: datetime

    class Config:
        from_attributes = True

class Token(BaseModel):
    access_token: str
    token_type: str = "bearer"


# ==================== Prompts ====================
class PromptCreate(BaseModel):
    title: str
    category: Optional[str] = None
    tags: List[str] = Field(default_factory=list)
    content: str
    technique: Optional[str] = None
    output_format: Optional[str] = None
    form_data: Dict[str, Any] = Field(default_factory=dict)

class PromptUpdate(BaseModel):
    title: Optional[str] = None
    category: Optional[str] = None
    tags: Optional[List[str]] = None
    content: Optional[str] = None
    technique: Optional[str] = None
    output_format: Optional[str] = None
    form_data: Optional[Dict[str, Any]] = None
    favorite: Optional[bool] = None

class PromptResponse(BaseModel):
    id: int
    user_id: int
    title: str
    category: Optional[str] = None
    tags: List[str] = Field(default_factory=list)
    content: str
    technique: Optional[str] = None
    output_format: Optional[str] = None

    form_data: Dict[str, Any] = Field(default_factory=dict)
    
    favorite: bool
    score: Optional[int] = None
    created_at: datetime
    updated_at: datetime

    class Config:
        from_attributes = True


# ==================== Prompt Versions ====================
class PromptVersionCreate(BaseModel):
    prompt_id: int
    title: str
    commit_message: Optional[str] = None
    changes: List[str] = Field(default_factory=list)
    status: Optional[str] = "Draft"
    model_used: Optional[str] = None
    system_prompt: Optional[str] = None
    user_prompt: str
    variables: List[str] = Field(default_factory=list)
    tags: List[str] = Field(default_factory=list)
    prompt_settings: Dict[str, Any] = Field(default_factory=dict)
    notes: Optional[str] = None

class PromptVersionResponse(BaseModel):
    id: int
    prompt_id: int
    version_number: int
    title: str
    commit_message: Optional[str] = None
    changes: List[str] = Field(default_factory=list)
    status: str
    quality_score: Optional[int] = None
    evaluation_score: Optional[int] = None
    average_user_rating: Optional[float] = None
    model_used: Optional[str] = None
    system_prompt: Optional[str] = None
    user_prompt: str
    variables: List[str] = Field(default_factory=list)
    tags: List[str] = Field(default_factory=list)
    prompt_settings: Dict[str, Any] = Field(default_factory=dict)
    notes: Optional[str] = None
    created_by: int
    created_at: datetime

    class Config:
        from_attributes = True


# ==================== Evaluations ====================
class EvaluationCreate(BaseModel):
    prompt_id: Optional[int] = None
    content: str  # raw text to evaluate if prompt_id not given

class EvaluationResponse(BaseModel):
    id: int
    prompt_id: Optional[int] = None
    overall_score: int
    metrics: List[Dict[str, Any]] = Field(default_factory=list)
    suggestions: List[str] = Field(default_factory=list)
    created_by: int
    created_at: datetime

    class Config:
        from_attributes = True


# ==================== Optimizations ====================
class OptimizationCreate(BaseModel):
    prompt_id: Optional[int] = None
    original_content: str

class OptimizationResponse(BaseModel):
    id: int
    prompt_id: Optional[int] = None
    original_content: str
    optimized_content: str
    summary: List[str] = Field(default_factory=list)
    score_before: Optional[int] = None
    score_after: Optional[int] = None
    created_by: int
    created_at: datetime

    class Config:
        from_attributes = True


# ==================== Comparison Runs ====================
class ComparisonCreate(BaseModel):
    prompt_id: Optional[int] = None
    content: str
    models: List[str]  # e.g. ["gemini:2.5-flash", "gemini:2.5-pro"]

class ComparisonResponse(BaseModel):
    id: int
    prompt_id: Optional[int] = None
    models_used: List[str] = Field(default_factory=list)
    results: List[Dict[str, Any]] = Field(default_factory=list)
    created_by: int
    created_at: datetime

    class Config:
        from_attributes = True


# ==================== Playground Runs ====================
class PlaygroundRunCreate(BaseModel):
    prompt_id: Optional[int] = None
    model_used: str
    input_text: str

class PlaygroundRunResponse(BaseModel):
    id: int
    prompt_id: Optional[int] = None
    model_used: str
    input_text: str
    output_text: str
    latency_ms: Optional[int] = None
    tokens: Optional[int] = None
    created_by: int
    created_at: datetime

    class Config:
        from_attributes = True


# ==================== Activity Log ====================
class ActivityLogResponse(BaseModel):
    id: int
    user_id: int
    action: str
    target_prompt_id: Optional[int] = None
    target_title: Optional[str] = None
    created_at: datetime

    class Config:
        from_attributes = True