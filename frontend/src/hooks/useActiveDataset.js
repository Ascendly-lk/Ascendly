import { useState, useEffect, useCallback } from 'react';
import { apiFetch } from '../api';

const ANALYZABLE = ['csv', 'xlsx', 'xls', 'json'];

export function useActiveDataset(initialDatasetId = null) {
    const [activeDataset, setActiveDataset] = useState(null); // { id, name, file_type }
    const [allFiles, setAllFiles] = useState([]);

    const fetchFiles = useCallback(async () => {
        try {
            const res = await apiFetch('/api/files/recent?limit=20');
            if (!res.ok) return;
            const data = await res.json();
            const files = (data.files || []).filter(f => ANALYZABLE.includes(f.file_type));
            setAllFiles(files);
            // Auto-select: prefer initialDatasetId, else most recent
            if (initialDatasetId) {
                const found = files.find(f => f.file_id === initialDatasetId);
                if (found) {
                    setActiveDataset({ id: found.file_id, name: found.name, file_type: found.file_type });
                    return;
                }
            }
            setActiveDataset(prev => {
                if (prev) return prev; // don't override manual selection
                if (files.length > 0) {
                    const f = files[0];
                    return { id: f.file_id, name: f.name, file_type: f.file_type };
                }
                return null;
            });
        } catch { /* ignore */ }
    }, [initialDatasetId]);

    useEffect(() => { fetchFiles(); }, [fetchFiles]);

    const trySelectByName = useCallback((text) => {
        const lower = text.toLowerCase();
        const match = allFiles.find(f =>
            lower.includes(f.name.toLowerCase().replace(/\.(csv|xlsx|xls|json)$/i, ''))
        );
        if (match) {
            const dataset = { id: match.file_id, name: match.name, file_type: match.file_type };
            setActiveDataset(dataset);
            return dataset;
        }
        return null;
    }, [allFiles]);

    const clearDataset = useCallback(() => setActiveDataset(null), []);

    const selectDataset = useCallback((file) => {
        setActiveDataset({ id: file.file_id, name: file.name, file_type: file.file_type });
    }, []);

    return { activeDataset, setActiveDataset, selectDataset, allFiles, fetchFiles, trySelectByName, clearDataset };
}
