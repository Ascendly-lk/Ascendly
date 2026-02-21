import { useState, useRef, useEffect, useCallback } from 'react';
import AIAnalyticsSidebar from '../../components/aianalytics/AIAnalyticsSidebar';
import AIAnalyticsTopBar from '../../components/aianalytics/AIAnalyticsTopBar';
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

const FAKE_REPLIES = [
    "Got it — I can help with that! Give me a moment to process your request.",
    "Great question. Based on your uploaded data, I can derive those insights for you.",
    "I'm analysing the data right now. Here's what I found so far — would you like a deeper breakdown?",
    "Sure! I can generate a summary report for that dataset. Would you like CSV or PDF format?",
    "I've identified some patterns in your data. Shall I highlight the key trends?",
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

/* ── Page Component ── */
const AIAssistant = () => {
    const [messages, setMessages] = useState(INITIAL_MESSAGES);
    const [input, setInput] = useState('');
    const [isSending, setIsSending] = useState(false);
    const messagesEndRef = useRef(null);
    const textareaRef = useRef(null);
    let replyIndex = useRef(0);

    /* Auto-scroll to latest message */
    useEffect(() => {
        messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }, [messages]);

    const sendMessage = useCallback(() => {
        const trimmed = input.trim();
        if (!trimmed || isSending) return;

        const userMsg = { id: Date.now(), role: 'user', text: trimmed, time: now() };
        setMessages((prev) => [...prev, userMsg]);
        setInput('');
        setIsSending(true);

        // Reset textarea height
        if (textareaRef.current) textareaRef.current.style.height = 'auto';

        // Fake assistant reply after a short delay
        setTimeout(() => {
            const reply = FAKE_REPLIES[replyIndex.current % FAKE_REPLIES.length];
            replyIndex.current += 1;
            setMessages((prev) => [
                ...prev,
                { id: Date.now() + 1, role: 'assistant', text: reply, time: now() },
            ]);
            setIsSending(false);
        }, 900);
    }, [input, isSending]);

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
                                        <div className="ai-chat-bubble">{msg.text}</div>
                                        <span className="ai-chat-time">{msg.time}</span>
                                    </div>
                                </div>
                            ))}

                            {/* Typing indicator */}
                            {isSending && (
                                <div className="ai-chat-message assistant">
                                    <div className="ai-chat-msg-avatar">
                                        <BotIcon />
                                    </div>
                                    <div className="ai-chat-bubble-wrap">
                                        <div className="ai-chat-bubble ai-chat-typing">
                                            <span /><span /><span />
                                        </div>
                                    </div>
                                </div>
                            )}

                            <div ref={messagesEndRef} />
                        </div>

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
        </div>
    );
};

export default AIAssistant;
