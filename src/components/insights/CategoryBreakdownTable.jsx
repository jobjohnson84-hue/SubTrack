import React from 'react';
import { formatINR } from '../../utils/formatters';
import { CATEGORY_COLORS, CATEGORY_STYLES } from '../../utils/demoData';

export default function CategoryBreakdownTable({ categories = [] }) {
  if (!categories || categories.length === 0) {
    return (
      <div className="text-center py-8 text-sm text-slate-400">
        No active subscription data to break down.
      </div>
    );
  }

  return (
    <div className="overflow-hidden">
      <table className="w-full text-left border-collapse">
        <thead>
          <tr className="border-b border-slate-100 text-[11px] font-semibold uppercase tracking-wider text-slate-400">
            <th className="pb-3 pl-1">Category</th>
            <th className="pb-3 text-center">Count</th>
            <th className="pb-3 text-right">Monthly</th>
            <th className="hidden sm:table-cell pb-3 text-right">Annual</th>
            <th className="pb-3 pr-1 text-right">Share</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-slate-100 text-sm">
          {categories.map((cat) => {
            const style = CATEGORY_STYLES[cat.name] || CATEGORY_STYLES['Other'];
            return (
              <tr key={cat.name} className="hover:bg-slate-50/60 transition-colors">
                <td className="py-3.5 pl-1">
                  <div className="flex items-center gap-2">
                    <span
                      className="w-2.5 h-2.5 rounded-full shrink-0"
                      style={{ backgroundColor: CATEGORY_COLORS[cat.name] || '#6366f1' }}
                    ></span>
                    <span className="font-semibold text-slate-800">{cat.name}</span>
                  </div>
                </td>
                <td className="py-3.5 text-center text-slate-600 font-medium">
                  {cat.count}
                </td>
                <td className="py-3.5 text-right font-semibold text-slate-900">
                  {formatINR(cat.monthlySpending)}
                </td>
                <td className="hidden sm:table-cell py-3.5 text-right text-slate-600">
                  {formatINR(cat.yearlySpending)}
                </td>
                <td className="py-3.5 pr-1 text-right">
                  <div className="flex items-center justify-end gap-2">
                    <span className="font-bold text-slate-700 w-10 text-right">
                      {cat.percentage}%
                    </span>
                    <div className="w-16 h-1.5 bg-slate-100 rounded-full overflow-hidden hidden sm:block">
                      <div
                        className="h-full rounded-full transition-all duration-500"
                        style={{
                          width: `${Math.min(cat.percentage, 100)}%`,
                          backgroundColor: CATEGORY_COLORS[cat.name] || '#6366f1',
                        }}
                      ></div>
                    </div>
                  </div>
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}
