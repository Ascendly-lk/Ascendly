import { useState } from "react";
import "./Clients.css";

const Clients = () => {
  const [activeTab, setActiveTab] = useState("requests");

  const clients = [
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
      name: "James Bond",
      initials: "JB",
      date: "2025 - 07 - 21",
      time: "12.00 p.m",
      duration: "45 minutes",
      topic: "Market Expansion",
      message: '"Hi I\'d love tp soikn swrkjgnolik skedfnlknlskgnk sdfffw wa;lskfiknwrgiknwinf olknfnknleedkefm;oljmweiknfp iknmlknm"',
    },
    {
      id: 3,
      name: "Tom Cruise",
      initials: "TC",
      date: "2025 - 05 - 18",
      time: "6.00 p.m",
      duration: "15 minutes",
      topic: "Product Roadmap",
      message: '"Hi I\'d love tp soikn swrkjgnolik skedfnlknlskgnk sdfffw wa;lskfiknwrgiknwinf olknfnknleedkefm;oljmweiknfp iknmlknm"',
    },
  ];

  return (
    <div className="clients-page">
      <h1 className="page-title clients-title">Clients</h1>

      <div className="clients-tabs">
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

      <div className="clients-list">
        {clients.map((client) => (
          <div key={client.id} className="client-card">
            <div className="client-content">
              <div className="client-avatar">{client.initials}</div>
              <div className="client-details">
                <h2 className="client-name">{client.name}</h2>
                <div className="client-meta">
                  <span className="meta-item">
                    <i className="fi fi-rr-calendar"></i> {client.date} at {client.time}
                  </span>
                  <span className="meta-item">
                    <i className="fi fi-rr-clock"></i> {client.duration}
                  </span>
                </div>
                <div className="client-topic">{client.topic}</div>
                <p className="client-message">{client.message}</p>
              </div>
            </div>
            <div className="client-actions">
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

export default Clients;
