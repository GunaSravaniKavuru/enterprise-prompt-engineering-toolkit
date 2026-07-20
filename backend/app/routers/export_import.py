import json
from fastapi import APIRouter, Depends, HTTPException, UploadFile, File, status
from fastapi.responses import JSONResponse
from sqlalchemy.orm import Session

from app import models
from app.database import get_db
from app.routers.auth import get_current_user

router = APIRouter(prefix="", tags=["Export/Import"])

@router.get("/export", status_code=status.HTTP_200_OK)
def export_prompts(db: Session = Depends(get_db), current_user: models.User = Depends(get_current_user)):
    """
    Exports all prompt records as a downloadable JSON collection.
    """
    prompts = db.query(models.Prompt).filter(models.Prompt.user_id == current_user.id).all()
    
    export_data = [
        {
            "title": p.title,
            "category": p.category,
            "tags": p.tags,
            "content": p.content,
            "technique": p.technique,
            "output_format": p.output_format,
            "favorite": p.favorite,
            "score": p.score
        }
        for p in prompts
    ]
    
    activity = models.ActivityLog(
        user_id=current_user.id,
        action="Export Prompts",
        target_title=f"Exported {len(export_data)} prompts"
    )
    db.add(activity)
    db.commit()
    
    return JSONResponse(
        content=export_data,
        headers={"Content-Disposition": "attachment; filename=prompts_export.json"}
    )

@router.post("/import", status_code=status.HTTP_201_CREATED)
async def import_prompts(
    file: UploadFile = File(...),
    db: Session = Depends(get_db),
    current_user: models.User = Depends(get_current_user)
):
    """
    Accepts an uploaded JSON file containing prompts and bulk-inserts them into the library.
    """
    if not file.filename.endswith(".json"):
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST, 
            detail="Invalid file format. Only JSON structure files are supported."
        )
        
    try:
        contents = await file.read()
        parsed_data = json.loads(contents)
        
        if isinstance(parsed_data, dict):
            parsed_data = [parsed_data]
            
        if not isinstance(parsed_data, list):
            raise HTTPException(status_code=400, detail="JSON format must be an object array.")
            
        new_prompts = []
        for item in parsed_data:
            new_prompts.append(
                models.Prompt(
                    user_id=current_user.id,
                    title=item.get("title", "Untitled Imported Prompt"),
                    category=item.get("category", "General"),
                    tags=item.get("tags", []),
                    content=item.get("content", ""),
                    technique=item.get("technique"),
                    output_format=item.get("output_format"),
                    favorite=item.get("favorite", False),
                    score=item.get("score")
                )
            )
            
        if new_prompts:
            db.bulk_save_objects(new_prompts)
            
            activity = models.ActivityLog(
                user_id=current_user.id,
                action="Import Prompts",
                target_title=f"Bulk imported {len(new_prompts)} prompts"
            )
            db.add(activity)
            db.commit()
            
        return {"status": "Success", "message": f"Successfully processed and imported {len(new_prompts)} prompts."}
        
    except json.JSONDecodeError:
        raise HTTPException(status_code=400, detail="Corrupted or malformed file structure.")
    except Exception as e:
        db.rollback()
        raise HTTPException(status_code=500, detail=f"Database operational failure: {str(e)}")