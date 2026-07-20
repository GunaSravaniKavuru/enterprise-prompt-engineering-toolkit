import time
import random
from sqlalchemy.orm import Session
from app import models, schemas
from app.services.gemini_service import ask_gemini

async def run_model_comparison(db: Session, schema: schemas.ComparisonCreate, user_id: int) -> models.ComparisonRun:
    results = []
    
    for model_name in schema.models:
        start_time = time.time()
        
        # Call the foundational Gemini function built by Person 1
        # Pass empty system instructions for raw completion, or adapt if needed
        try:
            response_text = await ask_gemini(
                prompt=schema.content,
                model_id=model_name,
                system_instruction=None
            )
        except Exception as e:
            response_text = f"Error running model {model_name}: {str(e)}"
            
        end_time = time.time()
        
        # Calculate execution metrics
        response_time_ms = int((end_time - start_time) * 1000)
        response_length = len(response_text)
        
        # Token calculation rules: fallback estimate if your ask_gemini doesn't provide it
        # Standard rough heuristic: 1 token ~= 4 characters
        input_tokens = max(1, len(schema.content) // 4)
        output_tokens = max(1, response_length // 4)
        total_tokens = input_tokens + output_tokens
        
        # Quality assessment scorecard simulation matching frontend requirements
        quality_score = random.randint(75, 98) if "Error" not in response_text else 0

        results.append({
            "model": model_name,
            "outputText": response_text,
            "inputTokens": input_tokens,
            "outputTokens": output_tokens,
            "totalTokens": total_tokens,
            "responseTime": response_time_ms,
            "responseLength": response_length,
            "qualityScore": quality_score
        })
        
    # Commit execution log record directly to the database
    db_run = models.ComparisonRun(
        prompt_id=schema.prompt_id,
        models_used=schema.models,
        results=results,
        created_by=user_id
    )
    db.add(db_run)
    
    # Write a record to the shared ActivityLog table for Dashboard tracking
    activity = models.ActivityLog(
        user_id=user_id,
        action="Run Comparison",
        target_prompt_id=schema.prompt_id,
        target_title=f"Compared {len(schema.models)} models"
    )
    db.add(activity)
    
    db.commit()
    db.refresh(db_run)
    return db_run