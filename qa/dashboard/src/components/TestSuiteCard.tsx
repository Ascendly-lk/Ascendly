import React from 'react';

interface Suite {
  name: string;
  passed: number;
  failed: number;
  total: number;
  duration_ms: number;
}

export function TestSuiteCard({ suite }: { suite: Suite }) {
  const passRate = suite.total > 0 ? Math.round((suite.passed / suite.total) * 100) : 0;
  const allPass = suite.failed === 0;
  const color = allPass ? '#4ade80' : '#f87171';

  return (
    <div style={styles.card}>
      <div style={styles.top}>
        <span style={styles.name}>{suite.name}</span>
        <span style={{ ...styles.badge, background: color, color: '#0f172a' }}>
          {allPass ? 'PASS' : 'FAIL'}
        </span>
      </div>

      {/* Progress bar */}
      <div style={styles.barBg}>
        <div style={{ ...styles.barFill, width: `${passRate}%`, background: color }} />
      </div>

      <div style={styles.stats}>
        <span style={{ color: '#4ade80' }}>✓ {suite.passed}</span>
        {suite.failed > 0 && <span style={{ color: '#f87171' }}>✗ {suite.failed}</span>}
        <span style={{ color: '#64748b' }}>{suite.total} total</span>
        <span style={{ color: '#64748b', marginLeft: 'auto' }}>
          {(suite.duration_ms / 1000).toFixed(1)} s
        </span>
      </div>
    </div>
  );
}

const styles: Record<string, React.CSSProperties> = {
  card: { background: '#1e293b', borderRadius: 12, padding: 20, display: 'flex', flexDirection: 'column', gap: 12 },
  top: { display: 'flex', justifyContent: 'space-between', alignItems: 'center' },
  name: { fontWeight: 700, color: '#f1f5f9', fontSize: 15 },
  badge: { borderRadius: 20, padding: '3px 12px', fontSize: 12, fontWeight: 700 },
  barBg: { height: 6, background: '#334155', borderRadius: 3, overflow: 'hidden' },
  barFill: { height: '100%', borderRadius: 3, transition: 'width 0.4s ease' },
  stats: { display: 'flex', gap: 16, fontSize: 13, alignItems: 'center' },
};
