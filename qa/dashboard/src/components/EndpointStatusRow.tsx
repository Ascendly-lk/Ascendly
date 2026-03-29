import React from 'react';

interface EndpointHealth {
  endpoint: string;
  status: 'ok' | 'slow' | 'error';
  latency_ms: number | null;
}

const DOT: Record<string, { color: string; label: string }> = {
  ok:    { color: '#4ade80', label: 'OK' },
  slow:  { color: '#facc15', label: 'SLOW' },
  error: { color: '#f87171', label: 'ERROR' },
};

export function EndpointStatusRow({ ep }: { ep: EndpointHealth }) {
  const d = DOT[ep.status] ?? DOT.error;
  return (
    <tr style={styles.row}>
      <td style={styles.td}>
        <code style={styles.code}>{ep.endpoint}</code>
      </td>
      <td style={styles.td}>
        <span style={{ ...styles.dot, background: d.color }} />
        <span style={{ color: d.color, fontWeight: 600 }}>{d.label}</span>
      </td>
      <td style={{ ...styles.td, color: '#94a3b8', textAlign: 'right' }}>
        {ep.latency_ms !== null ? `${ep.latency_ms} ms` : '—'}
      </td>
    </tr>
  );
}

const styles: Record<string, React.CSSProperties> = {
  row: { borderBottom: '1px solid #1e293b' },
  td: { padding: '10px 14px', fontSize: 13, color: '#cbd5e1', verticalAlign: 'middle' },
  code: { background: '#1e293b', borderRadius: 4, padding: '2px 8px', color: '#7dd3fc', fontSize: 12 },
  dot: { display: 'inline-block', width: 8, height: 8, borderRadius: '50%', marginRight: 6 },
};
