<<<<<<< HEAD
<<<<<<< HEAD
#Ascendly
=======
=======
>>>>>>> parent of ae17c912 (Update by deleting some files)
# Ascendly

AI-powered financial analytics platform for startups — upload your data, get revenue forecasts, strategic recommendations, and chat with an AI assistant about your business metrics.

## Tech Stack

| Layer | Technology |
|-------|-----------|
| **Backend** | Python 3.12, FastAPI, CrewAI, Statsmodels (SARIMAX), Pandas |
| **Database** | Supabase (PostgreSQL + Auth + Storage) |
| **LLM** | Azure OpenAI GPT-4o via LiteLLM + CrewAI |
| **Frontend** | React 19, Vite, React Router |

## Project Structure

```
ascendly/
├── backend/
│   ├── main.py                        # FastAPI app entry point, auth endpoints
│   ├── requirements.txt
│   ├── .env.example
│   ├── app/api/endpoints/
│   │   ├── analysis.py                # File upload, analysis, file listing
│   │   └── chat.py                    # SSE streaming AI chat endpoint
│   ├── database/
│   │   └── supabase_client.py         # Supabase auth & CRUD helpers
│   └── ai_engine/
│       ├── agents.py                  # CrewAI agent definitions
│       ├── tasks.py                   # CSV-based analysis pipeline
│       ├── crew.py                    # DB-based analysis pipeline (step functions)
│       └── tools/
│           ├── data_tools.py          # growth_calculator tool
│           ├── query_tool.py          # query_dataset tool (loads from Supabase)
│           ├── sarimax_tool.py        # forecast_revenue tool
│           └── benchmark_tool.py     # query_benchmarks tool
└── frontend/
    ├── src/
    │   ├── pages/
    │   │   ├── Login.jsx / Register.jsx
    │   │   └── aianalytics/
    │   │       ├── AIAssistant.jsx    # SSE streaming chat UI
    │   │       ├── UploadData.jsx     # File upload page
    │   │       └── Dashboard.jsx      # Analytics dashboard
    │   ├── components/
    │   │   └── aianalytics/           # Sidebar, TopBar, charts, stat cards
    │   ├── context/AuthContext.jsx    # Auth state (email + Google OAuth)
    │   └── api.js                     # apiFetch, token helpers
    └── package.json
```

## Features

- **File upload** — CSV, XLSX, XLS, JSON up to 50MB; rows stored in Supabase for agent pipeline
- **3-agent AI pipeline** — Data Analyst → Forecaster → Strategist powered by CrewAI + Azure GPT-4o
- **SARIMAX revenue forecasting** — 3-month forecast with confidence intervals; SES fallback for small datasets
- **SSE streaming chat** — Token-by-token streaming response with step-by-step progress for analysis mode
- **Conversation memory** — Last 10 messages sent as history context to the LLM
- **Industry benchmarks** — Strategic recommendations with competitor and sector comparisons
- **User authentication** — Email/password + Google OAuth via Supabase Auth

## API Endpoints

| Method | Path | Auth | Description |
|--------|------|------|-------------|
| `GET` | `/` | No | Health check |
| `GET` | `/health/db` | Yes | Database connection check |
| `POST` | `/auth/signup` | No | Register with email & password |
| `POST` | `/auth/signin` | No | Login, returns JWT |
| `POST` | `/auth/signout` | Yes | Logout |
| `GET` | `/auth/me` | Yes | Current user profile |
| `POST` | `/auth/profile/complete` | Yes | Complete onboarding (Google OAuth users) |
| `POST` | `/api/upload` | Yes | Upload dataset file |
| `POST` | `/api/analyze` | Yes | Upload CSV and run full analysis pipeline |
| `GET` | `/api/files/recent` | Yes | List user's uploaded files |
| `POST` | `/api/chat` | Yes | SSE streaming AI chat |

## Getting Started

### Prerequisites

- Python 3.12+
- Node.js 18+
- [Supabase](https://supabase.com) project
- Azure OpenAI deployment (GPT-4o)

### Backend Setup

```bash
cd backend
python -m venv venv
source venv/bin/activate   # Windows: venv\Scripts\activate
pip install -r requirements.txt
cp .env.example .env       # Fill in your credentials
uvicorn main:app --reload  # Runs on http://localhost:8000
```

### Frontend Setup

```bash
cd frontend
npm install
npm run dev                # Runs on http://localhost:5173
```

## Environment Variables

| Variable | Description |
|----------|-------------|
| `SUPABASE_URL` | Supabase project URL |
| `SUPABASE_KEY` | Supabase anon/public key |
| `SUPABASE_SERVICE_KEY` | Supabase service role key (bypasses RLS for uploads) |
| `AZURE_API_KEY` | Azure OpenAI API key |
| `AZURE_ENDPOINT` | Full deployment URL e.g. `https://<resource>.cognitiveservices.azure.com/openai/deployments/gpt-4o` |
| `AZURE_API_VERSION` | Azure API version e.g. `2024-02-01` |
| `CREWAI_LLM_MODEL` | LLM model identifier (default: `azure/gpt-4o`) |

## How the AI Pipeline Works

```
Dataset (uploaded to Supabase)
        │
        ▼
┌──────────────┐   Loads rows via query_dataset,
│ Data Analyst │── calculates MoM growth & metrics
└──────┬───────┘
       │
       ▼
┌──────────────┐   SARIMAX (≥12 data points) or SES fallback,
│  Forecaster  │── 3-month forecast with confidence intervals
└──────┬───────┘
       │
       ▼
┌──────────────┐   Compares against industry benchmarks,
│  Strategist  │── generates 3 actionable recommendations
└──────┬───────┘
       │
       ▼
  SSE Stream → Frontend
  (progress events → result event → done event)
```

### Chat Modes

- **Quick mode** — Conversational questions answered token-by-token via LiteLLM streaming
- **Analysis mode** — Triggered by keywords (`analyze`, `forecast`, `trend`, etc.) with a dataset selected; runs the full 3-agent pipeline with step progress updates
<<<<<<< HEAD
>>>>>>> parent of ae17c912 (Update by deleting some files)
=======
>>>>>>> parent of ae17c912 (Update by deleting some files)
