import { useState } from 'react';
import './RevenueTrendCard.css';

const RevenueTrendCard = () => {
    const [period, setPeriod] = useState('Monthly');

    const barHeights = [60, 75, 50, 80, 65, 90, 70];

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
                </div>
            </div>

            <div className="revenue-trend-value">
                <h2>$682.5</h2>
            </div>

            <div className="revenue-trend-status">
                <svg viewBox="0 0 24 24" fill="currentColor">
                    <path d="M9 16.17L4.83 12l-1.42 1.41L9 19 21 7l-1.41-1.41L9 16.17z" />
                </svg>
                On track
            </div>

            <div className="revenue-trend-chart">
                {barHeights.map((height, index) => (
                    <div
                        key={index}
                        className="revenue-bar"
                        style={{ height: `${height}%` }}
                    />
                ))}
            </div>
        </div>
    );
};

export default RevenueTrendCard;
