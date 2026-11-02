/**
 * Formats a numeric amount into Indian Rupee (INR) currency format.
 * Examples: 649 -> ₹649, 1999 -> ₹1,999, 12500.5 -> ₹12,500.50
 *
 * @param {number|string} amount
 * @param {boolean} showDecimals
 * @returns {string}
 */
export function formatINR(amount, showDecimals = false) {
  const numericAmount = Number(amount);
  if (isNaN(numericAmount) || numericAmount === null || numericAmount === undefined) {
    return '₹0';
  }

  // Determine if decimals should be displayed
  const hasDecimals = !Number.isInteger(numericAmount);
  const fractionDigits = showDecimals || hasDecimals ? 2 : 0;

  return new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency: 'INR',
    minimumFractionDigits: fractionDigits,
    maximumFractionDigits: fractionDigits,
  }).format(numericAmount);
}

/**
 * Capitalizes the first letter of a string.
 */
export function capitalize(str) {
  if (!str) return '';
  return str.charAt(0).toUpperCase() + str.slice(1);
}
