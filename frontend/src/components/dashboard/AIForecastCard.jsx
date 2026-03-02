import { useState } from 'react';
import './AIForecastCard.css';

const AIForecastCard = () => {
    const [period, setPeriod] = useState('Monthly');

    // Line path data points (x, y) in a 600×180 viewBox
    const points = [
        [0, 120], [80, 90], [140, 70], [220, 82],
        [300, 90], [380, 68], [460, 58], [540, 64], [600, 68]
    ];

    // Build smooth cubic bezier path from points
    const buildSmoothPath = (pts) => {
        if (pts.length < 2) return '';
        let d = `M ${pts[0][0]},${pts[0][1]}`;
        for (let i = 1; i < pts.length; i++) {
            const prev = pts[i - 1];
            const curr = pts[i];
            const cpX = (prev[0] + curr[0]) / 2;
            d += ` C ${cpX},${prev[1]} ${cpX},${curr[1]} ${curr[0]},${curr[1]}`;
        }
        return d;
    };

    const linePath = buildSmoothPath(points);
    const lastPt = points[points.length - 1];

    // Area fill path: line path + close down to baseline corners
    const areaPath = `${linePath} L ${lastPt[0]},180 L 0,180 Z`;

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
                    <span className="ai-forecast-chip-label">After 6 months</span>
                    <div className="ai-forecast-chip-value">
                        <span className="ai-forecast-value-main">43.50%</span>
                        <span className="ai-forecast-pill ai-forecast-pill-positive">+2.45%</span>
                    </div>
                </div>

                <div className="ai-forecast-chip">
                    <span className="ai-forecast-chip-label">Before 6 months</span>
                    <div className="ai-forecast-chip-value">
                        <span className="ai-forecast-value-main">$52,422</span>
                        <span className="ai-forecast-pill ai-forecast-pill-negative">-4.75%</span>
                    </div>
                </div>
            </div>

            <div className="ai-forecast-chart">
                <svg
                    className="ai-forecast-svg"
                    viewBox="0 0 600 180"
                    preserveAspectRatio="none"
                    overflow="visible"
                >
                    <defs>
                        {/* Glow filter – expanded bounds so it's not clipped */}
                        <filter id="aif-glow" x="-20%" y="-20%" width="140%" height="140%">
                            <feGaussianBlur stdDeviation="5" result="coloredBlur" />
                            <feMerge>
                                <feMergeNode in="coloredBlur" />
                                <feMergeNode in="SourceGraphic" />
                            </feMerge>
                        </filter>

                        {/* Dot glow filter */}
                        <filter id="aif-dot-glow" x="-100%" y="-100%" width="300%" height="300%">
                            <feGaussianBlur stdDeviation="4" result="coloredBlur" />
                            <feMerge>
                                <feMergeNode in="coloredBlur" />
                                <feMergeNode in="SourceGraphic" />
                            </feMerge>
                        </filter>

                        {/* Area fill gradient */}
                        <linearGradient id="aif-area-grad" x1="0" y1="0" x2="0" y2="1">
                            <stop offset="0%" stopColor="#00FFEF" stopOpacity="0.28" />
                            <stop offset="75%" stopColor="#00FFEF" stopOpacity="0.04" />
                            <stop offset="100%" stopColor="#00FFEF" stopOpacity="0" />
                        </linearGradient>

                        {/* Grid pattern */}
                        <pattern id="aif-grid" x="0" y="0" width="60" height="36" patternUnits="userSpaceOnUse">
                            <line x1="0" y1="0" x2="0" y2="180" stroke="rgba(255,255,255,0.04)" strokeWidth="1" />
                            <line x1="0" y1="0" x2="600" y2="0" stroke="rgba(255,255,255,0.04)" strokeWidth="1" />
                        </pattern>
                    </defs>

                    {/* Grid background */}
                    <rect x="0" y="0" width="600" height="180" fill="url(#aif-grid)" />

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

                    {/* Terminal dot (outer glow ring) */}
                    <circle
                        cx={lastPt[0]}
                        cy={lastPt[1]}
                        r="10"
                        fill="rgba(0,255,239,0.15)"
                        filter="url(#aif-dot-glow)"
                    />
                    {/* Terminal dot inner */}
                    <circle
                        cx={lastPt[0]}
                        cy={lastPt[1]}
                        r="5"
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