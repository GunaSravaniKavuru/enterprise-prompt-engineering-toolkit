from datetime import datetime
from sqlalchemy import (
    Column, Integer, String, Text, Boolean, Float, DateTime, ForeignKey
)
from sqlalchemy.dialects.postgresql import JSONB
from sqlalchemy.orm import relationship
from app.database import Base


# ---------------- Users ----------------
class User(Base):
    __tablename__ = "users"

    id = Column(Integer, primary_key=True, index=True)
    name = Column(String(120), nullable=False)
    email = Column(String(120), unique=True, nullable=False, index=True)
    password_hash = Column(String(255), nullable=False)
    org = Column(String(120), nullable=True)
    role = Column(String(80), nullable=True)
    avatar_initials = Column(String(5), nullable=True)
    created_at = Column(DateTime, default=datetime.utcnow, nullable=False)

    prompts = relationship("Prompt", back_populates="owner")
    prompt_versions = relationship("PromptVersion", back_populates="created_by_user")
    evaluations = relationship("Evaluation", back_populates="created_by_user")
    optimizations = relationship("Optimization", back_populates="created_by_user")
    comparison_runs = relationship("ComparisonRun", back_populates="created_by_user")
    playground_runs = relationship("PlaygroundRun", back_populates="created_by_user")
    activity_log = relationship("ActivityLog", back_populates="user")


# ---------------- Prompts ----------------
class Prompt(Base):
    __tablename__ = "prompts"

    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("users.id"), nullable=False)
    title = Column(String(200), nullable=False)
    category = Column(String(80), nullable=True)
    tags = Column(JSONB, nullable=True, default=list)
    content = Column(Text, nullable=False)
    technique = Column(String(40), nullable=True)
    output_format = Column(String(80), nullable=True)
    favorite = Column(Boolean, nullable=False, default=False)
    score = Column(Integer, nullable=True)
    created_at = Column(DateTime, default=datetime.utcnow, nullable=False)
    updated_at = Column(DateTime, default=datetime.utcnow, onupdate=datetime.utcnow, nullable=False)

    owner = relationship("User", back_populates="prompts")

    # Versions have no meaning without their parent prompt -> full cascade delete
    versions = relationship(
        "PromptVersion",
        back_populates="prompt",
        cascade="all, delete-orphan",
        passive_deletes=True,
    )

    # These feed analytics/history and should SURVIVE prompt deletion (prompt_id -> NULL)
    evaluations = relationship("Evaluation", back_populates="prompt", passive_deletes=True)
    optimizations = relationship("Optimization", back_populates="prompt", passive_deletes=True)
    comparison_runs = relationship("ComparisonRun", back_populates="prompt", passive_deletes=True)
    playground_runs = relationship("PlaygroundRun", back_populates="prompt", passive_deletes=True)
    activity_entries = relationship("ActivityLog", back_populates="target_prompt", passive_deletes=True)


# ---------------- Prompt Versions ----------------
class PromptVersion(Base):
    __tablename__ = "prompt_versions"

    id = Column(Integer, primary_key=True, index=True)
    prompt_id = Column(Integer, ForeignKey("prompts.id", ondelete="CASCADE"), nullable=False)
    version_number = Column(Integer, nullable=False)
    title = Column(String(200), nullable=False)
    commit_message = Column(String(255), nullable=True)
    changes = Column(JSONB, nullable=True, default=list)
    status = Column(String(30), nullable=False, default="Draft")
    quality_score = Column(Integer, nullable=True)
    evaluation_score = Column(Integer, nullable=True)
    average_user_rating = Column(Float, nullable=True)
    model_used = Column(String(60), nullable=True)
    system_prompt = Column(Text, nullable=True)
    user_prompt = Column(Text, nullable=False)
    variables = Column(JSONB, nullable=True, default=list)
    tags = Column(JSONB, nullable=True, default=list)
    prompt_settings = Column(JSONB, nullable=True, default=dict)
    notes = Column(Text, nullable=True)
    created_by = Column(Integer, ForeignKey("users.id"), nullable=False)
    created_at = Column(DateTime, default=datetime.utcnow, nullable=False)

    prompt = relationship("Prompt", back_populates="versions")
    created_by_user = relationship("User", back_populates="prompt_versions")


# ---------------- Evaluations ----------------
class Evaluation(Base):
    __tablename__ = "evaluations"

    id = Column(Integer, primary_key=True, index=True)
    # SET NULL on delete: evaluation history survives even if the prompt is later deleted
    prompt_id = Column(Integer, ForeignKey("prompts.id", ondelete="SET NULL"), nullable=True)
    overall_score = Column(Integer, nullable=False)
    metrics = Column(JSONB, nullable=False, default=list)
    suggestions = Column(JSONB, nullable=True, default=list)
    created_by = Column(Integer, ForeignKey("users.id"), nullable=False)
    created_at = Column(DateTime, default=datetime.utcnow, nullable=False)

    prompt = relationship("Prompt", back_populates="evaluations")
    created_by_user = relationship("User", back_populates="evaluations")


# ---------------- Optimizations ----------------
class Optimization(Base):
    __tablename__ = "optimizations"

    id = Column(Integer, primary_key=True, index=True)
    prompt_id = Column(Integer, ForeignKey("prompts.id", ondelete="SET NULL"), nullable=True)
    original_content = Column(Text, nullable=False)
    optimized_content = Column(Text, nullable=False)
    summary = Column(JSONB, nullable=True, default=list)
    score_before = Column(Integer, nullable=True)
    score_after = Column(Integer, nullable=True)
    created_by = Column(Integer, ForeignKey("users.id"), nullable=False)
    created_at = Column(DateTime, default=datetime.utcnow, nullable=False)

    prompt = relationship("Prompt", back_populates="optimizations")
    created_by_user = relationship("User", back_populates="optimizations")


# ---------------- Comparison Runs ----------------
class ComparisonRun(Base):
    __tablename__ = "comparison_runs"

    id = Column(Integer, primary_key=True, index=True)
    prompt_id = Column(Integer, ForeignKey("prompts.id", ondelete="SET NULL"), nullable=True)
    models_used = Column(JSONB, nullable=False, default=list)
    results = Column(JSONB, nullable=False, default=list)
    created_by = Column(Integer, ForeignKey("users.id"), nullable=False)
    created_at = Column(DateTime, default=datetime.utcnow, nullable=False)

    prompt = relationship("Prompt", back_populates="comparison_runs")
    created_by_user = relationship("User", back_populates="comparison_runs")


# ---------------- Playground Runs ----------------
class PlaygroundRun(Base):
    __tablename__ = "playground_runs"

    id = Column(Integer, primary_key=True, index=True)
    prompt_id = Column(Integer, ForeignKey("prompts.id", ondelete="SET NULL"), nullable=True)
    model_used = Column(String(60), nullable=False)
    input_text = Column(Text, nullable=False)
    output_text = Column(Text, nullable=False)
    latency_ms = Column(Integer, nullable=True)
    tokens = Column(Integer, nullable=True)
    created_by = Column(Integer, ForeignKey("users.id"), nullable=False)
    created_at = Column(DateTime, default=datetime.utcnow, nullable=False)

    prompt = relationship("Prompt", back_populates="playground_runs")
    created_by_user = relationship("User", back_populates="playground_runs")


# ---------------- Activity Log ----------------
class ActivityLog(Base):
    __tablename__ = "activity_log"

    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("users.id"), nullable=False)
    action = Column(String(40), nullable=False)
    # SET NULL on delete: the log entry survives, target_title keeps it readable
    target_prompt_id = Column(Integer, ForeignKey("prompts.id", ondelete="SET NULL"), nullable=True)
    target_title = Column(String(200), nullable=True)
    created_at = Column(DateTime, default=datetime.utcnow, nullable=False)

    user = relationship("User", back_populates="activity_log")
    target_prompt = relationship("Prompt", back_populates="activity_entries")