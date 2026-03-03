import { useState, useRef, useEffect } from 'react';
import './RevenueTrendCard.css';

/* ── Datasets ────────────────────────────────────────────────────────────── */
const DATASETS = {
    Monthly: {
        labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'],
        values: [60, 75, 50, 80, 65, 90, 70, 82, 74, 88, 92, 95],
        total: '$682.5K',
        status: 'On track',
    },
    Quarterly: {
        labels: ['Q1', 'Q2', 'Q3', 'Q4'],
        values: [185, 235, 226, 275],
        total: '$921K',
        status: 'On track',
    },
    Yearly: {
        labels: ['2021', '2022', '2023', '2024', '2025'],
        values: [320, 450, 580, 700, 921],
        total: '$2.97M',
        status: 'Ahead',
    },
};

/* ── Layout constants ────────────────────────────────────────────────────── */
const LABEL_HEIGHT = 24;   // px reserved at bottom for X-axis labels
const Y_LABEL_W = 42;      // px reserved on left for Y-axis ticks + label
const PADDING = { top: 20, right: 16, bottom: LABEL_HEIGHT, left: Y_LABEL_W };

/* ── Helper: smooth cubic-bezier SVG path ────────────────────────────────── */
function buildPath(pts) {
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
function calcYTicks(values, chartH, top) {
    const min = Math.min(...values);
    const max = Math.max(...values);
    return Array.from({ length: 5 }, (_, i) => {
        const frac = i / 4;
        const val = Math.round(min + frac * (max - min));
        const y = top + chartH - frac * chartH;
        return { val, y };
    });
}

/* ── Component ───────────────────────────────────────────────────────────── */
const RevenueTrendCard = () => {
    const [period, setPeriod] = useState('Monthly');
    const containerRef = useRef(null);
    const [dims, setDims] = useState({ width: 400, height: 160 });

    // ResizeObserver — update dims when container resizes
    useEffect(() => {
        if (!containerRef.current) return;
        const ro = new ResizeObserver(entries => {
            for (const entry of entries) {
                const { width, height } = entry.contentRect;
                if (width > 0 && height > 0) setDims({ width, height });
            }
        });
        ro.observe(containerRef.current);
        return () => ro.disconnect();
    }, []);

    const ds = DATASETS[period];
    const { width, height } = dims;
    const chartW = width - PADDING.left - PADDING.right;
    const chartH = height - PADDING.top - PADDING.bottom;

    // Map data → SVG coordinates
    const minVal = Math.min(...ds.values);
    const maxVal = Math.max(...ds.values);
    const range = maxVal - minVal || 1;

    const pts = ds.values.map((v, i) => {
        const x = PADDING.left + (i / (ds.values.length - 1)) * chartW;
        const y = PADDING.top + chartH - ((v - minVal) / range) * chartH;
        return [x, y];
    });

    const linePath = buildPath(pts);
    const lastPt = pts[pts.length - 1];

    // Area fill closes to bottom baseline
    const areaPath = pts.length
        ? `${linePath} L ${lastPt[0]},${PADDING.top + chartH} L ${pts[0][0]},${PADDING.top + chartH} Z`
        : '';

    // Horizontal grid lines (5 lines)
    const gridLines = Array.from({ length: 5 }, (_, i) =>
        PADDING.top + (i / 4) * chartH
    );

    // Y-axis ticks
    const yTicks = calcYTicks(ds.values, chartH, PADDING.top);

    return (
        <div className="revenue-trend-card">
            <div className="revenue-trend-header">
                <h3>Revenue Trend</h3>
                <div className="revenue-trend-dropdown">
                    <select value={period} onChange={(e) => setPeriod(e.target.value)}>
                        <option>Monthly</option>
                        <option>Quarterly</option>
                        <option>Yearly</option>
                    </select>
                    <svg className="rt-chevron" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                        <polyline points="6 9 12 15 18 9" />
                    </svg>
                </div>
            </div>

            <div className="revenue-trend-value">
                <h2>{ds.total}</h2>
            </div>

            <div className="revenue-trend-status">
                <svg viewBox="0 0 24 24" fill="currentColor">
                    <path d="M9 16.17L4.83 12l-1.42 1.41L9 19 21 7l-1.41-1.41L9 16.17z" />
                </svg>
                {ds.status}
            </div>

            <div className="revenue-trend-chart" ref={containerRef}>
                <svg
                    width={width}
                    height={height}
                    viewBox={`0 0 ${width} ${height}`}
                    overflow="visible"
                >
                    <defs>
                        <linearGradient id="rt-area-grad" x1="0" y1="0" x2="0" y2="1">
                            <stop offset="0%" stopColor="#00FFEF" stopOpacity="0.25" />
                            <stop offset="100%" stopColor="#00FFEF" stopOpacity="0" />
                        </linearGradient>
                        <filter id="rt-glow" x="-20%" y="-20%" width="140%" height="140%">
                            <feGaussianBlur stdDeviation="5" result="coloredBlur" />
                            <feMerge>
                                <feMergeNode in="coloredBlur" />
                                <feMergeNode in="SourceGraphic" />
                            </feMerge>
                        </filter>
                        <filter id="rt-dot-glow" x="-100%" y="-100%" width="300%" height="300%">
                            <feGaussianBlur stdDeviation="4" result="coloredBlur" />
                            <feMerge>
                                <feMergeNode in="coloredBlur" />
                                <feMergeNode in="SourceGraphic" />
                            </feMerge>
                        </filter>
                    </defs>

                    {/* Horizontal grid lines */}
                    {gridLines.map((y, i) => (
                        <line
                            key={i}
                            x1={PADDING.left} y1={y}
                            x2={width - PADDING.right} y2={y}
                            stroke="rgba(255,255,255,0.05)"
                            strokeWidth="1"
                            strokeDasharray="4 6"
                        />
                    ))}

                    {/* Y-axis ticks */}
                    {yTicks.map(({ val, y }, i) => (
                        <g key={i}>
                            <line
                                x1={PADDING.left - 4} y1={y}
                                x2={PADDING.left} y2={y}
                                stroke="rgba(255,255,255,0.2)" strokeWidth="1"
                            />
                            <text
                                x={PADDING.left - 6} y={y + 3}
                                textAnchor="end"
                                fontSize="9"
                                fill="rgba(255,255,255,0.32)"
                                fontFamily="inherit"
                            >
                                {val}
                            </text>
                        </g>
                    ))}

                    {/* Y-axis label "Revenue ($)" — rotated vertically */}
                    <text
                        x={10}
                        y={PADDING.top + chartH / 2}
                        textAnchor="middle"
                        fontSize="9"
                        fill="rgba(255,255,255,0.28)"
                        fontFamily="inherit"
                        transform={`rotate(-90, 10, ${PADDING.top + chartH / 2})`}
                    >
                        Revenue ($)
                    </text>

                    {/* Area fill */}
                    {areaPath && <path d={areaPath} fill="url(#rt-area-grad)" />}

                    {/* Glow layer */}
                    {linePath && (
                        <path
                            d={linePath}
                            stroke="rgba(0,255,239,0.38)"
                            strokeWidth="10"
                            fill="none"
                            filter="url(#rt-glow)"
                        />
                    )}

                    {/* Main bezier line */}
                    {linePath && (
                        <path
                            d={linePath}
                            stroke="#00FFEF"
                            strokeWidth="2.5"
                            fill="none"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                        />
                    )}

                    {/* X-axis labels */}
                    {pts.map((pt, i) => (
                        <text
                            key={i}
                            x={pt[0]}
                            y={height - 4}
                            textAnchor="middle"
                            fontSize="9"
                            fill="rgba(255,255,255,0.38)"
                            fontFamily="inherit"
                        >
                            {ds.labels[i]}
                        </text>
                    ))}

                    {/* Terminal dot glow ring */}
                    {lastPt && (
                        <>
                            <circle
                                cx={lastPt[0]} cy={lastPt[1]} r="10"
                                fill="rgba(0,255,239,0.15)"
                                filter="url(#rt-dot-glow)"
                            />
                            <circle
                                cx={lastPt[0]} cy={lastPt[1]} r="4.5"
                                fill="#00FFEF"
                                stroke="#0f172a"
                                strokeWidth="2"
                            />
                        </>
                    )}
                </svg>
            </div>
        </div>
    );
};

export default RevenueTrendCard;