import React from 'react';
import { Calendar, Edit3, Trash2, Clock, CheckCircle, PauseCircle, WalletCards } from 'lucide-react';
import { formatINR } from '../../utils/formatters';
import { formatDisplayDate, getNextEffectiveRenewal, getRelativeRenewalLabel } from '../../utils/dateUtils';
import { CATEGORY_STYLES } from '../../utils/demoData';

export default function SubscriptionCard({ subscription, onEdit, onDelete }) {
  const { name, category, price, billingCycle, nextRenewalDate, status } = subscription;

  const categoryStyle = CATEGORY_STYLES[category] || CATEGORY_STYLES['Other'];
  const isActive = status === 'Active';

  // Calculate renewal information
  const renewalInfo = getNextEffectiveRenewal(nextRenewalDate, billingCycle);

  return (
    <div className="bg-white rounded-2xl border border-slate-200/90 p-5 sm:p-6 shadow-sm hover:-translate-y-0.5 hover:shadow-md hover:border-indigo-200 transition-all duration-200 flex flex-col justify-between min-h-[286px] group">
      <div>
        {/* Top bar: Category badge & Status indicator */}
        <div className="flex items-center justify-between gap-2 mb-4">
          <span
            className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold border ${categoryStyle.bg} ${categoryStyle.text} ${categoryStyle.border}`}
          >
            <span className={`w-1.5 h-1.5 rounded-full ${categoryStyle.dot}`}></span>
            {category}
          </span>

          <span
            className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-medium border ${
              isActive
                ? 'bg-emerald-50 text-emerald-700 border-emerald-200'
                : 'bg-amber-50 text-amber-700 border-amber-200'
            }`}
          >
            {isActive ? (
              <>
                <CheckCircle className="w-3 h-3" />
                Active
              </>
            ) : (
              <>
                <PauseCircle className="w-3 h-3" />
                Paused
              </>
            )}
          </span>
        </div>

        {/* Service Name & Price */}
        <div className="flex items-start gap-3">
          <div className={`w-10 h-10 rounded-xl shrink-0 flex items-center justify-center font-bold ${categoryStyle.bg} ${categoryStyle.text}`} aria-hidden="true">
            <WalletCards className="w-5 h-5" />
          </div>
          <div className="min-w-0">
            <h3 className="text-xl font-bold text-slate-900 tracking-tight truncate group-hover:text-indigo-600 transition-colors" title={name}>
              {name}
            </h3>
            <p className="mt-0.5 text-xs font-medium text-slate-500">{billingCycle} plan</p>
          </div>
        </div>
        <div className="mt-4">
          <div className="mt-2 flex items-baseline gap-1.5">
            <span className="text-2xl font-extrabold text-slate-900 tracking-tight tabular-nums">
              {formatINR(price)}
            </span>
            <span className="text-xs font-medium text-slate-500 lowercase">
              / {billingCycle}
            </span>
          </div>
        </div>

        {/* Billing Info & Next Renewal */}
        <div className="mt-5 pt-4 border-t border-slate-100 space-y-2.5 text-xs">
          <div className="flex items-center justify-between text-slate-600">
            <span className="flex items-center gap-1.5 text-slate-500">
              <Calendar className="w-3.5 h-3.5 text-slate-400" />
              Next Renewal
            </span>
            <span className="font-semibold text-slate-800">
              {renewalInfo ? formatDisplayDate(renewalInfo.dateString) : formatDisplayDate(nextRenewalDate)}
            </span>
          </div>

          {renewalInfo && isActive && (
            <div className="flex items-center justify-between text-slate-500">
              <span className="flex items-center gap-1.5">
                <Clock className="w-3.5 h-3.5 text-slate-400" />
                Timing
              </span>
              <span
                className={`font-medium ${
                  renewalInfo.daysUntil <= 7
                    ? 'text-amber-600 font-semibold'
                    : 'text-slate-600'
                }`}
              >
                {getRelativeRenewalLabel(renewalInfo.daysUntil)}
                {renewalInfo.isAdvanced && ' (next cycle)'}
              </span>
            </div>
          )}
        </div>
      </div>

      {/* Card Actions */}
      <div className="mt-6 pt-4 border-t border-slate-100 flex items-center justify-end gap-2">
        <button
          onClick={() => onEdit(subscription)}
          className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-indigo-700 bg-indigo-50 hover:bg-indigo-100 rounded-lg transition-colors"
          aria-label={`Edit ${name}`}
        >
          <Edit3 className="w-3.5 h-3.5" />
          Edit
        </button>
        <button
          onClick={() => onDelete(subscription)}
          className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-slate-600 bg-slate-50 border border-slate-200 hover:bg-rose-50 hover:border-rose-100 hover:text-rose-600 rounded-lg transition-colors"
          aria-label={`Delete ${name}`}
        >
          <Trash2 className="w-3.5 h-3.5" />
          Delete
        </button>
      </div>
    </div>
  );
}
