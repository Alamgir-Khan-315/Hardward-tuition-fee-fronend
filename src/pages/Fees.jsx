import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import toast from 'react-hot-toast';
import { CheckCircle2, MessageCircle, History as HistoryIcon, Search } from 'lucide-react';
import { api } from '../api.js';
import { useApp } from '../context.jsx';
import { Avatar, Empty, ListSkeleton, MonthSelect, PageHead } from '../components/ui.jsx';
import { money } from '../utils/format.js';
import { reminderLink, receiptLink } from '../utils/whatsapp.js';

export default function Fees() {
  const { config } = useApp();
  const now = new Date();
  const [month, setMonth] = useState(now.getMonth() + 1);
  const [year, setYear] = useState(now.getFullYear());
  const [q, setQ] = useState('');
  const [data, setData] = useState(null);
  const [amounts, setAmounts] = useState({});
  const [busyId, setBusyId] = useState(null);
  const [receipt, setReceipt] = useState(null);

  const load = () => {
    const qs = new URLSearchParams({ month, year });
    if (q.trim()) qs.set('q', q.trim());
    api.get('/fees?' + qs).then((d) => { setData(d); setAmounts({}); }).catch((e) => toast.error(e.message));
  };
  useEffect(() => {
    const t = setTimeout(load, 250);
    return () => clearTimeout(t);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [month, year, q]);

  const pay = async (row) => {
    const amount = amounts[row.student._id] ?? row.balance;
    setBusyId(row.student._id);
    try {
      const r = await api.post('/fees/pay', { studentId: row.student._id, month, year, amount });
      toast.success(`${row.student.studentName} ki ${money(r.payment.amount)} fee jama ho gayi.`);
      setReceipt(receiptLink(r.student, r.payment, r.monthBalance, config));
      load();
    } catch (e) { toast.error(e.message); }
    setBusyId(null);
  };

  return (
    <>
      <PageHead title="Fees" subtitle="Mahina select karein, fee likhein aur Paid dabayein.">
        <Link className="btn btn-outline btn-sm lg:h-11 lg:px-4 lg:text-sm" to="/fees/history"><HistoryIcon size={16} />Payment History / Edit</Link>
      </PageHead>

      {receipt && (
        <div className="alert alert-success animate-pop">
          <CheckCircle2 size={18} /> Fee jama ho gayi.
          <a className="btn btn-wa btn-sm ml-auto" target="_blank" rel="noreferrer" href={receipt}><MessageCircle size={15} />WhatsApp receipt</a>
        </div>
      )}

      <div className="mb-4 space-y-3 lg:flex lg:items-center lg:gap-3 lg:space-y-0">
        <div className="grid grid-cols-5 gap-3 lg:w-80">
          <MonthSelect className="col-span-3" value={month} onChange={setMonth} />
          <input className="input col-span-2" type="number" inputMode="numeric" min="2000" max="2100" value={year} onChange={(e) => setYear(Number(e.target.value))} aria-label="Year" />
        </div>
        <div className="relative lg:max-w-md lg:flex-1">
          <Search size={18} className="pointer-events-none absolute top-1/2 left-4 -translate-y-1/2 text-muted" />
          <input className="input pl-11" type="search" value={q} onChange={(e) => setQ(e.target.value)} placeholder="Student search..." />
        </div>
      </div>

      {!data ? <ListSkeleton h="h-36" /> : (
        <>
        <div className="space-y-3 lg:hidden">
          {data.rows.map((r, i) => {
            const s = r.student;
            return (
              <article key={s._id} className="card animate-fade-up p-3.5" style={{ animationDelay: `${Math.min(i, 8) * 50}ms` }}>
                <div className="flex items-center gap-3">
                  <Avatar name={s.studentName} />
                  <Link to={`/students/${s._id}`} className="min-w-0 flex-1">
                    <div className="truncate font-bold">{s.studentName}</div>
                    <div className="flex items-center gap-2"><span className="chip">{s.studentCode}</span><span className="truncate text-xs text-muted">{s.className}</span></div>
                  </Link>
                  {r.balance <= 0 ? <span className="badge b-green">Paid</span>
                    : r.paid > 0 ? <span className="badge b-orange">{money(r.balance)}</span>
                    : <span className="badge b-red">{money(r.balance)}</span>}
                </div>
                <div className="mt-3 grid grid-cols-2 gap-2">
                  <div className="rounded-xl bg-soft px-3 py-2"><div className="text-[11px] text-muted">Fee</div><div className="truncate text-sm font-bold">{money(s.monthlyFee)}</div></div>
                  <div className="rounded-xl bg-soft px-3 py-2"><div className="text-[11px] text-muted">Paid</div><div className="truncate text-sm font-bold">{money(r.paid)}</div></div>
                </div>
                {r.balance > 0 && (
                  <div className="mt-3 flex items-center gap-2">
                    <input className="input h-11 min-w-0 flex-1" type="number" inputMode="decimal" min="1" max={r.balance} step="0.01" aria-label="Amount"
                      value={amounts[s._id] ?? r.balance} onChange={(e) => setAmounts({ ...amounts, [s._id]: e.target.value })} />
                    <button className="btn btn-success flex-none" disabled={busyId === s._id} onClick={() => pay(r)}><CheckCircle2 size={17} />Paid</button>
                    <a className="btn-icon wa size-11" target="_blank" rel="noreferrer" aria-label="WhatsApp reminder" href={reminderLink(s, r.balance, config)}><MessageCircle size={18} /></a>
                  </div>
                )}
              </article>
            );
          })}
          {!data.rows.length && <div className="card"><Empty icon={Search} text="Is mahine ke liye koi student nahi." /></div>}
        </div>

        {/* ===== Laptop: table ===== */}
        <div className="card hidden overflow-hidden lg:block">
          <div className="overflow-x-auto">
            <table className="w-full border-separate border-spacing-0 text-sm">
              <thead>
                <tr className="bg-soft text-left text-[11px] font-bold tracking-wide text-muted uppercase">
                  <th className="px-4 py-3.5">ID</th><th className="px-4 py-3.5">Student</th><th className="px-4 py-3.5">Class</th>
                  <th className="px-4 py-3.5 text-right">Fee</th><th className="px-4 py-3.5 text-right">Paid</th><th className="px-4 py-3.5 text-right">Balance</th>
                  <th className="px-4 py-3.5">Fee jama karein</th><th className="px-4 py-3.5" />
                </tr>
              </thead>
              <tbody>
                {data.rows.map((r) => {
                  const s = r.student;
                  const td = 'border-b border-line/70 px-4 py-3';
                  return (
                    <tr key={s._id} className="transition-colors hover:bg-blue-600/5">
                      <td className={td}><span className="chip">{s.studentCode}</span></td>
                      <td className={td}><Link to={`/students/${s._id}`} className="flex items-center gap-3 font-semibold hover:text-blue-600"><Avatar name={s.studentName} />{s.studentName}</Link></td>
                      <td className={td}>{s.className}</td>
                      <td className={td + ' text-right whitespace-nowrap'}>{money(s.monthlyFee)}</td>
                      <td className={td + ' text-right whitespace-nowrap'}>{money(r.paid)}</td>
                      <td className={td + ' text-right'}>
                        {r.balance <= 0 ? <span className="badge b-green">Paid</span>
                          : r.paid > 0 ? <span className="badge b-orange">{money(r.balance)}</span>
                          : <span className="badge b-red">{money(r.balance)}</span>}
                      </td>
                      <td className={td}>
                        {r.balance > 0 && (
                          <div className="flex items-center gap-2">
                            <input className="input h-10 w-32" type="number" inputMode="decimal" min="1" max={r.balance} step="0.01" aria-label="Amount"
                              value={amounts[s._id] ?? r.balance} onChange={(e) => setAmounts({ ...amounts, [s._id]: e.target.value })} />
                            <button className="btn btn-success btn-sm h-10" disabled={busyId === s._id} onClick={() => pay(r)}><CheckCircle2 size={16} />Paid</button>
                          </div>
                        )}
                      </td>
                      <td className={td + ' text-right'}>
                        {r.balance > 0 && <a className="btn-icon wa ml-auto size-9" target="_blank" rel="noreferrer" aria-label="WhatsApp reminder" href={reminderLink(s, r.balance, config)}><MessageCircle size={16} /></a>}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
          {!data.rows.length && <Empty icon={Search} text="Is mahine ke liye koi student nahi." />}
        </div>
        </>
      )}
    </>
  );
}
