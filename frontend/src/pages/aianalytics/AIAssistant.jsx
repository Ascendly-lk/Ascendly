import { useState, useRef, useEffect, useCallback } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import ReactMarkdown from 'react-markdown';
import TopBar from '../../components/dashboard/TopBar';
import { apiFetch, getToken } from '../../api';
import AnalyticsPopup from '../../components/aianalytics/AnalyticsPopup';
import C1Message from '../../components/aianalytics/C1Message';
import PricingModal from '../../components/aianalytics/PricingModal';
import { useUsageGuard } from '../../hooks/useUsageGuard';
import { BarChart2, FileDown } from 'lucide-react';
import './AIAssistant.css';

const API_BASE =
    import.meta.env.VITE_API_URL ||
    `${window.location.protocol}//${window.location.hostname}:8000`;

const ANALYSIS_INTENT = /\b(analyze|analyse|forecast|predict|trend|report|compare|benchmark|revenue|growth|insight|recommendation|strategic|sarimax)\b/i;

/* ── Helpers ── */
const now = () => {
    const d = new Date();
    return `${String(d.getHours()).padStart(2, '0')}:${String(d.getMinutes()).padStart(2, '0')}`;
};

const INITIAL_MESSAGES = [
    {
        id: 1,
        role: 'assistant',
        text: "Hello! I'm your AI Analytics Assistant. Upload your files and I can help you analyze data, answer questions, and provide insights. How can I assist you today?",
        time: now(),
    },
];

/* ── Icons ── */
const BotIcon = () => (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
        <rect x="3" y="11" width="18" height="10" rx="2" />
        <circle cx="12" cy="5" r="2" />
        <line x1="12" y1="7" x2="12" y2="11" />
        <line x1="8" y1="15" x2="8" y2="17" />
        <line x1="16" y1="15" x2="16" y2="17" />
    </svg>
);

const SendIcon = () => (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2">
        <line x1="22" y1="2" x2="11" y2="13" />
        <polygon points="22 2 15 22 11 13 2 9 22 2" />
    </svg>
);

/* ── Suggestion chips ── */
const SUGGESTIONS_WITH_FILE = [
    "Analyze revenue trends",
    "Forecast next 3 months",
    "Compare with industry benchmarks",
    "Summarize this dataset",
];

const SUGGESTIONS_NO_FILE = [
    "Upload a dataset to get started",
    "What can you help me with?",
    "How does the analysis work?",
];

/* ── Progress Bar ── */
const ProgressStep = ({ step, total, label }) => (
    <div className="ai-chat-progress">
        <div className="ai-chat-progress-bar">
            <div
                className="ai-chat-progress-fill"
                style={{ width: `${(step / total) * 100}%` }}
            />
        </div>
        <span className="ai-chat-progress-label">
            Step {step}/{total} — {label}
        </span>
    </div>
);

/* ── Page Component ── */
const AIAssistant = () => {
    const [messages, setMessages] = useState(INITIAL_MESSAGES);
    const [input, setInput] = useState('');
    const [isSending, setIsSending] = useState(false);
    const [files, setFiles] = useState([]);
    const [selectedFileId, setSelectedFileId] = useState(null);
    const [showSuggestions, setShowSuggestions] = useState(true);
    const [showAnalyticsPopup, setShowAnalyticsPopup] = useState(false);
    const [hasAnalyticsData, setHasAnalyticsData] = useState(false);
    const [showComingSoon, setShowComingSoon] = useState(false);
    const location = useLocation();
    const navigate = useNavigate();
    const hasAutoPrompted = useRef(false);
    const messagesEndRef = useRef(null);
    const textareaRef = useRef(null);
    // Accumulates C1 DSL chunks keyed by assistantMsgId
    const c1AccumulatorRef = useRef({});

    const { guardedFetch, showPricingModal, limitError, closePricingModal } = useUsageGuard();

    // Keep a ref to messages for history building without adding to sendMessage deps
    const messagesRef = useRef(messages);
    useEffect(() => { messagesRef.current = messages; }, [messages]);

    /* Fetch user's uploaded files */
    const fetchFiles = useCallback(() => {
        apiFetch('/api/files/recent?limit=20')
            .then((res) => res.json())
            .then((data) => {
                const analyzableTypes = ['csv', 'xlsx', 'xls', 'json'];
                const validFiles = (data.files || []).filter(
                    (f) => analyzableTypes.includes(f.file_type)
                );
                setFiles(validFiles);
            })
            .catch(() => {});
    }, []);

    const sendMessage = useCallback(async (overrideText, overrideDatasetId) => {
        const trimmed = (overrideText || input).trim();
        if (!trimmed || isSending) return;

        const datasetId = overrideDatasetId ?? selectedFileId;

        // Build history from all messages except the initial greeting
        const history = messagesRef.current.slice(1).map((m) => ({
            role: m.role,
            content: m.text,
        }));

        const userMsg = { id: crypto.randomUUID(), role: 'user', text: trimmed, time: now() };
        const assistantMsgId = crypto.randomUUID();

        setInput('');
        setShowSuggestions(false);
        if (textareaRef.current) textareaRef.current.style.height = 'auto';

        // No-dataset guard: analysis intent without a dataset → show inline upload zone
        // Check BEFORE appending messages to avoid duplicates
        if (ANALYSIS_INTENT.test(trimmed) && !datasetId) {
            setMessages((prev) => [
                ...prev,
                userMsg,
                {
                    id: assistantMsgId,
                    role: 'assistant',
                    text: '',
                    uploadPrompt: true,
                    pendingMessage: trimmed,
                    time: now(),
                    streaming: false,
                },
            ]);
            return;
        }

        setMessages((prev) => [
            ...prev,
            userMsg,
            { id: assistantMsgId, role: 'assistant', text: '', time: now(), streaming: true },
        ]);
        setIsSending(true);

        try {
            const body = { message: trimmed, history };
            if (datasetId) body.dataset_id = datasetId;

            const res = await guardedFetch('/api/chat', {
                method: 'POST',
                body: JSON.stringify(body),
            });

            if (res.status === 429) {
                // Usage limit hit — modal already opened by guardedFetch
                setMessages((prev) =>
                    prev.map((m) =>
                        m.id === assistantMsgId
                            ? { ...m, text: "You've reached your plan limit. Please upgrade to continue.", streaming: false }
                            : m
                    )
                );
                return;
            }

            if (!res.ok) {
                const data = await res.json().catch(() => ({}));
                throw new Error(data.detail || 'Request failed');
            }

            const reader = res.body.getReader();
            const decoder = new TextDecoder();
            let buffer = '';

            // Initialise C1 accumulator for this message
            c1AccumulatorRef.current[assistantMsgId] = '';

            const processLine = (line) => {
                if (!line.startsWith('data: ')) return;
                try {
                    const event = JSON.parse(line.slice(6));

                    if (event.type === 'token') {
                        setMessages((prev) => prev.map((m) =>
                            m.id === assistantMsgId
                                ? { ...m, text: m.text + event.content }
                                : m
                        ));
                    } else if (event.type === 'progress') {
                        setMessages((prev) => prev.map((m) =>
                            m.id === assistantMsgId
                                ? { ...m, progress: { step: event.step, total: event.total, label: event.label } }
                                : m
                        ));
                    } else if (event.type === 'c1_chunk') {
                        // Decode base64 chunk as UTF-8 (TextDecoder avoids Latin-1 corruption from atob)
                        const binaryString = atob(event.content);
                        const bytes = new Uint8Array(binaryString.length);
                        for (let i = 0; i < binaryString.length; i++) {
                            bytes[i] = binaryString.charCodeAt(i);
                        }
                        const decoded = new TextDecoder('utf-8').decode(bytes);
                        c1AccumulatorRef.current[assistantMsgId] =
                            (c1AccumulatorRef.current[assistantMsgId] || '') + decoded;
                        const fullDsl = c1AccumulatorRef.current[assistantMsgId];
                        setMessages((prev) => prev.map((m) =>
                            m.id === assistantMsgId
                                ? { ...m, c1Dsl: fullDsl, progress: null }
                                : m
                        ));
                    } else if (event.type === 'c1_done') {
                        delete c1AccumulatorRef.current[assistantMsgId];
                        setMessages((prev) => prev.map((m) =>
                            m.id === assistantMsgId
                                ? { ...m, streaming: false, progress: null }
                                : m
                        ));
                        if (selectedFileId && /predict|analysis|analyse|forecast|insights|business data/i.test(trimmed)) {
                            setHasAnalyticsData(true);
                            setShowAnalyticsPopup(true);
                        }
                    } else if (event.type === 'result') {
                        // Markdown fallback (no THESYS_API_KEY or C1 error)
                        setMessages((prev) => prev.map((m) =>
                            m.id === assistantMsgId
                                ? { ...m, text: event.text, progress: null }
                                : m
                        ));
                        if (selectedFileId && /predict|analysis|analyse|forecast|insights|business data/i.test(trimmed)) {
                            setHasAnalyticsData(true);
                            setShowAnalyticsPopup(true);
                        }
                    } else if (event.type === 'done') {
                        delete c1AccumulatorRef.current[assistantMsgId];
                        setMessages((prev) => prev.map((m) =>
                            m.id === assistantMsgId
                                ? { ...m, streaming: false, progress: null }
                                : m
                        ));
                    } else if (event.type === 'error') {
                        delete c1AccumulatorRef.current[assistantMsgId];
                        setMessages((prev) => prev.map((m) =>
                            m.id === assistantMsgId
                                ? { ...m, text: event.content || 'An error occurred.', streaming: false, progress: null }
                                : m
                        ));
                    }
                } catch {
                    // Skip malformed SSE lines
                }
            };

            try {
                while (true) {
                    const { done, value } = await reader.read();
                    if (done) break;

                    buffer += decoder.decode(value, { stream: true });
                    const lines = buffer.split('\n');
                    buffer = lines.pop() ?? '';

                    for (const line of lines) {
                        processLine(line);
                    }
                }

                // Process any remaining data left in the buffer after stream ends
                if (buffer.trim()) {
                    processLine(buffer.trim());
                }
            } finally {
                // Clean up C1 accumulator to prevent memory leak in long sessions
                delete c1AccumulatorRef.current[assistantMsgId];
                // Always ensure the assistant message exits streaming state
                setMessages((prev) => prev.map((m) =>
                    m.id === assistantMsgId && m.streaming
                        ? { ...m, streaming: false }
                        : m
                ));
            }
        } catch {
            setMessages((prev) => prev.map((m) =>
                m.id === assistantMsgId
                    ? { ...m, text: 'Sorry, something went wrong. Please try again.', streaming: false, progress: null }
                    : m
            ));
        } finally {
            setIsSending(false);
            fetchFiles();
        }
    }, [input, isSending, selectedFileId, fetchFiles]);

    useEffect(() => {
        fetchFiles();
        const onVisible = () => { if (document.visibilityState === 'visible') fetchFiles(); };
        document.addEventListener('visibilitychange', onVisible);
        return () => document.removeEventListener('visibilitychange', onVisible);
    }, [fetchFiles]);

    // Handle initial prompt from Quick Actions (e.g., Generate Report)
    useEffect(() => {
        if (location.state?.initialPrompt && !hasAutoPrompted.current) {
            hasAutoPrompted.current = true;
            sendMessage(location.state.initialPrompt);
            // Clear state so it doesn't re-trigger
            window.history.replaceState({}, document.title);
        }
    }, [location.state, sendMessage]);

    /* Auto-scroll to latest message */
    useEffect(() => {
        messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }, [messages]);

    const handleInlineUpload = useCallback((file, pendingMessage, assistantMsgId) => {
        const formData = new FormData();
        formData.append('file', file);

        setMessages((prev) => prev.map((m) =>
            m.id === assistantMsgId ? { ...m, uploadStatus: 'uploading', uploadProgress: 0 } : m
        ));

        const xhr = new XMLHttpRequest();
        xhr.upload.onprogress = (e) => {
            if (e.lengthComputable) {
                const pct = Math.round((e.loaded / e.total) * 100);
                setMessages((prev) => prev.map((m) =>
                    m.id === assistantMsgId ? { ...m, uploadProgress: pct } : m
                ));
            }
        };
        xhr.onload = () => {
            if (xhr.status === 200) {
                const data = JSON.parse(xhr.responseText);
                const newFileId = data.file_id || data.id;
                setMessages((prev) => prev.map((m) =>
                    m.id === assistantMsgId ? { ...m, uploadPrompt: false, uploadStatus: 'done', text: '' } : m
                ));
                setSelectedFileId(newFileId);
                fetchFiles();
                // Pass newFileId explicitly to avoid stale selectedFileId closure
                sendMessage(pendingMessage, newFileId);
            } else {
                setMessages((prev) => prev.map((m) =>
                    m.id === assistantMsgId ? { ...m, uploadStatus: 'error' } : m
                ));
            }
        };
        xhr.onerror = () => {
            setMessages((prev) => prev.map((m) =>
                m.id === assistantMsgId ? { ...m, uploadStatus: 'error' } : m
            ));
        };
        xhr.open('POST', `${API_BASE}/api/upload`);
        const token = getToken();
        const bypassAuth = import.meta.env.DEV && import.meta.env.VITE_BYPASS_AUTH === 'true';
        if (token && !bypassAuth) {
            xhr.setRequestHeader('Authorization', `Bearer ${token}`);
        }
        xhr.send(formData);
    }, [fetchFiles, sendMessage]);

    const handleKeyDown = (e) => {
        if (e.key === 'Enter' && !e.shiftKey) {
            e.preventDefault();
            sendMessage();
        }
    };

    /* Auto-grow textarea */
    const handleInput = (e) => {
        setInput(e.target.value);
        e.target.style.height = 'auto';
        e.target.style.height = `${Math.min(e.target.scrollHeight, 120)}px`;
    };

    return (
        <div className="ai-assistant-main">
            <TopBar title="AI Assistant" />

            <div className="ai-assistant-content">
                {/* Chat Card */}
                <div className="ai-chat-card">
                    {/* Card Header */}
                    <div className="ai-chat-card-header">
                        <div className="ai-chat-avatar">
                            <BotIcon />
                        </div>
                        <div className="ai-chat-header-info">
                            <span className="ai-chat-header-name">AI Assistant</span>
                            <span className="ai-chat-status">
                                <span className="ai-chat-status-dot" />
                                Online
                            </span>
                        </div>
                        {/* File selector */}
                        <div className="ai-chat-file-selector">
                            <select
                                value={selectedFileId || ''}
                                onChange={(e) => setSelectedFileId(e.target.value || null)}
                                className="ai-chat-file-dropdown"
                            >
                                <option value="">No dataset selected</option>
                                {files.map((f) => (
                                    <option key={f.file_id} value={f.file_id}>
                                        {f.name}
                                    </option>
                                ))}
                            </select>
                        </div>
                        
                        {/* Action Buttons (Insights / PDF) */}
                        {hasAnalyticsData && (
                            <div className="ai-chat-actions">
                                <button 
                                    className="ai-chat-action-btn"
                                    onClick={() => setShowAnalyticsPopup(!showAnalyticsPopup)}
                                    title={showAnalyticsPopup ? "Close Analytics" : "Open Analytics"}
                                >
                                    <BarChart2 size={16} />
                                    {showAnalyticsPopup ? "Close Insights" : "Open Insights"}
                                </button>
                                <button 
                                    className="ai-chat-action-btn pdf"
                                    onClick={() => {
                                        setShowComingSoon(true);
                                        setTimeout(() => setShowComingSoon(false), 3000);
                                    }}
                                    title="Download Business Insights Report"
                                >
                                    <FileDown size={16} />
                                    Export PDF
                                </button>
                            </div>
                        )}
                    </div>

                    {/* Messages area */}
                    <div className="ai-chat-messages">
                        {messages.map((msg) => (
                            <div
                                key={msg.id}
                                className={`ai-chat-message ${msg.role === 'user' ? 'user' : 'assistant'}`}
                            >
                                {msg.role === 'assistant' && (
                                    <div className="ai-chat-msg-avatar">
                                        <BotIcon />
                                    </div>
                                )}
                                <div className="ai-chat-bubble-wrap">
                                    {msg.uploadPrompt ? (
                                        <div className="ai-chat-bubble ai-chat-bubble--upload">
                                            <p className="ai-upload-prompt-text">
                                                To run an analysis, please upload a dataset first.
                                            </p>
                                            {msg.uploadStatus === 'uploading' && (
                                                <p className="ai-upload-progress-text">Uploading… {msg.uploadProgress ?? 0}%</p>
                                            )}
                                            {msg.uploadStatus === 'error' && (
                                                <p className="ai-upload-error-text">Upload failed. Please try again.</p>
                                            )}
                                            {msg.uploadStatus !== 'uploading' && (
                                                <label className="ai-upload-inline-btn">
                                                    Browse or drop a file
                                                    <input
                                                        type="file"
                                                        hidden
                                                        accept=".csv,.xlsx,.xls,.json"
                                                        onChange={(e) => {
                                                            const f = e.target.files?.[0];
                                                            if (f) handleInlineUpload(f, msg.pendingMessage, msg.id);
                                                            e.target.value = '';
                                                        }}
                                                    />
                                                </label>
                                            )}
                                        </div>
                                    ) : msg.progress ? (
                                        <div className="ai-chat-bubble">
                                            <ProgressStep {...msg.progress} />
                                        </div>
                                    ) : msg.c1Dsl ? (
                                        // C1 interactive UI (analysis mode with Thesys)
                                        <div className="ai-chat-bubble ai-chat-bubble--c1">
                                            <C1Message
                                                dsl={msg.c1Dsl}
                                                isStreaming={msg.streaming}
                                                onAction={({ type, params }) => {
                                                    if (type === 'continue_conversation' && params?.llmFriendlyMessage) {
                                                        sendMessage(params.llmFriendlyMessage);
                                                    } else if (type === 'start_chat_with_prompt' && params?.prompt) {
                                                        navigate('/ai-analytics/assistant', { state: { initialPrompt: params.prompt } });
                                                    }
                                                }}
                                            />
                                        </div>
                                    ) : (
                                        <div className="ai-chat-bubble">
                                            {msg.streaming && !msg.text ? (
                                                <div className="ai-chat-typing">
                                                    <span /><span /><span />
                                                </div>
                                            ) : msg.role === 'assistant' ? (
                                                <ReactMarkdown>{msg.text}</ReactMarkdown>
                                            ) : (
                                                msg.text
                                            )}
                                        </div>
                                    )}
                                    <span className="ai-chat-time">{msg.time}</span>
                                </div>
                            </div>
                        ))}

                        <div ref={messagesEndRef} />
                    </div>

                    {/* Suggestion chips */}
                    {showSuggestions && (
                        <div className="ai-chat-suggestions">
                            {(selectedFileId ? SUGGESTIONS_WITH_FILE : SUGGESTIONS_NO_FILE).map((s) => (
                                <button
                                    key={s}
                                    className="ai-chat-chip"
                                    onClick={() => sendMessage(s)}
                                    disabled={isSending}
                                >
                                    {s}
                                </button>
                            ))}
                        </div>
                    )}

                    {/* Composer */}
                    <div className="ai-chat-composer">
                        <div className="ai-chat-input-wrap">
                            <textarea
                                ref={textareaRef}
                                className="ai-chat-input"
                                placeholder="Ask me anything about your data..."
                                value={input}
                                onChange={handleInput}
                                onKeyDown={handleKeyDown}
                                rows={1}
                            />
                            <button
                                className="ai-chat-send-btn"
                                onClick={sendMessage}
                                disabled={!input.trim() || isSending}
                                aria-label="Send message"
                            >
                                <SendIcon />
                            </button>
                        </div>
                        <p className="ai-chat-hint">Press Enter to send, Shift + Enter for new line</p>
                    </div>

                    {/* Toast Notification */}
                    <div className={`ai-toast-popup ${showComingSoon ? 'visible' : ''}`}>
                        This feature will come soon!
                    </div>
                </div>
            </div>
            
            <AnalyticsPopup
                isOpen={showAnalyticsPopup}
                onClose={() => setShowAnalyticsPopup(false)}
                onSuggestionClick={sendMessage}
            />

            <PricingModal
                isOpen={showPricingModal}
                onClose={closePricingModal}
                limitError={limitError}
            />
        </div>
    );
};

export default AIAssistant;
