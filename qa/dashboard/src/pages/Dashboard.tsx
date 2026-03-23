/**
 * Main QA Dashboard page.
 *
 * Data source priority:
 *   1. VITE_SUMMARY_URL env var (Supabase Storage public URL) — used in production
 *   2. /summary.json in the same Vite dev server origin — used when running locally
 *      after `node scripts/aggregate-results.js`
 */
import React, { useEffect, useState } from 'react';
import { TestSuiteCard } from '../components/TestSuiteCard';
import { EndpointStatusRow } from '../components/EndpointStatusRow';
import { RunHistory } from '../components/RunHistory';

const SUMMARY_URL =
  (import.meta as any).env?.VITE_SUMMARY_URL ?? '/results/summary.json';

interface Summary {
  generated_at: string;
  run_id: string;
  git_sha: string;
  git_branch: string;
  overall: { passed: number; failed: number; skipped: number; total: number };
  suites: Array<{ name: string; passed: number; failed: number; total: number; duration_ms: number }>;
  failed_tests: Array<{ suite: string; name: string; error: string }>;
  endpoint_health: Array<{ endpoint: string; status: 'ok' | 'slow' | 'error'; latency_ms: number | null }>;
}

export function Dashboard() {
  const [summary, setSummary] = useState<Summary | null>(null);
  const [history, setHistory] = useState<Summary[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch(SUMMARY_URL)
      .then((r) => {
        if (!r.ok) throw new Error(`HTTP ${r.status}`);
        return r.json();
      })
      .then((data) => {
        // Support single object or array of runs
        if (Array.isArray(data)) {
          setHistory(data);
          setSummary(data[data.length - 1] ?? null);
        } else {
          setSummary(data);
          setHistory([data]);
        }
      })
      .catch((e) => setError(e.message))
      .finally(() => setLoading(false));
  }, []);

  if (loading) return <p style={styles.msg}>Loading results…</p>;
  if (error)   return <p style={styles.error}>Could not load summary.json: {error}</p>;
  if (!summary) return <p style={styles.msg}>No test results found.</p>;

  const allPass = summary.overall.failed === 0;

  return (
    <div style={styles.page}>
      {/* ── Header ─────────────────────────────────────────────────────── */}
      <div style={styles.header}>
        <div>
          <h1 style={styles.title}>Ascendly QA Dashboard</h1>
          <p style={styles.sub}>
            Branch: <code style={styles.code}>{summary.git_branch}</code> ·
            SHA: <code style={styles.code}>{summary.git_sha}</code> ·
            {new Date(summary.generated_at).toLocaleString()}
          </p>
        </div>
        <div style={{ ...styles.overallBadge, background: allPass ? '#4ade80' : '#f87171' }}>
          {allPass ? '✓ ALL PASS' : `✗ ${summary.overall.failed} FAILED`}
        </div>
      </div>

      {/* ── Overall counts ──────────────────────────────────────────────── */}
      <div style={styles.counts}>
        {[
          { label: 'Passed',  value: summary.overall.passed,  color: '#4ade80' },
          { label: 'Failed',  value: summary.overall.failed,  color: '#f87171' },
          { label: 'Skipped', value: summary.overall.skipped, color: '#facc15' },
          { label: 'Total',   value: summary.overall.total,   color: '#94a3b8' },
        ].map(({ label, value, color }) => (
          <div key={label} style={styles.countCard}>
            <span style={{ fontSize: 28, fontWeight: 800, color }}>{value}</span>
            <span style={{ fontSize: 12, color: '#64748b', textTransform: 'uppercase' }}>{label}</span>
          </div>
        ))}
      </div>

      {/* ── Test Suites ─────────────────────────────────────────────────── */}
      <section style={styles.section}>
        <h2 style={styles.sectionTitle}>Test Suites</h2>
        <div style={styles.suiteGrid}>
          {summary.suites.map((s) => <TestSuiteCard key={s.name} suite={s} />)}
        </div>
      </section>

      {/* ── Failed Tests ────────────────────────────────────────────────── */}
      {summary.failed_tests.length > 0 && (
        <section style={styles.section}>
          <h2 style={{ ...styles.sectionTitle, color: '#f87171' }}>Failed Tests</h2>
          {summary.failed_tests.map((t, i) => (
            <div key={i} style={styles.failCard}>
              <p style={{ color: '#f87171', fontWeight: 700 }}>{t.suite} › {t.name}</p>
              <pre style={styles.pre}>{t.error}</pre>
            </div>
          ))}
        </section>
      )}

      {/* ── Endpoint Health ─────────────────────────────────────────────── */}
      {summary.endpoint_health?.length > 0 && (
        <section style={styles.section}>
          <h2 style={styles.sectionTitle}>Endpoint Health</h2>
          <div style={styles.tableWrap}>
            <table style={{ width: '100%', borderCollapse: 'collapse' }}>
              <thead>
                <tr style={{ background: '#0f172a' }}>
                  {['Endpoint', 'Status', 'Latency'].map((h) => (
                    <th key={h} style={styles.th}>{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {summary.endpoint_health.map((ep) => (
                  <EndpointStatusRow key={ep.endpoint} ep={ep} />
                ))}
              </tbody>
            </table>
          </div>
        </section>
      )}

      {/* ── Run History ─────────────────────────────────────────────────── */}
      {history.length > 1 && (
        <section style={styles.section}>
          <h2 style={styles.sectionTitle}>Run History</h2>
          <div style={styles.tableWrap}>
            <RunHistory runs={[...history].reverse()} />
          </div>
        </section>
      )}
    </div>
  );
}

const styles: Record<string, React.CSSProperties> = {
  page: { maxWidth: 960, margin: '0 auto', padding: '40px 20px' },
  header: { display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 32 },
  title: { fontSize: 26, fontWeight: 800, color: '#f1f5f9', marginBottom: 6 },
  sub: { color: '#64748b', fontSize: 13 },
  code: { background: '#1e293b', borderRadius: 4, padding: '1px 6px', color: '#7dd3fc', fontSize: 12 },
  overallBadge: { borderRadius: 12, padding: '10px 24px', fontSize: 16, fontWeight: 800, color: '#0f172a' },
  counts: { display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 16, marginBottom: 40 },
  countCard: { background: '#1e293b', borderRadius: 12, padding: 20, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 4 },
  section: { marginBottom: 40 },
  sectionTitle: { fontSize: 18, fontWeight: 700, color: '#f1f5f9', marginBottom: 16 },
  suiteGrid: { display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: 16 },
  failCard: { background: '#1e293b', borderRadius: 10, padding: 16, marginBottom: 10 },
  pre: { background: '#0f172a', borderRadius: 6, padding: 12, fontSize: 11, color: '#fca5a5', overflowX: 'auto', marginTop: 8 },
  tableWrap: { background: '#1e293b', borderRadius: 12, overflow: 'hidden' },
  th: { padding: '10px 14px', textAlign: 'left', color: '#64748b', fontSize: 11, textTransform: 'uppercase', letterSpacing: 1 },
  msg: { color: '#64748b', textAlign: 'center', padding: 60 },
  error: { color: '#f87171', textAlign: 'center', padding: 60 },
};
