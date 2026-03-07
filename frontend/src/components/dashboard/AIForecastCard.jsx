import { useState } from 'react';
import './AIForecastCard.css';

/* ── Datasets ────────────────────────────────────────────────────────────── */
const DATASETS = {
    Monthly: {
        labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'],
        values: [38, 42, 45, 41, 47, 52, 50, 55, 53, 58, 61, 64],
        chip1: { label: 'After 6 months', value: '43.50%', pill: '+2.45%', positive: true },
        chip2: { label: 'Before 6 months', value: '$52,422', pill: '-4.75%', positive: false },
    },
    Quarterly: {
        labels: ['Q1', 'Q2', 'Q3', 'Q4'],
        values: [42, 50, 55, 62],
        chip1: { label: 'H2 Forecast', value: '58.50%', pill: '+6.30%', positive: true },
        chip2: { label: 'H1 Actual', value: '$48,100', pill: '-2.10%', positive: false },
    },
    Yearly: {
        labels: ['2021', '2022', '2023', '2024', '2025'],
        values: [30, 40, 48, 57, 64],
        chip1: { label: 'YOY Growth', value: '12.30%', pill: '+3.80%', positive: true },
        chip2: { label: '5Y Average', value: '$44,860', pill: '+1.20%', positive: true },
    },
};

/* ── Chart constants ─────────────────────────────────────────────────────── */
const VB_W = 600;
const VB_H = 200;          // taller than before to fit X-axis labels below line
const CHART_TOP = 12;
const CHART_BOTTOM = 30;   // space for X-axis labels
const CHART_LEFT = 40;     // space for Y-axis labels
const CHART_RIGHT = 10;
const CHART_W = VB_W - CHART_LEFT - CHART_RIGHT;
const CHART_H = VB_H - CHART_TOP - CHART_BOTTOM;

/* ── Helper: map values → [x,y] coords ──────────────────────────────────── */
function mapPoints(values) {
    const min = Math.min(...values);
    const max = Math.max(...values);
    const range = max - min || 1;
    return values.map((v, i) => {
        const x = CHART_LEFT + (i / (values.length - 1)) * CHART_W;
        const y = CHART_TOP + CHART_H - ((v - min) / range) * CHART_H;
        return [x, y];
    });
}

/* ── Helper: smooth cubic bezier path ───────────────────────────────────── */
function buildSmoothPath(pts) {
    if (pts.length < 2) return '';
    let d = `M ${pts[0][0]},${pts[0][1]}`;
    for (let i = 1; i < pts.length; i++) {
        const prev = pts[i - 1];
        const curr = pts[i];
        const cpX = (prev[0] + curr[0]) / 2;
        d += ` C ${cpX},${prev[1]} ${cpX},${curr[1]} ${curr[0]},${curr[1]}`;
    }
    return d;
}

/* ── Y-axis ticks (5 evenly spaced) ─────────────────────────────────────── */
function yTicks(values) {
    const min = Math.min(...values);
    const max = Math.max(...values);
    return Array.from({ length: 5 }, (_, i) => {
        const frac = i / 4;
        const val = Math.round(min + frac * (max - min));
        const y = CHART_TOP + CHART_H - frac * CHART_H;
        return { val, y };
    });
}

/* ── Component ───────────────────────────────────────────────────────────── */
const AIForecastCard = () => {
    const [period, setPeriod] = useState('Monthly');
    const ds = DATASETS[period];

    const pts = mapPoints(ds.values);
    const linePath = buildSmoothPath(pts);
    const lastPt = pts[pts.length - 1];
    const areaPath = `${linePath} L ${lastPt[0]},${CHART_TOP + CHART_H} L ${CHART_LEFT},${CHART_TOP + CHART_H} Z`;

    return (
        <div className="ai-forecast-card">
            <div className="ai-forecast-header">
                <h3>AI Forecasting</h3>
                <div className="ai-forecast-dropdown">
                    <select value={period} onChange={(e) => setPeriod(e.target.value)}>
                        <option>Monthly</option>
                        <option>Quarterly</option>
                        <option>Yearly</option>
                    </select>
                    <svg className="dropdown-chevron" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                        <polyline points="6 9 12 15 18 9" />
                    </svg>
                </div>
            </div>

            <div className="ai-forecast-chips">
                <div className="ai-forecast-chip">
                    <span className="ai-forecast-chip-label">{ds.chip1.label}</span>
                    <div className="ai-forecast-chip-value">
                        <span className="ai-forecast-value-main">{ds.chip1.value}</span>
                        <span className={`ai-forecast-pill ${ds.chip1.positive ? 'ai-forecast-pill-positive' : 'ai-forecast-pill-negative'}`}>
                            {ds.chip1.pill}
                        </span>
                    </div>
                </div>

                <div className="ai-forecast-chip">
                    <span className="ai-forecast-chip-label">{ds.chip2.label}</span>
                    <div className="ai-forecast-chip-value">
                        <span className="ai-forecast-value-main">{ds.chip2.value}</span>
                        <span className={`ai-forecast-pill ${ds.chip2.positive ? 'ai-forecast-pill-positive' : 'ai-forecast-pill-negative'}`}>
                            {ds.chip2.pill}
                        </span>
                    </div>
                </div>
            </div>

            <div className="ai-forecast-chart">
                <svg
                    className="ai-forecast-svg"
                    viewBox={`0 0 ${VB_W} ${VB_H}`}
                    preserveAspectRatio="none"
                    overflow="visible"
                >
                    <defs>
                        <filter id="aif-glow" x="-20%" y="-20%" width="140%" height="140%">
                            <feGaussianBlur stdDeviation="5" result="coloredBlur" />
                            <feMerge>
                                <feMergeNode in="coloredBlur" />
                                <feMergeNode in="SourceGraphic" />
                            </feMerge>
                        </filter>
                        <filter id="aif-dot-glow" x="-100%" y="-100%" width="300%" height="300%">
                            <feGaussianBlur stdDeviation="4" result="coloredBlur" />
                            <feMerge>
                                <feMergeNode in="coloredBlur" />
                                <feMergeNode in="SourceGraphic" />
                            </feMerge>
                        </filter>
                        <linearGradient id="aif-area-grad" x1="0" y1="0" x2="0" y2="1">
                            <stop offset="0%" stopColor="#00FFEF" stopOpacity="0.28" />
                            <stop offset="75%" stopColor="#00FFEF" stopOpacity="0.04" />
                            <stop offset="100%" stopColor="#00FFEF" stopOpacity="0" />
                        </linearGradient>
                        <pattern id="aif-grid" x="0" y="0" width="60" height="36" patternUnits="userSpaceOnUse">
                            <line x1="0" y1="0" x2="0" y2={VB_H} stroke="rgba(255,255,255,0.04)" strokeWidth="1" />
                            <line x1="0" y1="0" x2={VB_W} y2="0" stroke="rgba(255,255,255,0.04)" strokeWidth="1" />
                        </pattern>
                    </defs>

                    {/* Grid background */}
                    <rect x="0" y="0" width={VB_W} height={VB_H} fill="url(#aif-grid)" />

                    {/* Y-axis ticks + label */}
                    {yTicks(ds.values).map(({ val, y }, i) => (
                        <g key={i}>
                            <line
                                x1={CHART_LEFT - 4} y1={y}
                                x2={CHART_LEFT} y2={y}
                                stroke="rgba(255,255,255,0.2)" strokeWidth="1"
                            />
                            <text
                                x={CHART_LEFT - 6} y={y + 3}
                                textAnchor="end"
                                fontSize="9"
                                fill="rgba(255,255,255,0.35)"
                                fontFamily="inherit"
                            >
                                {val}
                            </text>
                        </g>
                    ))}

                    {/* Y-axis label "Forecast (%)" — rotated vertically */}
                    <text
                        x={8}
                        y={CHART_TOP + CHART_H / 2}
                        textAnchor="middle"
                        fontSize="9"
                        fill="rgba(255,255,255,0.3)"
                        fontFamily="inherit"
                        transform={`rotate(-90, 8, ${CHART_TOP + CHART_H / 2})`}
                    >
                        Forecast (%)
                    </text>

                    {/* Area fill */}
                    <path d={areaPath} fill="url(#aif-area-grad)" />

                    {/* Glow stroke layer */}
                    <path
                        d={linePath}
                        stroke="rgba(0,255,239,0.4)"
                        strokeWidth="10"
                        fill="none"
                        filter="url(#aif-glow)"
                    />

                    {/* Main line */}
                    <path
                        d={linePath}
                        stroke="#00FFEF"
                        strokeWidth="2.5"
                        fill="none"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                    />

                    {/* X-axis labels */}
                    {pts.map((pt, i) => (
                        <text
                            key={i}
                            x={pt[0]}
                            y={VB_H - 6}
                            textAnchor="middle"
                            fontSize="9"
                            fill="rgba(255,255,255,0.35)"
                            fontFamily="inherit"
                        >
                            {ds.labels[i]}
                        </text>
                    ))}

                    {/* Terminal dot glow ring */}
                    <circle
                        cx={lastPt[0]} cy={lastPt[1]} r="10"
                        fill="rgba(0,255,239,0.15)"
                        filter="url(#aif-dot-glow)"
                    />
                    {/* Terminal dot inner */}
                    <circle
                        cx={lastPt[0]} cy={lastPt[1]} r="5"
                        fill="#00FFEF"
                        stroke="#0f172a"
                        strokeWidth="2"
                    />
                </svg>
            </div>
        </div>
    );
};

export default AIForecastCard;
