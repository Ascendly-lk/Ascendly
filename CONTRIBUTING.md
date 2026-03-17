# Contributing — Team Guidelines

A few ground rules to keep the codebase clean and working for everyone.

---

## 1. Never Hardcode Credentials

Never put real API keys, tokens, or database URLs directly in code or in `.env.example`.

**Wrong:**
```python
supabase = create_client("https://xyzproject.supabase.co", "eyJhbGci...")
```

**Right:**
```python
import os
from dotenv import load_dotenv
load_dotenv()

supabase = create_client(os.getenv("SUPABASE_URL"), os.getenv("SUPABASE_KEY"))
```

Your `.env` file (which is gitignored) holds the real values. Copy `.env.example` to `.env` and fill in your keys — that file is your starting point.

```bash
cp backend/.env.example backend/.env
# then open .env and fill in your actual keys
```

> The `.env.example` file should only ever contain placeholder strings like `your-api-key-here`. If you see a real key in `.env.example`, replace it immediately.

---

## 2. Adding a New Python Dependency

If your code needs a new package, add it to `requirements.txt` — not a separate `package.json`.

**Wrong:** Creating `backend/package.json` with `@supabase/supabase-js` (that's the JavaScript SDK — the backend is Python).

**Right:**
```bash
pip install some-package
# then add it to requirements.txt manually, or:
pip freeze | grep some-package >> backend/requirements.txt
```

Anyone cloning the repo sets up the backend with:
```bash
cd backend
pip install -r requirements.txt
```

---

## 3. Don't Commit Debug / Temp Scripts

If you write a one-off script to check the database or test an endpoint locally, do not commit it.

These do not belong in the repo:
- `check_tables.py`, `debug_metrics.py`, `tmp_verify_user_count.py` — run locally, delete after
- `test_api.py` (manual requests scripts) — use the proper test suite in `qa/` instead

If you need to verify the system is working, run:
```bash
cd backend
uvicorn main:app --reload
# then open http://localhost:8000/docs
```

---

## 4. Backend is Python — Frontend is JavaScript

The `backend/` folder is a **Python / FastAPI** project. Do not run `npm install` inside it.

| Folder | Runtime | Package manager |
|--------|---------|-----------------|
| `backend/` | Python 3.12 | `pip` + `requirements.txt` |
| `frontend/` | Node.js | `npm` + `package.json` |

---

## 5. Check Your Work Before Merging to Main

Before opening a PR to `Main`:

```bash
# Backend — make sure it starts cleanly
cd backend && pip install -r requirements.txt && uvicorn main:app --reload

# Frontend — make sure it builds cleanly
cd frontend && npm install && npm run build
```

If you used an AI tool to generate code, please review what it produced before committing. AI tools are helpful but they often hardcode values, add unnecessary files, or use the wrong language SDK for the project.

---

## 6. Project Structure Reference

```
ascendly/
├── backend/
│   ├── main.py                  # FastAPI entry point — do not add debug scripts here
│   ├── requirements.txt         # ALL Python dependencies go here
│   ├── .env.example             # Placeholder keys only — never real values
│   ├── .env                     # Your real keys — gitignored, never commit this
│   └── ...
└── frontend/
    ├── package.json             # Frontend JS dependencies only
    └── ...
```
