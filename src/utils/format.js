export const MONTHS = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];
export const monthName = (m) => MONTHS[m - 1] || '-';
export const money = (v) => 'Rs ' + Number(v || 0).toLocaleString('en-US', { maximumFractionDigits: 2 });
export const fmtDate = (d) =>
  d ? new Date(d).toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' }) : '-';
export const toInputDate = (d) => (d ? new Date(d).toISOString().slice(0, 10) : '');
export const initial = (name) => (name || '?').trim().charAt(0).toUpperCase();
