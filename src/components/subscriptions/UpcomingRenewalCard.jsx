import React from 'react';
import { Calendar } from 'lucide-react';
import { formatINR } from '../../utils/formatters';
import { formatDisplayDate, getRelativeRenewalLabel } from '../../utils/dateUtils';
import { CATEGORY_STYLES } from '../../utils/demoData';

export default function UpcomingRenewalCard({ subscription }) {
  const { name, category, price, billingCycle, effectiveRenewalDate, daysUntil, isAdvanced } = subscription;
  const categoryStyle = CATEGORY_STYLES[category] || CATEGORY_STYLES['Other'];

  const isUrgent = daysUntil <= 7;

  return (
    <div className={`relative flex items-center justify-between overflow-hidden p-4 rounded-2xl border transition-all shadow-sm hover:-translate-y-0.5 hover:shadow-md ${isUrgent ? 'bg-amber-50/40 border-amber-200/80' : 'bg-white border-slate-200/80 hover:border-indigo-200'}`}>
      <span className={`absolute left-0 inset-y-0 w-1 ${isUrgent ? 'bg-amber-500' : 'bg-indigo-400'}`} aria-hidden="true" />
      <div className="flex items-center gap-3.5 min-w-0">
        <div
          className={`w-10 h-10 rounded-xl flex items-center justify-center font-bold text-sm shrink-0 ${categoryStyle.bg} ${categoryStyle.text}`}
        >
          {name.charAt(0).toUpperCase()}
        </div>
        <div className="min-w-0">
          <div className="flex items-center gap-2">
            <h4 className="text-sm font-semibold text-slate-900 truncate">{name}</h4>
            <span
              className={`hidden sm:inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-medium ${categoryStyle.bg} ${categoryStyle.text}`}
            >
              {category}
            </span>
          </div>
          <p className="text-xs text-slate-500 flex items-center gap-1.5 mt-0.5">
            <Calendar className="w-3 h-3 text-slate-400" />
            <span>{formatDisplayDate(effectiveRenewalDate)}</span>
            {isAdvanced && <span className="text-slate-400 text-[10px]">(auto-advanced)</span>}
          </p>
        </div>
      </div>

      <div className="text-right shrink-0 ml-3">
        <p className="text-sm font-extrabold text-slate-900 tabular-nums">
          {formatINR(price)}
          <span className="text-[11px] font-normal text-slate-500 lowercase"> /{billingCycle === 'Monthly' ? 'mo' : 'yr'}</span>
        </p>
        <span
          className={`inline-block mt-0.5 text-[11px] font-semibold px-2 py-0.5 rounded-full ${
            isUrgent
              ? 'bg-amber-100 text-amber-800 ring-1 ring-inset ring-amber-200'
              : 'bg-indigo-50 text-indigo-700 ring-1 ring-inset ring-indigo-100'
          }`}
        >
          {getRelativeRenewalLabel(daysUntil)}
        </span>
      </div>
    </div>
  );
}
