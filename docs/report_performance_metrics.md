## 5. Performance Evaluation

### 5.1 Evaluation Methodology

To ensure that the Ascendly platform meets the reliability and responsiveness expectations of a production-grade SaaS application, a systematic API performance evaluation was conducted across five core endpoints. The evaluation employed a three-layer quality assurance strategy comprising pytest for backend API validation, Vitest for frontend unit and integration tests, and Playwright for end-to-end browser-level acceptance testing. Each endpoint was assessed against four dimensions: response latency under normal load, HTTP status code correctness (including authentication enforcement), payload structure conformance, and input validation robustness.

All authenticated endpoints depend on the `require_auth` FastAPI dependency (defined in `database/supabase_client.py`), which validates Supabase JWT bearer tokens. During automated testing, this dependency is overridden via `app.dependency_overrides` to inject deterministic mock user objects, thereby isolating API behaviour from external authentication infrastructure. This approach follows established test-double patterns recommended by the FastAPI documentation (Ramirez, 2023).

### 5.2 Endpoint Performance Summary

The table below summarises the five evaluated endpoints, their authentication requirements, target response times, and the validation checks performed.

| Endpoint | Method | Auth Required | Response Time Target | Validation Checks |
|---|---|---|---|---|
| `/api/dashboard/metrics` | GET | Yes (Bearer) | < 500 ms | JSON keys: `files_uploaded`, `ai_queries`, `data_processed`, `active_reports`; each containing `value` and `change_percent`. Returns 401 for unauthenticated requests. |
| `/api/analytics/activity` | GET | Yes (Bearer) | < 800 ms | JSON keys: `period`, `labels`, `data`, `values`, `total_value`. Query parameter `period` accepts `monthly` or `yearly` only. Returns 401 without token. |
| `/api/analyze` | POST | Yes (Bearer) | 10--30 s | Accepts only `.csv` files (400 for other formats). Enforces 10 MB maximum file size (413 for oversized payloads). Returns 403 when `user_id` does not match the authenticated user. Payload includes `status`, `data`, and `metadata` keys on success. |
| `/api/datasets/{id}/insights` | GET | Yes (Bearer) | < 500 ms | JSON keys: `dataset_id`, `insights`, `count`. Returns 403 if dataset ownership check fails. Returns 404 for non-existent dataset identifiers. |
| `/api/chat` | POST | Yes (Bearer) | First token < 2 s | Returns `text/event-stream` media type with `Cache-Control: no-cache` and `X-Accel-Buffering: no` headers. SSE events conform to the `data: {JSON}\n\n` format, emitting `token`, `progress`, `result`, `done`, or `error` event types. Returns 400 for empty messages; 403 for unauthorised dataset access. |

### 5.3 Results and Analysis

**Dashboard and Analytics Endpoints.** The `GET /api/dashboard/metrics` endpoint aggregates data from three Supabase tables (`uploaded_files`, `ai_logs`, `ai_insights`) within a single request handler, computing 30-day rolling change percentages via the `_calc_change` utility function. Under normal load with a modest dataset volume, observed response times remained well within the 500 ms target. The `GET /api/analytics/activity` endpoint queries the `financial_records` table and groups revenue data by month or year; its < 800 ms target accounts for the additional database round-trip.

**AI Analysis Pipeline.** The `POST /api/analyze` endpoint invokes the three-agent CrewAI pipeline through `run_analysis()`, which sequentially executes the Data Analyst, Forecaster (SARIMAX), and Strategist agents. The 10--30 second target reflects the inherent latency of three sequential LLM calls to Azure GPT-4o combined with SARIMAX model fitting. The deterministic test suite (`test_analyst_agent.py`) validates the output schema of `parse_outputs()` across nominal and edge cases -- including empty inputs, malformed JSON, and missing forecast data -- ensuring graceful degradation without runtime exceptions.

**Chat Streaming.** The `POST /api/chat` endpoint implements dual-mode streaming: a quick conversational path using `litellm.acompletion()` with token-by-token SSE emission, and an analysis path that streams three-step progress events before delegating to the CrewAI pipeline. The `_sse()` helper function enforces consistent SSE framing. A response cache (`cache_manager`) is employed for stateless requests to reduce redundant LLM invocations, improving perceived latency for repeated queries.

**Authentication and Authorisation.** All five endpoints correctly return HTTP 401 for requests lacking a valid bearer token. The `/api/analyze` endpoint additionally enforces user-level authorisation by comparing the form-submitted `user_id` against the authenticated identity, returning 403 on mismatch. The `/api/datasets/{id}/insights` and `/api/chat` endpoints perform dataset ownership verification via Supabase queries, ensuring data isolation between tenants.

### 5.4 Input Validation

File validation is enforced at two levels within the analysis module (`analysis.py`). The `POST /api/analyze` endpoint restricts uploads to `.csv` files and rejects payloads exceeding the `MAX_FILE_SIZE` constant of 10 MB with an HTTP 413 response. The general `POST /api/upload` endpoint supports a broader set of extensions (`.csv`, `.xlsx`, `.xls`, `.json`, `.pdf`, `.txt`) with a 50 MB ceiling (`MAX_UPLOAD_SIZE`). Path traversal is mitigated by applying `os.path.basename()` to all user-supplied filenames before writing to the temporary directory.

### 5.5 Summary

The evaluation demonstrates that the Ascendly API layer satisfies its defined performance targets across all five endpoints. Lightweight read endpoints respond within sub-second thresholds, while the AI analysis pipeline's latency is attributable to the sequential multi-agent architecture -- an acceptable trade-off given the depth of insight produced. The automated test suite provides regression coverage for schema correctness, authentication enforcement, and edge-case resilience, supporting continuous integration confidence as the platform evolves.

---

### References

Ramirez, S. (2023) *FastAPI Documentation: Testing*. Available at: https://fastapi.tiangolo.com/tutorial/testing/ (Accessed: 22 March 2026).
