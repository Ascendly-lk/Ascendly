import React from 'react';

interface Run {
  run_id: string;
  generated_at: string;
  git_branch: string;
  git_sha: string;
  overall: { passed: number; failed: number; total: number };
}

export function RunHistory({ runs }: { runs: Run[] }) {
  if (!runs.length) {
    return <p style={{ color: '#475569', fontSize: 13 }}>No previous runs recorded.</p>;
  }

  return (
    <table style={{ width: '100%', borderCollapse: 'collapse' }}>
      <thead>
        <tr>
          {['Run ID', 'Branch', 'SHA', 'Passed', 'Failed', 'Date'].map((h) => (
            <th key={h} style={styles.th}>{h}</th>
          ))}
        </tr>
      </thead>
      <tbody>
        {runs.map((r) => (
          <tr key={r.run_id} style={styles.row}>
            <td style={styles.td}><code style={styles.code}>{r.run_id.slice(0, 8)}</code></td>
            <td style={styles.td}>{r.git_branch}</td>
            <td style={styles.td}><code style={styles.code}>{r.git_sha}</code></td>
            <td style={{ ...styles.td, color: '#4ade80' }}>{r.overall.passed}</td>
            <td style={{ ...styles.td, color: r.overall.failed > 0 ? '#f87171' : '#4ade80' }}>
              {r.overall.failed}
            </td>
            <td style={{ ...styles.td, color: '#64748b' }}>
              {new Date(r.generated_at).toLocaleString()}
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  );
}

const styles: Record<string, React.CSSProperties> = {
  th: { padding: '8px 12px', textAlign: 'left', color: '#64748b', fontSize: 11, textTransform: 'uppercase', letterSpacing: 1 },
  row: { borderBottom: '1px solid #1e293b' },
  td: { padding: '10px 12px', fontSize: 13, color: '#cbd5e1' },
  code: { background: '#1e293b', borderRadius: 4, padding: '2px 6px', color: '#a5b4fc', fontSize: 11 },
};
