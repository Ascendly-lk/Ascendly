import { useState, useRef, useEffect } from "react";
import {
  Bell,
  CalendarDays,
  CheckCheck,
  CheckCircle2,
  Clock3,
  Image as ImageIcon,
  MessageSquare,
  Paperclip,
  Phone,
  Search,
  SendHorizontal,
  X,
  XCircle,
} from "lucide-react";
import Sidebar from "./Sidebar";
import TopHeader from "../../components/TopHeader";
import "./clients.css";

const clientRequests = [
  {
    id: 1,
    initials: "SC",
    name: "Sarah Chen",
    date: "2025 - 06 - 25",
    time: "10.00 a.m",
    duration: "01 hour",
    tag: "Fundraising",
    message:
      "Hi! I'd love to review our Q3 pitch deck before we present to Sequoia next week.",
    variant: "large",
  },
  {
    id: 2,
    initials: "MC",
    name: "Michael Chang",
    date: "2025 - 07 - 21",
    time: "12.00 p.m",
    duration: "45 minutes",
    tag: "Go-to-Market",
    message:
      "We are launching our new enterprise tier and need your advice on the pricing structure.",
    variant: "compact",
  },
  {
    id: 3,
    initials: "ER",
    name: "Elena Rostova",
    date: "2025 - 05 - 18",
    time: "6.00 p.m",
    duration: "15 minutes",
    tag: "Hiring Strategy",
    message:
      "Could we schedule a quick sync? We're expanding the engineering team and need insights on equity.",
    variant: "compact",
  },
];

const messageThreads = [
  {
    id: 1,
    initials: "NK",
    name: "Nadia Khan",
    preview: "Sounds great! Let's align on...",
    unread: 2,
    online: true,
  },
  {
    id: 2,
    initials: "JD",
    name: "James Doe",
    preview: "I've attached the Q2 financial...",
    unread: 1,
    online: true,
  },
  {
    id: 3,
    initials: "LO",
    name: "Liam O'Connor",
    preview: "How does next Tuesday work?",
    unread: 0,
    online: false,
  },
  {
    id: 4,
    initials: "AM",
    name: "Aisha Martinez",
    preview: "Thanks for the swift feedback.",
    unread: 0,
    online: false,
  },
];

export default function Clients() {
  const [activeTab, setActiveTab] = useState("session");
  const [activeThreadId, setActiveThreadId] = useState(messageThreads[0].id);

  // Real-time Chat States
  const [searchTerm, setSearchTerm] = useState("");
  const [newMessageText, setNewMessageText] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const [attachment, setAttachment] = useState(null);

  const [messagesState, setMessagesState] = useState({
    1: [
      { id: 1, text: "Hey! Did you have a chance to look at the revised term sheet?", type: "incoming", timestamp: "10:30 AM", seen: false },
      { id: 2, text: "Yes, just finished reviewing it. The valuation looks much better now.", type: "outgoing", timestamp: "10:35 AM", seen: true },
      { id: 3, text: "Good to hear. Do you think we should push for a board seat?", type: "incoming", timestamp: "10:42 AM", seen: false }
    ],
    2: [
      { id: Date.now(), text: "I've uploaded the Cap Table to the shared drive.", type: "incoming", timestamp: "09:15 AM", seen: false },
    ],
    3: [
      { id: Date.now(), text: "Looking forward to our sync next week.", type: "incoming", timestamp: "02:15 PM", seen: false },
    ],
    4: []
  });

  // Session Requests State
  const [requests, setRequests] = useState([]);
  const [isLoadingRequests, setIsLoadingRequests] = useState(true);
  const [actionLoading, setActionLoading] = useState({ id: null, type: null });
  const [toastConfig, setToastConfig] = useState({ show: false, message: '', type: '' });

  const [sessionSearchTerm, setSessionSearchTerm] = useState("");
  const [sessionSortOrder, setSessionSortOrder] = useState("soonest");

  useEffect(() => {
    setIsLoadingRequests(true);
    const timer = setTimeout(() => {
      setRequests(clientRequests);
      setIsLoadingRequests(false);
    }, 1500);
    return () => clearTimeout(timer);
  }, []);

  const handleRequestAction = (id, type, name) => {
    setActionLoading({ id, type });
    setTimeout(() => {
      setRequests(prev => prev.filter(r => r.id !== id));
      setActionLoading({ id: null, type: null });
      setToastConfig({
        show: true,
        message: `Meeting with ${name} ${type}ed`,
        type: 'success'
      });
      setTimeout(() => setToastConfig({ show: false, message: '', type: '' }), 3000);
    }, 1000);
  };

  const parseDateStr = (dateStr) => new Date(dateStr.replace(/\s/g, ''));

  const formatDynamicDate = (dateStr) => {
    const dt = parseDateStr(dateStr);
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const tmrw = new Date(today);
    tmrw.setDate(tmrw.getDate() + 1);

    if (dt.getTime() === tmrw.getTime()) return "Tomorrow";
    if (dt.getTime() === today.getTime()) return "Today";

    return dt.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
  };

  let processedRequests = requests.filter(r =>
    r.name.toLowerCase().includes(sessionSearchTerm.toLowerCase()) ||
    r.tag.toLowerCase().includes(sessionSearchTerm.toLowerCase())
  );

  processedRequests.sort((a, b) => {
    const da = parseDateStr(a.date).getTime();
    const db = parseDateStr(b.date).getTime();
    return sessionSortOrder === "soonest" ? da - db : db - da;
  });

  const messagesEndRef = useRef(null);
  const fileInputRef = useRef(null);
  const typingTimeoutRef = useRef(null);

  const activeThread = messageThreads.find((thread) => thread.id === activeThreadId) || messageThreads[0];
  const currentMessages = messagesState[activeThreadId] || [];

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [currentMessages, isTyping]);

  const handleTyping = (e) => {
    setNewMessageText(e.target.value);
    setIsTyping(true);
    if (typingTimeoutRef.current) clearTimeout(typingTimeoutRef.current);
    typingTimeoutRef.current = setTimeout(() => {
      setIsTyping(false);
    }, 1500);
  };

  const handleSendMessage = (e) => {
    e?.preventDefault();
    if (!newMessageText.trim() && !attachment) return;

    const newMessage = {
      id: Date.now(),
      text: newMessageText,
      type: "outgoing",
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      seen: false,
      attachment: attachment
    };

    setMessagesState(prev => ({
      ...prev,
      [activeThreadId]: [...(prev[activeThreadId] || []), newMessage]
    }));

    setNewMessageText("");
    setAttachment(null);
    setIsTyping(false);

    // Simulate mock reply
    setTimeout(() => {
      const mockReply = {
        id: Date.now() + 1,
        text: "Thanks, I received that. I'll take a look and get back to you shortly.",
        type: "incoming",
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        seen: false
      };
      setMessagesState(prev => ({
        ...prev,
        [activeThreadId]: [...(prev[activeThreadId] || []), mockReply]
      }));
    }, 2500);
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      if (file.type.startsWith('image/')) {
        const url = URL.createObjectURL(file);
        setAttachment(url);
      } else {
        setAttachment(file.name);
      }
    }
  };

  const filteredThreads = messageThreads.filter(t =>
    t.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="dashboard-container">
      <Sidebar />

      <main className="clients-main" style={{ marginLeft: '260px', flexGrow: 1, minWidth: 0, padding: '28px 40px' }}>
        <TopHeader showWelcome={false} title={activeTab === "session" ? "Clients" : "Chats"} />

        <div className="clients-tabs">
          <button
            className={`clients-tab ${activeTab === "session" ? "active" : ""}`}
            type="button"
            onClick={() => setActiveTab("session")}
          >
            <Bell />
            Session requests
            <span className="tab-count">{isLoadingRequests ? '...' : requests.length}</span>
          </button>
          <button
            className={`clients-tab ${activeTab === "messages" ? "active" : ""}`}
            type="button"
            onClick={() => setActiveTab("messages")}
          >
            <MessageSquare />
            Messages
            <span className="tab-count">10</span>
          </button>
        </div>

        {activeTab === "session" ? (
          <section className="clients-request-list">
            <div className="session-filters" style={{ display: 'flex', gap: '16px', marginBottom: '20px', alignItems: 'center' }}>
              <div className="chat-search" style={{ flex: 1, margin: 0, padding: '10px 14px' }}>
                <Search size={16} />
                <input
                  type="text"
                  placeholder="Search by name or category..."
                  value={sessionSearchTerm}
                  onChange={(e) => setSessionSearchTerm(e.target.value)}
                />
              </div>
              <div style={{ background: '#17222d', borderRadius: '8px', padding: '0 12px', display: 'flex', alignItems: 'center' }}>
                <select
                  value={sessionSortOrder}
                  onChange={(e) => setSessionSortOrder(e.target.value)}
                  style={{ background: 'transparent', border: 'none', color: '#e2e8f0', padding: '10px 0', outline: 'none', cursor: 'pointer' }}
                >
                  <option value="soonest">Soonest Date</option>
                  <option value="newest">Newest Received</option>
                </select>
              </div>
            </div>

            {isLoadingRequests ? (
              Array.from({ length: 3 }).map((_, i) => (
                <article key={`skeleton-${i}`} className="client-request-card" style={{ animation: 'pulse 1.5s infinite', opacity: 0.5 }}>
                  <div className="client-avatar" style={{ background: '#1c2733' }}></div>
                  <div className="client-request-content">
                    <div style={{ height: '24px', background: '#1c2733', width: '200px', borderRadius: '4px', marginBottom: '12px' }}></div>
                    <div style={{ height: '16px', background: '#1c2733', width: '300px', borderRadius: '4px' }}></div>
                    <div style={{ height: '40px', background: '#1c2733', width: '100px', borderRadius: '999px', marginTop: '16px' }}></div>
                    <div style={{ height: '60px', background: '#1c2733', width: '100%', borderRadius: '8px', marginTop: '20px' }}></div>
                  </div>
                </article>
              ))
            ) : processedRequests.length === 0 ? (
              <div style={{ textAlign: 'center', padding: '40px', color: '#64748b' }}>
                <p>No matching requests found.</p>
              </div>
            ) : (
              processedRequests.map((request) => (
                <article key={request.id} className="client-request-card">
                  <div className="client-avatar">{request.initials}</div>

                  <div className="client-request-content">
                    <div className="client-request-top">
                      <div>
                        <h3>{request.name}</h3>
                        <div className="client-meta-row">
                          <span>
                            <CalendarDays /> {formatDynamicDate(request.date)}
                          </span>
                          <span>at</span>
                          <span>{request.time}</span>
                          <span>
                            <Clock3 /> {request.duration}
                          </span>
                        </div>
                      </div>

                      <div className={`client-action-buttons ${request.variant}`}>
                        <button
                          type="button"
                          className="btn-accept"
                          disabled={actionLoading.id === request.id}
                          onClick={() => handleRequestAction(request.id, "accept", request.name)}
                        >
                          {actionLoading.id === request.id && actionLoading.type === "accept" ? (
                            "Sending..."
                          ) : (
                            <>
                              <CheckCircle2 size={18} strokeWidth={2.2} /> Accept
                            </>
                          )}
                        </button>
                        <button
                          type="button"
                          className="btn-decline"
                          disabled={actionLoading.id === request.id}
                          onClick={() => handleRequestAction(request.id, "decline", request.name)}
                        >
                          {actionLoading.id === request.id && actionLoading.type === "decline" ? (
                            "Sending..."
                          ) : (
                            <>
                              <X size={18} strokeWidth={2.8} /> Decline
                            </>
                          )}
                        </button>
                      </div>
                    </div>

                    <span className="client-tag">{request.tag}</span>
                    <p className="client-message">
                      &quot;{request.message}&quot;
                    </p>
                  </div>
                </article>
              )))}
          </section>
        ) : (
          <section className="clients-messages-layout">
            <aside className="chat-thread-list">
              <div className="chat-search">
                <Search />
                <input
                  type="text"
                  placeholder="search"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>

              <div className="chat-thread-scroll">
                {filteredThreads.map((thread) => (
                  <button
                    key={thread.id}
                    type="button"
                    className={`chat-thread-item ${activeThread.id === thread.id ? "active" : ""
                      }`}
                    onClick={() => setActiveThreadId(thread.id)}
                  >
                    <span className="chat-avatar">{thread.initials}</span>

                    <span className="chat-thread-copy">
                      <span className="chat-thread-name">{thread.name}</span>
                      <span className="chat-thread-preview">
                        {thread.preview}
                      </span>
                    </span>

                    {thread.unread > 0 && (
                      <span className="chat-unread-count">{thread.unread}</span>
                    )}
                  </button>
                ))}
              </div>
            </aside>

            <div className="chat-conversation-card">
              <header className="chat-card-header">
                <div>
                  <h3>{activeThread.name}</h3>
                  <p>{activeThread.online ? "online" : "offline"}</p>
                </div>

                <div className="chat-card-actions">
                  <button type="button" aria-label="Search chat">
                    <Search />
                  </button>
                  <button type="button" aria-label="Call">
                    <Phone />
                  </button>
                </div>
              </header>

              <div className="chat-body" style={{ position: 'relative' }}>
                {currentMessages.map((message) => (
                  <div
                    key={message.id}
                    className={`chat-bubble-row ${message.type}`}
                  >
                    <div className="chat-bubble-wrapper" style={{ display: 'flex', flexDirection: 'column', alignItems: message.type === 'outgoing' ? 'flex-end' : 'flex-start' }}>
                      <div className="chat-bubble">
                        {message.attachment && (
                          <div style={{ marginBottom: message.text ? '8px' : 0 }}>
                            {message.attachment.startsWith('blob:') ? (
                              <img src={message.attachment} alt="attachment preview" style={{ maxWidth: '200px', borderRadius: '8px' }} />
                            ) : (
                              <span style={{ fontSize: '0.85rem', color: '#00FFEF' }}>📎 {message.attachment}</span>
                            )}
                          </div>
                        )}
                        {message.text}
                      </div>
                      <div className="chat-message-meta" style={{ display: 'flex', alignItems: 'center', gap: '4px', marginTop: '4px', fontSize: '0.75rem', color: '#64748b' }}>
                        <span>{message.timestamp || 'Just now'}</span>
                        {message.type === 'outgoing' && (
                          <CheckCheck size={14} color={message.seen ? '#00FFEF' : '#64748b'} strokeWidth={2.5} />
                        )}
                      </div>
                    </div>
                  </div>
                ))}
                <div ref={messagesEndRef} />
              </div>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                {isTyping && <div style={{ fontSize: '0.8rem', color: '#0bd19d', marginLeft: '12px', fontStyle: 'italic' }}>Typing...</div>}

                {attachment && (
                  <div style={{ display: 'flex', alignItems: 'center', gap: '10px', background: '#1c2733', padding: '8px 12px', borderRadius: '8px', alignSelf: 'flex-start', marginLeft: '10px' }}>
                    {attachment.startsWith('blob:') ? <ImageIcon size={16} color="#00FFEF" /> : <Paperclip size={16} />}
                    <span style={{ fontSize: '0.85rem', color: '#e2e8f0', maxWidth: '200px', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                      {attachment.startsWith('blob:') ? 'Image attached' : attachment}
                    </span>
                    <button type="button" onClick={() => setAttachment(null)} style={{ background: 'transparent', border: 'none', color: '#ef4444', cursor: 'pointer', padding: 0, display: 'flex' }}>
                      <XCircle size={16} />
                    </button>
                  </div>
                )}

                <form className="chat-composer" onSubmit={handleSendMessage} style={{ margin: 0, width: '100%' }}>
                  <input
                    type="file"
                    ref={fileInputRef}
                    style={{ display: 'none' }}
                    onChange={handleFileChange}
                    accept="image/*"
                  />
                  <button type="button" aria-label="Attach file" onClick={() => fileInputRef.current?.click()}>
                    <Paperclip />
                  </button>
                  <input
                    type="text"
                    placeholder="Type a message..."
                    value={newMessageText}
                    onChange={handleTyping}
                  />
                  <button type="submit" aria-label="Send message" disabled={!newMessageText.trim() && !attachment} style={{ opacity: (!newMessageText.trim() && !attachment) ? 0.5 : 1 }}>
                    <SendHorizontal />
                  </button>
                </form>
              </div>
            </div>
          </section>
        )}
      </main>
      {toastConfig.show && (
        <div style={{
          position: 'fixed',
          bottom: '30px',
          left: '50%',
          transform: 'translateX(-50%)',
          background: '#0d131a',
          color: '#ffffff',
          padding: '12px 24px',
          borderRadius: '8px',
          border: '1px solid rgba(0, 255, 239, 0.2)',
          boxShadow: '0 8px 32px rgba(0,0,0,0.4)',
          zIndex: 9999,
          animation: 'slideUpFade 0.3s ease-out',
          display: 'flex',
          alignItems: 'center',
          gap: '8px'
        }}>
          <CheckCircle2 size={18} color="#00FFEF" />
          {toastConfig.message}
        </div>
      )}
    </div>
  );
}
