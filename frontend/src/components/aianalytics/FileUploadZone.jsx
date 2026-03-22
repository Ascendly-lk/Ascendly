/**
 * FileUploadZone — custom C1 component rendered by Thesys when no dataset is loaded.
 *
 * C1 injects this component into the chat bubble when the system prompt's
 * DATASET GUARD RULE triggers. Handles drag-and-drop + click-to-browse upload
 * with XHR progress, and signals C1 to continue the conversation after upload.
 */
import { useRef } from 'react';
import { useOnAction, useC1State } from '@thesysai/genui-sdk';
import { getToken } from '../../api';
import './FileUploadZone.css';

const API_BASE =
    import.meta.env.VITE_API_URL ||
    `${window.location.protocol}//${window.location.hostname}:8000`;

export const FileUploadZone = ({ allowedTypes, maxSizeMB }) => {
    const fileInputRef = useRef(null);
    const onAction = useOnAction();
    const { getValue, setValue } = useC1State('FileUploadZone');

    const progress = getValue('progress') ?? 0;
    const status   = getValue('status')   ?? 'idle';   // idle | uploading | done | error

    const handleFile = (file) => {
        setValue('status', 'uploading');
        setValue('progress', 0);

        const formData = new FormData();
        formData.append('file', file);

        const xhr = new XMLHttpRequest();

        xhr.upload.onprogress = (e) => {
            if (e.lengthComputable) {
                setValue('progress', Math.round((e.loaded / e.total) * 100));
            }
        };

        xhr.onload = () => {
            if (xhr.status === 200) {
                setValue('status', 'done');
                onAction(
                    'FileUploaded',
                    `User uploaded file: ${file.name}. Please now analyse this dataset.`
                );
            } else {
                setValue('status', 'error');
            }
        };

        xhr.onerror = () => setValue('status', 'error');

        const token = getToken();
        if (!token) {
            setValue('status', 'error');
            return;
        }

        xhr.open('POST', `${API_BASE}/api/upload`);
        xhr.setRequestHeader('Authorization', `Bearer ${token}`);
        xhr.send(formData);
    };

    const acceptAttr = allowedTypes?.join(',') ?? '.csv,.xlsx,.xls,.json';

    return (
        <div
            className={`c1-upload-zone c1-upload-zone--${status}`}
            onDragOver={(e) => e.preventDefault()}
            onDrop={(e) => {
                e.preventDefault();
                const f = e.dataTransfer.files[0];
                if (f) handleFile(f);
            }}
            onClick={() => status === 'idle' && fileInputRef.current?.click()}
            role="button"
            tabIndex={0}
            onKeyDown={(e) => {
                if (status !== 'idle') return;
                if (e.key === 'Enter' || e.key === ' ' || e.key === 'Spacebar') {
                    e.preventDefault();
                    fileInputRef.current?.click();
                }
            }}
        >
            <input
                ref={fileInputRef}
                type="file"
                hidden
                accept={acceptAttr}
                onChange={(e) => e.target.files?.[0] && handleFile(e.target.files[0])}
            />

            {status === 'idle' && (
                <>
                    <div className="c1-upload-icon">📂</div>
                    <p className="c1-upload-primary">Drag & drop your dataset here</p>
                    <p className="c1-upload-secondary">or click to browse</p>
                </>
            )}

            {status === 'uploading' && (
                <>
                    <p className="c1-upload-primary">Uploading… {progress}%</p>
                    <progress className="c1-upload-progress" value={progress} max={100} />
                </>
            )}

            {status === 'done' && (
                <p className="c1-upload-primary c1-upload-done">
                    Upload complete — analysing your data…
                </p>
            )}

            {status === 'error' && (
                <p className="c1-upload-primary c1-upload-error">
                    Upload failed. Please try again.
                </p>
            )}

            <small className="c1-upload-hint">
                CSV, XLSX, XLS, JSON · max {maxSizeMB ?? 50} MB
            </small>
        </div>
    );
};
