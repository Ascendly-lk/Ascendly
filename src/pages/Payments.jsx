import React from 'react';
import { DollarSign, Clock, CheckCircle, AlertCircle, ArrowUpRight, ArrowDownLeft, FileText } from 'lucide-react';
import { MetricCard } from '../components/MetricCard';
import { InvoiceTable } from '../components/InvoiceTable.jsx';

const transactions = [
  { title: 'Payment from TechFlow', date: 'Dec 14, 2024', amount: '+$4,500.00', type: 'in' },
  { title: 'Software Subscription', date: 'Dec 12, 2024', amount: '-$120.00', type: 'out' },
  { title: 'Payment from Urban Eat', date: 'Dec 10, 2024', amount: '+$3,200.00', type: 'in' },
  { title: 'Freelance Designer', date: 'Dec 08, 2024', amount: '-$850.00', type: 'out' },
];

const invoices = [
  { id: 'INV-2024-001', client: 'TechFlow Solutions', amount: '$4,500.00', date: 'Dec 20, 2024', status: 'Paid' },
  { id: 'INV-2024-002', client: 'GreenScape Garden', amount: '$2,800.00', date: 'Dec 25, 2024', status: 'Pending' },
  { id: 'INV-2024-003', client: 'Urban Eat Co.', amount: '$3,200.00', date: 'Dec 15, 2024', status: 'Overdue' },
  { id: 'INV-2024-004', client: 'CloudNine Systems', amount: '$5,100.00', date: 'Jan 05, 2025', status: 'Pending' },
];

export default function PaymentsPage() {
  return (
    <div className="space-y-8">
      {/* Top Section */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="lg:col-span-1 bg-gradient-to-br from-accent to-teal-600 p-6 rounded-2xl text-bg-dark shadow-[0_0_30px_rgba(0,255,239,0.2)]">
          <div className="flex justify-between items-start mb-6">
            <div className="p-2 bg-bg-dark/10 rounded-lg">
              <DollarSign className="w-5 h-5" />
            </div>
            <span className="px-2 py-1 bg-bg-dark/10 rounded-full text-[10px] font-bold uppercase tracking-wider">
              +15.4%
            </span>
          </div>
          <h3 className="text-4xl font-bold mb-1">$75,000</h3>
          <p className="text-bg-dark/70 text-sm font-semibold">Total Revenue</p>
        </div>

        <MetricCard label="Pending Payments" value="$26,000" icon={Clock} trendColor="warning" />
        <MetricCard label="Paid This Month" value="$27,500" icon={CheckCircle} />
        <MetricCard label="Overdue Invoices" value="1" icon={AlertCircle} trendColor="danger" />
      </div>

      {/* Middle Section */}
      <div className="bg-card-dark p-6 rounded-2xl border border-border-subtle">
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-lg font-semibold">Recent Transactions</h3>
          <button className="text-accent text-sm font-semibold hover:underline">View All</button>
        </div>
        <div className="space-y-4">
          {transactions.map((tx, i) => (
            <div key={i} className="flex items-center justify-between p-4 hover:bg-white/[0.02] rounded-xl transition-colors group">
              <div className="flex items-center gap-4">
                <div className={`p-2 rounded-lg ${tx.type === 'in' ? 'bg-green-500/10 text-green-500' : 'bg-red-500/10 text-red-500'}`}>
                  {tx.type === 'in' ? <ArrowDownLeft className="w-4 h-4" /> : <ArrowUpRight className="w-4 h-4" />}
                </div>
                <div>
                  <h4 className="font-medium text-sm">{tx.title}</h4>
                  <p className="text-muted-text text-xs">{tx.date}</p>
                </div>
              </div>
              <div className="flex items-center gap-4">
                <span className={`font-bold ${tx.type === 'in' ? 'text-green-500' : 'text-white'}`}>
                  {tx.amount}
                </span>
                <button className="opacity-0 group-hover:opacity-100 transition-opacity">
                  <ArrowUpRight className="w-4 h-4 text-muted-text" />
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Bottom Section */}
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <h3 className="text-xl font-semibold">Recent Invoices</h3>
          <button className="flex items-center gap-2 px-4 py-2 bg-accent/10 text-accent border border-accent/20 rounded-xl text-sm font-bold hover:bg-accent hover:text-bg-dark transition-all glow-hover">
            <FileText className="w-4 h-4" />
            Export Invoices
          </button>
        </div>
        <InvoiceTable invoices={invoices} />
      </div>
    </div>
  );
}
