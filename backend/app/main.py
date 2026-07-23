from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from app.database import Base, engine
from app import models  # noqa: F401

from app.routers import (
    auth,
    builder,
    library,
    playground,
    versions,
    comparison,
    analytics,
    export_import,
    optimizer,
    evaluator,
)

app = FastAPI(
    title="Enterprise Prompt Engineering Toolkit API",
    redirect_slashes=False,
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Register all routers
app.include_router(auth.router, prefix="/api/auth")
app.include_router(builder.router, prefix="/api/builder")
app.include_router(library.router, prefix="/api/library")
app.include_router(playground.router, prefix="/api/playground")
app.include_router(versions.router, prefix="/api/versions")

app.include_router(comparison.router, prefix="/api/comparison")
app.include_router(analytics.router, prefix="/api/analytics")
app.include_router(export_import.router, prefix="/api/export_import")

app.include_router(optimizer.router, prefix="/api/optimizer")
app.include_router(evaluator.router, prefix="/api/evaluator")


@app.on_event("startup")
def on_startup():
    Base.metadata.create_all(bind=engine)


@app.get("/")
def root():
    return {
        "status": "Backend is running",
        "message": "Enterprise Prompt Engineering Toolkit API",
    }