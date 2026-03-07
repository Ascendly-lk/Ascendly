import { useEffect, useMemo, useRef, useState } from "react";
import {
  Bell,
  CheckCircle2,
  CircleAlert,
  Megaphone,
  MessageCircle,
  UserPlus,
} from "lucide-react";
import "./NotificationCenter.css";

const iconMap = {
  message: MessageCircle,
  success: CheckCircle2,
  alert: CircleAlert,
  social: UserPlus,
  update: Megaphone,
};

const defaultNotifications = [
  {
    id: 1,
    group: "new",
    type: "message",
    title: "New Message",
    description: "Aria sent you a new message in Startup Chat.",
    timestamp: "2m ago",
    unread: true,
  },
  {
    id: 2,
    group: "new",
    type: "alert",
    title: "Portfolio Alert",
    description: "Funding milestone tracker needs your review.",
    timestamp: "10m ago",
    unread: true,
  },
  {
    id: 3,
    group: "earlier",
    type: "success",
    title: "Profile Approved",
    description: "Your profile changes were approved successfully.",
    timestamp: "Yesterday",
    unread: false,
  },
  {
    id: 4,
    group: "earlier",
    type: "update",
    title: "Weekly Digest Ready",
    description: "Your weekly activity summary is now available.",
    timestamp: "2 days ago",
    unread: false,
  },
  {
    id: 5,
    group: "earlier",
    type: "social",
    title: "New Follower",
    description: "Jordan started following your startup profile.",
    timestamp: "3 days ago",
    unread: false,
  },
];

export default function NotificationCenter({
  notifications = defaultNotifications,
}) {
  const [isOpen, setIsOpen] = useState(false);
  const rootRef = useRef(null);

  const groupedNotifications = useMemo(() => {
    const grouped = { new: [], earlier: [] };

    notifications.forEach((notification) => {
      const key = notification.group === "new" ? "new" : "earlier";
      grouped[key].push(notification);
    });

    return grouped;
  }, [notifications]);

  const unreadCount = useMemo(
    () => notifications.filter((notification) => notification.unread).length,
    [notifications],
  );

  useEffect(() => {
    const handlePointerDown = (event) => {
      if (rootRef.current && !rootRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    };

    const handleEscape = (event) => {
      if (event.key === "Escape") {
        setIsOpen(false);
      }
    };

    document.addEventListener("mousedown", handlePointerDown);
    document.addEventListener("keydown", handleEscape);

    return () => {
      document.removeEventListener("mousedown", handlePointerDown);
      document.removeEventListener("keydown", handleEscape);
    };
  }, []);

  return (
    <div className="notification-center" ref={rootRef}>
      <button
        type="button"
        className="notification-bell-btn"
        onClick={() => setIsOpen((prev) => !prev)}
        aria-label="Open notifications"
        aria-expanded={isOpen}
      >
        <Bell size={19} />
        {unreadCount > 0 && <span className="bell-badge">{unreadCount}</span>}
      </button>

      {isOpen && (
        <div
          className="notification-dropdown"
          role="dialog"
          aria-label="Notification center"
        >
          <div className="notification-dropdown-header">
            <h3>Notifications</h3>
          </div>

          <NotificationSection title="New" items={groupedNotifications.new} />
          <NotificationSection
            title="Earlier"
            items={groupedNotifications.earlier}
          />
        </div>
      )}
    </div>
  );
}

function NotificationSection({ title, items }) {
  return (
    <section className="notification-section">
      <h4>{title}</h4>
      {items.length === 0 ? (
        <p className="notification-empty">No notifications</p>
      ) : (
        <ul className="notification-list">
          {items.map((notification) => {
            const ItemIcon = iconMap[notification.type] || Bell;

            return (
              <li key={notification.id} className="notification-item">
                <span className="notification-item-icon" aria-hidden="true">
                  <ItemIcon size={16} />
                </span>

                <div className="notification-item-content">
                  <div className="notification-item-header">
                    <p className="notification-item-title">
                      {notification.title}
                    </p>
                    {notification.unread && (
                      <span className="notification-unread-dot" />
                    )}
                  </div>

                  <p className="notification-item-description">
                    {notification.description}
                  </p>
                  <p className="notification-item-time">
                    {notification.timestamp}
                  </p>
                </div>
              </li>
            );
          })}
        </ul>
      )}
    </section>
  );
}
