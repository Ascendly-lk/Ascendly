import { useState, useRef, useCallback, useEffect } from 'react';
<<<<<<< HEAD
<<<<<<< HEAD
import { useLocation } from 'react-router-dom';
import AIAnalyticsTopBar from '../../components/aianalytics/AIAnalyticsTopBar';
import RecentUploads from '../../components/aianalytics/RecentUploads';
=======
import AIAnalyticsSidebar from '../../components/aianalytics/AIAnalyticsSidebar';
import AIAnalyticsTopBar from '../../components/aianalytics/AIAnalyticsTopBar';
>>>>>>> parent of ae17c912 (Update by deleting some files)
=======
import AIAnalyticsSidebar from '../../components/aianalytics/AIAnalyticsSidebar';
import AIAnalyticsTopBar from '../../components/aianalytics/AIAnalyticsTopBar';
>>>>>>> parent of ae17c912 (Update by deleting some files)
import { apiFetch } from '../../api';
import { formatBytes, timeAgo } from '../../utils/format';
import './UploadData.css';

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
    const [recentFiles, setRecentFiles] = useState([]);
    const [uploading, setUploading] = useState(false);
    const [uploadMsg, setUploadMsg] = useState('');
    const fileInputRef = useRef(null);

<<<<<<< HEAD
<<<<<<< HEAD
    const location = useLocation();
    const hasAutoOpened = useRef(false);

=======
>>>>>>> parent of ae17c912 (Update by deleting some files)
=======
>>>>>>> parent of ae17c912 (Update by deleting some files)
    const fetchRecentFiles = useCallback(() => {
        apiFetch('/api/files/recent?limit=3')
            .then((res) => res.json())
            .then((data) => {
                if (data.files) {
                    setRecentFiles(data.files.map((f) => ({
                        name: f.name,
                        meta: `${timeAgo(f.uploaded_at)} • ${formatBytes(f.size_bytes)}`,
                    })));
                }
            })
            .catch(() => {});
    }, []);

    useEffect(() => { fetchRecentFiles(); }, [fetchRecentFiles]);

<<<<<<< HEAD
<<<<<<< HEAD
    // Handle auto-open file browser if signaled from Quick Actions
    useEffect(() => {
        if (location.state?.autoOpen && !hasAutoOpened.current && fileInputRef.current) {
            hasAutoOpened.current = true;
            fileInputRef.current.click();
            // Clear state so it doesn't re-trigger on refresh/back
            window.history.replaceState({}, document.title);
        }
    }, [location.state]);


=======
>>>>>>> parent of ae17c912 (Update by deleting some files)
=======
>>>>>>> parent of ae17c912 (Update by deleting some files)
    const uploadFiles = useCallback(async (files) => {
        if (!files || files.length === 0 || uploading) return;
        setUploading(true);
        setUploadMsg('');
        try {
            for (const file of files) {
                const formData = new FormData();
                formData.append('file', file);
                const res = await apiFetch('/api/upload', { method: 'POST', body: formData });
                if (!res.ok) {
                    const err = await res.json().catch(() => ({}));
                    setUploadMsg(`Failed: ${err.detail || 'Upload error'}`);
                    return;
                }
            }
            setUploadMsg(`${files.length} file(s) uploaded successfully!`);
            fetchRecentFiles();
        } catch {
            setUploadMsg('Upload failed. Please try again.');
        } finally {
            setUploading(false);
        }
    }, [fetchRecentFiles]);

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
        if (!uploading) uploadFiles(e.dataTransfer.files);
    }, [uploadFiles, uploading]);

    return (
<<<<<<< HEAD
<<<<<<< HEAD
        <div className="upload-main">
            <AIAnalyticsTopBar />

            {/* ── Content ── */}
            <div className="upload-content">
                {/* ... rest of the content ... */}
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
                            onClick={() => !uploading && fileInputRef.current?.click()}
                            disabled={uploading}
                            aria-label="Upload files"
                        >
                            <UploadIcon />
                        </button>

                        <p className="upload-drop-text">
                            {uploading ? 'Uploading...' : 'Drop your files here, or browse'}
                        </p>
                        <p className="upload-drop-sub">Supports: CSV, Excel, PDF, JSON, TXT (Max 50MB)</p>
                        {uploadMsg && <p className="upload-drop-sub" style={{ color: uploadMsg.startsWith('Failed') ? '#ef4444' : '#10b981' }}>{uploadMsg}</p>}

                        <button
                            className="upload-select-btn"
                            onClick={() => fileInputRef.current?.click()}
                            disabled={uploading}
                        >
                            {uploading ? 'Uploading...' : 'Select Files'}
                        </button>

                        {/* Hidden file input */}
                        <input
                            ref={fileInputRef}
                            type="file"
                            multiple
                            accept=".csv,.xlsx,.xls,.pdf,.json,.txt"
                            className="upload-file-input"
                            onChange={(e) => { uploadFiles(e.target.files); e.target.value = ''; }}
                        />
                    </div>
                </div>

                {/* Bottom row */}
                <div className="upload-bottom-row">
                    <RecentUploads />
                    {/* Right side intentionally empty per Figma */}
=======
=======
>>>>>>> parent of ae17c912 (Update by deleting some files)
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
                                onClick={() => !uploading && fileInputRef.current?.click()}
                                disabled={uploading}
                                aria-label="Upload files"
                            >
                                <UploadIcon />
                            </button>

                            <p className="upload-drop-text">
                                {uploading ? 'Uploading...' : 'Drop your files here, or browse'}
                            </p>
                            <p className="upload-drop-sub">Supports: CSV, Excel, PDF, JSON, TXT (Max 50MB)</p>
                            {uploadMsg && <p className="upload-drop-sub" style={{ color: uploadMsg.startsWith('Failed') ? '#ef4444' : '#10b981' }}>{uploadMsg}</p>}

                            <button
                                className="upload-select-btn"
                                onClick={() => fileInputRef.current?.click()}
                                disabled={uploading}
                            >
                                {uploading ? 'Uploading...' : 'Select Files'}
                            </button>

                            {/* Hidden file input */}
                            <input
                                ref={fileInputRef}
                                type="file"
                                multiple
                                accept=".csv,.xlsx,.xls,.pdf,.json,.txt"
                                className="upload-file-input"
                                onChange={(e) => { uploadFiles(e.target.files); e.target.value = ''; }}
                            />
                        </div>
                    </div>

                    {/* Bottom row */}
                    <div className="upload-bottom-row">
                        {/* Recent Uploads */}
                        <div className="upload-recent-card">
                            <h3 className="upload-recent-title">Recent Uploads</h3>
                            <ul className="upload-recent-list">
                                {recentFiles.map((file, i) => (
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
<<<<<<< HEAD
>>>>>>> parent of ae17c912 (Update by deleting some files)
=======
>>>>>>> parent of ae17c912 (Update by deleting some files)
                </div>
            </div>
        </div>
    );
};

export default UploadData;
