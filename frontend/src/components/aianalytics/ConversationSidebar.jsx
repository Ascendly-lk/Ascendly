import { useState, useEffect, useCallback } from 'react';
import { listConversations, deleteConversation } from '../../api/conversations';
import './ConversationSidebar.css';

const PlusIcon = () => (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" width="16" height="16">
        <line x1="12" y1="5" x2="12" y2="19"/>
        <line x1="5" y1="12" x2="19" y2="12"/>
    </svg>
);

const TrashIcon = () => (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" width="14" height="14">
        <polyline points="3 6 5 6 21 6"/>
        <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"/>
    </svg>
);

const ChatIcon = () => (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" width="14" height="14">
        <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/>
    </svg>
);

function groupByDate(conversations) {
    const now = new Date();
    const todayStr = now.toDateString();
    const yesterday = new Date(now - 86400000).toDateString();
    const groups = { Today: [], Yesterday: [], 'Earlier': [] };
    for (const c of conversations) {
        const d = new Date(c.updated_at).toDateString();
        if (d === todayStr) groups.Today.push(c);
        else if (d === yesterday) groups.Yesterday.push(c);
        else groups['Earlier'].push(c);
    }
    return groups;
}

export default function ConversationSidebar({ activeId, onSelect, onNew, refreshTrigger }) {
    const [conversations, setConversations] = useState([]);
    const [hoveredId, setHoveredId] = useState(null);

    const refresh = useCallback(() => {
        listConversations().then(setConversations);
    }, []);

    useEffect(() => { refresh(); }, [refresh, refreshTrigger]);

    const handleDelete = async (e, id) => {
        e.stopPropagation();
        await deleteConversation(id);
        setConversations(prev => prev.filter(c => c.id !== id));
        if (activeId === id) onNew();
    };

    const groups = groupByDate(conversations);
    const hasAny = Object.values(groups).some(g => g.length > 0);

    return (
        <div className="conv-sidebar">
            <div className="conv-sidebar-header">
                <span className="conv-sidebar-title">Chats</span>
                <button className="conv-new-btn" onClick={onNew} title="New Chat">
                    <PlusIcon />
                    <span>New Chat</span>
                </button>
            </div>

            <div className="conv-list">
                {Object.entries(groups).map(([label, items]) =>
                    items.length > 0 && (
                        <div key={label} className="conv-group">
                            <span className="conv-group-label">{label}</span>
                            {items.map(c => (
                                <div
                                    key={c.id}
                                    className={`conv-item ${activeId === c.id ? 'active' : ''}`}
                                    onClick={() => onSelect(c)}
                                    onMouseEnter={() => setHoveredId(c.id)}
                                    onMouseLeave={() => setHoveredId(null)}
                                >
                                    <ChatIcon />
                                    <span className="conv-item-title">{c.title}</span>
                                    {hoveredId === c.id && (
                                        <button
                                            className="conv-delete-btn"
                                            onClick={(e) => handleDelete(e, c.id)}
                                            title="Delete conversation"
                                        >
                                            <TrashIcon />
                                        </button>
                                    )}
                                </div>
                            ))}
                        </div>
                    )
                )}

                {!hasAny && (
                    <div className="conv-empty">
                        <ChatIcon />
                        <p>No conversations yet</p>
                        <span>Start a new chat to get started</span>
                    </div>
                )}
            </div>
        </div>
    );
}
