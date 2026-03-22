/**
 * MSW request handlers — mock every backend endpoint used by frontend components.
 * These intercept calls to http://localhost:8000/... in the jsdom environment.
 */
import { http, HttpResponse } from 'msw';

const BASE = 'http://localhost:8000';

export const handlers = [
  // ── Health ──────────────────────────────────────────────
  http.get(`${BASE}/`, () => HttpResponse.json({ message: 'Ascendly API is running' })),
  http.get(`${BASE}/health/db`, () => HttpResponse.json({ status: 'ok' })),

  // ── Auth ────────────────────────────────────────────────
  http.post(`${BASE}/auth/signin`, () =>
    HttpResponse.json({
      access_token: 'mock-token-abc',
      user: { id: 'test-user-uuid', email: 'testuser@ascendly.test' },
    })
  ),
  http.post(`${BASE}/auth/signup`, () =>
    HttpResponse.json({ message: 'Account created. Please verify your email.' })
  ),
  http.post(`${BASE}/auth/signout`, () => HttpResponse.json({ message: 'Signed out' })),

  // ── Dashboard ───────────────────────────────────────────
  http.get(`${BASE}/api/dashboard/metrics`, () =>
    HttpResponse.json({
      total_files: 12,
      total_analyses: 47,
      recent_activity: 5,
      plan: 'pro',
    })
  ),

  // ── Files / Upload ──────────────────────────────────────
  http.get(`${BASE}/api/files/recent`, () =>
    HttpResponse.json([
      { id: '1', filename: 'sales_q1.csv', created_at: '2026-03-01T10:00:00Z' },
      { id: '2', filename: 'financials.xlsx', created_at: '2026-03-10T14:30:00Z' },
    ])
  ),
  http.post(`${BASE}/api/analysis/upload`, () =>
    HttpResponse.json({ file_id: 'mock-file-id-999', message: 'File uploaded successfully' })
  ),
  http.post(`${BASE}/api/analysis/analyze`, () =>
    HttpResponse.json({
      insights: ['Revenue grew 12% QoQ', 'Churn rate decreased to 3.2%'],
      summary: 'Overall positive performance trajectory.',
    })
  ),

  // ── Analytics ───────────────────────────────────────────
  http.get(`${BASE}/api/analytics/activity`, () =>
    HttpResponse.json({ labels: ['Mon', 'Tue', 'Wed'], values: [3, 7, 2] })
  ),

  // ── AI Chat ─────────────────────────────────────────────
  http.post(`${BASE}/api/chat`, () =>
    HttpResponse.text(
      'data: {"content":"Here is your financial summary."}\ndata: [DONE]\n\n',
      { headers: { 'Content-Type': 'text/event-stream' } }
    )
  ),

  // ── Conversations ───────────────────────────────────────
  http.get(`${BASE}/api/conversations`, () =>
    HttpResponse.json([
      { id: 'conv-1', title: 'Q1 Review', created_at: '2026-03-20T09:00:00Z' },
    ])
  ),
];
