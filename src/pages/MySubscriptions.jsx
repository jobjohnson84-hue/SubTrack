import React, { useState, useMemo } from 'react';
import { useSubscriptions } from '../context/SubscriptionContext';
import SubscriptionCard from '../components/subscriptions/SubscriptionCard';
import EmptyState from '../components/common/EmptyState';
import { CATEGORIES } from '../utils/demoData';
import { getMonthlyEquivalent } from '../utils/calculations';
import { getNextEffectiveRenewal } from '../utils/dateUtils';
import { Plus, Search, Layers } from 'lucide-react';

export default function MySubscriptions() {
  const { subscriptions, openAddModal, openEditModal, openDeleteModal } = useSubscriptions();

  // Search, filter, and sort state
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [selectedStatus, setSelectedStatus] = useState('All');
  const [renewalWindow, setRenewalWindow] = useState('All');
  const [sortBy, setSortBy] = useState('date-asc'); // date-asc, price-desc, price-asc, name-asc

  const clearFilters = () => {
    setSearchQuery('');
    setSelectedCategory('All');
    setSelectedStatus('All');
    setRenewalWindow('All');
    setSortBy('date-asc');
  };

  // Filtered and sorted subscriptions
  const filteredSubscriptions = useMemo(() => {
    return subscriptions
      .filter((sub) => {
        const matchesSearch = (sub.name || '').toLowerCase().includes(searchQuery.toLowerCase());
        const matchesCategory = selectedCategory === 'All' || sub.category === selectedCategory;
        const matchesStatus = selectedStatus === 'All' || sub.status === selectedStatus;
        const renewalInfo = getNextEffectiveRenewal(sub.nextRenewalDate, sub.billingCycle);
        const matchesRenewalWindow = renewalWindow === 'All'
          || (sub.status === 'Active' && renewalInfo && renewalInfo.daysUntil >= 0 && renewalInfo.daysUntil <= Number(renewalWindow));
        return matchesSearch && matchesCategory && matchesStatus && matchesRenewalWindow;
      })
      .sort((a, b) => {
        if (sortBy === 'name-asc') {
          return a.name.localeCompare(b.name);
        }
        if (sortBy === 'price-desc') {
          return getMonthlyEquivalent(b) - getMonthlyEquivalent(a);
        }
        if (sortBy === 'price-asc') {
          return getMonthlyEquivalent(a) - getMonthlyEquivalent(b);
        }
        if (sortBy === 'date-asc') {
          const aRenewal = getNextEffectiveRenewal(a.nextRenewalDate, a.billingCycle);
          const bRenewal = getNextEffectiveRenewal(b.nextRenewalDate, b.billingCycle);
          return (aRenewal?.daysUntil ?? Number.POSITIVE_INFINITY) - (bRenewal?.daysUntil ?? Number.POSITIVE_INFINITY);
        }
        return 0;
      });
  }, [subscriptions, searchQuery, selectedCategory, selectedStatus, renewalWindow, sortBy]);

  const hasAnySubscriptions = subscriptions.length > 0;

  return (
    <div className="space-y-7 animate-in fade-in duration-300">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 pb-1">
        <div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
            My Subscriptions
          </h1>
          <p className="text-sm text-slate-500 mt-1.5">
            Manage your recurring services, update pricing details, and review renewal schedules.
          </p>
        </div>

        <button
          onClick={openAddModal}
          className="inline-flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl text-sm font-semibold text-white bg-indigo-600 hover:bg-indigo-700 active:bg-indigo-800 shadow-sm shadow-indigo-200 transition-all hover:scale-[1.02] shrink-0"
        >
          <Plus className="w-4 h-4 stroke-[2.5]" />
          Add Subscription
        </button>
      </div>

      {/* Search & Filter Controls */}
      {hasAnySubscriptions && (
        <div className="bg-white p-3.5 sm:p-4 rounded-2xl border border-slate-200/90 shadow-sm grid grid-cols-1 xl:grid-cols-[minmax(0,1fr)_auto] gap-3 sm:gap-4">
          {/* Search Box */}
          <div className="relative flex-1">
            <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
            <input
              type="text"
              placeholder="Search by subscription name..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-9 pr-3.5 py-2 text-sm rounded-xl border border-slate-200 bg-slate-50/50 focus:bg-white focus:outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100 transition-colors"
            />
          </div>

          <div className="grid grid-cols-1 min-[480px]:grid-cols-2 md:grid-cols-4 gap-2 sm:gap-3">
            {/* Category Filter */}
            <select
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
              className="min-w-0 w-full px-3 py-2.5 text-xs font-semibold rounded-xl border border-slate-200 bg-white text-slate-700 focus:outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100"
            >
              <option value="All">All Categories</option>
              {CATEGORIES.map((cat) => (
                <option key={cat} value={cat}>
                  {cat}
                </option>
              ))}
            </select>

            {/* Status Filter */}
            <select
              value={selectedStatus}
              onChange={(e) => setSelectedStatus(e.target.value)}
              className="min-w-0 w-full px-3 py-2.5 text-xs font-semibold rounded-xl border border-slate-200 bg-white text-slate-700 focus:outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100"
            >
              <option value="All">All Statuses</option>
              <option value="Active">Active only</option>
              <option value="Paused">Paused only</option>
            </select>

            <select
              value={renewalWindow}
              onChange={(e) => setRenewalWindow(e.target.value)}
              aria-label="Filter by renewal window"
              className="min-w-0 w-full px-3 py-2.5 text-xs font-semibold rounded-xl border border-slate-200 bg-white text-slate-700 focus:outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100"
            >
              <option value="All">All Renewals</option>
              <option value="7">Renewing Within 7 Days</option>
              <option value="30">Renewing Within 30 Days</option>
            </select>

            {/* Sort Filter */}
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              className="min-w-0 w-full px-3 py-2.5 text-xs font-semibold rounded-xl border border-slate-200 bg-white text-slate-700 focus:outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100"
            >
              <option value="date-asc">Renewal: Soonest</option>
              <option value="name-asc">Name: A to Z</option>
              <option value="price-desc">Price: High to Low</option>
              <option value="price-asc">Price: Low to High</option>
            </select>
          </div>
        </div>
      )}

      {/* Subscriptions Grid */}
      {!hasAnySubscriptions ? (
        <EmptyState
          title="No subscriptions tracked yet"
          description="Click the button below to add your first subscription and begin tracking your recurring expenses."
          actionLabel="Add First Subscription"
          onAction={openAddModal}
          icon={Layers}
        />
      ) : filteredSubscriptions.length === 0 ? (
        <div className="bg-white rounded-2xl border border-slate-200/90 p-10 text-center">
          <p className="text-sm font-semibold text-slate-800">No subscriptions matched your filters</p>
          <p className="text-xs text-slate-500 mt-1">No saved subscriptions were changed. Try broadening your search or renewal filters.</p>
          <button
            onClick={clearFilters}
            className="mt-4 px-3 py-1.5 text-xs font-semibold text-indigo-600 bg-indigo-50 hover:bg-indigo-100 rounded-lg transition-colors"
          >
            Clear Filters
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {filteredSubscriptions.map((sub) => (
            <SubscriptionCard
              key={sub.id}
              subscription={sub}
              onEdit={openEditModal}
              onDelete={openDeleteModal}
            />
          ))}
        </div>
      )}
    </div>
  );
}
