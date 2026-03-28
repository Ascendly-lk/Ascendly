import React, { useState } from "react";
import Sidebar from "./Sidebar";
import TopHeader from "../../components/TopHeader";
import "./EditProfile.css";
import "./editProfile.css";


const EditProfile = () => {
  const [showSuccess, setShowSuccess] = useState(false);

  const handleSave = () => {
    setShowSuccess(true);
    setTimeout(() => {
      setShowSuccess(false);
    }, 3000);
  };

  return (
    <div className="dashboard-container app-container">
      <Sidebar />

      <main className="main-content" style={{ marginLeft: '260px', flexGrow: 1, minWidth: 0, padding: '28px 40px' }}>
        <div style={{ width: '100%', maxWidth: '1400px', margin: '0 auto' }}>
          <TopHeader showWelcome={false} title="Edit Profile" />

        <div className="content-wrapper">
          <div className="page-header">
            <p className="page-subtitle">
              Update your personal information and contact details.
            </p>
          </div>

          {/* Edit Profile Form Card */}
          <div className="card profile-card">
            {/* Photo Section */}
            <div className="section photo-section">
              <div className="photo-placeholder"></div>
              <div className="photo-info">
                <h3>Profile Photo</h3>
                <p>
                  This will be displayed on your profile and visible to other
                  investors.
                  <br />
                  JPG, GIF or PNG. Max size of 800K.
                </p>
                <button className="btn btn-primary">Upload New</button>
              </div>
            </div>

            <div className="divider"></div>

            {/* Personal Details */}
            <div className="section personal-details">
              <h3 className="section-title">Personal Details</h3>
              <div className="form-grid">
                <div className="form-group">
                  <label>First Name</label>
                  <input type="text" defaultValue="Alex" />
                </div>
                <div className="form-group">
                  <label>Last Name</label>
                  <input type="text" defaultValue="Rivera" />
                </div>
                <div className="form-group">
                  <label>Username</label>
                  <div className="input-prefix-group">
                    <span className="prefix">Ascendely.com/</span>
                    <input type="text" defaultValue="alexrivera" />
                  </div>
                </div>
                <div className="form-group">
                  <label>Job Title</label>
                  <input type="text" defaultValue="Founder & CEO" />
                </div>
              </div>
            </div>

            <div className="divider"></div>

            {/* Contact Details */}
            <div className="section contact-details">
              <h3 className="section-title">Contact Details</h3>
              <div className="form-grid">
                <div className="form-group">
                  <label>Email Address</label>
                  <input type="email" defaultValue="alex@ascendly.com" />
                </div>
                <div className="form-group">
                  <label>Phone Number</label>
                  <input type="tel" defaultValue="+1 (555) 123-4567" />
                </div>
                <div className="form-group full-width">
                  <label>Home Address</label>
                  <textarea rows="3" defaultValue="123 Innovation Drive, Silicon Valley, CA"></textarea>
                </div>
              </div>
            </div>

            {/* Save Button Section */}
            <div className="section actions-section" style={{ marginTop: '24px' }}>
              <button className="btn btn-primary" onClick={handleSave}>
                Save Details
              </button>
            </div>
          </div>
        </div>

        {/* Success Toast Popup */}
        {showSuccess && (
          <div style={{
            position: 'fixed',
            bottom: '24px',
            right: '24px',
            backgroundColor: '#10B981',
            color: '#fff',
            padding: '12px 24px',
            borderRadius: '8px',
            boxShadow: '0 4px 6px rgba(0,0,0,0.1)',
            zIndex: 1000,
            display: 'flex',
            alignItems: 'center',
            gap: '8px',
            animation: 'fadeIn 0.3s ease-out'
          }}>
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <polyline points="20 6 9 17 4 12"></polyline>
            </svg>
            <span style={{ fontWeight: '500' }}>Details saved successfully</span>
          </div>
        )}
      </main>

      <style>{`
        @keyframes fadeIn {
          from { opacity: 0; transform: translateY(10px); }
          to { opacity: 1; transform: translateY(0); }
        }
      `}</style>
    </div>
  );
};

export default EditProfile;
