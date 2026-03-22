import { useMemo, useState, useEffect } from "react";
import {
  Search,
  Filter,
  Send,
  Download,
  AlertCircle,
  CheckCircle2,
  Clock,
  Calendar,
  CreditCard,
  Banknote,
} from "lucide-react";
import { fetchPayments } from '../../utils/patent-api';
import TopBar from "../../components/dashboard/TopBar";
import "./Payments.css";

const statusMeta = {
  all: { label: "All", color: "cl-badge-gray" },
  paid: { label: "Paid", color: "cl-badge-green" },
  pending: { label: "Pending", color: "cl-tier-2" },
  overdue: { label: "cl-tier-1", color: "cl-tier-1" }, // Matches urgent/overdue
};

export default function PatentFirmPayments() {
  const [sampleInvoices, setSampleInvoices] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [tab, setTab] = useState("all");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchPayments().then(data => {
        setSampleInvoices(data);
        setLoading(false);
    }).catch(e => {
        console.error("Failed to fetch payments", e);
        setLoading(false);
    });
  }, []);

  const filtered = useMemo(() => {
    if (!sampleInvoices.length) return [];
    const normalized = searchQuery.trim().toLowerCase();
    return sampleInvoices.filter((invoice) => {
      const matchQuery =
        !normalized ||
        (invoice.client || "").toLowerCase().includes(normalized) ||
        (invoice.id || "").toLowerCase().includes(normalized) ||
        (invoice.applicationId || "").toLowerCase().includes(normalized);

      const matchTab = tab === "all" || invoice.status === tab;
      return matchQuery && matchTab;
    });
  }, [searchQuery, tab, sampleInvoices]);

  const overdueInvoice = sampleInvoices.find((inv) => inv.status === "overdue");

  const analytics = useMemo(() => {
    if (!sampleInvoices.length) return { revenueByTier: {}, paymentMethods: {}, totalRevenue: 0 };
    const revenueByTier = sampleInvoices.reduce((acc, inv) => {
      acc[inv.tier] = (acc[inv.tier] || 0) + (parseFloat(inv.amount) || 0);
      return acc;
    }, {});

    const paymentMethods = sampleInvoices.reduce((acc, inv) => {
      if (inv.paymentMethod) {
        acc[inv.paymentMethod] = acc[inv.paymentMethod] || { amount: 0, count: 0 };
        acc[inv.paymentMethod].amount += (parseFloat(inv.amount) || 0);
        acc[inv.paymentMethod].count += 1;
      }
      return acc;
    }, {});

    const totalRevenue = Object.values(revenueByTier).reduce((a, b) => a + b, 0);

    return { revenueByTier, paymentMethods, totalRevenue };
  }, [sampleInvoices]);

  return (
    <div className="startup-dashboard">
      <TopBar />
      <div className="pf-hero" style={{ padding: '32px 28px 16px 28px' }}>
        <h1>Payments</h1>
        <p>Complete payment history and status</p>
      </div>

      <div className="dashboard-content pf-content">
        <div className="cl-toolbar">
            <div className="cl-search-wrapper">
              <Search className="cl-search-icon" size={16} />
              <input
                type="search"
                className="cl-input"
                placeholder="Search invoices..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
            <div className="cl-action-btns">
              <button className="cl-btn cl-btn-outline">
                <Filter size={16} /> Filter
              </button>
              <button className="cl-btn cl-btn-primary">
                <Send size={16} /> New Invoice
              </button>
            </div>
          </div>

        {overdueInvoice && (
          <section className="payment-overdue-highlight">
            <div className="highlight-header">
              <AlertCircle size={16} />
              <h3>1 Overdue Invoice</h3>
            </div>
            <p className="highlight-text">These invoices require immediate attention</p>
            <div className="overdue-item">
              <div>
                <h4>{overdueInvoice.client}</h4>
                <p>
                  {overdueInvoice.id} • ${overdueInvoice.amount.toLocaleString()} • Due {overdueInvoice.dueDate}
                </p>
              </div>
              <button className="cl-btn send-reminder-btn">Send Reminder</button>
            </div>
          </section>
        )}

        <div style={{ display: 'flex', gap: '8px', marginBottom: '24px' }}>
          {Object.keys(statusMeta).map((key) => (
            <button
              key={key}
              className={`cl-btn ${tab === key ? "cl-btn-primary" : "cl-btn-outline"}`}
              onClick={() => setTab(key)}
            >
              {statusMeta[key].label} ({key === "all" ? sampleInvoices.length : sampleInvoices.filter((i) => i.status === key).length})
            </button>
          ))}
        </div>

        <div className="payment-list">
          {filtered.map((invoice) => {
            const status = statusMeta[invoice.status];
            return (
              <article key={invoice.id} className="payment-card">
                <div className="payment-main">
                  <div className="payment-header-row">
                    <div className="payment-title-group">
                      <h3>{invoice.client}</h3>
                      <p className="service">{invoice.service}</p>
                    </div>
                    <span className={`cl-badge ${invoice.status === 'paid' ? 'cl-badge-green' : (invoice.status === 'pending' ? 'cl-tier-2' : 'cl-tier-1')}`}>
                      {invoice.status === 'paid' && <CheckCircle2 size={12} style={{marginRight: '4px'}} />}
                      {invoice.status === 'pending' && <Clock size={12} style={{marginRight: '4px'}} />}
                      {status.label}
                    </span>
                  </div>

                  <div className="payment-body-row">
                    <div className="payment-meta-group">
                      <span className="id-tag">{invoice.id}</span>
                      <span className="dot-sep">•</span>
                      <span className="app-tag">{invoice.applicationId}</span>
                      <span className="dot-sep">•</span>
                      <span className="cl-badge cl-tier-1">{invoice.tier}</span>
                      <span className="dot-sep">•</span>
                      <div className="date-meta">
                        <Calendar size={14} />
                        <span>Due: {invoice.dueDate}</span>
                      </div>
                      {invoice.paidDate && (
                        <>
                          <span className="dot-sep">•</span>
                          <div className="date-meta paid-meta">
                            <span>Paid: {invoice.paidDate}</span>
                          </div>
                        </>
                      )}
                    </div>
                    
                    <div className="payment-amount-group">
                      <div className="amount">${(parseFloat(invoice.amount) || 0).toLocaleString()}</div>
                      <button className="download-btn" aria-label={`Download ${invoice.id}`}>
                        <Download size={18} />
                      </button>
                    </div>
                  </div>
                </div>
              </article>
            );
          })}

          {filtered.length === 0 && <div className="empty-note">No invoices matched your search.</div>}
        </div>

        {/* Analytics Widgets Row */}
        <div className="payments-analytics-row">
          <div className="analytics-card">
            <div className="analytics-header">
              <h3>Revenue by Service Tier</h3>
              <p>Breakdown of revenue by service level</p>
            </div>
            <div className="analytics-content">
              {[
                { label: 'Tier 3 - Premium', key: 'Tier 3', color: '#C084FC' },
                { label: 'Tier 2 - Full Support', key: 'Tier 2', color: '#60A5FA' },
                { label: 'Tier 1 - Self-Service', key: 'Tier 1', color: '#94a3b8' }
              ].map(tier => (
                <div key={tier.key} className="tier-stat-item">
                  <div className="tier-stat-info">
                    <div className="tier-label">
                      <span className="tier-dot" style={{ backgroundColor: tier.color }}></span>
                      {tier.label}
                    </div>
                    <div className="tier-value">${(analytics.revenueByTier[tier.key] || 0).toLocaleString()}</div>
                  </div>
                  <div className="tier-progress-bg">
                    <div 
                      className="tier-progress-fill" 
                      style={{ 
                        width: `${((analytics.revenueByTier[tier.key] || 0) / analytics.totalRevenue) * 100}%`, 
                        backgroundColor: '#0d1628' 
                      }}
                    ></div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="analytics-card">
            <div className="analytics-header">
              <h3>Payment Methods</h3>
              <p>How clients are paying</p>
            </div>
            <div className="analytics-content">
              {[
                { label: 'Credit Card', icon: CreditCard },
                { label: 'Bank Transfer', icon: Banknote }
              ].map(method => {
                const data = analytics.paymentMethods[method.label] || { amount: 0, count: 0 };
                const Icon = method.icon;
                return (
                  <div key={method.label} className="method-item">
                    <div className="method-icon-box">
                      <Icon size={20} />
                    </div>
                    <div className="method-info">
                      <div className="method-top">
                        <h4>{method.label}</h4>
                        <span className="method-amount">${data.amount.toLocaleString()}</span>
                      </div>
                      <p>{data.count} transactions</p>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
