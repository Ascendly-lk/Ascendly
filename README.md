# Ascendly MVP

AI-powered financial analysis platform that helps startups understand their revenue data through automated insights, forecasting, and strategic recommendations.

## Tech Stack

| Layer | Technology |
|-------|-----------|
| **Backend** | Python 3.12, FastAPI, CrewAI, Statsmodels (SARIMAX), Pandas |
| **Database** | Supabase (PostgreSQL + Auth) |
| **LLM** | Groq (`llama-3.1-8b-instant`) via LiteLLM |
| **Frontend** | Next.js (placeholder — not yet built) |

## Project Structure

```
backend/
├── main.py                        # FastAPI app entry point
├── requirements.txt               # Python dependencies
├── .env.example                   # Environment variable template
├── sample_data.csv                # Sample financial CSV
├── app/
│   └── api/
│       └── endpoints/
│           └── analysis.py        # POST /api/analyze endpoint
├── database/
│   ├── supabase_client.py         # Supabase auth & CRUD helpers
│   └── sqlalchemy_client.py       # PostgreSQL/SQLAlchemy setup
├── models/
│   └── user.py                    # User model (profiles table)
└── ai_engine/
    ├── agents.py                  # 3 CrewAI agents
    ├── tasks.py                   # Task definitions & orchestration
    └── tools/
        ├── data_tools.py          # csv_reader & growth_calculator
        └── sarimax_tool.py        # forecast_revenue tool
```

## Features

- **CSV upload & analysis** — Upload financial CSV files for automated processing
- **3-agent AI pipeline** — Data Analyst, Forecaster, and Strategist agents powered by CrewAI
- **SARIMAX revenue forecasting** — Time-series forecasting with SES fallback for small datasets
- **MoM growth metrics & trend detection** — Average, median, min/max revenue and growth volatility
- **User authentication** — Signup, signin, and signout via Supabase Auth
- **Rate limit handling** — Countdown timer and fallback logic for Groq API limits

## API Endpoints

| Method | Path | Description |
|--------|------|-------------|
| `GET` | `/` | Health check |
| `GET` | `/health/db` | Database connection check |
| `POST` | `/auth/signup` | Register a new user |
| `POST` | `/auth/signin` | Login with email & password |
| `POST` | `/auth/signout` | Logout current user |
| `POST` | `/api/analyze` | Upload CSV and run AI analysis pipeline |

## Getting Started

### Prerequisites

- Python 3.12+
- [Supabase](https://supabase.com) account
- [Groq](https://groq.com/developers/) API key

### Setup

```bash
# Clone the repo
git clone <repo-url>
cd ascendly-mvp/backend

# Create and activate virtual environment
python -m venv venv
source venv/bin/activate   # Windows: venv\Scripts\activate

# Install dependencies
pip install -r requirements.txt
```

### Configure environment

Copy `.env.example` to `.env` and fill in your credentials:

```bash
cp .env.example .env
```

### Create Supabase tables

Run the following SQL in the Supabase SQL Editor:

```sql
-- Profiles table (linked to Supabase Auth)
CREATE TABLE public.profiles (
    id UUID REFERENCES auth.users(id) PRIMARY KEY,
    email TEXT,
    full_name TEXT,
    avatar_url TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view own profile" ON public.profiles
    FOR SELECT USING (auth.uid() = id);
CREATE POLICY "Users can update own profile" ON public.profiles
    FOR UPDATE USING (auth.uid() = id);

-- Financial records table
CREATE TABLE public.financial_records (
    id BIGSERIAL PRIMARY KEY,
    user_id UUID REFERENCES auth.users(id),
    data JSONB,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- AI logs table
CREATE TABLE public.ai_logs (
    id BIGSERIAL PRIMARY KEY,
    user_id UUID REFERENCES auth.users(id),
    result JSONB,
    created_at TIMESTAMPTZ DEFAULT NOW()
);
```

### Run the server

```bash
uvicorn main:app --reload
```

The API will be available at `http://localhost:8000`. Interactive docs at `http://localhost:8000/docs`.

## Environment Variables

| Variable | Description |
|----------|-------------|
| `SUPABASE_URL` | Supabase project URL |
| `SUPABASE_KEY` | Supabase anon/public key |
| `DATABASE_URL` | PostgreSQL connection string |
| `GROQ_API_KEY` | Groq API key |
| `CREWAI_LLM_MODEL` | LLM model identifier (default: `groq/llama-3.1-8b-instant`) |

## How the AI Pipeline Works

```
CSV Upload
    │
    ▼
┌──────────────┐   Cleans data, fuzzy-matches columns,
│  Data Analyst │──  calculates MoM growth & statistics
└──────┬───────┘
       │
       ▼
┌──────────────┐   SARIMAX (≥12 points) or SES (<12 points),
│  Forecaster  │──  3-month revenue forecast with confidence intervals
└──────┬───────┘
       │
       ▼
┌──────────────┐   Synthesizes insights into 3 actionable
│  Strategist  │──  recommendations for the startup
└──────┬───────┘
       │
       ▼
  JSON Response
  (historical data + forecast + strategy)
```

Each agent runs sequentially with a 75-second cooldown between calls to respect Groq rate limits. Results are persisted to Supabase (`financial_records` and `ai_logs` tables).
