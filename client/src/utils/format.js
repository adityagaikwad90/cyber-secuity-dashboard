export function formatNumber(n) {
  if (n === null || n === undefined || isNaN(n)) return '0';
  return new Intl.NumberFormat('en-IN').format(n);
}

export function formatMoney(n) {
  if (n === null || n === undefined || isNaN(n)) return '₹0';
  const abs = Math.abs(n);
  const sign = n < 0 ? '-' : '';
  if (abs >= 1e7) return `${sign}₹${(abs / 1e7).toFixed(2)} Cr`;
  if (abs >= 1e5) return `${sign}₹${(abs / 1e5).toFixed(2)} L`;
  return `${sign}₹${formatNumber(Math.round(abs))}`;
}

export function formatPercent(n) {
  if (n === null || n === undefined || isNaN(n)) return '0%';
  const sign = n > 0 ? '+' : '';
  return `${sign}${n.toFixed(1)}%`;
}

export const RISK_COLORS = {
  Low: '#52b788',
  Medium: '#e9c46a',
  High: '#f4a261',
  Critical: '#e76f51',
};

export const RISK_DARK_COLORS = {
  Low: '#40916c',
  Medium: '#d4a373',
  High: '#e07a5f',
  Critical: '#d90429',
};

export const SEVERITY_COLORS = {
  Low: '#52b788',
  Medium: '#e9c46a',
  High: '#f4a261',
  Critical: '#e76f51',
};

export const STATUS_COLORS = {
  Closed: '#2a9d8f',
  Resolved: '#52b788',
  Investigating: '#e9c46a',
  Open: '#e76f51',
};
