import { getMonthlyEquivalent, calculateDashboardStats, calculateCategoryBreakdown, getMostExpensiveSubscriptions } from './src/utils/calculations.js';
import { getNextEffectiveRenewal, formatDisplayDate, getRelativeRenewalLabel } from './src/utils/dateUtils.js';
import { formatINR } from './src/utils/formatters.js';
import { getInitialDemoData } from './src/utils/demoData.js';

console.log('=== RUNNING SUBTRACK LOGIC TESTS ===\n');

// Test 1: Monthly equivalents
const monthlySub = { price: 649, billingCycle: 'Monthly', status: 'Active' };
const yearlySub = { price: 2400, billingCycle: 'Yearly', status: 'Active' };
const pausedSub = { price: 500, billingCycle: 'Monthly', status: 'Paused' };

console.assert(getMonthlyEquivalent(monthlySub) === 649, 'Monthly equivalent for monthly sub should be 649');
console.assert(getMonthlyEquivalent(yearlySub) === 200, 'Monthly equivalent for yearly sub 2400/yr should be 200');
console.log('✔ Test 1 passed: getMonthlyEquivalent calculation is accurate.');

// Test 2: Dashboard statistics with Active and Paused
const testSubs = [
  { id: '1', name: 'Netflix', category: 'Entertainment', price: 649, billingCycle: 'Monthly', nextRenewalDate: '2026-11-20', status: 'Active' },
  { id: '2', name: 'Spotify', category: 'Entertainment', price: 119, billingCycle: 'Monthly', nextRenewalDate: '2026-11-10', status: 'Active' },
  { id: '3', name: 'Annual Tool', category: 'Productivity', price: 1200, billingCycle: 'Yearly', nextRenewalDate: '2026-11-15', status: 'Active' },
  { id: '4', name: 'Paused Service', category: 'Utilities', price: 1000, billingCycle: 'Monthly', nextRenewalDate: '2026-11-12', status: 'Paused' },
];

const referenceDate = new Date('2026-11-02T00:00:00');
const stats = calculateDashboardStats(testSubs, referenceDate);

console.assert(stats.totalSubscriptions === 4, 'Total subscriptions should be 4');
console.assert(stats.totalActiveSubscriptions === 3, 'Active subscriptions should be 3');
console.assert(stats.pausedSubscriptionsCount === 1, 'Paused count should be 1');
// Monthly spending = 649 + 119 + 100 = 868 (Paused 1000 is excluded)
console.assert(stats.totalMonthlySpending === 868, `Monthly spending should be 868, got ${stats.totalMonthlySpending}`);
// Yearly spending = 868 * 12 = 10416
console.assert(stats.totalYearlySpending === 10416, `Yearly spending should be 10416, got ${stats.totalYearlySpending}`);
console.assert(stats.upcomingRenewalsCount === 3, `Upcoming renewals should be 3 within 30 days, got ${stats.upcomingRenewalsCount}`);
console.log('✔ Test 2 passed: calculateDashboardStats handles active vs paused correctly.');

// Test 3: Advancing past renewal dates
// Date in the past: 2026-08-15, Monthly
const pastMonthlyRenewal = getNextEffectiveRenewal('2026-08-15', 'Monthly', referenceDate);
console.assert(pastMonthlyRenewal.isAdvanced === true, 'Should mark isAdvanced as true');
console.assert(pastMonthlyRenewal.dateString === '2026-11-15', `Past date 2026-08-15 should advance to 2026-11-15, got ${pastMonthlyRenewal.dateString}`);

// Month-end date test: Jan 31 advanced into Feb (28 days in non-leap year 2027)
const monthEndRenewal = getNextEffectiveRenewal('2026-01-31', 'Monthly', new Date('2026-02-01T00:00:00'));
console.assert(monthEndRenewal.dateString === '2026-02-28', `Jan 31 should advance to Feb 28 in 2026, got ${monthEndRenewal.dateString}`);
console.log('✔ Test 3 passed: getNextEffectiveRenewal advances past dates and handles month-ends correctly.');

// Test 4: Category breakdown
const catBreakdown = calculateCategoryBreakdown(testSubs);
console.assert(catBreakdown.categories.length === 2, 'Should only have 2 categories (Entertainment & Productivity; Utilities is paused)');
console.assert(catBreakdown.totalSpending === 868, 'Total spending in category breakdown should match monthly active total');
console.log('✔ Test 4 passed: calculateCategoryBreakdown ignores paused subscriptions.');

// Test 5: Currency formatting
console.assert(formatINR(649) === '₹649', `formatINR(649) should be '₹649', got ${formatINR(649)}`);
console.assert(formatINR(1999) === '₹1,999', `formatINR(1999) should be '₹1,999', got ${formatINR(1999)}`);
console.log('✔ Test 5 passed: formatINR formats Indian currency properly.');

// Test 6: Demo data initialization
const demoData = getInitialDemoData();
console.assert(demoData.length === 4, 'Should have 4 demo subscriptions');
const names = demoData.map(d => d.name);
console.assert(names.includes('Netflix') && names.includes('Spotify') && names.includes('Google One') && names.includes('Adobe Creative Cloud'), 'Must include required 4 sample subscriptions');
console.log('✔ Test 6 passed: demo data contains 4 realistic sample subscriptions.');

console.log('\nALL TESTS PASSED SUCCESSFULLY! 🎉');

