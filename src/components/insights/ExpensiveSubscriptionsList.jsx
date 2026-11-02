import React from 'react';
import { formatINR } from '../../utils/formatters';
import { CATEGORY_STYLES } from '../../utils/demoData';

export default function ExpensiveSubscriptionsList({ subscriptions = [] }) {
  if (!subscriptions || subscriptions.length === 0) {
    return (
      <div className="text-center py-8 text-sm text-slate-400">
        No active subscriptions to rank.
      </div>
    );
  }

  return (
    <div className="space-y-3">
      {subscriptions.map((sub, index) => {
        const categoryStyle = CATEGORY_STYLES[sub.category] || CATEGORY_STYLES['Other'];
        return (
          <div
            key={sub.id}
            className="flex items-center justify-between p-3.5 bg-slate-50/70 hover:bg-indigo-50/60 rounded-xl border border-slate-100 hover:border-indigo-100 transition-colors"
          >
            <div className="flex items-center gap-3 min-w-0">
              <span className={`w-6 h-6 rounded-full text-xs font-bold flex items-center justify-center shrink-0 ${index === 0 ? 'bg-indigo-100 text-indigo-700' : 'bg-slate-200/80 text-slate-700'}`}>
                #{index + 1}
              </span>
              <div className="min-w-0">
                <div className="flex items-center gap-2">
                  <h4 className="text-sm font-semibold text-slate-800 truncate">{sub.name}</h4>
                  <span
                    className={`inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-medium ${categoryStyle.bg} ${categoryStyle.text}`}
                  >
                    {sub.category}
                  </span>
                </div>
                <p className="text-xs text-slate-500 mt-0.5">
                  Billed {sub.billingCycle.toLowerCase()} as {formatINR(sub.price)}
                </p>
              </div>
            </div>

            <div className="text-right shrink-0 ml-3">
              <p className="text-sm font-extrabold text-slate-900 tabular-nums">
                {formatINR(sub.monthlyEquivalent)}
                <span className="text-xs font-normal text-slate-500"> /mo</span>
              </p>
              <p className="text-[11px] text-slate-400">
                {formatINR(sub.yearlyEquivalent)} /yr
              </p>
            </div>
          </div>
        );
      })}
    </div>
  );
}
