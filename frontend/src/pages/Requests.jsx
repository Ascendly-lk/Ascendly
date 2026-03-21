import { useState } from "react";
import "./Requests.css";

const Requests = () => {
  const [activeTab, setActiveTab] = useState("requests");

  const requests = [
    {
      id: 1,
      name: "Adam Hooper",
      initials: "AH",
      date: "2025 - 06 - 25",
      time: "10.00 a.m",
      duration: "01 hour",
      topic: "Fundraising Strategy",
      message: '"Hi I\'d love tp soikn swrkjgnolik skedfnlknlskgnk sdfffw wa;lskfiknwrgiknwinf olknfnknleedkefm;oljmweiknfp iknmlknm"',
    },
    {
      id: 2,
      name: "Adam Hooper",
      initials: "AH",
      date: "2025 - 06 - 25",
      time: "10.00 a.m",
      duration: "01 hour",
      topic: "Fundraising Strategy",
      message: '"Hi I\'d love tp soikn swrkjgnolik skedfnlknlskgnk sdfffw wa;lskfiknwrgiknwinf olknfnknleedkefm;oljmweiknfp iknmlknm"',
    },
    {
      id: 3,
      name: "Adam Hooper",
      initials: "AH",
      date: "2025 - 06 - 25",
      time: "10.00 a.m",
      duration: "01 hour",
      topic: "Fundraising Strategy",
      message: '"Hi I\'d love tp soikn swrkjgnolik skedfnlknlskgnk sdfffw wa;lskfiknwrgiknwinf olknfnknleedkefm;oljmweiknfp iknmlknm"',
    },
  ];

  return (
    <div className="requests-page">
      <h1 className="page-title requests-title">Requests</h1>

      <div className="requests-tabs">
        <button 
          className={`tab-item ${activeTab === 'requests' ? 'active' : ''}`}
          onClick={() => setActiveTab('requests')}
        >
          <i className="fi fi-rr-users-alt"></i> Session requests
          <span className="tab-badge">3</span>
        </button>
        <button 
          className={`tab-item ${activeTab === 'messages' ? 'active' : ''}`}
          onClick={() => setActiveTab('messages')}
        >
          <i className="fi fi-rr-messages"></i> Messages
          <span className="tab-badge">10</span>
        </button>
      </div>

      <div className="requests-grid">
        {requests.map((request, index) => (
          <div key={index} className="request-card">
            <div className="request-header">
              <div className="request-avatar">{request.initials}</div>
              <div className="request-info">
                <h2 className="request-name">{request.name}</h2>
                <div className="request-meta">
                  <span>
                    <i className="fi fi-rr-calendar"></i> {request.date}
                  </span>
                  <span>@ {request.time}</span>
                  <span>
                    <i className="fi fi-rr-clock"></i> {request.duration}
                  </span>
                </div>
              </div>
            </div>
            
            <div className="request-topic">{request.topic}</div>
            
            <p className="request-message">{request.message}</p>
            
            <div className="request-actions">
              <button className="btn-accept">
                <i className="fi fi-rr-check-circle"></i> Accept
              </button>
              <button className="btn-decline">
                <i className="fi fi-rr-cross-circle"></i> Decline
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Requests;
