import React from 'react';
import { Download, Eye, MoreHorizontal } from 'lucide-react';
import { clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';

function cn(...inputs) {
  return twMerge(clsx(inputs));
}

export const InvoiceTable = ({ invoices }) => {
  return (
    <div className="bg-card-dark rounded-2xl border border-border-subtle overflow-hidden">
      <div className="overflow-x-auto">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="border-bottom border-border-subtle">
              <th className="p-6 text-xs font-semibold text-muted-text uppercase tracking-wider">Invoice #</th>
              <th className="p-6 text-xs font-semibold text-muted-text uppercase tracking-wider">Client</th>
              <th className="p-6 text-xs font-semibold text-muted-text uppercase tracking-wider">Amount</th>
              <th className="p-6 text-xs font-semibold text-muted-text uppercase tracking-wider">Due Date</th>
              <th className="p-6 text-xs font-semibold text-muted-text uppercase tracking-wider">Status</th>
              <th className="p-6 text-xs font-semibold text-muted-text uppercase tracking-wider text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-border-subtle">
            {invoices.map((invoice) => (
              <tr key={invoice.id} className="hover:bg-white/[0.02] transition-colors group">
                <td className="p-6 text-sm font-medium text-white">{invoice.id}</td>
                <td className="p-6 text-sm text-white">{invoice.client}</td>
                <td className="p-6 text-sm font-semibold text-white">{invoice.amount}</td>
                <td className="p-6 text-sm text-muted-text">{invoice.date}</td>
                <td className="p-6">
                  <span className={cn(
                    "px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider",
                    invoice.status === 'Paid' && "bg-green-500/10 text-green-500",
                    invoice.status === 'Pending' && "bg-yellow-500/10 text-yellow-500",
                    invoice.status === 'Overdue' && "bg-red-500/10 text-red-500"
                  )}>
                    {invoice.status}
                  </span>
                </td>
                <td className="p-6 text-right">
                  <div className="flex justify-end gap-3 opacity-0 group-hover:opacity-100 transition-opacity">
                    <button className="text-accent hover:text-accent/80 transition-colors">
                      <Eye className="w-4 h-4" />
                    </button>
                    <button className="text-accent hover:text-accent/80 transition-colors">
                      <Download className="w-4 h-4" />
                    </button>
                    <button className="text-muted-text hover:text-white transition-colors">
                      <MoreHorizontal className="w-4 h-4" />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};
