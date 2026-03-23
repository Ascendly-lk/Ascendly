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
      files_uploaded:  { value: 12,   change_percent: 5  },
      ai_queries:      { value: 47,   change_percent: 10 },
      data_processed:  { value: 1200, change_percent: 3  },
      active_reports:  { value: 5,    change_percent: -2 },
    })
  ),

  // ── Files / Upload ──────────────────────────────────────
  http.get(`${BASE}/api/files/recent`, () =>
    HttpResponse.json({
      files: [
        { id: '1', filename: 'sales_q1.csv',    created_at: '2026-03-01T10:00:00Z' },
        { id: '2', filename: 'financials.xlsx', created_at: '2026-03-10T14:30:00Z' },
      ],
      count: 2,
    })
  ),
  http.post(`${BASE}/api/upload`, () =>
    HttpResponse.json({ file_id: 'mock-file-id-999', message: 'File uploaded successfully' })
  ),
  http.post(`${BASE}/api/analyze`, () =>
    HttpResponse.json({
      insights: ['Revenue grew 12% QoQ', 'Churn rate decreased to 3.2%'],
      summary: 'Overall positive performance trajectory.',
    })
  ),

  // ── Analytics ───────────────────────────────────────────
  http.get(`${BASE}/api/analytics/activity`, () =>
    HttpResponse.json({
      period:      'monthly',
      labels:      ['Jan', 'Feb', 'Mar'],
      data:        [30, 70, 50],
      values:      [3000, 7000, 5000],
      total_value: 15000,
    })
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
