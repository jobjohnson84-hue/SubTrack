import React from 'react';
import { ResponsiveContainer, PieChart, Pie, Cell, Tooltip } from 'recharts';
import { formatINR } from '../../utils/formatters';
import { CATEGORY_COLORS } from '../../utils/demoData';

export default function CategorySpendingChart({ categories = [] }) {
  if (!categories || categories.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center h-64 text-slate-400 text-sm">
        No active subscriptions to chart.
      </div>
    );
  }

  const chartData = categories.map((cat) => ({
    name: cat.name,
    value: cat.monthlySpending,
    color: CATEGORY_COLORS[cat.name] || '#6366f1',
    percentage: cat.percentage,
    count: cat.count,
  }));
  const totalMonthlySpending = chartData.reduce((total, category) => total + category.value, 0);

  const CustomTooltip = ({ active, payload }) => {
    if (active && payload && payload.length) {
      const data = payload[0].payload;
      return (
        <div className="bg-white p-3 rounded-xl shadow-lg border border-slate-100 text-xs">
          <p className="font-bold text-slate-800 flex items-center gap-1.5">
            <span
              className="w-2.5 h-2.5 rounded-full inline-block"
              style={{ backgroundColor: data.color }}
            ></span>
            {data.name}
          </p>
          <p className="text-slate-600 mt-1 font-semibold text-sm">
            {formatINR(data.value)} <span className="text-[11px] font-normal text-slate-400">/mo</span>
          </p>
          <p className="text-slate-400 mt-0.5">
            {data.percentage}% of active spending ({data.count} {data.count === 1 ? 'service' : 'services'})
          </p>
        </div>
      );
    }
    return null;
  };

  return (
    <div className="w-full">
      <div className="relative h-64 sm:h-72">
      <ResponsiveContainer width="100%" height="100%">
        <PieChart>
          <Pie
            data={chartData}
            cx="50%"
            cy="50%"
            innerRadius={70}
            outerRadius={102}
            paddingAngle={4}
            dataKey="value"
            animationDuration={800}
          >
            {chartData.map((entry, index) => (
              <Cell key={`cell-${index}`} fill={entry.color} stroke="#ffffff" strokeWidth={3} />
            ))}
          </Pie>
          <Tooltip content={<CustomTooltip />} />
        </PieChart>
      </ResponsiveContainer>
        <div className="pointer-events-none absolute inset-0 flex flex-col items-center justify-center text-center">
          <span className="text-[10px] font-bold uppercase tracking-[0.16em] text-slate-400">Monthly total</span>
          <strong className="mt-1 text-xl font-extrabold tracking-tight text-slate-900 tabular-nums">{formatINR(totalMonthlySpending)}</strong>
          <span className="mt-0.5 text-[11px] text-slate-500">active spend</span>
        </div>
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-5 gap-y-2 px-1 pt-2">
        {chartData.map((category) => (
          <div key={category.name} className="flex items-center justify-between gap-2 text-xs">
            <span className="flex items-center gap-2 min-w-0 font-medium text-slate-600"><span className="w-2.5 h-2.5 rounded-full shrink-0" style={{ backgroundColor: category.color }} /> <span className="truncate">{category.name}</span></span>
            <span className="shrink-0 font-semibold text-slate-800">{category.percentage}%</span>
          </div>
        ))}
      </div>
    </div>
  );
}
