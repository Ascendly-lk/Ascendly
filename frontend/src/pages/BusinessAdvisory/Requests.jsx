import { useState } from "react";
import {
  Bell,
  CalendarDays,
  CheckCircle2,
  Clock3,
  MessageSquare,
  Paperclip,
  Phone,
  Search,
  SendHorizontal,
  X,
} from "lucide-react";
import Sidebar from "../../components/dashboard/Sidebar";
import TopHeader from "../../components/TopHeader";
import "./Requests.css";

const clientRequests = [
  {
    id: 1,
    initials: "AH",
    name: "Adam Hooper",
    date: "2025 - 06 - 25",
    time: "10.00 a.m",
    duration: "01 hour",
    tag: "Fundraising Strategy",
    message:
      "Hi I’d love to speak regarding your startup strategy and fundraising roadmap for the next quarter.",
    variant: "large",
  },
  {
    id: 2,
    initials: "JB",
    name: "James Bond",
    date: "2025 - 07 - 21",
    time: "12.00 p.m",
    duration: "45 minutes",
    tag: "Market Expansion",
    message:
      "Hi I’d love to speak regarding your startup strategy and fundraising roadmap for the next quarter.",
    variant: "compact",
  },
  {
    id: 3,
    initials: "TC",
    name: "Tom Cruise",
    date: "2025 - 05 - 18",
    time: "6.00 p.m",
    duration: "15 minutes",
    tag: "Product Roadmap",
    message:
      "Hi I’d love to speak regarding your startup strategy and fundraising roadmap for the next quarter.",
    variant: "compact",
  },
];

const messageThreads = [
  {
    id: 1,
    initials: "AH",
    name: "Adam Hooper",
    preview: "sfhrshfugk ftujdjtkyf drjhdjyfyk dtjdy...",
    unread: 2,
    online: true,
  },
  {
    id: 2,
    initials: "AH",
    name: "Adam Hooper",
    preview: "sfhrshfugk ftujdjtkyf drjhdjyfyk dtjdy...",
    unread: 6,
    online: true,
  },
  {
    id: 3,
    initials: "AH",
    name: "Adam Hooper",
    preview: "sfhrshfugk ftujdjtkyf drjhdjyfyk dtjdy...",
    unread: 0,
    online: false,
  },
];

const activeChatMessages = [
  {
    id: 1,
    text: "dhndrubholi asetgjbho slirgh osiu se;ojo agjhJh sklj silk",
    type: "incoming",
  },
  {
    id: 2,
    text: "dhndrubholi asetgjbho slirgh osiu se;ojo adgjlhI skjf silk",
    type: "outgoing",
  },
];

export default function Requests() {
  const [activeTab, setActiveTab] = useState("session");
  const [activeThreadId, setActiveThreadId] = useState(messageThreads[0].id);
  const activeThread =
    messageThreads.find((thread) => thread.id === activeThreadId) ||
    messageThreads[0];

  return (
    <div className="requests-page">
      <main className="requests-main">
        <TopHeader showWelcome={false} />

        <header className="requests-header">
          <h1>Requests</h1>
        </header>

        <div className="requests-tabs">
          <button
            className={`requests-tab ${activeTab === "session" ? "active" : ""}`}
            type="button"
            onClick={() => setActiveTab("session")}
          >
            <Bell />
            Session requests
            <span className="tab-count">3</span>
          </button>
          <button
            className={`requests-tab ${activeTab === "messages" ? "active" : ""}`}
            type="button"
            onClick={() => setActiveTab("messages")}
          >
            <MessageSquare />
            Messages
            <span className="tab-count">10</span>
          </button>
        </div>

        {activeTab === "session" ? (
          <section className="requests-list">
            {clientRequests.map((request) => (
              <article key={request.id} className="request-card">
                <div className="client-avatar">{request.initials}</div>

                <div className="request-content">
                  <div className="request-top">
                    <div>
                      <h3>{request.name}</h3>
                      <div className="client-meta-row">
                        <span>
                          <CalendarDays /> {request.date}
                        </span>
                        <span>at</span>
                        <span>{request.time}</span>
                        <span>
                          <Clock3 /> {request.duration}
                        </span>
                      </div>
                    </div>

                    <div className={`client-action-buttons ${request.variant}`}>
                      <button type="button" className="btn-accept">
                        {request.variant === "compact" && <CheckCircle2 />}
                        Accept
                      </button>
                      <button type="button" className="btn-decline">
                        {request.variant === "compact" && <X />}
                        Decline
                      </button>
                    </div>
                  </div>

                  <span className="client-tag">{request.tag}</span>
                  <p className="client-message">
                    &quot;{request.message}&quot;
                  </p>
                </div>
              </article>
            ))}
          </section>
        ) : (
          <section className="requests-messages-layout">
            <aside className="chat-thread-list">
              <div className="chat-search">
                <Search />
                <input type="text" placeholder="search" />
              </div>

              <div className="chat-thread-scroll">
                {messageThreads.map((thread) => (
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

              <div className="chat-body">
                {activeChatMessages.map((message) => (
                  <div
                    key={message.id}
                    className={`chat-bubble-row ${message.type}`}
                  >
                    <div className="chat-bubble">{message.text}</div>
                  </div>
                ))}
              </div>

              <footer className="chat-composer">
                <button type="button" aria-label="Attach">
                  <Paperclip />
                </button>
                <input type="text" placeholder="Type a message" />
                <button type="button" aria-label="Send">
                  <SendHorizontal />
                </button>
              </footer>
            </div>
          </section>
        )}
      </main>
    </div>
  );
}
