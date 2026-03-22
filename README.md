# Ascendly — AI Analytics Platform for Startups

Ascendly is an AI-powered business analytics platform that helps startups analyze financial data, forecast revenue, benchmark against industry peers, and receive strategic recommendations — all through a conversational AI interface.

---

## Features

- **AI Chat Assistant** — conversational interface powered by Azure GPT-4o
- **3-Agent Analysis Pipeline** — Analyst → Forecaster → Strategist (CrewAI)
- **Interactive Analysis UI** — Thesys C1 renders live charts, KPI cards, and recommendation cards inside the chat
- **Revenue Forecasting** — SARIMAX time-series forecasting on uploaded datasets
- **Industry Benchmarks** — Google ADK multi-agent system + 1,050-row startup benchmark database
- **File Upload** — CSV, XLSX, XLS, JSON dataset support
- **Dashboard** — metrics overview, activity chart, contextual AI nudge chips
- **Multi-role Auth** — Startup, Investor, Marketing Agency, Patent Firm, Business Advisor, Admin
- **Google OAuth** — sign in with Google via Supabase

---

## Tech Stack

| Layer | Technology |
|-------|-----------|
| Frontend | React 18, Vite, React Router, ReactMarkdown |
| Backend | FastAPI, Python 3.12, Uvicorn |
| AI Pipeline | CrewAI, Azure OpenAI GPT-4o |
| Interactive UI | Thesys C1 (`@thesysai/genui-sdk`) |
| Benchmarks | Google ADK, Gemini 2.0 Flash |
| Database | Supabase (PostgreSQL) |
| Auth | Supabase Auth + JWT |
| Caching | `cachetools` TTLCache (in-memory) |

---

## Project Structure

```
ascendly-main/
├── backend/
│   ├── main.py                         # FastAPI app entry point
│   ├── requirements.txt
│   ├── ai_engine/
│   │   ├── agents.py                   # CrewAI agent definitions
│   │   ├── crew.py                     # Pipeline runner
│   │   ├── tasks.py                    # CrewAI task definitions
│   │   ├── provider.py                 # AI provider config (Azure/OpenAI)
│   │   ├── c1_client.py                # Thesys C1 API client
│   │   ├── adk/                        # Google ADK benchmark agents
│   │   └── tools/                      # CrewAI tools (benchmark, data, SARIMAX)
│   ├── app/api/endpoints/
│   │   ├── chat.py                     # SSE streaming chat + analysis
│   │   ├── dashboard.py                # Dashboard metrics
│   │   ├── analysis.py                 # Analysis trigger
│   │   └── patent_firm.py
│   ├── cache/
│   │   └── cache_manager.py            # TTL cache for analysis + chat
│   ├── database/
│   │   ├── supabase_client.py          # Supabase client + require_auth
│   │   ├── migrations/                 # SQL migration files
│   │   └── seed_startup_benchmarks.py  # One-time DB seeder
│   └── models/
│       └── user.py
│
└── frontend/
    └── src/
        ├── api.js                      # apiFetch, getToken, setToken helpers
        ├── App.jsx                     # Route definitions
        ├── main.jsx                    # React app entry point
        ├── components/
        │   ├── aianalytics/            # AI dashboard components
        │   │   ├── AIStatCard          # Metric stat cards
        │   │   ├── AIAnalyticsChart    # Activity bar chart
        │   │   ├── AIInsightNudges     # Contextual prompt chips
        │   │   ├── C1Message           # Thesys C1 interactive renderer
        │   │   ├── FileUploadZone      # C1 custom upload component
        │   │   ├── RecentUploads       # Recent file list
        │   │   └── QuickActions        # Action shortcut buttons
        │   └── dashboard/              # Role dashboard components
        │       ├── Sidebar, TopBar, StatCard, RevenueTrendCard, etc.
        ├── pages/
        │   ├── aianalytics/
        │   │   ├── AIAnalyticsDashboard.jsx
        │   │   ├── AIAssistant.jsx     # Chat + C1 streaming interface
        │   │   └── UploadData.jsx
        │   ├── dashboard/              # Role-specific dashboards
        │   │   ├── StartupDashboard, InvestorsPage, MarketingAgency, PatentPage, etc.
        │   ├── BusinessAdvisory/       # Business advisor role pages
        │   ├── marketing-agency/       # Marketing agency role pages
        │   ├── patent-firm/            # Patent firm role pages
        │   ├── Login.jsx, Register.jsx
        │   ├── ForgotPassword.jsx, ResetPassword.jsx
        │   └── Profile.jsx, AccountPage.jsx
        └── utils/
            └── auth.js                 # Auth helpers, Supabase client, role routing
```

---

## Setup

### Prerequisites
- Node.js 18+
- Python 3.12+
- A Supabase project

### Backend

```bash
cd backend
python3 -m venv venv
source venv/bin/activate      # Windows: venv\Scripts\activate
pip install -r requirements.txt

cp .env.example .env
# Fill in your keys (see .env.example)

uvicorn main:app --reload --port 8000
```

### Frontend

```bash
cd frontend
npm install

# Create frontend/.env
VITE_API_URL=http://localhost:8000
VITE_SUPABASE_URL=your-supabase-url
VITE_SUPABASE_ANON_KEY=your-anon-key

npm run dev
```

### Required Environment Variables

**`backend/.env`**
```env
SUPABASE_URL=...
SUPABASE_KEY=...
SUPABASE_SERVICE_KEY=...

AI_PROVIDER=azure
AZURE_API_KEY=...
AZURE_API_BASE=...
AZURE_API_VERSION=...
AZURE_OPENAI_DEPLOYMENT=gpt-4o

THESYS_API_KEY=...
THESYS_C1_MODEL=c1-exp/anthropic/claude-haiku-4.5

GEMINI_API_KEY=...
GOOGLE_ADK_MODEL=gemini-2.0-flash
```

### Database Setup

Run `backend/database/migrations/create_startup_benchmarks.sql` in your Supabase SQL editor, then seed the data:

```bash
cd backend
python3 database/seed_startup_benchmarks.py
```

---

## Development

| Command | Where | Description |
|---------|-------|-------------|
| `uvicorn main:app --reload` | `backend/` | Start API server (port 8000) |
| `npm run dev` | `frontend/` | Start Vite dev server (port 5173) |
| `npm run build` | `frontend/` | Production build check |

---

## Contributing

See [CONTRIBUTING.md](CONTRIBUTING.md).
