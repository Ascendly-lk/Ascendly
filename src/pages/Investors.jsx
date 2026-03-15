import "./PageStyles.css";

const Investors = () => {
  const investors = [
    {
      name: "Venture Capital Partners",
      type: "VC",
      investment: "$2.5M",
      equity: "15%",
      status: "Active",
      avatar:
        "https://ui-avatars.com/api/?name=VCP&background=00D9C9&color=0F1419",
    },
    {
      name: "Angel Investor Group",
      type: "Angel",
      investment: "$500K",
      equity: "5%",
      status: "Active",
      avatar:
        "https://ui-avatars.com/api/?name=AIG&background=00D9C9&color=0F1419",
    },
    {
      name: "Tech Growth Fund",
      type: "VC",
      investment: "$1.8M",
      equity: "12%",
      status: "Active",
      avatar:
        "https://ui-avatars.com/api/?name=TGF&background=00D9C9&color=0F1419",
    },
    {
      name: "Strategic Partners Inc",
      type: "Strategic",
      investment: "$750K",
      equity: "8%",
      status: "Pending",
      avatar:
        "https://ui-avatars.com/api/?name=SPI&background=00D9C9&color=0F1419",
    },
  ];

  const fundingRounds = [
    {
      round: "Seed",
      date: "Jan 2023",
      amount: "$500K",
      valuation: "$2M",
      status: "Closed",
    },
    {
      round: "Series A",
      date: "Jul 2023",
      amount: "$4.3M",
      valuation: "$15M",
      status: "Closed",
    },
    {
      round: "Series B",
      date: "Mar 2024",
      amount: "$12M",
      valuation: "$50M",
      status: "In Progress",
    },
  ];

  return (
    <div className="page-content">
      <div className="page-header">
        <div>
          <h1 className="page-title">Investors</h1>
          <p className="page-description">
            Manage investor relations and funding rounds
          </p>
        </div>
        <button className="btn btn-primary">+ Add Investor</button>
      </div>

      <div className="stats-row">
        <div className="stat-card accent">
          <div className="stat-icon">💰</div>
          <div className="stat-info">
            <span className="stat-value">$17.3M</span>
            <span className="stat-label">Total Raised</span>
          </div>
        </div>
        <div className="stat-card">
          <div className="stat-icon">👥</div>
          <div className="stat-info">
            <span className="stat-value">12</span>
            <span className="stat-label">Active Investors</span>
          </div>
        </div>
        <div className="stat-card">
          <div className="stat-icon">📊</div>
          <div className="stat-info">
            <span className="stat-value">$50M</span>
            <span className="stat-label">Current Valuation</span>
          </div>
        </div>
        <div className="stat-card">
          <div className="stat-icon">📈</div>
          <div className="stat-info">
            <span className="stat-value">40%</span>
            <span className="stat-label">Total Equity Sold</span>
          </div>
        </div>
      </div>

      <div className="content-columns">
        <div className="card">
          <h3 className="card-heading">Investor Directory</h3>
          <div className="investor-list">
            {investors.map((investor, index) => (
              <div key={index} className="investor-item">
                <img
                  src={investor.avatar}
                  alt={investor.name}
                  className="investor-avatar"
                />
                <div className="investor-info">
                  <h4>{investor.name}</h4>
                  <span className="investor-type">{investor.type}</span>
                </div>
                <div className="investor-details">
                  <div className="detail">
                    <span className="detail-value">{investor.investment}</span>
                    <span className="detail-label">Investment</span>
                  </div>
                  <div className="detail">
                    <span className="detail-value">{investor.equity}</span>
                    <span className="detail-label">Equity</span>
                  </div>
                </div>
                <span
                  className={`status-badge ${investor.status.toLowerCase()}`}
                >
                  {investor.status}
                </span>
              </div>
            ))}
          </div>
        </div>

        <div className="card">
          <h3 className="card-heading">Funding Rounds</h3>
          <div className="funding-timeline">
            {fundingRounds.map((round, index) => (
              <div key={index} className="funding-item">
                <div className="funding-marker"></div>
                <div className="funding-content">
                  <div className="funding-header">
                    <h4>{round.round}</h4>
                    <span
                      className={`status-badge ${round.status.toLowerCase().replace(" ", "-")}`}
                    >
                      {round.status}
                    </span>
                  </div>
                  <span className="funding-date">{round.date}</span>
                  <div className="funding-details">
                    <div className="funding-stat">
                      <span className="stat-value">{round.amount}</span>
                      <span className="stat-label">Raised</span>
                    </div>
                    <div className="funding-stat">
                      <span className="stat-value">{round.valuation}</span>
                      <span className="stat-label">Valuation</span>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Investors;
