import { useState, useEffect } from 'react';
import AIAnalyticsTopBar from '../../components/aianalytics/AIAnalyticsTopBar';
import AIStatCard from '../../components/aianalytics/AIStatCard';
import AIAnalyticsChart from '../../components/aianalytics/AIAnalyticsChart';
import RecentUploads from '../../components/aianalytics/RecentUploads';
import QuickActions from '../../components/aianalytics/QuickActions';
import { apiFetch } from '../../api';
import './AIAnalyticsDashboard.css';

/* ── Stat card icons ── */
const UploadIcon = () => (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
        <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
        <polyline points="17 8 12 3 7 8" />
        <line x1="12" y1="3" x2="12" y2="15" />
    </svg>
);

const QueryIcon = () => (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
        <rect x="3" y="11" width="18" height="10" rx="2" />
        <circle cx="12" cy="5" r="2" />
        <line x1="12" y1="7" x2="12" y2="11" />
    </svg>
);

const DataIcon = () => (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
        <ellipse cx="12" cy="5" rx="9" ry="3" />
        <path d="M21 12c0 1.66-4 3-9 3s-9-1.34-9-3" />
        <path d="M3 5v14c0 1.66 4 3 9 3s9-1.34 9-3V5" />
    </svg>
);

const ReportIcon = () => (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
        <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
        <polyline points="14 2 14 8 20 8" />
        <line x1="16" y1="13" x2="8" y2="13" />
        <line x1="16" y1="17" x2="8" y2="17" />
    </svg>
);

const AIAnalyticsDashboard = () => {
    const [metrics, setMetrics] = useState(null);

    useEffect(() => {
        apiFetch('/api/dashboard/metrics')
            .then((res) => {
                if (!res.ok) throw new Error('Failed to fetch metrics');
                return res.json();
            })
            .then(setMetrics)
            .catch(() => {});
    }, []);

    const m = metrics || {
        files_uploaded: { value: '--', change_percent: 0 },
        ai_queries: { value: '--', change_percent: 0 },
        data_processed: { value: '--', change_percent: 0 },
        active_reports: { value: '--', change_percent: 0 },
    };

    const fmt = (v) => (v >= 0 ? `+${v}%` : `${v}%`);

    return (
        <div className="ai-dashboard-main">
            <AIAnalyticsTopBar />

            <div className="ai-dashboard-content">
                {/* Row 1 — Stats */}
                <div className="ai-stats-row">
                    <AIStatCard
                        icon={<UploadIcon />}
                        title="Files Uploaded"
                        value={String(m.files_uploaded.value)}
                        change={fmt(m.files_uploaded.change_percent)}
                        variant="dark"
                    />
                    <AIStatCard
                        icon={<QueryIcon />}
                        title="AI Queries"
                        value={String(m.ai_queries.value)}
                        change={fmt(m.ai_queries.change_percent)}
                        variant="dark"
                    />
                    <AIStatCard
                        icon={<DataIcon />}
                        title="Data Processed"
                        value={String(m.data_processed.value)}
                        change={fmt(m.data_processed.change_percent)}
                        variant="dark"
                    />
                    <AIStatCard
                        icon={<ReportIcon />}
                        title="Active Reports"
                        value={String(m.active_reports.value)}
                        change={fmt(m.active_reports.change_percent)}
                        variant="highlight"
                    />
                </div>

                {/* Row 2 — Chart */}
                <AIAnalyticsChart />

                {/* Row 3 — Bottom cards */}
                <div className="ai-bottom-row">
                    <RecentUploads />
                    <QuickActions />
                </div>
            </div>
        </div>
    );
};

export default AIAnalyticsDashboard;