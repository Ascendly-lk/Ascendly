import { useState, useRef, useEffect, useCallback } from 'react';
<<<<<<< HEAD
<<<<<<< HEAD
import { useLocation } from 'react-router-dom';
import ReactMarkdown from 'react-markdown';
import AIAnalyticsTopBar from '../../components/aianalytics/AIAnalyticsTopBar';
import { apiFetch } from '../../api';
import AnalyticsPopup from '../../components/aianalytics/AnalyticsPopup';
import { generatePDFReport } from '../../utils/pdfGenerator';
import { BarChart2, FileDown } from 'lucide-react';
=======
=======
>>>>>>> parent of ae17c912 (Update by deleting some files)
import ReactMarkdown from 'react-markdown';
import AIAnalyticsSidebar from '../../components/aianalytics/AIAnalyticsSidebar';
import AIAnalyticsTopBar from '../../components/aianalytics/AIAnalyticsTopBar';
import { apiFetch } from '../../api';
<<<<<<< HEAD
>>>>>>> parent of ae17c912 (Update by deleting some files)
=======
>>>>>>> parent of ae17c912 (Update by deleting some files)
import './AIAssistant.css';

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
<<<<<<< HEAD
<<<<<<< HEAD
    const [showAnalyticsPopup, setShowAnalyticsPopup] = useState(false);
    const [hasAnalyticsData, setHasAnalyticsData] = useState(false);
    const [showComingSoon, setShowComingSoon] = useState(false);
    const location = useLocation();
    const hasAutoPrompted = useRef(false);
    const messagesEndRef = useRef(null);
    const textareaRef = useRef(null);

=======
    const messagesEndRef = useRef(null);
    const textareaRef = useRef(null);
>>>>>>> parent of ae17c912 (Update by deleting some files)
=======
    const messagesEndRef = useRef(null);
    const textareaRef = useRef(null);
>>>>>>> parent of ae17c912 (Update by deleting some files)
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

<<<<<<< HEAD
<<<<<<< HEAD
=======
=======
>>>>>>> parent of ae17c912 (Update by deleting some files)
    useEffect(() => {
        fetchFiles();
        const onVisible = () => { if (document.visibilityState === 'visible') fetchFiles(); };
        document.addEventListener('visibilitychange', onVisible);
        return () => document.removeEventListener('visibilitychange', onVisible);
    }, [fetchFiles]);

    /* Auto-scroll to latest message */
    useEffect(() => {
        messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }, [messages]);

<<<<<<< HEAD
>>>>>>> parent of ae17c912 (Update by deleting some files)
=======
>>>>>>> parent of ae17c912 (Update by deleting some files)
    const sendMessage = useCallback(async (overrideText) => {
        const trimmed = (overrideText || input).trim();
        if (!trimmed || isSending) return;

        // Build history from all messages except the initial greeting
        const history = messagesRef.current.slice(1).map((m) => ({
            role: m.role,
            content: m.text,
        }));

        const userMsg = { id: crypto.randomUUID(), role: 'user', text: trimmed, time: now() };
        const assistantMsgId = crypto.randomUUID();

        setMessages((prev) => [
            ...prev,
            userMsg,
            { id: assistantMsgId, role: 'assistant', text: '', time: now(), streaming: true },
        ]);
        setInput('');
        setIsSending(true);
        setShowSuggestions(false);

        if (textareaRef.current) textareaRef.current.style.height = 'auto';

        try {
            const body = { message: trimmed, history };
            if (selectedFileId) body.dataset_id = selectedFileId;

            const res = await apiFetch('/api/chat', {
                method: 'POST',
                body: JSON.stringify(body),
            });

            if (!res.ok) {
                const data = await res.json().catch(() => ({}));
                throw new Error(data.detail || 'Request failed');
            }

            const reader = res.body.getReader();
            const decoder = new TextDecoder();
            let buffer = '';

<<<<<<< HEAD
<<<<<<< HEAD
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
                    } else if (event.type === 'result') {
                        setMessages((prev) => prev.map((m) =>
                            m.id === assistantMsgId
                                ? { ...m, text: event.text, progress: null }
                                : m
                        ));
                        
                        // Trigger AI Analytics Popup if file is selected and prompt matches keywords
                        if (selectedFileId && /predict|analysis|analyse|forecast|insights|business data/i.test(trimmed)) {
                            setHasAnalyticsData(true);
                            setShowAnalyticsPopup(true);
                        }
                    } else if (event.type === 'done') {
                        setMessages((prev) => prev.map((m) =>
                            m.id === assistantMsgId
                                ? { ...m, streaming: false, progress: null }
                                : m
                        ));
                    } else if (event.type === 'error') {
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
                // Always ensure the assistant message exits streaming state
                setMessages((prev) => prev.map((m) =>
                    m.id === assistantMsgId && m.streaming
                        ? { ...m, streaming: false }
                        : m
                ));
=======
=======
>>>>>>> parent of ae17c912 (Update by deleting some files)
            while (true) {
                const { done, value } = await reader.read();
                if (done) break;

                buffer += decoder.decode(value, { stream: true });
                const lines = buffer.split('\n');
                buffer = lines.pop() ?? '';

                for (const line of lines) {
                    if (!line.startsWith('data: ')) continue;
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
                        } else if (event.type === 'result') {
                            setMessages((prev) => prev.map((m) =>
                                m.id === assistantMsgId
                                    ? { ...m, text: event.text, progress: null }
                                    : m
                            ));
                        } else if (event.type === 'done') {
                            setMessages((prev) => prev.map((m) =>
                                m.id === assistantMsgId
                                    ? { ...m, streaming: false, progress: null }
                                    : m
                            ));
                        } else if (event.type === 'error') {
                            setMessages((prev) => prev.map((m) =>
                                m.id === assistantMsgId
                                    ? { ...m, text: event.content, streaming: false, progress: null }
                                    : m
                            ));
                        }
                    } catch {
                        // Skip malformed SSE lines
                    }
                }
<<<<<<< HEAD
>>>>>>> parent of ae17c912 (Update by deleting some files)
=======
>>>>>>> parent of ae17c912 (Update by deleting some files)
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

<<<<<<< HEAD
<<<<<<< HEAD
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

=======
>>>>>>> parent of ae17c912 (Update by deleting some files)
=======
>>>>>>> parent of ae17c912 (Update by deleting some files)
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
<<<<<<< HEAD
<<<<<<< HEAD
        <div className="ai-assistant-main">
            <AIAnalyticsTopBar />

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
                                    {msg.progress ? (
                                        <div className="ai-chat-bubble">
                                            <ProgressStep {...msg.progress} />
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
=======
=======
>>>>>>> parent of ae17c912 (Update by deleting some files)
        <div className="ai-assistant-page">
            <AIAnalyticsSidebar />

            <div className="ai-assistant-main">
                <AIAnalyticsTopBar />

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
                                        {msg.progress ? (
                                            <div className="ai-chat-bubble">
                                                <ProgressStep {...msg.progress} />
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
                    </div>
                </div>
            </div>
<<<<<<< HEAD
>>>>>>> parent of ae17c912 (Update by deleting some files)
=======
>>>>>>> parent of ae17c912 (Update by deleting some files)
        </div>
    );
};

export default AIAssistant;
