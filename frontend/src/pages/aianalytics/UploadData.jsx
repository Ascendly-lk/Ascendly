import { useState, useRef, useCallback } from 'react';
import AIAnalyticsSidebar from '../../components/aianalytics/AIAnalyticsSidebar';
import AIAnalyticsTopBar from '../../components/aianalytics/AIAnalyticsTopBar';
import './UploadData.css';

/* ── Recent uploads list ── */
const RECENT_FILES = [
    { name: 'sales_data_2024.csv', meta: '2 hours ago • 2.4 MB' },
    { name: 'customer_analysis.xlsx', meta: '5 hours ago • 1.8 MB' },
    { name: 'quarterly_report.pdf', meta: '1 day ago • 890 KB' },
];

/* ── Icons ── */
const FileIcon = () => (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
        <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
        <polyline points="14 2 14 8 20 8" />
        <line x1="16" y1="13" x2="8" y2="13" />
        <line x1="16" y1="17" x2="8" y2="17" />
    </svg>
);

const SearchIcon = () => (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
        <circle cx="11" cy="11" r="8" />
        <path d="m21 21-4.35-4.35" />
    </svg>
);

const UploadIcon = () => (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
        <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
        <polyline points="17 8 12 3 7 8" />
        <line x1="12" y1="3" x2="12" y2="15" />
    </svg>
);

/* ── Page ── */
const UploadData = () => {
    const [isDragging, setIsDragging] = useState(false);
    const fileInputRef = useRef(null);

    const handleDragOver = useCallback((e) => {
        e.preventDefault();
        setIsDragging(true);
    }, []);

    const handleDragLeave = useCallback((e) => {
        e.preventDefault();
        setIsDragging(false);
    }, []);

    const handleDrop = useCallback((e) => {
        e.preventDefault();
        setIsDragging(false);
        // Files available at e.dataTransfer.files — wired for future backend
    }, []);

    return (
        <div className="upload-page">
            <AIAnalyticsSidebar />

            <div className="upload-main">
                <AIAnalyticsTopBar />

                {/* ── Content ── */}
                <div className="upload-content">

                    {/* Big Upload Card */}
                    <div className="upload-card">
                        <p className="upload-card-title">Upload Files</p>

                        {/* Inner dropzone */}
                        <div
                            className={`upload-dropzone ${isDragging ? 'dragging' : ''}`}
                            onDragOver={handleDragOver}
                            onDragLeave={handleDragLeave}
                            onDrop={handleDrop}
                        >
                            <button
                                className="upload-icon-btn"
                                onClick={() => fileInputRef.current?.click()}
                                aria-label="Upload files"
                            >
                                <UploadIcon />
                            </button>

                            <p className="upload-drop-text">Drop your files here, or browse</p>
                            <p className="upload-drop-sub">Supports: CSV, Excel, PDF, JSON, TXT (Max 50MB)</p>

                            <button
                                className="upload-select-btn"
                                onClick={() => fileInputRef.current?.click()}
                            >
                                Select Files
                            </button>

                            {/* Hidden file input */}
                            <input
                                ref={fileInputRef}
                                type="file"
                                multiple
                                accept=".csv,.xlsx,.xls,.pdf,.json,.txt"
                                className="upload-file-input"
                                onChange={(e) => { /* hook up to backend later */ }}
                            />
                        </div>
                    </div>

                    {/* Bottom row */}
                    <div className="upload-bottom-row">
                        {/* Recent Uploads */}
                        <div className="upload-recent-card">
                            <h3 className="upload-recent-title">Recent Uploads</h3>
                            <ul className="upload-recent-list">
                                {RECENT_FILES.map((file, i) => (
                                    <li key={i} className="upload-recent-item">
                                        <div className="upload-recent-icon">
                                            <FileIcon />
                                        </div>
                                        <div className="upload-recent-info">
                                            <p className="upload-recent-name">{file.name}</p>
                                            <p className="upload-recent-meta">{file.meta}</p>
                                        </div>
                                    </li>
                                ))}
                            </ul>
                        </div>
                        {/* Right side intentionally empty per Figma */}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default UploadData;
