import React from 'react';
import './Help.css';

const Help = () => {
  return (
    <div className="help-page">
      <h1 className="page-title">Help & Support</h1>
      
      <div className="help-container">
        <div className="help-card">
          <div className="help-icon">
            <i className="fi fi-rr-interrogation"></i>
          </div>
          <h2>How can we help you?</h2>
          <p>Search our knowledge base or contact our support team.</p>
          
          <div className="help-search">
            <input type="text" placeholder="Search for articles..." />
            <button><i className="fi fi-rr-search"></i></button>
          </div>
        </div>

        <div className="help-grid">
          <div className="help-box">
            <i className="fi fi-rr-book"></i>
            <h3>Documentation</h3>
            <p>Learn how to use Ascendly effectively.</p>
          </div>
          <div className="help-box">
            <i className="fi fi-rr-envelope"></i>
            <h3>Email Support</h3>
            <p>Get in touch with our support team.</p>
          </div>
          <div className="help-box">
            <i className="fi fi-rr-comment"></i>
            <h3>Live Chat</h3>
            <p>Chat with us in real-time.</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Help;