import React from 'react';

export default function StatCard({ title, value, subtitle, icon: Icon, colorScheme = 'indigo' }) {
  const colorStyles = {
    indigo: {
      iconBg: 'bg-indigo-50 text-indigo-600 ring-1 ring-inset ring-indigo-100',
      border: 'border-slate-200/80 hover:border-indigo-200',
    },
    purple: {
      iconBg: 'bg-purple-50 text-purple-600 ring-1 ring-inset ring-purple-100',
      border: 'border-slate-200/80 hover:border-purple-200',
    },
    emerald: {
      iconBg: 'bg-emerald-50 text-emerald-600 ring-1 ring-inset ring-emerald-100',
      border: 'border-slate-200/80 hover:border-emerald-200',
    },
    amber: {
      iconBg: 'bg-amber-50 text-amber-600 ring-1 ring-inset ring-amber-100',
      border: 'border-slate-200/80 hover:border-amber-200',
    },
  };

  const scheme = colorStyles[colorScheme] || colorStyles.indigo;

  return (
    <div
      className={`bg-white rounded-2xl p-5 sm:p-6 border shadow-sm transition-all duration-200 hover:-translate-y-0.5 hover:shadow-md ${scheme.border}`}
    >
      <div className="flex items-center justify-between">
        <p className="text-xs font-semibold uppercase tracking-wider text-slate-500">{title}</p>
        {Icon && (
          <div className={`w-11 h-11 rounded-xl flex items-center justify-center shrink-0 ${scheme.iconBg}`}>
            <Icon className="w-5 h-5" />
          </div>
        )}
      </div>
      <div className="mt-4">
        <h3 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight tabular-nums">{value}</h3>
        {subtitle && <p className="mt-1.5 text-xs leading-5 text-slate-500">{subtitle}</p>}
      </div>
    </div>
  );
}
