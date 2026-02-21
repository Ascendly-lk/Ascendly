import { useState } from 'react';
import './AIForecastCard.css';

const AIForecastCard = () => {
    const [period, setPeriod] = useState('Monthly');

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
                    <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
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
                <svg viewBox="0 0 600 180" preserveAspectRatio="none">
                    <defs>
                        <filter id="glow" x="-50%" y="-50%" width="200%" height="200%">
                            <feGaussianBlur stdDeviation="4" result="coloredBlur" />
                            <feMerge>
                                <feMergeNode in="coloredBlur" />
                                <feMergeNode in="SourceGraphic" />
                            </feMerge>
                        </filter>
                    </defs>
                    {/* Glow layer - wider, semi-transparent */}
                    <path
                        d="M 0,120 Q 50,100 80,90 T 140,70 Q 180,60 220,80 T 300,90 Q 340,85 380,70 T 460,60 Q 500,55 540,65 T 600,70"
                        stroke="rgba(0, 229, 255, 0.35)"
                        strokeWidth="10"
                        fill="none"
                        filter="url(#glow)"
                    />
                    {/* Main line - thicker and brighter */}
                    <path
                        d="M 0,120 Q 50,100 80,90 T 140,70 Q 180,60 220,80 T 300,90 Q 340,85 380,70 T 460,60 Q 500,55 540,65 T 600,70"
                        stroke="#00E5FF"
                        strokeWidth="3.5"
                        fill="none"
                    />
                </svg>
            </div>
        </div>
    );
};

export default AIForecastCard;
