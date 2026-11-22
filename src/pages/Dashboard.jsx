import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { Chart as ChartJS, CategoryScale, LinearScale, PointElement, LineElement, ArcElement, Tooltip, Legend, Filler } from 'chart.js';
import { Line, Doughnut } from 'react-chartjs-2';
import { Users, UserCheck, Wallet, HandCoins, CalendarCheck, AlertCircle, TrendingUp, PieChart, Zap, Receipt, Bell, UserPlus, Banknote, BarChart3, MessageCircle, CalendarDays } from 'lucide-react';
import { api } from '../api.js';
import { useApp } from '../context.jsx';
import { StatCard, Avatar, DashboardSkeleton, Empty } from '../components/ui.jsx';
import { money, monthName, fmtDate } from '../utils/format.js';
import { reminderLink } from '../utils/whatsapp.js';

ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, ArcElement, Tooltip, Legend, Filler);

const compact = (v) => (v >= 1000 ? v / 1000 + 'k' : v);

export default function Dashboard() {
  const { config, theme } = useApp();
  const [d, setD] = useState(null);
  const [error, setError] = useState('');

  useEffect(() => {
    api.get('/dashboard').then(setD).catch((e) => setError(e.message));
  }, []);

  if (error) return <div className="alert alert-error">{error}</div>;
  if (!d) return <DashboardSkeleton />;

  const dark = theme === 'dark';
  const text = dark ? '#94a3b8' : '#64748b';
  const grid = dark ? '#22304a' : '#eef2f7';
  const m = d.thisMonth;
  const now = new Date();

  const lineData = {
    labels: d.chart.labels,
    datasets: [{
      label: 'Collection', data: d.chart.values, borderColor: '#2563EB', backgroundColor: 'rgba(37,99,235,.14)',
      fill: true, tension: 0.4, pointRadius: 3, pointBackgroundColor: '#2563EB',
    }],
  };
  const lineOpts = {
    maintainAspectRatio: false,
    plugins: { legend: { display: false } },
    scales: {
      y: { beginAtZero: true, grid: { color: grid }, ticks: { color: text, font: { size: 11 }, maxTicksLimit: 5, callback: compact } },
      x: { grid: { display: false }, ticks: { color: text, font: { size: 11 }, maxRotation: 0, autoSkip: true, maxTicksLimit: 6 } },
    },
  };
  const donutData = { labels: ['Paid', 'Unpaid'], datasets: [{ data: [m.paid, m.unpaid], backgroundColor: ['#2563EB', dark ? '#334155' : '#CBD5E1'], borderWidth: 0 }] };

  const quick = [
    { to: '/students/new', label: 'Add Student', icon: UserPlus, bg: 'bg-navy' },
    { to: '/fees', label: 'Collect Fee', icon: Banknote, bg: 'bg-green-600' },
    { to: '/students', label: 'All Students', icon: Users, bg: 'bg-blue-600' },
    { to: '/reports', label: 'View Report', icon: BarChart3, bg: 'bg-cyan-500' },
  ];

  return (
    <div className="space-y-5">
      {/* Hero */}
      <section className="relative overflow-hidden rounded-3xl bg-linear-to-br from-[#0f1d4d] via-navy to-blue-600 p-5 text-white shadow-xl shadow-blue-900/20 animate-fade-up lg:p-8">
        <span className="pointer-events-none absolute -top-24 -right-16 size-64 animate-float rounded-full bg-white/10" />
        <span className="pointer-events-none absolute -bottom-24 left-16 size-52 animate-float-slow rounded-full bg-cyan-400/20" />
        <div className="relative">
          <h2 className="text-[clamp(1.35rem,6.4vw,1.75rem)] leading-tight font-bold lg:text-[32px]">Welcome Back, <span className="text-cyan-300">Admin</span></h2>
          <p className="mt-1.5 text-[14px] leading-snug text-white/85 lg:text-base">Apni academy ki fee aur students ko asaani se manage karein.</p>
          <div className="mt-4 inline-flex max-w-full flex-col gap-2 rounded-2xl bg-white/15 px-4 py-2.5 backdrop-blur-sm">
            <div className="flex items-center gap-2 text-[13px] font-medium"><CalendarDays size={17} />{monthName(now.getMonth() + 1)}: {m.paidPercent}% fee wasool</div>
            <div className="h-1.5 overflow-hidden rounded-full bg-white/20">
              <div className="h-full origin-left animate-grow-x rounded-full bg-cyan-300" style={{ width: `${Math.min(100, Math.max(0, m.paidPercent))}%` }} />
            </div>
          </div>
        </div>
      </section>

      {/* Stats */}
      <section className="grid grid-cols-2 gap-3 md:grid-cols-3 lg:gap-4 xl:grid-cols-6">
        <StatCard i={0} title="Total Students" value={d.totalStudents} sub="Sab students" icon={Users} color="#2563EB" />
        <StatCard i={1} title="Active Students" value={d.activeStudents} sub="Fee dene wale" icon={UserCheck} color="#16A34A" />
        <StatCard i={2} title="Total Fee" value={d.totalFee} format={money} sub="Ab tak banne wali" icon={Wallet} color="#1e3a8a" />
        <StatCard i={3} title="Collected" value={d.totalCollected} format={money} sub="Ab tak wasool" icon={HandCoins} color="#06B6D4" />
        <StatCard i={4} title="This Month" value={d.thisMonthCollected} format={money} sub="Is mahine ki wasooli" icon={CalendarCheck} color="#F59E0B" />
        <StatCard i={5} title="Due Fee" value={d.totalDue} format={money} sub={`${d.followUps.length} students unpaid`} icon={AlertCircle} color="#EF4444" />
      </section>

      {/* Quick actions */}
      <section className="animate-fade-up" style={{ animationDelay: '120ms' }}>
        <h3 className="mb-2.5 flex items-center gap-2 font-semibold text-head"><Zap size={18} className="text-blue-600" />Quick Actions</h3>
        <div className="grid grid-cols-2 gap-3 lg:grid-cols-4 lg:gap-4">
          {quick.map(({ to, label, icon: Icon, bg }) => (
            <Link key={to} to={to} className={`${bg} flex items-center gap-2.5 rounded-2xl px-3.5 py-3.5 text-[14px] font-semibold text-white shadow-md transition active:scale-95`}>
              <Icon size={20} className="flex-none" /><span className="truncate">{label}</span>
            </Link>
          ))}
        </div>
      </section>

      {/* Charts */}
      <div className="space-y-5 lg:grid lg:grid-cols-3 lg:gap-5 lg:space-y-0">
      <section className="card animate-fade-up p-4 lg:col-span-2 lg:p-5" style={{ animationDelay: '160ms' }}>
        <h3 className="mb-3 flex items-center gap-2 font-semibold text-head"><TrendingUp size={18} className="text-blue-600" />Monthly Fee Collection</h3>
        <div className="relative h-52 lg:h-72"><Line data={lineData} options={lineOpts} /></div>
      </section>

      <section className="card animate-fade-up p-4 lg:p-5" style={{ animationDelay: '200ms' }}>
        <h3 className="mb-3 flex items-center gap-2 font-semibold text-head"><PieChart size={18} className="text-blue-600" />{monthName(now.getMonth() + 1)} Status</h3>
        <div className="relative mx-auto h-44 max-w-[220px]">
          <Doughnut data={donutData} options={{ maintainAspectRatio: false, cutout: '72%', plugins: { legend: { display: false } } }} />
          <div className="pointer-events-none absolute inset-0 flex flex-col items-center justify-center">
            <b className="text-2xl">{m.paidPercent}%</b><span className="text-xs text-muted">Paid</span>
          </div>
        </div>
        <div className="mt-3 space-y-1.5 text-sm">
          <div className="flex justify-between"><span className="flex items-center gap-2"><i className="size-2.5 rounded-full bg-blue-600" />Paid</span><b>{money(m.paid)}</b></div>
          <div className="flex justify-between"><span className="flex items-center gap-2"><i className="size-2.5 rounded-full" style={{ background: dark ? '#334155' : '#CBD5E1' }} />Unpaid</span><b>{money(m.unpaid)}</b></div>
        </div>
      </section>
      </div>

      <div className="space-y-5 lg:grid lg:grid-cols-2 lg:items-start lg:gap-5 lg:space-y-0">
      {/* Recent payments */}
      <section className="animate-fade-up" style={{ animationDelay: '240ms' }}>
        <div className="mb-2.5 flex items-center justify-between">
          <h3 className="flex items-center gap-2 font-semibold text-head"><Receipt size={18} className="text-blue-600" />Recent Fee Payments</h3>
          <Link className="text-[13px] font-semibold text-blue-600" to="/fees/history">View All</Link>
        </div>
        <div className="card divide-y divide-line/70 overflow-hidden">
          {d.recentPayments.map((p) => (
            <div key={p._id} className="flex items-center gap-3 px-3.5 py-3">
              <Avatar name={p.student?.studentName} />
              <div className="min-w-0 flex-1">
                <div className="truncate font-semibold">{p.student?.studentName}</div>
                <div className="truncate text-xs text-muted">{p.student?.studentCode} · {monthName(p.month)} {p.year}</div>
              </div>
              <div className="text-right">
                <span className="badge b-green">{money(p.amount)}</span>
                <div className="mt-0.5 text-[11px] text-muted">{fmtDate(p.paymentDate)}</div>
              </div>
            </div>
          ))}
          {!d.recentPayments.length && <Empty text="Abhi koi payment nahi." />}
        </div>
      </section>

      {/* Follow-up */}
      <section className="animate-fade-up" style={{ animationDelay: '280ms' }}>
        <div className="mb-2.5 flex items-center justify-between">
          <h3 className="flex items-center gap-2 font-semibold text-head"><Bell size={18} className="text-blue-600" />Follow-up: Unpaid</h3>
          <Link className="text-[13px] font-semibold text-blue-600" to="/fees">View All</Link>
        </div>
        <div className="space-y-3">
          {d.followUps.slice(0, 8).map(({ student: s, summary }) => (
            <div key={s._id} className="card flex items-center gap-3 p-3.5">
              <Link to={`/students/${s._id}`} className="flex min-w-0 flex-1 items-center gap-3">
                <Avatar name={s.studentName} />
                <div className="min-w-0">
                  <div className="truncate font-semibold">{s.studentName}</div>
                  <div className="flex items-center gap-1.5 text-xs text-muted"><span className="truncate">{s.className}</span><span className="badge b-red !px-2 !py-0.5">{money(summary.due)}</span></div>
                </div>
              </Link>
              <a className="btn-icon wa" target="_blank" rel="noreferrer" href={reminderLink(s, summary.due, config)} aria-label="WhatsApp reminder"><MessageCircle size={18} /></a>
              <Link className="btn btn-primary btn-sm" to={`/students/${s._id}`}>Fee Jama</Link>
            </div>
          ))}
          {!d.followUps.length && <div className="card"><Empty text="Koi unpaid student nahi." /></div>}
        </div>
      </section>
      </div>
    </div>
  );
}
