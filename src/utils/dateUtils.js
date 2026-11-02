/**
 * Utility functions for subscription date math, renewal forecasting, and formatting.
 */

/**
 * Returns number of days in a given year and 0-indexed month.
 * @param {number} year
 * @param {number} monthIndex (0 = Jan, 11 = Dec)
 * @returns {number}
 */
export function getDaysInMonth(year, monthIndex) {
  return new Date(year, monthIndex + 1, 0).getDate();
}

/**
 * Formats a Date object to YYYY-MM-DD string.
 * @param {Date} date
 * @returns {string}
 */
export function formatDateISO(date) {
  const y = date.getFullYear();
  const m = String(date.getMonth() + 1).padStart(2, '0');
  const d = String(date.getDate()).padStart(2, '0');
  return `${y}-${m}-${d}`;
}

/**
 * Normalizes a date to midnight local time.
 * @param {Date} date
 * @returns {Date}
 */
export function startOfDay(date = new Date()) {
  return new Date(date.getFullYear(), date.getMonth(), date.getDate());
}

/**
 * Difference in whole calendar days between two dates (d2 - d1).
 * @param {Date} d1
 * @param {Date} d2
 * @returns {number}
 */
export function getDaysDifference(d1, d2) {
  const t1 = startOfDay(d1).getTime();
  const t2 = startOfDay(d2).getTime();
  const diffMs = t2 - t1;
  return Math.round(diffMs / (1000 * 60 * 60 * 24));
}

/**
 * Calculates the next effective renewal date for an active subscription.
 * If the stored renewal date is in the past, advances it by the billing cycle
 * (preserving the original day-of-month where valid) until >= referenceDate.
 *
 * NOTE: This does NOT modify stored data; it calculates purely for display and alerts.
 *
 * @param {string} storedDateStr - 'YYYY-MM-DD'
 * @param {'Monthly'|'Yearly'} billingCycle
 * @param {Date} [referenceDate=new Date()]
 * @returns {{ date: Date, dateString: string, daysUntil: number, isAdvanced: boolean } | null}
 */
export function getNextEffectiveRenewal(storedDateStr, billingCycle = 'Monthly', referenceDate = new Date()) {
  if (!storedDateStr) return null;
  const parts = storedDateStr.split('-').map(Number);
  if (parts.length !== 3 || parts.some(isNaN)) return null;

  const [y, m, d] = parts;
  const todayStart = startOfDay(referenceDate);

  const anchorDay = d;
  let curYear = y;
  let curMonth = m - 1; // 0-based month

  // Cap anchor day if initial month has fewer days
  const initialDaysInMonth = getDaysInMonth(curYear, curMonth);
  let curDate = new Date(curYear, curMonth, Math.min(anchorDay, initialDaysInMonth));

  if (curDate >= todayStart) {
    return {
      date: curDate,
      dateString: formatDateISO(curDate),
      daysUntil: getDaysDifference(todayStart, curDate),
      isAdvanced: false,
    };
  }

  // Stored date is in the past; advance by billing cycle
  const isYearly = String(billingCycle).toLowerCase() === 'yearly';
  let iterations = 0;
  const maxIterations = 1200; // Prevents infinite loop

  while (curDate < todayStart && iterations < maxIterations) {
    iterations++;
    if (isYearly) {
      curYear += 1;
    } else {
      curMonth += 1;
      if (curMonth > 11) {
        curYear += Math.floor(curMonth / 12);
        curMonth = curMonth % 12;
      }
    }
    const daysInTargetMonth = getDaysInMonth(curYear, curMonth);
    const targetDay = Math.min(anchorDay, daysInTargetMonth);
    curDate = new Date(curYear, curMonth, targetDay);
  }

  return {
    date: curDate,
    dateString: formatDateISO(curDate),
    daysUntil: getDaysDifference(todayStart, curDate),
    isAdvanced: true,
  };
}

/**
 * Formats a date string or Date object into a readable date string.
 * e.g., '2026-11-20' -> 'Nov 20, 2026'
 * @param {string|Date} dateInput
 * @returns {string}
 */
export function formatDisplayDate(dateInput) {
  if (!dateInput) return '—';
  let dateObj;
  if (typeof dateInput === 'string') {
    const parts = dateInput.split('-').map(Number);
    if (parts.length === 3 && !parts.some(isNaN)) {
      dateObj = new Date(parts[0], parts[1] - 1, parts[2]);
    } else {
      dateObj = new Date(dateInput);
    }
  } else {
    dateObj = dateInput;
  }

  if (isNaN(dateObj.getTime())) return '—';

  return new Intl.DateTimeFormat('en-IN', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
  }).format(dateObj);
}

/**
 * Returns a human-friendly relative label for days until renewal.
 * e.g. "Today", "Tomorrow", "In 4 days", "Past due"
 * @param {number} days
 * @returns {string}
 */
export function getRelativeRenewalLabel(days) {
  if (days < 0) return `${Math.abs(days)} day${Math.abs(days) === 1 ? '' : 's'} ago`;
  if (days === 0) return 'Renews today';
  if (days === 1) return 'Renews tomorrow';
  return `In ${days} days`;
}
