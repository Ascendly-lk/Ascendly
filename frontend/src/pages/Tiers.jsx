import "./PageStyles.css";

const Tiers = () => {
  const tiers = [
    {
      name: "Starter",
      price: "$0",
      period: "/month",
      description: "Perfect for exploring the platform",
      features: [
        "5 Team Members",
        "Basic Analytics",
        "10GB Storage",
        "Email Support",
        "Basic Integrations",
      ],
      highlighted: false,
      buttonText: "Current Plan",
    },
    {
      name: "Professional",
      price: "$49",
      period: "/month",
      description: "Best for growing startups",
      features: [
        "25 Team Members",
        "Advanced Analytics",
        "100GB Storage",
        "Priority Support",
        "All Integrations",
        "AI Insights",
        "Custom Reports",
      ],
      highlighted: true,
      buttonText: "Upgrade Now",
    },
    {
      name: "Enterprise",
      price: "$199",
      period: "/month",
      description: "For large organizations",
      features: [
        "Unlimited Team Members",
        "Enterprise Analytics",
        "Unlimited Storage",
        "24/7 Dedicated Support",
        "Custom Integrations",
        "Advanced AI",
        "White Label",
        "SLA Guarantee",
      ],
      highlighted: false,
      buttonText: "Contact Sales",
    },
  ];

  return (
    <div className="page-content">
      <div className="page-header centered">
        <h1 className="page-title">Subscription Tiers</h1>
        <p className="page-description">Choose the plan that fits your needs</p>
      </div>

      <div className="tiers-grid">
        {tiers.map((tier, index) => (
          <div
            key={index}
            className={`tier-card ${tier.highlighted ? "highlighted" : ""}`}
          >
            {tier.highlighted && <div className="tier-badge">Most Popular</div>}
            <div className="tier-header">
              <h3 className="tier-name">{tier.name}</h3>
              <div className="tier-price">
                <span className="price">{tier.price}</span>
                <span className="period">{tier.period}</span>
              </div>
              <p className="tier-description">{tier.description}</p>
            </div>
            <ul className="tier-features">
              {tier.features.map((feature, fIndex) => (
                <li key={fIndex}>
                  <span className="check-icon">✓</span>
                  {feature}
                </li>
              ))}
            </ul>
            <button
              className={`tier-button ${tier.highlighted ? "primary" : "secondary"}`}
            >
              {tier.buttonText}
            </button>
          </div>
        ))}
      </div>

      <div className="card comparison-section">
        <h3 className="card-heading">Feature Comparison</h3>
        <div className="table-container">
          <table className="data-table comparison-table">
            <thead>
              <tr>
                <th>Feature</th>
                <th>Starter</th>
                <th>Professional</th>
                <th>Enterprise</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td>Team Members</td>
                <td>5</td>
                <td>25</td>
                <td>Unlimited</td>
              </tr>
              <tr>
                <td>Storage</td>
                <td>10GB</td>
                <td>100GB</td>
                <td>Unlimited</td>
              </tr>
              <tr>
                <td>AI Analytics</td>
                <td>❌</td>
                <td>✅</td>
                <td>✅</td>
              </tr>
              <tr>
                <td>Custom Reports</td>
                <td>❌</td>
                <td>✅</td>
                <td>✅</td>
              </tr>
              <tr>
                <td>API Access</td>
                <td>❌</td>
                <td>✅</td>
                <td>✅</td>
              </tr>
              <tr>
                <td>White Label</td>
                <td>❌</td>
                <td>❌</td>
                <td>✅</td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default Tiers;
