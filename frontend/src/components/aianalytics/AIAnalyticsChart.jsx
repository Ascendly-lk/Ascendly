import { useState, useRef, useEffect } from 'react';
import './AIAnalyticsChart.css';

/* ── Monthly data ── */
const MONTHLY_LABELS = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
const MONTHLY_HEIGHTS = [40, 55, 35, 70, 50, 80, 60, 90, 65, 75, 45, 85];

/* ── Yearly data (last 6 years) ── */
const currentYear = new Date().getFullYear();
const YEARLY_LABELS = Array.from({ length: 6 }, (_, i) => String(currentYear - 5 + i));
const YEARLY_HEIGHTS = [38, 50, 62, 55, 78, 90];

const AIAnalyticsChart = () => {
    const [period, setPeriod] = useState('Monthly');
    const [open, setOpen] = useState(false);
    const dropdownRef = useRef(null);

    const labels = period === 'Monthly' ? MONTHLY_LABELS : YEARLY_LABELS;
    const heights = period === 'Monthly' ? MONTHLY_HEIGHTS : YEARLY_HEIGHTS;

    /* Close dropdown when clicking outside */
    useEffect(() => {
        const handler = (e) => {
            if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
                setOpen(false);
            }
        };
        document.addEventListener('mousedown', handler);
        return () => document.removeEventListener('mousedown', handler);
    }, []);

    const handleSelect = (value) => {
        setPeriod(value);
        setOpen(false);
    };

    return (
        <div className="ai-chart-card">
            {/* Card Header */}
            <div className="ai-chart-header">
                <div className="ai-chart-header-left">
                    <p className="ai-chart-label">AI Analytics Activity</p>
                    <p className="ai-chart-value">$682.5</p>
                </div>

                {/* Period dropdown */}
                <div className="ai-chart-dropdown-wrap" ref={dropdownRef}>
                    <button
                        className="ai-chart-period-btn"
                        onClick={() => setOpen((prev) => !prev)}
                        aria-haspopup="listbox"
                        aria-expanded={open}
                    >
                        <span>{period}</span>
                        <svg
                            className={`ai-chart-chevron ${open ? 'open' : ''}`}
                            viewBox="0 0 24 24"
                            fill="none"
                            stroke="currentColor"
                            strokeWidth="2.5"
                        >
                            <polyline points="6 9 12 15 18 9" />
                        </svg>
                    </button>

                    {open && (
                        <ul className="ai-chart-dropdown" role="listbox">
                            {['Monthly', 'Yearly'].map((opt) => (
                                <li
                                    key={opt}
                                    role="option"
                                    aria-selected={period === opt}
                                    className={`ai-chart-dropdown-item ${period === opt ? 'selected' : ''}`}
                                    onClick={() => handleSelect(opt)}
                                >
                                    {opt}
                                </li>
                            ))}
                        </ul>
                    )}
                </div>
            </div>

            {/* Legend */}
            <div className="ai-chart-legend">
                {/* <span className="ai-chart-legend-dot" /> */}
                {/* <span className="ai-chart-legend-text">Monthly Usage Trend</span> */}
            </div>

            {/* Bar Chart */}
            <div className="ai-chart-bars">
                {heights.map((h, i) => (
                    <div key={i} className="ai-chart-col">
                        <div
                            className="ai-chart-bar"
                            style={{ height: `${h}%` }}
                        />
                        <span className="ai-chart-month">{labels[i]}</span>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default AIAnalyticsChart;

