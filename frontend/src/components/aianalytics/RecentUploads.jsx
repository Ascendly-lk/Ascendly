import { useState, useEffect } from 'react';
import { apiFetch } from '../../api';
import { formatBytes, timeAgo } from '../../utils/format';
import './RecentUploads.css';

const FALLBACK_FILES = [
    { name: 'sales_data_2024.csv', meta: '2 hours ago • 2.4 MB' },
    { name: 'customer_analysis.xlsx', meta: '5 hours ago • 1.8 MB' },
    { name: 'quarterly_report.pdf', meta: '1 day ago • 890 KB' },
    { name: 'market_trends_Q4.csv', meta: '2 days ago • 3.1 MB' },
    { name: 'user_engagement.xlsx', meta: '3 days ago • 1.2 MB' },
];

const FileIcon = () => (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
        <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
        <polyline points="14 2 14 8 20 8" />
        <line x1="16" y1="13" x2="8" y2="13" />
        <line x1="16" y1="17" x2="8" y2="17" />
        <polyline points="10 9 9 9 8 9" />
    </svg>
);

const RecentUploads = () => {
    const [files, setFiles] = useState(FALLBACK_FILES);

    useEffect(() => {
        const fetchFiles = () => {
            apiFetch('/api/files/recent?limit=5')
                .then((res) => res.json())
                .then((data) => {
                    if (data.files && data.files.length > 0) {
                        setFiles(data.files.map((f) => ({
                            name: f.name,
                            meta: `${timeAgo(f.uploaded_at)} • ${formatBytes(f.size_bytes)}`,
                        })));
                    }
                })
                .catch(() => {});
        };
        fetchFiles();
        const onVisible = () => { if (document.visibilityState === 'visible') fetchFiles(); };
        document.addEventListener('visibilitychange', onVisible);
        return () => document.removeEventListener('visibilitychange', onVisible);
    }, []);

    return (
        <div className="recent-uploads-card">
            <h3 className="recent-uploads-title">Recent Uploads</h3>
            <ul className="recent-uploads-list">
                {files.map((file, i) => (
                    <li key={i} className="recent-uploads-item">
                        <div className="recent-uploads-icon">
                            <FileIcon />
                        </div>
                        <div className="recent-uploads-info">
                            <p className="recent-uploads-name">{file.name}</p>
                            <p className="recent-uploads-meta">{file.meta}</p>
                        </div>
                    </li>
                ))}
            </ul>
        </div>
    );
};

export default RecentUploads;
