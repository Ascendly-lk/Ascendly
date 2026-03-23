import React from "react";
import Sidebar from "./Sidebar";
import TopHeader from "../../components/TopHeader";
import "./Settings.css";

const Settings = () => {
  return (
    <div className="dashboard-container">
      <Sidebar />

      <main className="settings-main" style={{ marginLeft: '260px', flexGrow: 1, minWidth: 0, padding: '28px 40px' }}>
        <div style={{ width: '100%', maxWidth: '1400px', margin: '0 auto' }}>
          <TopHeader showWelcome={false} title="Settings" />

        <div className="settings-header">
          <p className="settings-subtitle">
            Manage your account preferences and application settings.
          </p>
        </div>

        {/* Change Email */}
        <div className="settings-section">
          <div className="section-cat-title">Change Email</div>

          <div className="alert-box">
            <i className="ri-error-warning-fill"></i>
            <span>
              Please check your inbox for an email confirming your address. |{" "}
              <span className="alert-link">Send Again</span>
            </span>
          </div>

          <div className="form-group">
            <label>Email</label>
            <input type="email" defaultValue="admin@ascendly.com" />
          </div>

          <button className="btn-save-block">Save Email</button>
        </div>

        {/* Change Password */}
        <div className="settings-section">
          <div className="section-cat-title">Change Password</div>

          <div className="form-grid">
            <div className="form-group">
              <label>New Password</label>
              <div className="password-input-wrapper">
                <input type="password" placeholder="Enter your password" />
                <i className="ri-eye-line"></i>
              </div>
            </div>
            <div className="form-group">
              <label>Confirm Password</label>
              <div className="password-input-wrapper">
                <input type="password" placeholder="Enter your password" />
                <i className="ri-eye-line"></i>
              </div>
            </div>
          </div>

          <button className="btn-save-block">Save Password</button>
        </div>

        {/* Connected Accounts */}
        <div className="settings-section">
          <div className="section-cat-title">Connected Accounts</div>

          {/* Google */}
          <div className="connected-account-item">
            <div className="account-info">
              <div className="account-icon">
                <i className="ri-google-fill"></i>
              </div>
              <div className="account-details">
                <h4>Google</h4>
                <span>Account: admin@ascendly.com</span>
              </div>
            </div>
            <button className="btn-remove">Remove</button>
          </div>

          {/* Facebook */}
          <div className="connected-account-item">
            <div className="account-info">
              <div className="account-icon">
                <i className="ri-facebook-fill"></i>
              </div>
              <div className="account-details">
                <h4>Facebook</h4>
                <span>Connect your Facebook account</span>
              </div>
            </div>
            <button className="btn-connect">Connect</button>
          </div>

          {/* X / Twitter */}
          <div className="connected-account-item">
            <div className="account-info">
              <div className="account-icon">
                <i className="ri-twitter-x-fill"></i>
              </div>
              <div className="account-details">
                <h4>X / Twitter</h4>
                <span>Connect your X account</span>
              </div>
            </div>
            <button className="btn-connect">Connect</button>
          </div>

          {/* LinkedIn */}
          <div className="connected-account-item">
            <div className="account-info">
              <div className="account-icon">
                <i className="ri-linkedin-fill"></i>
              </div>
              <div className="account-details">
                <h4>LinkedIn</h4>
                <span>Connect your LinkedIn account</span>
              </div>
            </div>
            <button className="btn-connect">Connect</button>
          </div>
        </div>
        </div>
      </main>
    </div>
  );
};

export default Settings;
