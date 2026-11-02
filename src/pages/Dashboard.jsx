import React, { useMemo } from 'react';
import { useSubscriptions } from '../context/SubscriptionContext';
import { calculateDashboardStats } from '../utils/calculations';
import { formatINR } from '../utils/formatters';
import StatCard from '../components/common/StatCard';
import UpcomingRenewalCard from '../components/subscriptions/UpcomingRenewalCard';
import EmptyState from '../components/common/EmptyState';
import { CreditCard, CalendarCheck, TrendingUp, Calendar, Plus, ArrowRight, Sparkles } from 'lucide-react';
import { Link } from 'react-router-dom';

export default function Dashboard() {
  const { subscriptions, openAddModal } = useSubscriptions();

  // Dynamically calculate dashboard statistics from stored subscriptions
  const stats = useMemo(() => calculateDashboardStats(subscriptions), [subscriptions]);

  const hasAnySubscriptions = subscriptions.length > 0;
  const hasUpcomingRenewals = stats.upcomingRenewalsList.length > 0;

  return (
    <div className="space-y-8 animate-in fade-in duration-300">
      {/* Welcome Section */}
      <div className="bg-gradient-to-r from-indigo-900 via-indigo-800 to-indigo-950 rounded-3xl p-6 sm:p-8 text-white shadow-xl relative overflow-hidden">
        <div className="absolute right-0 top-0 translate-x-12 -translate-y-8 w-64 h-64 bg-indigo-500/10 rounded-full blur-3xl pointer-events-none"></div>
        <div className="relative z-10 max-w-2xl">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/10 text-indigo-200 text-xs font-semibold mb-3 backdrop-blur-sm border border-white/10">
            <Sparkles className="w-3.5 h-3.5 text-indigo-300" />
            <span>Welcome to SubTrack</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight">
            Your subscriptions, simplified.
          </h1>
          <p className="mt-2 text-sm sm:text-base text-indigo-100/90 leading-relaxed">
            Gain full control over recurring costs, stay ahead of renewals, and optimize your monthly budget effortlessly.
          </p>

          <div className="mt-6 flex flex-wrap items-center gap-3">
            <button
              onClick={openAddModal}
              className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-semibold text-indigo-900 bg-white hover:bg-indigo-50 active:bg-slate-100 shadow-md transition-all hover:scale-[1.02]"
            >
              <Plus className="w-4 h-4 stroke-[2.5]" />
              Add Subscription
            </button>
            <Link
              to="/subscriptions"
              className="inline-flex items-center gap-1.5 px-4 py-2.5 rounded-xl text-sm font-semibold text-white/90 hover:text-white bg-white/10 hover:bg-white/15 transition-colors border border-white/10"
            >
              View All Subscriptions
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        </div>
      </div>

      {/* 4 Summary Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
        <StatCard
          title="Total Active Subscriptions"
          value={stats.totalActiveSubscriptions}
          subtitle={
            stats.pausedSubscriptionsCount > 0
              ? `${stats.pausedSubscriptionsCount} paused subscription${stats.pausedSubscriptionsCount > 1 ? 's' : ''}`
              : 'All subscriptions are active'
          }
          icon={CreditCard}
          colorScheme="indigo"
        />

        <StatCard
          title="Estimated Monthly Spending"
          value={formatINR(stats.totalMonthlySpending)}
          subtitle="Calculated from active plans"
          icon={TrendingUp}
          colorScheme="purple"
        />

        <StatCard
          title="Estimated Yearly Spending"
          value={formatINR(stats.totalYearlySpending)}
          subtitle="Monthly equivalents × 12"
          icon={CalendarCheck}
          colorScheme="emerald"
        />

        <StatCard
          title="Upcoming Renewals (30 Days)"
          value={stats.upcomingRenewalsCount}
          subtitle={
            stats.upcomingRenewalsCount > 0
              ? 'Due within the next month'
              : 'No renewals due in 30 days'
          }
          icon={Calendar}
          colorScheme="amber"
        />
      </div>

      {/* Upcoming Renewals Section */}
      <div className="bg-white rounded-2xl border border-slate-200/90 p-6 shadow-sm">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-6">
          <div>
            <h2 className="text-lg font-bold text-slate-900 flex items-center gap-2">
              <Calendar className="w-5 h-5 text-indigo-600" />
              Upcoming Renewals (Next 30 Days)
            </h2>
            <p className="text-xs text-slate-500 mt-0.5">
              Subscriptions scheduled for renewal or billing cycle refresh in the next 30 days.
            </p>
          </div>

          {hasUpcomingRenewals && (
            <span className="self-start sm:self-auto px-2.5 py-1 bg-amber-50 text-amber-700 text-xs font-semibold rounded-full border border-amber-200/60">
              {stats.upcomingRenewalsCount} due soon
            </span>
          )}
        </div>

        {!hasAnySubscriptions ? (
          <EmptyState
            title="No subscriptions added yet"
            description="Start by adding your first subscription to view your upcoming renewals and spending breakdown."
            actionLabel="Add Subscription"
            onAction={openAddModal}
          />
        ) : !hasUpcomingRenewals ? (
          <div className="text-center py-10 px-4 bg-slate-50 rounded-xl border border-slate-100">
            <div className="w-10 h-10 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center mx-auto mb-2">
              <CalendarCheck className="w-5 h-5" />
            </div>
            <p className="text-sm font-semibold text-slate-700">All clear for the next 30 days!</p>
            <p className="text-xs text-slate-500 mt-1 max-w-sm mx-auto">
              None of your active subscriptions are due for renewal in the next 30 days.
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3.5">
            {stats.upcomingRenewalsList.map((sub) => (
              <UpcomingRenewalCard key={sub.id} subscription={sub} />
            ))}
          </div>
        )}
      </div>

      {/* Quick Links & Tips */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="p-5 rounded-2xl bg-indigo-50/50 border border-indigo-100 flex items-start gap-4">
          <div className="w-9 h-9 rounded-xl bg-indigo-100 text-indigo-700 flex items-center justify-center shrink-0">
            <Sparkles className="w-4 h-4" />
          </div>
          <div>
            <h3 className="text-sm font-semibold text-indigo-950">Manage Recurring Plans</h3>
            <p className="text-xs text-indigo-900/80 mt-1 leading-relaxed">
              Easily edit renewal dates, toggle pause status, or adjust prices anytime on the Subscriptions page.
            </p>
            <Link
              to="/subscriptions"
              className="inline-flex items-center gap-1 text-xs font-semibold text-indigo-600 hover:text-indigo-800 mt-2"
            >
              Go to My Subscriptions <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>
        </div>

        <div className="p-5 rounded-2xl bg-slate-100/70 border border-slate-200/80 flex items-start gap-4">
          <div className="w-9 h-9 rounded-xl bg-slate-200 text-slate-700 flex items-center justify-center shrink-0">
            <TrendingUp className="w-4 h-4" />
          </div>
          <div>
            <h3 className="text-sm font-semibold text-slate-900">Spending Insights</h3>
            <p className="text-xs text-slate-600 mt-1 leading-relaxed">
              Review your monthly and annual budget distributions, category share, and top expense drivers.
            </p>
            <Link
              to="/insights"
              className="inline-flex items-center gap-1 text-xs font-semibold text-indigo-600 hover:text-indigo-800 mt-2"
            >
              View Spending Insights <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
