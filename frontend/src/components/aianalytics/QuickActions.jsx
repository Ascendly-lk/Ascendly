import './QuickActions.css';

const ACTIONS = [
    {
        icon: (
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
                <polyline points="17 8 12 3 7 8" />
                <line x1="12" y1="3" x2="12" y2="15" />
            </svg>
        ),
        title: 'Upload New Dataset',
        sub: 'Import CSV, Excel, PDF or JSON',
    },
    {
        icon: (
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
                <polyline points="14 2 14 8 20 8" />
                <line x1="16" y1="13" x2="8" y2="13" />
                <line x1="16" y1="17" x2="8" y2="17" />
            </svg>
        ),
        title: 'Generate Report',
        sub: 'Create AI-powered analytics report',
    },
    {
        icon: (
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <rect x="3" y="11" width="18" height="10" rx="2" />
                <circle cx="12" cy="5" r="2" />
                <line x1="12" y1="7" x2="12" y2="11" />
            </svg>
        ),
        title: 'Ask AI Assistant',
        sub: 'Query your data with natural language',
    },
];

const ArrowIcon = () => (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
        <polyline points="9 18 15 12 9 6" />
    </svg>
);

const QuickActions = () => {
    return (
        <div className="quick-actions-card">
            <h3 className="quick-actions-title">Quick Actions</h3>
            <ul className="quick-actions-list">
                {ACTIONS.map((action, i) => (
                    <li key={i} className="quick-actions-item">
                        <div className="quick-actions-icon">
                            {action.icon}
                        </div>
                        <div className="quick-actions-info">
                            <p className="quick-actions-name">{action.title}</p>
                            <p className="quick-actions-sub">{action.sub}</p>
                        </div>
                        <button className="quick-actions-btn" aria-label={action.title}>
                            <ArrowIcon />
                        </button>
                    </li>
                ))}
            </ul>
        </div>
    );
};

export default QuickActions;
