import { useState } from "react";
import Sidebar from "./Sidebar";
import TopHeader from "../../components/TopHeader";
import "./DashboardLayout.css";
import "./Notifications.css";

export default function NotificationsPage() {
  const initialEmail = "admin@ascendly.com";
  const [messageNotifications, setMessageNotifications] = useState(true);
  const [email, setEmail] = useState(initialEmail);
  const [emailTouched, setEmailTouched] = useState(false);
  const [isSavingEmail, setIsSavingEmail] = useState(false);
  const [saveStatus, setSaveStatus] = useState("idle");
  const [isSendingAgain, setIsSendingAgain] = useState(false);
  const [sendAgainStatus, setSendAgainStatus] = useState("idle");

  const emailValue = email.trim();
  const emailIsValid = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(emailValue);
  const showEmailError = emailTouched && !emailIsValid;
  const canSaveEmail = emailIsValid && !isSavingEmail;

  const handleEmailChange = (event) => {
    setEmail(event.target.value);
    setSaveStatus("idle");
  };

  const handleSaveEmail = () => {
    setEmailTouched(true);

    if (!emailIsValid || isSavingEmail) {
      setSaveStatus("error");
      return;
    }

    setIsSavingEmail(true);
    setSaveStatus("idle");

    setTimeout(() => {
      setIsSavingEmail(false);
      setSaveStatus("success");
    }, 900);
  };

  const handleSendAgain = () => {
    if (isSendingAgain) {
      return;
    }

    setIsSendingAgain(true);
    setSendAgainStatus("idle");

    setTimeout(() => {
      setIsSendingAgain(false);
      setSendAgainStatus("sent");
    }, 1000);
  };

  return (
    <div className="dashboard-container notifications-layout">
      <Sidebar />

      <main className="notifications-page" style={{ marginLeft: '260px', flexGrow: 1, minWidth: 0, padding: '28px 40px' }}>
        <div style={{ width: '100%', maxWidth: '1400px', margin: '0 auto' }}>
          <TopHeader showWelcome={false} title="Notifications" />

        <div className="notifications-shell">
          <section className="notifications-section">
            <div className="notifications-row">
              <div>
                <h2 className="notifications-title">
                  Message Notifications:{" "}
                  <span className="status-pill">
                    {messageNotifications ? "ON" : "OFF"}
                  </span>
                </h2>
                <p className="notifications-subtitle">
                  We&apos;ll email you when you have new unread chat messages from
                  other members.
                </p>
              </div>

              <button
                type="button"
                className={`notifications-toggle ${messageNotifications ? "is-on" : ""}`}
                onClick={() => setMessageNotifications((prev) => !prev)}
                aria-label="Toggle message notifications"
                aria-pressed={messageNotifications}
              >
                <span className="toggle-knob" />
              </button>
            </div>
          </section>

          <section className="notifications-section">
            <h2 className="section-title">Change Email</h2>

            <div className="alert-box">
              <i className="ri-error-warning-fill"></i>
              <span>
                Please check your inbox for an email confirming your address. |{" "}
                <button
                  type="button"
                  className="alert-link-btn"
                  onClick={handleSendAgain}
                  disabled={isSendingAgain}
                >
                  {isSendingAgain ? "Sending..." : "Send Again"}
                </button>
              </span>
            </div>

            {sendAgainStatus === "sent" && (
              <p className="inline-feedback success">
                Confirmation email sent again.
              </p>
            )}

            <div className="form-group">
              <label htmlFor="notification-email">Email</label>
              <input
                id="notification-email"
                type="email"
                value={email}
                onBlur={() => setEmailTouched(true)}
                onChange={handleEmailChange}
                className={showEmailError ? "input-error" : ""}
                aria-invalid={showEmailError}
              />
              {showEmailError && (
                <span className="inline-feedback error">
                  Please enter a valid email address.
                </span>
              )}
            </div>

            <button
              type="button"
              className="btn-save-block"
              onClick={handleSaveEmail}
              disabled={!canSaveEmail}
            >
              {isSavingEmail ? "Saving..." : "Save Email"}
            </button>

            {saveStatus === "success" && (
              <p className="inline-feedback success">Email saved successfully.</p>
            )}

            {saveStatus === "error" && !showEmailError && (
              <p className="inline-feedback error">
                Could not save email. Please check your input.
              </p>
            )}
          </section>
        </div>
        </div>
      </main>
    </div>
  );
}
