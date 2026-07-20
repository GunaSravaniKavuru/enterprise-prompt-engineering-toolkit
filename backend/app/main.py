from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from app.database import Base, engine
from app import models  # noqa: F401 — import so all tables are registered with Base
from app.routers import auth
from app.routers import comparison, analytics, export_import

app = FastAPI(title="Enterprise Prompt Engineering Toolkit API")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # tighten this to your frontend's actual URL before final submission
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Shared Foundation Router
app.include_router(auth.router, prefix="/api/auth")

# Person 5 Routers (Registered correctly outside functions)
app.include_router(comparison.router, prefix="/api/comparison", tags=["Comparison"])
app.include_router(analytics.router, prefix="/api/analytics", tags=["Analytics"])
app.include_router(export_import.router, prefix="/api/export-import", tags=["Export/Import"])

@app.on_event("startup")
def on_startup():
    Base.metadata.create_all(bind=engine)

@app.get("/")
def root():
    return {"status": "Backend is running", "message": "Enterprise Prompt Engineering Toolkit API"}