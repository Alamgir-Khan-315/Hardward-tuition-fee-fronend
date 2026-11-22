import { useEffect, useState } from 'react';
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from 'chart.js';
import { Doughnut } from 'react-chartjs-2';
import { Wallet, CheckCircle2, AlertCircle, PieChart } from 'lucide-react';
import { api } from '../api.js';
import { useApp } from '../context.jsx';
import { ListSkeleton, MonthSelect, PageHead, StatCard } from '../components/ui.jsx';
import { money, monthName } from '../utils/format.js';

ChartJS.register(ArcElement, Tooltip, Legend);

export default function Reports() {
  const { theme } = useApp();
  const now = new Date();
  const [month, setMonth] = useState(now.getMonth() + 1);
  const [year, setYear] = useState(now.getFullYear());
  const [data, setData] = useState(null);
  const [error, setError] = useState('');

  useEffect(() => {
    setError('');
    const t = setTimeout(() => api.get(`/reports/monthly?month=${month}&year=${year}`).then(setData).catch((e) => setError(e.message)), 200);
    return () => clearTimeout(t);
  }, [month, year]);

  const r = data?.report;
  const text = theme === 'dark' ? '#94a3b8' : '#64748b';

  return (
    <>
      <PageHead title="Monthly Report" subtitle="Is mahine kitni fee jama hui aur kitni baqaya hai." />
      <div className="mb-4 grid grid-cols-5 gap-3 lg:max-w-sm">
        <MonthSelect className="col-span-3" value={month} onChange={setMonth} />
        <input className="input col-span-2" type="number" inputMode="numeric" min="2000" max="2100" value={year} onChange={(e) => setYear(Number(e.target.value))} aria-label="Year" />
      </div>
      {error && <div className="alert alert-error">{error}</div>}
      {!r ? <ListSkeleton rows={3} h="h-36" /> : (
        <div className="space-y-4 lg:grid lg:grid-cols-12 lg:items-start lg:gap-5 lg:space-y-0">
          <div className="grid grid-cols-2 gap-3 lg:col-span-7 lg:grid-cols-3 lg:gap-4">
            <div className="col-span-2 lg:col-span-1"><StatCard i={0} title="Total Fee" value={r.expected} format={money} sub={`${r.totalStudents} students`} icon={Wallet} color="#2563EB" /></div>
            <StatCard i={1} title="Paid" value={r.paid} format={money} sub={`${r.paidStudents} pura, ${r.partialStudents} adha`} icon={CheckCircle2} color="#16A34A" />
            <StatCard i={2} title="Unpaid" value={r.unpaid} format={money} sub={`${r.unpaidStudents + r.partialStudents} students baqaya`} icon={AlertCircle} color="#EF4444" />
          </div>
          <section className="card animate-fade-up p-4 lg:col-span-5 lg:p-5" style={{ animationDelay: '150ms' }}>
            <h3 className="mb-3 flex items-center gap-2 font-semibold text-head"><PieChart size={18} className="text-blue-600" />{monthName(data.month)} {data.year}</h3>
            <div className="relative mx-auto h-60 max-w-[280px]">
              <Doughnut
                data={{ labels: ['Paid', 'Unpaid'], datasets: [{ data: [r.paid, r.unpaid], backgroundColor: ['#16A34A', '#EF4444'], borderWidth: 0 }] }}
                options={{ maintainAspectRatio: false, cutout: '72%', plugins: { legend: { position: 'bottom', labels: { color: text, usePointStyle: true, boxWidth: 8 } } } }}
              />
              <div className="pointer-events-none absolute inset-0 flex flex-col items-center justify-center pb-8">
                <b className="text-2xl">{r.paidPercent}%</b><span className="text-xs text-muted">Paid</span>
              </div>
            </div>
          </section>
        </div>
      )}
    </>
  );
}
