/**
 * QA Status Page — /qa-status
 *
 * Pings all backend endpoints and displays a live health dashboard.
 * Color-coded: green (200), yellow (>2 s), red (error / timeout).
 * Auto-refreshes every 30 s.
 *
 * Public route — no auth required.
 */
import { useState, useEffect, useCallback } from 'react';
import { getToken } from '../api';

const API_BASE = import.meta.env.VITE_API_URL || `http://${window.location.hostname}:8000`;
const REFRESH_INTERVAL = 30_000;

const ENDPOINTS = [
  { label: 'Root',              method: 'GET',  path: '/',                         auth: false },
  { label: 'DB Health',         method: 'GET',  path: '/health/db',                auth: true  },
  { label: 'Dashboard Metrics', method: 'GET',  path: '/api/dashboard/metrics',    auth: true  },
  { label: 'Recent Files',      method: 'GET',  path: '/api/files/recent',         auth: true  },
  { label: 'Analytics Activity',method: 'GET',  path: '/api/analytics/activity',   auth: true  },
  { label: 'Auth (401 check)',  method: 'POST', path: '/auth/signin',              auth: false,
    body: JSON.stringify({ email: 'qa-probe@ascendly.test', password: 'wrong' }),
    expectedStatus: 400 },
];

const STATUS = { ok: 'ok', slow: 'slow', error: 'error', pending: 'pending' };

async function pingEndpoint(endpoint, token) {
  const start = performance.now();
  try {
    const headers = { 'Content-Type': 'application/json' };
    if (endpoint.auth && token) headers['Authorization'] = `Bearer ${token}`;

    const res = await fetch(`${API_BASE}${endpoint.path}`, {
      method: endpoint.method,
      headers,
      body: endpoint.body ?? undefined,
      signal: AbortSignal.timeout(5_000),
    });

    const latency = Math.round(performance.now() - start);
    const expected = endpoint.expectedStatus ?? 200;
    const ok = res.status === expected || (res.status >= 200 && res.status < 300 && !endpoint.expectedStatus);

    if (!ok) return { status: STATUS.error, latency, httpStatus: res.status };
    if (latency > 2000) return { status: STATUS.slow, latency, httpStatus: res.status };
    return { status: STATUS.ok, latency, httpStatus: res.status };
  } catch (err) {
    return { status: STATUS.error, latency: null, httpStatus: null, error: err.message };
  }
}

const DOT = {
  [STATUS.ok]:      { color: '#4ade80', label: 'OK' },
  [STATUS.slow]:    { color: '#facc15', label: 'SLOW' },
  [STATUS.error]:   { color: '#f87171', label: 'ERROR' },
  [STATUS.pending]: { color: '#94a3b8', label: '…' },
};

export default function QAStatus() {
  const [results, setResults] = useState(
    ENDPOINTS.map((e) => ({ ...e, status: STATUS.pending, latency: null, httpStatus: null }))
  );
  const [lastChecked, setLastChecked] = useState(null);
  const [checking, setChecking] = useState(false);

  const runChecks = useCallback(async () => {
    setChecking(true);
    const token = getToken();
    const updated = await Promise.all(
      ENDPOINTS.map(async (ep) => {
        const result = await pingEndpoint(ep, token);
        return { ...ep, ...result };
      })
    );
    setResults(updated);
    setLastChecked(new Date());
    setChecking(false);
  }, []);

  useEffect(() => {
    runChecks();
    const id = setInterval(runChecks, REFRESH_INTERVAL);
    return () => clearInterval(id);
  }, [runChecks]);

  const overall = results.every((r) => r.status === STATUS.ok)
    ? STATUS.ok
    : results.some((r) => r.status === STATUS.error)
    ? STATUS.error
    : results.some((r) => r.status === STATUS.slow)
    ? STATUS.slow
    : STATUS.pending;

  return (
    <div style={styles.page}>
      <div style={styles.card}>
        {/* Header */}
        <div style={styles.header}>
          <div>
            <h1 style={styles.title}>Ascendly API Health</h1>
            <p style={styles.subtitle}>
              {lastChecked
                ? `Last checked: ${lastChecked.toLocaleTimeString()} · auto-refresh every 30 s`
                : 'Checking…'}
            </p>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
            <span style={{ ...styles.badge, background: DOT[overall].color }}>
              {DOT[overall].label}
            </span>
            <button
              onClick={runChecks}
              disabled={checking}
              style={styles.refreshBtn}
            >
              {checking ? 'Checking…' : '↻ Refresh'}
            </button>
          </div>
        </div>

        {/* Table */}
        <table style={styles.table}>
          <thead>
            <tr style={styles.thead}>
              <th style={styles.th}>Endpoint</th>
              <th style={styles.th}>Method</th>
              <th style={styles.th}>Status</th>
              <th style={styles.th}>HTTP</th>
              <th style={styles.th}>Latency</th>
            </tr>
          </thead>
          <tbody>
            {results.map((r) => (
              <tr key={r.path} style={styles.row}>
                <td style={styles.td}>
                  <span style={styles.label}>{r.label}</span>
                  <span style={styles.path}>{r.method} {r.path}</span>
                </td>
                <td style={styles.td}>
                  <code style={styles.method}>{r.method}</code>
                </td>
                <td style={styles.td}>
                  <span style={{ ...styles.dot, background: DOT[r.status].color }} />
                  <span style={{ color: DOT[r.status].color, fontWeight: 600 }}>
                    {DOT[r.status].label}
                  </span>
                </td>
                <td style={styles.td}>
                  {r.httpStatus !== null ? (
                    <code style={styles.http}>{r.httpStatus}</code>
                  ) : '—'}
                </td>
                <td style={styles.td}>
                  {r.latency !== null ? `${r.latency} ms` : '—'}
                </td>
              </tr>
            ))}
          </tbody>
        </table>

        <p style={styles.footer}>
          Green ≤ 2000 ms · Yellow &gt; 2000 ms · Red = error / timeout (5 s)
        </p>
      </div>
    </div>
  );
}

const styles = {
  page: { minHeight: '100vh', background: '#0f172a', padding: '40px 20px', fontFamily: 'Inter, system-ui, sans-serif' },
  card: { maxWidth: 800, margin: '0 auto', background: '#1e293b', borderRadius: 16, padding: 32, boxShadow: '0 8px 32px rgba(0,0,0,0.4)' },
  header: { display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 28 },
  title: { margin: 0, color: '#f1f5f9', fontSize: 24, fontWeight: 700 },
  subtitle: { margin: '4px 0 0', color: '#64748b', fontSize: 13 },
  badge: { borderRadius: 20, padding: '4px 14px', fontSize: 13, fontWeight: 700, color: '#0f172a' },
  refreshBtn: { background: '#334155', color: '#e2e8f0', border: 'none', borderRadius: 8, padding: '8px 16px', cursor: 'pointer', fontSize: 14 },
  table: { width: '100%', borderCollapse: 'collapse', marginTop: 8 },
  thead: { background: '#0f172a' },
  th: { padding: '10px 14px', textAlign: 'left', color: '#64748b', fontSize: 12, textTransform: 'uppercase', letterSpacing: 1, fontWeight: 600 },
  row: { borderBottom: '1px solid #334155' },
  td: { padding: '12px 14px', color: '#cbd5e1', fontSize: 14, verticalAlign: 'middle' },
  label: { display: 'block', color: '#f1f5f9', fontWeight: 600, marginBottom: 2 },
  path: { display: 'block', color: '#64748b', fontSize: 12 },
  method: { background: '#334155', color: '#7dd3fc', borderRadius: 4, padding: '2px 6px', fontSize: 12 },
  http: { background: '#334155', color: '#a5b4fc', borderRadius: 4, padding: '2px 6px', fontSize: 12 },
  dot: { display: 'inline-block', width: 8, height: 8, borderRadius: '50%', marginRight: 6 },
  footer: { marginTop: 20, color: '#475569', fontSize: 12, textAlign: 'center' },
};
