# enterprise-prompt-engineering-toolkit
Onboard Academy Capstone Project | Team 3 | Enterprise Prompt Engineering Toolkit
# Enterprise Prompt Engineering Toolkit

An AI-powered web application for designing, managing, evaluating, optimizing, and comparing prompts for Large Language Models (LLMs). The toolkit provides a centralized platform for prompt engineering workflows with prompt versioning, analytics, and multi-model comparison.

---

## Live Demo

| Service | URL |
|---------|-----|
| Frontend (Vercel) | https://enterprise-prompt-engineering-toolkit-he7s3qa5h-collegeproject.vercel.app |
| Backend API (Railway) | https://enterprise-prompt-engineering-toolkit-production.up.railway.app |
| API Documentation | https://enterprise-prompt-engineering-toolkit-production.up.railway.app/docs |

---

## Features

- User Authentication (Register/Login)
- Prompt Builder
- Prompt Library
- Prompt Playground
- Prompt Optimizer
- Prompt Evaluator
- Multi-Model Comparison
- Prompt Version History
- Export & Import Prompts
- Analytics Dashboard

---

## Tech Stack

### Frontend
- React
- Vite
- Tailwind CSS
- Axios

### Backend
- FastAPI
- SQLAlchemy
- JWT Authentication

### Database
- PostgreSQL (Supabase)

### AI Integration
- Google Gemini API

### Deployment
- Frontend: Vercel
- Backend: Railway

---

## Project Structure

```text
enterprise-prompt-engineering-toolkit/
│
├── backend/
├── frontend/
├── database/
├── docs/
├── tests/
├── README.md
```

---

## System Architecture

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

---

## Installation

### Clone the Repository

```bash
git clone <repository-url>
cd enterprise-prompt-engineering-toolkit
```

### Backend Setup

```bash
cd backend

python -m venv venv

# Windows
venv\Scripts\activate

# Linux / macOS
source venv/bin/activate

pip install -r requirements.txt
```

Create a `.env` file inside the backend directory.

```env
DATABASE_URL=your_database_url
GEMINI_API_KEY=your_gemini_api_key
JWT_SECRET_KEY=your_secret_key
```

Run the backend server.

```bash
uvicorn app.main:app --reload
```

---

### Frontend Setup

```bash
cd frontend

npm install
npm run dev
```

Create a `.env` file inside the frontend directory.

```env
VITE_API_BASE_URL=http://localhost:8000/api
```

---

## Modules

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

---

## Testing

The application was manually tested to verify all implemented features.

Testing includes:

- Authentication
- Prompt Management
- Prompt Generation
- Playground Execution
- Prompt Optimization
- Prompt Evaluation
- Multi-Model Comparison
- Version History
- Export & Import
- Analytics Dashboard

---

## Documentation

Additional documentation is available in the following folders:

- `database/`
- `docs/`
- `tests/`

---

## License

This project was developed for educational purposes as part of the Enterprise Prompt Engineering Toolkit project.