import "./PageStyles.css";

const BusinessAdvisors = () => {
  const advisors = [
    {
      name: "John Keels Holdings PLC",
      title: "Senior Business Consultant",
      expertise: ["Strategy", "Finance", "Operations"],
      rating: 4.8,
      reviews: 124,
      hourlyRate: "$250",
      availability: "Available",
      avatar:
        "https://ui-avatars.com/api/?name=JK&background=00D9C9&color=0F1419&size=80",
    },
    {
      name: "Gayani de Alwis",
      title: "Marketing Strategist",
      expertise: ["Marketing", "Branding", "Growth"],
      rating: 4.6,
      reviews: 89,
      hourlyRate: "$180",
      availability: "Available",
      avatar:
        "https://ui-avatars.com/api/?name=GA&background=00D9C9&color=0F1419&size=80",
    },
    {
      name: "Ajith de Costa",
      title: "Tech Advisor",
      expertise: ["Technology", "Engineering", "Product"],
      rating: 4.5,
      reviews: 67,
      hourlyRate: "$200",
      availability: "Busy",
      avatar:
        "https://ui-avatars.com/api/?name=AC&background=00D9C9&color=0F1419&size=80",
    },
    {
      name: "Sarah Williams",
      title: "Legal Consultant",
      expertise: ["Legal", "Compliance", "IP"],
      rating: 4.9,
      reviews: 156,
      hourlyRate: "$300",
      availability: "Available",
      avatar:
        "https://ui-avatars.com/api/?name=SW&background=00D9C9&color=0F1419&size=80",
    },
    {
      name: "Michael Chen",
      title: "Financial Advisor",
      expertise: ["Finance", "Investment", "Fundraising"],
      rating: 4.7,
      reviews: 112,
      hourlyRate: "$275",
      availability: "Available",
      avatar:
        "https://ui-avatars.com/api/?name=MC&background=00D9C9&color=0F1419&size=80",
    },
    {
      name: "Emma Thompson",
      title: "HR Consultant",
      expertise: ["HR", "Culture", "Hiring"],
      rating: 4.4,
      reviews: 45,
      hourlyRate: "$150",
      availability: "Available",
      avatar:
        "https://ui-avatars.com/api/?name=ET&background=00D9C9&color=0F1419&size=80",
    },
  ];

  return (
    <div className="page-content">
      <div className="page-header">
        <div>
          <h1 className="page-title">Business Advisors</h1>
          <p className="page-description">
            Connect with experienced advisors to grow your business
          </p>
        </div>
        <div className="header-actions">
          <input
            type="text"
            placeholder="Search advisors..."
            className="search-input-large"
          />
          <select className="filter-select">
            <option value="">All Expertise</option>
            <option value="strategy">Strategy</option>
            <option value="finance">Finance</option>
            <option value="marketing">Marketing</option>
            <option value="technology">Technology</option>
          </select>
        </div>
      </div>

      <div className="stats-row">
        <div className="stat-card">
          <div className="stat-icon">👥</div>
          <div className="stat-info">
            <span className="stat-value">48</span>
            <span className="stat-label">Total Advisors</span>
          </div>
        </div>
        <div className="stat-card accent">
          <div className="stat-icon">⭐</div>
          <div className="stat-info">
            <span className="stat-value">4.7</span>
            <span className="stat-label">Avg. Rating</span>
          </div>
        </div>
        <div className="stat-card">
          <div className="stat-icon">📅</div>
          <div className="stat-info">
            <span className="stat-value">156</span>
            <span className="stat-label">Sessions This Month</span>
          </div>
        </div>
        <div className="stat-card">
          <div className="stat-icon">✅</div>
          <div className="stat-info">
            <span className="stat-value">32</span>
            <span className="stat-label">Available Now</span>
          </div>
        </div>
      </div>

      <div className="advisors-grid">
        {advisors.map((advisor, index) => (
          <div key={index} className="advisor-card">
            <div className="advisor-header">
              <img
                src={advisor.avatar}
                alt={advisor.name}
                className="advisor-avatar-large"
              />
              <span
                className={`availability-badge ${advisor.availability.toLowerCase()}`}
              >
                {advisor.availability}
              </span>
            </div>
            <div className="advisor-body">
              <h3 className="advisor-name">{advisor.name}</h3>
              <p className="advisor-title">{advisor.title}</p>
              <div className="expertise-tags">
                {advisor.expertise.map((exp, eIndex) => (
                  <span key={eIndex} className="expertise-tag">
                    {exp}
                  </span>
                ))}
              </div>
              <div className="advisor-stats">
                <div className="rating">
                  <span className="star">⭐</span>
                  <span className="rating-value">{advisor.rating}</span>
                  <span className="reviews">({advisor.reviews} reviews)</span>
                </div>
                <div className="rate">{advisor.hourlyRate}/hr</div>
              </div>
            </div>
            <div className="advisor-actions">
              <button className="btn btn-secondary">View Profile</button>
              <button className="btn btn-primary">Book Session</button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default BusinessAdvisors;
