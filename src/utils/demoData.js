import { formatDateISO } from './dateUtils.js';

export const CATEGORIES = [
  'Entertainment',
  'Productivity',
  'Education',
  'Cloud Storage',
  'Utilities',
  'Other',
];

export const CATEGORY_COLORS = {
  'Entertainment': '#ec4899', // Pink
  'Productivity': '#6366f1',  // Indigo
  'Education': '#f59e0b',     // Amber
  'Cloud Storage': '#0284c7', // Sky
  'Utilities': '#10b981',     // Emerald
  'Other': '#64748b',         // Slate
};

export const CATEGORY_STYLES = {
  'Entertainment': {
    bg: 'bg-pink-50',
    text: 'text-pink-700',
    border: 'border-pink-200',
    dot: 'bg-pink-500',
  },
  'Productivity': {
    bg: 'bg-indigo-50',
    text: 'text-indigo-700',
    border: 'border-indigo-200',
    dot: 'bg-indigo-500',
  },
  'Education': {
    bg: 'bg-amber-50',
    text: 'text-amber-700',
    border: 'border-amber-200',
    dot: 'bg-amber-500',
  },
  'Cloud Storage': {
    bg: 'bg-sky-50',
    text: 'text-sky-700',
    border: 'border-sky-200',
    dot: 'bg-sky-500',
  },
  'Utilities': {
    bg: 'bg-emerald-50',
    text: 'text-emerald-700',
    border: 'border-emerald-200',
    dot: 'bg-emerald-500',
  },
  'Other': {
    bg: 'bg-slate-100',
    text: 'text-slate-700',
    border: 'border-slate-200',
    dot: 'bg-slate-500',
  },
};

/**
 * Generates the initial 4 realistic demo subscriptions with renewal dates
 * computed relative to the current date.
 * At least 2 are upcoming within the next 30 days.
 *
 * Requirements:
 * - Netflix - Entertainment - ₹649/month
 * - Spotify - Entertainment - ₹119/month
 * - Google One - Cloud Storage - ₹130/month
 * - Adobe Creative Cloud - Productivity - ₹1,999/month
 */
export function getInitialDemoData() {
  const today = new Date();

  // Helper to add days to current date
  const addDays = (days) => {
    const d = new Date(today);
    d.setDate(today.getDate() + days);
    return formatDateISO(d);
  };

  return [
    {
      id: 'sub_demo_spotify',
      name: 'Spotify',
      category: 'Entertainment',
      price: 119,
      billingCycle: 'Monthly',
      nextRenewalDate: addDays(4), // Upcoming in 4 days
      status: 'Active',
      createdAt: new Date().toISOString(),
    },
    {
      id: 'sub_demo_netflix',
      name: 'Netflix',
      category: 'Entertainment',
      price: 649,
      billingCycle: 'Monthly',
      nextRenewalDate: addDays(16), // Upcoming in 16 days
      status: 'Active',
      createdAt: new Date().toISOString(),
    },
    {
      id: 'sub_demo_adobe',
      name: 'Adobe Creative Cloud',
      category: 'Productivity',
      price: 1999,
      billingCycle: 'Monthly',
      nextRenewalDate: addDays(24), // Upcoming in 24 days
      status: 'Active',
      createdAt: new Date().toISOString(),
    },
    {
      id: 'sub_demo_google_one',
      name: 'Google One',
      category: 'Cloud Storage',
      price: 130,
      billingCycle: 'Monthly',
      nextRenewalDate: addDays(42), // Upcoming in 42 days (>30 days)
      status: 'Active',
      createdAt: new Date().toISOString(),
    },
  ];
}
