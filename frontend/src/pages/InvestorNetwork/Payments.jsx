import React from 'react';
import './Payments.css';

const Payments = () => {
  const transactions = [
    {
      id: "TXN-001",
      client: "Adam Hooper",
      service: "Fundraising Strategy",
      amount: "+$2,500.00",
      date: "June 12, 2025",
      status: "Completed"
    },
    {
      id: "TXN-002",
      client: "James Bond",
      service: "Market Expansion",
      amount: "+$1,850.00",
      date: "June 10, 2025",
      status: "Pending"
    },
    {
      id: "TXN-003",
      client: "Tom Cruise",
      service: "Product Roadmap",
      amount: "+$3,200.00",
      date: "June 05, 2025",
      status: "Completed"
    },
    {
      id: "TXN-004",
      client: "Alexa Rawles",
      service: "Strategy Consultation",
      amount: "+$1,200.00",
      date: "May 28, 2025",
      status: "Completed"
    }
  ];

  return (
    <div className="payments-page">
      <h1 className="page-title">Payments</h1>

      <div className="payments-summary">
        <div className="summary-card balance-card">
          <div className="summary-info">
            <span className="summary-label">Total Balance</span>
            <h2 className="summary-value">$12,450.00</h2>
          </div>
          <div className="summary-icon">
            <i className="fi fi-rr-wallet"></i>
          </div>
        </div>
        
        <div className="summary-card earnings-card">
          <div className="summary-info">
            <span className="summary-label">Monthly Earnings</span>
            <h2 className="summary-value">$7,550.00</h2>
          </div>
          <div className="summary-icon">
            <i className="fi fi-rr-stats"></i>
          </div>
        </div>

        <div className="summary-card pending-card">
          <div className="summary-info">
            <span className="summary-label">Pending Payments</span>
            <h2 className="summary-value">$1,850.00</h2>
          </div>
          <div className="summary-status">
            <i className="fi fi-rr-time-past"></i>
          </div>
        </div>
      </div>

      <div className="transactions-container">
        <div className="transactions-header">
          <h3>Transaction History</h3>
          <button className="btn-export">
            <i className="fi fi-rr-download"></i> Export CSV
          </button>
        </div>

        <div className="transactions-table-wrapper">
          <table className="transactions-table">
            <thead>
              <tr>
                <th>Transaction ID</th>
                <th>Client</th>
                <th>Service</th>
                <th>Amount</th>
                <th>Date</th>
                <th>Status</th>
              </tr>
            </thead>
            <tbody>
              {transactions.map((txn) => (
                <tr key={txn.id}>
                  <td className="txn-id">{txn.id}</td>
                  <td className="txn-client">{txn.client}</td>
                  <td className="txn-service">{txn.service}</td>
                  <td className="txn-amount">{txn.amount}</td>
                  <td className="txn-date">{txn.date}</td>
                  <td>
                    <span className={`status-pill ${txn.status.toLowerCase()}`}>
                      {txn.status}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default Payments;
