import { getNextEffectiveRenewal } from './dateUtils.js';

  /**
   * Calculates the monthly equivalent cost for a subscription.
   * - Monthly: Monthly Equivalent = Subscription Price
   * - Yearly: Monthly Equivalent = Subscription Price / 12
   *
   * @param {{ price: number|string, billingCycle: string }} subscription
   * @returns {number}
   */
  export function getMonthlyEquivalent(subscription) {
    if (!subscription) return 0;
    const price = Number(subscription.price) || 0;
    const cycle = (subscription.billingCycle || 'Monthly').toLowerCase();

    if (cycle === 'yearly') {
      return price / 12;
    }
    return price;
  }

  /**
   * Calculates dashboard statistics.
   *
   * Requirements:
   * - Use only active subscriptions for spending calculations.
   * - Paused subscriptions must not contribute to active spending summaries.
   * - Monthly subscription: Monthly Equivalent = Subscription Price
   * - Yearly subscription: Monthly Equivalent = Subscription Price / 12
   * - Estimated Annual Spending = Sum of Monthly Equivalents * 12
   *
   * @param {Array} subscriptions
   * @param {Date} [referenceDate=new Date()]
   * @returns {Object}
   */
  export function calculateDashboardStats(subscriptions = [], referenceDate = new Date()) {
    const allList = Array.isArray(subscriptions) ? subscriptions : [];
    const activeSubs = allList.filter((s) => s.status === 'Active');

    // Sum of monthly equivalents for active subscriptions
    const totalMonthlySpending = activeSubs.reduce((acc, sub) => {
      return acc + getMonthlyEquivalent(sub);
    }, 0);

    // Estimated Annual Spending = Sum of Monthly Equivalents * 12
    const totalYearlySpending = totalMonthlySpending * 12;

    // Upcoming renewals in next 30 days (active only)
    const upcomingRenewals = [];
    for (const sub of activeSubs) {
      const renewalInfo = getNextEffectiveRenewal(sub.nextRenewalDate, sub.billingCycle, referenceDate);
      if (renewalInfo && renewalInfo.daysUntil >= 0 && renewalInfo.daysUntil <= 30) {
        upcomingRenewals.push({
          ...sub,
          effectiveRenewalDate: renewalInfo.dateString,
          daysUntil: renewalInfo.daysUntil,
          isAdvanced: renewalInfo.isAdvanced,
        });
      }
    }

    // Sort upcoming renewals ascending by days until renewal
    upcomingRenewals.sort((a, b) => a.daysUntil - b.daysUntil);

    return {
      totalSubscriptions: allList.length,
      totalActiveSubscriptions: activeSubs.length,
      pausedSubscriptionsCount: allList.length - activeSubs.length,
      totalMonthlySpending: Math.round(totalMonthlySpending * 100) / 100,
      totalYearlySpending: Math.round(totalYearlySpending * 100) / 100,
      upcomingRenewalsCount: upcomingRenewals.length,
      upcomingRenewalsList: upcomingRenewals,
    };
  }

  /**
   * Calculates category breakdown and chart data.
   * Only includes Active subscriptions.
   *
   * @param {Array} subscriptions
   * @returns {{ categories: Array, totalSpending: number }}
   */
  export function calculateCategoryBreakdown(subscriptions = []) {
    const allList = Array.isArray(subscriptions) ? subscriptions : [];
    const activeSubs = allList.filter((s) => s.status === 'Active');

    const totalMonthlySpending = activeSubs.reduce((acc, sub) => {
      return acc + getMonthlyEquivalent(sub);
    }, 0);

    const categoryMap = {};

    activeSubs.forEach((sub) => {
      const cat = sub.category || 'Other';
      const monthlyCost = getMonthlyEquivalent(sub);

      if (!categoryMap[cat]) {
        categoryMap[cat] = {
          name: cat,
          monthlySpending: 0,
          yearlySpending: 0,
          count: 0,
          subscriptions: [],
        };
      }

      categoryMap[cat].monthlySpending += monthlyCost;
      categoryMap[cat].yearlySpending += monthlyCost * 12;
      categoryMap[cat].count += 1;
      categoryMap[cat].subscriptions.push(sub);
    });

    const categories = Object.values(categoryMap).map((item) => {
      const percentage = totalMonthlySpending > 0 ? (item.monthlySpending / totalMonthlySpending) * 100 : 0;
      return {
        ...item,
        monthlySpending: Math.round(item.monthlySpending * 100) / 100,
        yearlySpending: Math.round(item.yearlySpending * 100) / 100,
        percentage: Math.round(percentage * 10) / 10,
      };
    });

    // Sort by monthly spending descending
    categories.sort((a, b) => b.monthlySpending - a.monthlySpending);

    return {
      categories,
      totalSpending: Math.round(totalMonthlySpending * 100) / 100,
    };
  }

  /**
   * Returns active subscriptions sorted by monthly equivalent spending descending.
   *
   * @param {Array} subscriptions
   * @param {number} [limit=5]
   * @returns {Array}
   */
  export function getMostExpensiveSubscriptions(subscriptions = [], limit = 5) {
    const allList = Array.isArray(subscriptions) ? subscriptions : [];
    const activeSubs = allList.filter((s) => s.status === 'Active');

    const formatted = activeSubs.map((sub) => {
      const monthlyEquivalent = getMonthlyEquivalent(sub);
      return {
        ...sub,
        monthlyEquivalent: Math.round(monthlyEquivalent * 100) / 100,
        yearlyEquivalent: Math.round(monthlyEquivalent * 12 * 100) / 100,
      };
    });

    formatted.sort((a, b) => b.monthlyEquivalent - a.monthlyEquivalent);

    return formatted.slice(0, limit);
  }
