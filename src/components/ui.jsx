import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { ChevronDown } from 'lucide-react';
import { initial } from '../utils/format.js';

export function Avatar({ name, size = 'md' }) {
  const s = size === 'lg' ? 'size-12 text-lg' : 'size-10 text-base';
  return (
    <span className={`inline-flex ${s} flex-none items-center justify-center rounded-full bg-linear-to-br from-blue-600 to-cyan-500 font-bold text-white`}>
      {initial(name)}
    </span>
  );
}

/* Numbers 0 se upar ginte hue aate hain */
export function CountUp({ value, format = (n) => String(n), duration = 900 }) {
  const target = Number(value) || 0;
  const [n, setN] = useState(0);
  useEffect(() => {
    if (window.matchMedia?.('(prefers-reduced-motion: reduce)').matches) { setN(target); return undefined; }
    let raf;
    const t0 = performance.now();
    const tick = (t) => {
      const p = Math.min(1, (t - t0) / duration);
      const e = 1 - Math.pow(1 - p, 3);
      setN(p < 1 ? Math.round(target * e) : target);
      if (p < 1) raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [target, duration]);
  return <>{format(n)}</>;
}

export function Spinner() {
  return (
    <div className="flex justify-center py-16" aria-label="Loading">
      <div className="size-9 animate-spin rounded-full border-4 border-line border-t-blue-600" />
    </div>
  );
}

/* Loading ke waqt shimmer wali list */
export function ListSkeleton({ rows = 4, h = 'h-28' }) {
  return (
    <div className="space-y-3" aria-label="Loading">
      {Array.from({ length: rows }).map((_, i) => <div key={i} className={`skeleton ${h}`} style={{ animationDelay: `${i * 80}ms` }} />)}
    </div>
  );
}

export function DashboardSkeleton() {
  return (
    <div className="space-y-4" aria-label="Loading">
      <div className="skeleton h-44 !rounded-3xl" />
      <div className="grid grid-cols-2 gap-3">
        {Array.from({ length: 6 }).map((_, i) => <div key={i} className="skeleton h-36" />)}
      </div>
    </div>
  );
}

export function StatCard({ title, value, format, sub, icon: Icon, color, i = 0 }) {
  return (
    <div
      className="card min-w-0 animate-fade-up border-t-[3px] p-3.5 transition duration-200 active:scale-[0.97]"
      style={{ borderTopColor: color, animationDelay: `${i * 70}ms` }}
    >
      <div className="mb-3 flex size-11 items-center justify-center rounded-full text-white shadow-md" style={{ background: color }}>
        <Icon size={21} />
      </div>
      <div className="truncate text-[clamp(1.05rem,5.4vw,1.35rem)] leading-tight font-bold text-ink">
        {format ? <CountUp value={value} format={format} /> : value}
      </div>
      <div className="mt-0.5 truncate text-[13px] text-muted">{title}</div>
      {sub && <div className="truncate text-xs text-muted/80">{sub}</div>}
    </div>
  );
}

export function PageHead({ title, subtitle, children }) {
  return (
    <div className="mb-4 animate-fade-up lg:mb-6 lg:flex lg:items-center lg:justify-between lg:gap-4">
      <div>
        <h2 className="text-[22px] leading-tight font-bold text-head lg:text-[26px]">{title}</h2>
        {subtitle && <p className="mt-0.5 text-sm text-muted">{subtitle}</p>}
      </div>
      {children && <div className="flex flex-wrap gap-2 has-[>:not(.hidden)]:mt-3 lg:mt-0 lg:has-[>:not(.hidden)]:mt-0">{children}</div>}
    </div>
  );
}

/* Neeche se upar aane wali confirm sheet */
export function Confirm({ title, message, confirmText = 'Delete', onConfirm, onCancel }) {
  useEffect(() => {
    const onKey = (e) => e.key === 'Escape' && onCancel();
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [onCancel]);
  return (
    <div className="fixed inset-0 z-[60] flex items-end justify-center bg-slate-900/55 animate-fade-in lg:items-center lg:p-4" onClick={onCancel}>
      <div
        className="w-full max-w-[480px] animate-sheet-up rounded-t-3xl bg-surface px-5 pt-3 shadow-2xl lg:max-w-md lg:animate-pop lg:rounded-3xl lg:pt-6"
        style={{ paddingBottom: 'calc(env(safe-area-inset-bottom, 0px) + 20px)' }}
        onClick={(e) => e.stopPropagation()}
        role="dialog"
        aria-modal="true"
      >
        <div className="mx-auto mb-4 h-1.5 w-10 rounded-full bg-line lg:hidden" />
        <h3 className="text-lg font-bold text-head">{title}</h3>
        <p className="mt-1.5 text-sm text-muted">{message}</p>
        <div className="mt-5 grid grid-cols-2 gap-3">
          <button className="btn btn-outline h-12" onClick={onCancel}>Cancel</button>
          <button className="btn btn-danger h-12" onClick={onConfirm}>{confirmText}</button>
        </div>
      </div>
    </div>
  );
}

export function Select({ children, className = '', ...rest }) {
  return (
    <div className={`relative ${className}`}>
      <select className="input appearance-none pr-10" {...rest}>{children}</select>
      <ChevronDown size={18} className="pointer-events-none absolute top-1/2 right-3.5 -translate-y-1/2 text-muted" />
    </div>
  );
}

export function MonthSelect({ value, onChange, className, ...rest }) {
  return (
    <Select className={className} value={value} onChange={(e) => onChange(Number(e.target.value))} {...rest}>
      {MONTH_NAMES.map((m, i) => <option key={m} value={i + 1}>{m}</option>)}
    </Select>
  );
}
const MONTH_NAMES = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];

/* Chhote chips: Sab / Active / Inactive */
export function Segmented({ value, onChange, options }) {
  return (
    <div className="flex gap-1 rounded-xl border border-line bg-surface p-1">
      {options.map((o) => (
        <button key={o.value} type="button" className={'seg' + (value === o.value ? ' on' : '')} onClick={() => onChange(o.value)}>{o.label}</button>
      ))}
    </div>
  );
}

export function Empty({ icon: Icon, text }) {
  return (
    <div className="animate-pop py-12 text-center text-muted">
      {Icon && <Icon size={34} className="mx-auto mb-2 opacity-60" />}
      <div className="text-sm">{text}</div>
    </div>
  );
}

/* Neeche right me floating + button (nav ke upar) */
export function Fab({ to, icon: Icon, label }) {
  return (
    <div className="pointer-events-none fixed inset-x-0 z-40 mx-auto flex max-w-[480px] justify-end px-4 lg:hidden" style={{ bottom: 'calc(env(safe-area-inset-bottom, 0px) + 96px)' }}>
      <Link to={to} aria-label={label} className="pointer-events-auto inline-flex h-14 animate-pop items-center gap-2 rounded-full bg-blue-600 px-5 font-semibold text-white shadow-xl shadow-blue-600/40 transition active:scale-90">
        <Icon size={22} />{label}
      </Link>
    </div>
  );
}

export function Field({ label, children, className = '' }) {
  return <div className={className}><label className="label">{label}</label>{children}</div>;
}
