import React, { useMemo } from 'react';
import { useSubscriptions } from '../context/SubscriptionContext';
import {
  calculateDashboardStats,
  calculateCategoryBreakdown,
  getMostExpensiveSubscriptions,
} from '../utils/calculations';
import { formatINR } from '../utils/formatters';
import CategorySpendingChart from '../components/insights/CategorySpendingChart';
import CategoryBreakdownTable from '../components/insights/CategoryBreakdownTable';
import ExpensiveSubscriptionsList from '../components/insights/ExpensiveSubscriptionsList';
import EmptyState from '../components/common/EmptyState';
import { TrendingUp, CalendarCheck, PieChart, Info } from 'lucide-react';

export default function SpendingInsights() {
  const { subscriptions, openAddModal } = useSubscriptions();

  // Dynamic calculations (active only)
  const stats = useMemo(() => calculateDashboardStats(subscriptions), [subscriptions]);
  const { categories } = useMemo(() => calculateCategoryBreakdown(subscriptions), [subscriptions]);
  const expensiveSubs = useMemo(() => getMostExpensiveSubscriptions(subscriptions, 5), [subscriptions]);

  const hasActiveSubscriptions = stats.totalActiveSubscriptions > 0;

  return (
    <div className="space-y-8 animate-in fade-in duration-300">
      {/* Header */}
      <div>
        <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
          Spending Insights
        </h1>
        <p className="text-sm text-slate-500 mt-1.5">
          Detailed analytics and category breakdowns calculated exclusively from your active subscriptions.
        </p>
      </div>

      {/* Metrics Row: Monthly & Annual Spending */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
        <div className="bg-white rounded-2xl p-5 sm:p-6 border border-slate-200/90 shadow-sm flex items-start justify-between gap-4 transition-all hover:shadow-md hover:border-indigo-200">
          <div className="min-w-0">
            <div className="flex items-center gap-2">
              <span className="w-2.5 h-2.5 rounded-full bg-indigo-500"></span>
              <p className="text-xs font-semibold uppercase tracking-wider text-slate-500">
                Estimated Monthly Spending
              </p>
            </div>
            <h2 className="text-3xl sm:text-4xl font-extrabold text-slate-900 mt-3 tracking-tight">
              {formatINR(stats.totalMonthlySpending)}
            </h2>
            <p className="text-xs text-slate-500 mt-2">
              Sum of monthly subscription fees + (yearly fees ÷ 12) for {stats.totalActiveSubscriptions} active service{stats.totalActiveSubscriptions === 1 ? '' : 's'}.
            </p>
          </div>
          <div className="w-12 h-12 rounded-2xl bg-indigo-50 text-indigo-600 flex items-center justify-center shrink-0">
            <TrendingUp className="w-6 h-6" />
          </div>
        </div>

        <div className="bg-white rounded-2xl p-5 sm:p-6 border border-slate-200/90 shadow-sm flex items-start justify-between gap-4 transition-all hover:shadow-md hover:border-emerald-200">
          <div className="min-w-0">
            <div className="flex items-center gap-2">
              <span className="w-2.5 h-2.5 rounded-full bg-emerald-500"></span>
              <p className="text-xs font-semibold uppercase tracking-wider text-slate-500">
                Estimated Annual Spending
              </p>
            </div>
            <h2 className="text-3xl sm:text-4xl font-extrabold text-slate-900 mt-3 tracking-tight">
              {formatINR(stats.totalYearlySpending)}
            </h2>
            <p className="text-xs text-slate-500 mt-2">
              Estimated Annual Spending = Sum of Monthly Equivalents × 12.
            </p>
          </div>
          <div className="w-12 h-12 rounded-2xl bg-emerald-50 text-emerald-600 flex items-center justify-center shrink-0">
            <CalendarCheck className="w-6 h-6" />
          </div>
        </div>
      </div>

      {/* Informational Callout regarding Paused Subscriptions */}
      {stats.pausedSubscriptionsCount > 0 && (
        <div className="p-4 rounded-xl bg-amber-50/70 border border-amber-200/70 flex items-start gap-3 text-xs text-amber-900">
          <Info className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
          <p>
            <span className="font-semibold">{stats.pausedSubscriptionsCount} subscription{stats.pausedSubscriptionsCount === 1 ? '' : 's'}</span> {stats.pausedSubscriptionsCount === 1 ? 'is' : 'are'} currently paused and <span className="font-semibold">excluded</span> from all spending sums and breakdowns per billing rules.
          </p>
        </div>
      )}

      {!hasActiveSubscriptions ? (
        <EmptyState
          title="No active subscriptions to analyze"
          description="Spending insights require at least one active subscription to compute monthly and annual distributions."
          actionLabel="Add Active Subscription"
          onAction={openAddModal}
          icon={PieChart}
        />
      ) : (
        <>
          {/* Chart & Top Expensive Grid */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
            {/* Category Chart Card (7 cols) */}
            <div className="lg:col-span-7 bg-white rounded-2xl border border-slate-200/90 p-5 sm:p-6 shadow-sm flex flex-col justify-between">
              <div>
                <h3 className="text-base font-bold text-slate-900 flex items-center gap-2">
                  <PieChart className="w-4 h-4 text-indigo-600" />
                  Spending by Category
                </h3>
                <p className="text-xs text-slate-500 mt-1">
                  Visual breakdown of monthly equivalent spend across categories.
                </p>
              </div>

              <div className="my-2">
                <CategorySpendingChart categories={categories} />
              </div>

              <p className="text-[11px] text-slate-400 text-center">
                Percentages calculated relative to total monthly active spend ({formatINR(stats.totalMonthlySpending)})
              </p>
            </div>

            {/* Most Expensive Subscriptions Card (5 cols) */}
            <div className="lg:col-span-5 bg-white rounded-2xl border border-slate-200/90 p-5 sm:p-6 shadow-sm flex flex-col justify-between">
              <div>
                <h3 className="text-base font-bold text-slate-900 flex items-center gap-2">
                  <TrendingUp className="w-4 h-4 text-indigo-600" />
                  Most Expensive Subscriptions
                </h3>
                <p className="text-xs text-slate-500 mt-1">
                  Ranked by highest monthly equivalent cost.
                </p>
              </div>

              <div className="my-4">
                <ExpensiveSubscriptionsList subscriptions={expensiveSubs} />
              </div>

              <p className="text-[11px] text-slate-400">
                * Yearly subscriptions are converted to their monthly equivalent (Price ÷ 12).
              </p>
            </div>
          </div>

          {/* Category Breakdown Table */}
          <div className="bg-white rounded-2xl border border-slate-200/90 p-6 shadow-sm">
            <div className="mb-5">
              <h3 className="text-base font-bold text-slate-900">
                Subscription Category Breakdown
              </h3>
              <p className="text-xs text-slate-500 mt-0.5">
                Complete overview of subscription counts and projected spending grouped by category.
              </p>
            </div>

            <CategoryBreakdownTable categories={categories} />
          </div>
        </>
      )}
    </div>
  );
}
