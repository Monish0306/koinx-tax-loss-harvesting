/**
 * Format a number as currency with compact notation for large values
 */
export function formatCurrency(value: number): string {
  const abs = Math.abs(value);
  const sign = value < 0 ? '-' : '';

  if (abs >= 1_000_000) {
    return `${sign}$${(abs / 1_000_000).toFixed(2)}M`;
  }
  if (abs >= 1_000) {
    return `${sign}$${(abs / 1_000).toFixed(2)}K`;
  }
  return `${sign}$${abs.toFixed(2)}`;
}

/**
 * Format a token amount with smart decimal places
 */
export function formatTokenAmount(value: number, coin: string): string {
  if (value === 0) return `0 ${coin}`;
  if (Math.abs(value) < 0.0001) {
    return `${value.toExponential(2)} ${coin}`;
  }
  if (Math.abs(value) >= 1000) {
    return `${value.toLocaleString(undefined, { maximumFractionDigits: 2 })} ${coin}`;
  }
  return `${value.toFixed(4)} ${coin}`;
}

/**
 * Format price with compact notation
 */
export function formatPrice(value: number): string {
  if (value >= 1000) {
    return `$${(value / 1000).toFixed(2)}K`;
  }
  if (value < 0.001) {
    return `$${value.toExponential(4)}`;
  }
  return `$${value.toFixed(2)}`;
}
