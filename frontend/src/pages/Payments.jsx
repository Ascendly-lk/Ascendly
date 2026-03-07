import { useEffect, useMemo, useState } from "react";
import {
  AlertCircle,
  CalendarDays,
  CheckCircle2,
  Clock3,
  DollarSign,
  Download,
  LineChart,
  Send,
  TrendingUp,
} from "lucide-react";
import Sidebar from "./Sidebar";
import TopHeader from "../components/TopHeader";
import "./Payments.css";

const overviewCardConfig = [
  {
    id: 1,
    label: "Total Revenue",
    key: "revenue",
    format: "currency",
    Icon: DollarSign,
    variant: "primary",
  },
  {
    id: 2,
    label: "Pending Payments",
    key: "pending",
    format: "currency",
    Icon: Clock3,
    variant: "pending",
  },
  {
    id: 3,
    label: "Paid This Month",
    key: "paid",
    format: "currency",
    Icon: CheckCircle2,
    variant: "paid",
  },
  {
    id: 4,
    label: "Overdue Invoices",
    key: "overdue",
    format: "number",
    Icon: AlertCircle,
    variant: "danger",
  },
];

const periodData = {
  month: {
    label: "This Month",
    trend: "+10.0%",
    metrics: { revenue: 75000, pending: 26000, paid: 27500, overdue: 1 },
    transactions: [
      {
        id: 1,
        title: "Payment from TechFlow Inc.",
        date: "Dec 14, 2024",
        amount: 15000,
      },
      {
        id: 2,
        title: "Revenue Share - November",
        date: "Dec 10, 2024",
        amount: 48200,
      },
    ],
    invoices: [
      {
        id: "INV-2024-001",
        client: "TechFlow Inc.",
        amount: 15000,
        dueDate: "Dec 1, 2024",
        status: "PAID",
      },
      {
        id: "INV-2024-002",
        client: "FinTech Pro",
        amount: 12500,
        dueDate: "Dec 5, 2024",
        status: "PAID",
      },
    ],
  },
  quarter: {
    label: "This Quarter",
    trend: "+13.6%",
    metrics: { revenue: 213000, pending: 64100, paid: 141700, overdue: 3 },
    transactions: [
      {
        id: 1,
        title: "Enterprise Payment - CoreStack",
        date: "Nov 18, 2024",
        amount: 42000,
      },
      {
        id: 2,
        title: "Revenue Share - Q4",
        date: "Oct 30, 2024",
        amount: 88400,
      },
    ],
    invoices: [
      {
        id: "INV-2024-018",
        client: "CoreStack Labs",
        amount: 42000,
        dueDate: "Nov 25, 2024",
        status: "PAID",
      },
      {
        id: "INV-2024-021",
        client: "LaunchScale Inc.",
        amount: 17200,
        dueDate: "Dec 12, 2024",
        status: "PENDING",
      },
    ],
  },
  year: {
    label: "This Year",
    trend: "+21.2%",
    metrics: { revenue: 918000, pending: 139000, paid: 741400, overdue: 7 },
    transactions: [
      {
        id: 1,
        title: "Annual Retainer - Vertex Group",
        date: "Aug 12, 2024",
        amount: 125000,
      },
      {
        id: 2,
        title: "Revenue Share - FY 2024",
        date: "Dec 20, 2024",
        amount: 267500,
      },
    ],
    invoices: [
      {
        id: "INV-2024-102",
        client: "Vertex Group",
        amount: 125000,
        dueDate: "Aug 30, 2024",
        status: "PAID",
      },
      {
        id: "INV-2024-117",
        client: "Blue Orbit",
        amount: 28500,
        dueDate: "Dec 30, 2024",
        status: "OVERDUE",
      },
    ],
  },
};

const periods = [
  { key: "month", label: "Month" },
  { key: "quarter", label: "Quarter" },
  { key: "year", label: "Year" },
];

function formatCurrency(value) {
  return `$${value.toLocaleString()}`;
}

function useCountUp(targetValue, duration = 500) {
  const [displayValue, setDisplayValue] = useState(targetValue);

  useEffect(() => {
    const startValue = displayValue;
    const steps = 20;
    const stepDuration = Math.max(Math.floor(duration / steps), 16);
    const increment = (targetValue - startValue) / steps;
    let currentStep = 0;

    const timer = setInterval(() => {
      currentStep += 1;
      if (currentStep >= steps) {
        setDisplayValue(targetValue);
        clearInterval(timer);
        return;
      }

      setDisplayValue(Math.round(startValue + increment * currentStep));
    }, stepDuration);

    return () => clearInterval(timer);
  }, [targetValue]);

  return displayValue;
}

function StatCard({ card, value, subLabel, trend }) {
  const Icon = card.Icon;
  const animatedValue = useCountUp(value);
  const displayedValue =
    card.format === "currency"
      ? formatCurrency(animatedValue)
      : animatedValue.toLocaleString();

  return (
    <article className={`payment-stat-card ${card.variant}`}>
      <div className="stat-icon">
        <Icon />
      </div>
      <p>{card.label}</p>
      <h2>{displayedValue}</h2>
      {card.variant === "primary" ? (
        <div className="stat-foot-chip">
          <span>{trend}</span>
          <small>{subLabel}</small>
        </div>
      ) : (
        <small>{subLabel}</small>
      )}
    </article>
  );
}

export default function Payments() {
  const [activePeriod, setActivePeriod] = useState("month");

  const currentData = useMemo(() => periodData[activePeriod], [activePeriod]);

  const overviewCards = useMemo(
    () =>
      overviewCardConfig.map((card) => ({
        ...card,
        value: currentData.metrics[card.key],
      })),
    [currentData],
  );

  return (
    <div className="payments-page">
      <Sidebar />

      <main className="payments-main">
        <TopHeader showWelcome={false} />

        <header className="payments-header">
          <h1>Payments &amp; Revenue</h1>

          <div className="payments-header-actions">
            <div
              className="period-switch"
              role="tablist"
              aria-label="Period view"
            >
              {periods.map((period) => (
                <button
                  key={period.key}
                  type="button"
                  className={activePeriod === period.key ? "active" : ""}
                  onClick={() => setActivePeriod(period.key)}
                >
                  {period.label}
                </button>
              ))}
            </div>

            <button type="button" className="send-invoice-btn">
              <Send />
              Send Invoice
            </button>
          </div>
        </header>

        <section className="payments-overview">
          {overviewCards.map((card) => (
            <StatCard
              key={card.id}
              card={card}
              value={card.value}
              subLabel={currentData.label}
              trend={currentData.trend}
            />
          ))}
        </section>

        <section className="payment-panel">
          <h3>Recent Transactions</h3>
          <div className="transactions-list">
            {currentData.transactions.map((transaction) => (
              <article key={transaction.id} className="transaction-item">
                <div className="transaction-left">
                  <span className="transaction-icon">
                    <TrendingUp />
                  </span>
                  <div>
                    <h4>{transaction.title}</h4>
                    <p>{transaction.date}</p>
                  </div>
                </div>
                <span className="transaction-amount">
                  + {formatCurrency(transaction.amount)}
                </span>
              </article>
            ))}
          </div>
        </section>

        <section className="payment-panel invoices-panel">
          <div className="panel-head">
            <h3>Recent Invoices</h3>
            <button type="button" className="export-btn">
              <Download />
              Export
            </button>
          </div>

          <div className="invoice-table-wrap">
            <table className="invoice-table">
              <thead>
                <tr>
                  <th>Invoice #</th>
                  <th>Client</th>
                  <th>Amount</th>
                  <th>Due Date</th>
                  <th>Status</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {currentData.invoices.map((invoice) => (
                  <tr key={invoice.id}>
                    <td>{invoice.id}</td>
                    <td>{invoice.client}</td>
                    <td className="amount-cell">
                      {formatCurrency(invoice.amount)}
                    </td>
                    <td>
                      <CalendarDays /> {invoice.dueDate}
                    </td>
                    <td>
                      <span
                        className={`status-pill ${invoice.status.toLowerCase()}`}
                      >
                        {invoice.status}
                      </span>
                    </td>
                    <td>
                      <button type="button" className="table-link-btn">
                        View
                      </button>
                      <span className="action-dot">+</span>
                      <button type="button" className="table-link-btn">
                        Download
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>
      </main>
    </div>
  );
}
