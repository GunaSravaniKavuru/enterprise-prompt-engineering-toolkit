from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from typing import Optional
import time
import uuid


# -------------------------------
# FastAPI App
# -------------------------------

app = FastAPI(
    title="PromptOps Evaluation Dashboard API",
    description="API for Prompt Evaluation, LLM Benchmarking and Monitoring",
    version="1.0.0"
)


# -------------------------------
# CORS Configuration
# -------------------------------

app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        "http://localhost:5173",
        "http://127.0.0.1:5173",
        "http://localhost:3000",
        "http://127.0.0.1:3000"
    ],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


# -------------------------------
# Request Schema
# -------------------------------

class PromptEvaluationRequest(BaseModel):
    prompt_id: int
    prompt_text: str
    model_id: str


# -------------------------------
# Response Schema
# -------------------------------

class PromptEvaluationResponse(BaseModel):
    id: int
    prompt_id: int
    prompt_text: str
    model_id: str
    output_text: str
    input_tokens: int
    output_tokens: int
    total_tokens: int
    latency_ms: int



# -------------------------------
# Root API
# -------------------------------

@app.get("/")
def home():
    return {
        "message": "PromptOps Evaluation Dashboard API Running",
        "status": "success"
    }



# -------------------------------
# Health Check
# -------------------------------

@app.get("/health")
def health():
    return {
        "status": "healthy"
    }



# -------------------------------
# Prompt Evaluation API
# -------------------------------

@app.post(
    "/evaluate",
    response_model=PromptEvaluationResponse,
    status_code=201
)
def evaluate_prompt(
    request: PromptEvaluationRequest
):

    start_time = time.time()


    # --------------------------------
    # Dummy LLM Response
    # Replace this with Gemini/OpenAI API
    # --------------------------------

    generated_output = (
        f"Evaluation result for prompt: "
        f"{request.prompt_text}"
    )


    # Token calculation simulation

    input_tokens = len(
        request.prompt_text.split()
    )

    output_tokens = len(
        generated_output.split()
    )


    total_tokens = (
        input_tokens +
        output_tokens
    )


    latency = int(
        (time.time() - start_time) * 1000
    )


    return {
        "id": int(uuid.uuid4().int % 100000),
        "prompt_id": request.prompt_id,
        "prompt_text": request.prompt_text,
        "model_id": request.model_id,
        "output_text": generated_output,
        "input_tokens": input_tokens,
        "output_tokens": output_tokens,
        "total_tokens": total_tokens,
        "latency_ms": latency
    }



# -------------------------------
# Get Prompt History
# -------------------------------

@app.get("/prompts")
def get_prompts():

    return [
        {
            "id":1,
            "prompt":"Explain Artificial Intelligence",
            "model":"Gemini",
            "score":92
        },
        {
            "id":2,
            "prompt":"Generate Python code",
            "model":"GPT",
            "score":88
        }
    ]