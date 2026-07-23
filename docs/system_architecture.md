# System Architecture

## Overview

The Enterprise Prompt Engineering Toolkit follows a three-tier architecture consisting of the frontend, backend, and database.

```
User
   │
   ▼
React + Vite Frontend
   │
   │ REST API
   ▼
FastAPI Backend
   │
   ├────────► Google Gemini API
   │
   ▼
Supabase PostgreSQL
```

## Workflow

1. The user interacts with the React frontend.
2. The frontend sends requests to the FastAPI backend.
3. The backend processes the request and performs business logic.
4. If AI functionality is required, the backend sends the prompt to the Google Gemini API.
5. The backend stores and retrieves data from the PostgreSQL database hosted on Supabase.
6. The processed response is returned to the frontend and displayed to the user.

## Main Components

- Authentication
- Prompt Builder
- Prompt Library
- Playground
- Prompt Optimizer
- Prompt Evaluator
- Multi-Model Comparison
- Version History
- Export / Import
- Analytics Dashboard